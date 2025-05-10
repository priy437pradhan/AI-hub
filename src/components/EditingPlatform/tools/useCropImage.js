'use client'

import { useState, useRef, useEffect } from 'react';

export function useCropImage({ 
  imageRef, 
  aspectRatio, 
  aspectRatios, 
  width, 
  height, 
  setWidth, 
  setHeight, 
  keepAspectRatio,
  setKeepAspectRatio,
  imagePreview 
}) {
  // Crop state
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isCropping, setIsCropping] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  
  const cropBoxRef = useRef(null);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const resizeHandleRef = useRef(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const cropStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (imagePreview && imageRef.current) {
      const img = imageRef.current;
      
      const handleImageLoad = () => {
        // Get natural dimensions of the image
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        
        // Determine if image is landscape, portrait or square
        const isLandscape = imgWidth > imgHeight;
        const isPortrait = imgHeight > imgWidth;
        const isSquare = imgWidth === imgHeight;
        
        let cropWidth, cropHeight, x, y;
        
        // Default crop - aim for an initial crop that's appropriate to the image shape
        // For square images - use a square crop
        if (isSquare) {
          // Use 90% of the image size for the crop
          cropWidth = cropHeight = Math.min(imgWidth, imgHeight) * 0.9;
          x = (imgWidth - cropWidth) / 2;
          y = (imgHeight - cropHeight) / 2;
        } 
        // For landscape images - use a crop that preserves the landscape feel
        else if (isLandscape) {
          // Use 90% of the height and corresponding width to maintain a pleasing ratio
          cropHeight = imgHeight * 0.9;
          // Use 16:9 aspect ratio if image is very wide, otherwise use the image's natural ratio
          const targetRatio = imgWidth / imgHeight > 1.8 ? 16/9 : imgWidth / imgHeight;
          cropWidth = Math.min(cropHeight * targetRatio, imgWidth * 0.9);
          x = (imgWidth - cropWidth) / 2;
          y = (imgHeight - cropHeight) / 2;
        } 
        // For portrait images - use a crop that preserves the portrait feel
        else {
          // Use 90% of the width and corresponding height to maintain a pleasing ratio
          cropWidth = imgWidth * 0.9;
          // Use 3:4 aspect ratio if image is very tall, otherwise use the image's natural ratio
          const targetRatio = imgHeight / imgWidth > 1.8 ? 3/4 : imgWidth / imgHeight;
          cropHeight = Math.min(cropWidth / targetRatio, imgHeight * 0.9);
          x = (imgWidth - cropWidth) / 2;
          y = (imgHeight - cropHeight) / 2;
        }
        
        // Set the crop area
        setCropArea({
          x: x,
          y: y,
          width: cropWidth,
          height: cropHeight
        });
        
        // Update input fields
        setWidth(Math.round(cropWidth).toString());
        setHeight(Math.round(cropHeight).toString());
        
        // Ensure crop tool is active
        setIsCropping(true);
      };
      
      // Check if image is already loaded
      if (img.complete) {
        handleImageLoad();
      } else {
        img.onload = handleImageLoad;
      }
    }
  }, [imagePreview, imageRef, setWidth, setHeight]);
  
  // Update crop area when aspect ratio changes
  useEffect(() => {
    if (!imagePreview || !imageRef.current) return;
    
    const img = imageRef.current;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    
    if (aspectRatio === 'freeform') {
      // For freeform, don't constrain the ratio but keep current size
      setKeepAspectRatio(false);
    } else if (aspectRatio === 'circle' || aspectRatio === 'triangle' || aspectRatio === 'heart') {
      // For special shapes, enforce 1:1 ratio
      setKeepAspectRatio(true);
      const size = Math.min(imgWidth, imgHeight) * 0.8;
      setCropArea({
        x: (imgWidth - size) / 2,
        y: (imgHeight - size) / 2,
        width: size,
        height: size
      });
      setWidth(Math.round(size).toString());
      setHeight(Math.round(size).toString());
    } else if (aspectRatio === 'original') {
      // For original, use the entire image
      setCropArea({
        x: 0,
        y: 0,
        width: imgWidth,
        height: imgHeight
      });
      setWidth(imgWidth.toString());
      setHeight(imgHeight.toString());
    } else {
      // For standard aspect ratios
      const selectedRatio = aspectRatios.find(r => r.id === aspectRatio);
      if (selectedRatio?.dimensions) {
        const { width: rWidth, height: rHeight } = selectedRatio.dimensions;
        const ratio = rWidth / rHeight;
        
        // Calculate new dimensions while maintaining the aspect ratio
        let newWidth, newHeight;
        
        // Try to maximize the crop area while maintaining the ratio
        if (imgWidth / imgHeight > ratio) {
          // Image is wider than the target ratio
          newHeight = imgHeight * 0.8; // 80% of image height
          newWidth = newHeight * ratio;
        } else {
          // Image is taller than the target ratio
          newWidth = imgWidth * 0.8; // 80% of image width
          newHeight = newWidth / ratio;
        }
        
        // Center the crop area
        const newX = (imgWidth - newWidth) / 2;
        const newY = (imgHeight - newHeight) / 2;
        
        setCropArea({
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight
        });
        
        // Update width and height inputs
        setWidth(Math.round(newWidth).toString());
        setHeight(Math.round(newHeight).toString());
        
        // Make sure to maintain aspect ratio when resizing
        setKeepAspectRatio(true);
      }
    }
  }, [aspectRatio, imagePreview, aspectRatios, imageRef, setWidth, setHeight, setKeepAspectRatio]);

  // Add useEffect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Force re-render to update display crop coordinates
      if (imageRef.current && cropArea) {
        setCropArea({...cropArea});
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cropArea]);

  // Function to get the display coordinates for the crop box
  const getDisplayCropArea = () => {
    if (!imageRef.current || !cropArea) return { top: 0, left: 0, width: 0, height: 0 };
    
    const img = imageRef.current;
    const imgRect = img.getBoundingClientRect();
    
    // Calculate scaling factors based on the rendered image vs natural size
    const scaleX = imgRect.width / img.naturalWidth;
    const scaleY = imgRect.height / img.naturalHeight;
    
    // Transform natural coordinates to display coordinates
    const displayBox = {
      top: cropArea.y * scaleY,
      left: cropArea.x * scaleX,
      width: cropArea.width * scaleX,
      height: cropArea.height * scaleY
    };
    
    return displayBox;
  };

  const constrainCropToImage = (newCrop) => {
    if (!imageRef.current) return newCrop;
    
    const img = imageRef.current;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    
    let { x, y, width, height } = newCrop;
    
    // Ensure crop dimensions don't exceed image bounds
    width = Math.min(width, imgWidth - x);
    height = Math.min(height, imgHeight - y);
    
    // Ensure crop position doesn't go outside image bounds
    x = Math.max(0, Math.min(x, imgWidth - width));
    y = Math.max(0, Math.min(y, imgHeight - height));
    
    return { x, y, width, height };
  };

  const handleMouseDown = (e) => {
    if (isCropping) {
      e.preventDefault();
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
      cropStartRef.current = { 
        x: cropArea.x, 
        y: cropArea.y,
        width: cropArea.width,
        height: cropArea.height
      };
    }
  };

  // Handle resize start event
  const handleResizeStart = (e, handle) => {
    if (isCropping) {
      e.stopPropagation();
      e.preventDefault();
      isResizingRef.current = true;
      resizeHandleRef.current = handle;
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
      cropStartRef.current = { 
        x: cropArea.x, 
        y: cropArea.y,
        width: cropArea.width,
        height: cropArea.height
      };
    }
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    
    const img = imageRef.current;
    const imgRect = img.getBoundingClientRect();
    
    // Calculate scaling factors to convert screen pixels to image pixels
    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;
    
    if (isDraggingRef.current) {
      // Calculate movement delta
      const deltaX = e.clientX - startXRef.current;
      const deltaY = e.clientY - startYRef.current;
      
      // Scale delta by image scale factor
      const scaledDeltaX = deltaX * scaleX;
      const scaledDeltaY = deltaY * scaleY;
      
      // Calculate new position
      let newX = cropStartRef.current.x + scaledDeltaX;
      let newY = cropStartRef.current.y + scaledDeltaY;
      
      // Constrain within image bounds
      newX = Math.max(0, Math.min(img.naturalWidth - cropArea.width, newX));
      newY = Math.max(0, Math.min(img.naturalHeight - cropArea.height, newY));
      
      // Update crop area
      setCropArea(prev => ({
        ...prev,
        x: newX,
        y: newY
      }));
    }
    else if (isResizingRef.current) {
      // Calculate movement delta
      const deltaX = e.clientX - startXRef.current;
      const deltaY = e.clientY - startYRef.current;
      
      // Scale delta by image scale factor
      const scaledDeltaX = deltaX * scaleX;
      const scaledDeltaY = deltaY * scaleY;
      
      let newX = cropStartRef.current.x;
      let newY = cropStartRef.current.y;
      let newWidth = cropStartRef.current.width;
      let newHeight = cropStartRef.current.height;
      const handle = resizeHandleRef.current;
      
      // Handle resize based on which handle was grabbed
      if (handle.includes('n')) {
        newY = cropStartRef.current.y + scaledDeltaY;
        newHeight = cropStartRef.current.height - scaledDeltaY;
      }
      if (handle.includes('s')) {
        newHeight = cropStartRef.current.height + scaledDeltaY;
      }
      if (handle.includes('w')) {
        newX = cropStartRef.current.x + scaledDeltaX;
        newWidth = cropStartRef.current.width - scaledDeltaX;
      }
      if (handle.includes('e')) {
        newWidth = cropStartRef.current.width + scaledDeltaX;
      }
      
      // Maintain aspect ratio if enabled
      if (keepAspectRatio && aspectRatio !== 'freeform') {
        const selectedRatio = aspectRatios.find(r => r.id === aspectRatio);
        if (selectedRatio?.dimensions) {
          const { width: rWidth, height: rHeight } = selectedRatio.dimensions;
          const ratio = rWidth / rHeight;
          
          if (handle.includes('n') || handle.includes('s')) {
            // Vertical resize, adjust width based on height
            newWidth = newHeight * ratio;
            if (handle.includes('w')) {
              newX = cropStartRef.current.x + cropStartRef.current.width - newWidth;
            }
          } else if (handle.includes('w') || handle.includes('e')) {
            // Horizontal resize, adjust height based on width
            newHeight = newWidth / ratio;
            if (handle.includes('n')) {
              newY = cropStartRef.current.y + cropStartRef.current.height - newHeight;
            }
          }
        }
      }
      
      // Ensure minimum size
      newWidth = Math.max(20, newWidth);
      newHeight = Math.max(20, newHeight);
      
      // Constrain within image bounds
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      
      if (newX < 0) {
        newWidth += newX;
        newX = 0;
      }
      if (newY < 0) {
        newHeight += newY;
        newY = 0;
      }
      if (newX + newWidth > imgWidth) {
        newWidth = imgWidth - newX;
      }
      if (newY + newHeight > imgHeight) {
        newHeight = imgHeight - newY;
      }
      
      // Update crop area
      setCropArea({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
      
      // Update dimension input fields
      setWidth(Math.round(newWidth).toString());
      setHeight(Math.round(newHeight).toString());
    }
  };
      
  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isResizingRef.current = false;
    resizeHandleRef.current = null;
  };

  // Crop the image
  const performCrop = (format = 'image/jpeg', quality = 0.92) => {
    if (!imageRef.current || !cropArea) return null;
  
    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    // Set canvas size to crop area
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;
  
    // Apply shape mask for special shapes
    if (aspectRatio === 'circle' || aspectRatio === 'triangle' || aspectRatio === 'heart') {
      ctx.save();
  
      if (aspectRatio === 'circle') {
        ctx.beginPath();
        ctx.arc(cropArea.width / 2, cropArea.height / 2, cropArea.width / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      } else if (aspectRatio === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(cropArea.width / 2, 0);
        ctx.lineTo(0, cropArea.height);
        ctx.lineTo(cropArea.width, cropArea.height);
        ctx.closePath();
        ctx.clip();
      } else if (aspectRatio === 'heart') {
        ctx.beginPath();
        const size = Math.min(cropArea.width, cropArea.height);
        const x = cropArea.width / 2;
        const y = cropArea.height / 2;
        const width = size;
        const height = size;
  
        ctx.moveTo(x, y - 0.3 * height);
        ctx.bezierCurveTo(
          x - 0.25 * width, y - 0.45 * height,
          x - 0.5 * width, y - 0.25 * height,
          x - 0.5 * width, y
        );
        ctx.bezierCurveTo(
          x - 0.5 * width, y + 0.3 * height,
          x - 0.3 * width, y + 0.4 * height,
          x, y + 0.5 * height
        );
        ctx.bezierCurveTo(
          x + 0.3 * width, y + 0.4 * height,
          x + 0.5 * width, y + 0.3 * height,
          x + 0.5 * width, y
        );
        ctx.bezierCurveTo(
          x + 0.5 * width, y - 0.25 * height,
          x + 0.25 * width, y - 0.45 * height,
          x, y - 0.3 * height
        );
        ctx.closePath();
        ctx.clip();
      }
    }
  
    // Draw cropped portion of image to canvas
    ctx.drawImage(
      img,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      0, 0, cropArea.width, cropArea.height
    );
  
    if (aspectRatio === 'circle' || aspectRatio === 'triangle' || aspectRatio === 'heart') {
      ctx.restore();
    }
  
    // Convert canvas to data URL with selected format
    const croppedDataUrl = canvas.toDataURL(format, quality);
  
    setCroppedImage(croppedDataUrl);
    setIsCropping(false);
  
    return croppedDataUrl;
  };
  
  return {
    cropArea,
    setCropArea,
    isCropping,
    setIsCropping,
    croppedImage,
    setCroppedImage,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleResizeStart,
    performCrop,
    cropBoxRef,
    getDisplayCropArea   
  };
}