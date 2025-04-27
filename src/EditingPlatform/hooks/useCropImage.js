'use client'
import { useState, useRef, useEffect } from 'react';

export function useCropImage({ imageRef, aspectRatio, aspectRatios, width, height, setWidth, setHeight, keepAspectRatio }) {
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

  // Add this effect to initialize crop area when image loads
  useEffect(() => {
    if (imageRef.current && (!cropArea || cropArea.width === 0)) {
      const img = imageRef.current;
      // Make sure the image is loaded
      if (img.complete) {
        initializeCropArea(img);
      } else {
        img.onload = () => initializeCropArea(img);
      }
    }
  }, [imageRef.current]);

  // Initialize crop area based on image dimensions
  const initializeCropArea = (img) => {
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    
    // Default to 80% of the image
    const newWidth = imgWidth * 0.8;
    const newHeight = imgHeight * 0.8;
    const newX = (imgWidth - newWidth) / 2;
    const newY = (imgHeight - newHeight) / 2;
    
    setCropArea({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    });
    
    setWidth(Math.round(newWidth).toString());
    setHeight(Math.round(newHeight).toString());
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

  // Function to set up cropping based on aspect ratio
  const setupCropByAspectRatio = (ratioId) => {
    if (!imageRef.current) return;
    
    const img = imageRef.current;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    
    // For freeform, just disable keep aspect ratio
    if (ratioId === 'freeform') {
      // Use current crop area or default to 80% of image
      const newWidth = imgWidth * 0.8;
      const newHeight = imgHeight * 0.8;
      const newX = (imgWidth - newWidth) / 2;
      const newY = (imgHeight - newHeight) / 2;
      
      setCropArea({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
      
      setWidth(Math.round(newWidth).toString());
      setHeight(Math.round(newHeight).toString());
      return;
    }
    
    // For original ratio, use the whole image
    if (ratioId === 'original') {
      setCropArea({
        x: 0,
        y: 0,
        width: imgWidth,
        height: imgHeight
      });
      setWidth(imgWidth.toString());
      setHeight(imgHeight.toString());
      return;
    }
    
    // For special shapes (circle, triangle, heart), use 1:1 ratio
    if (ratioId === 'circle' || ratioId === 'triangle' || ratioId === 'heart') {
      // For these shapes, we'll use square dimensions
      const size = Math.min(imgWidth, imgHeight) * 0.8; // 80% of smaller dimension
      const newX = (imgWidth - size) / 2;
      const newY = (imgHeight - size) / 2;
      
      setCropArea({
        x: newX,
        y: newY,
        width: size,
        height: size
      });
      setWidth(Math.round(size).toString());
      setHeight(Math.round(size).toString());
      return;
    }
    
    // For standard aspect ratios
    const selectedRatio = aspectRatios.find(r => r.id === ratioId);
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
    }
  };

  // Crop the image
  const performCrop = (format = 'image/jpeg', quality = 0.92) => {
    if (!imageRef.current || !cropArea) return null;
  
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
      imageRef.current,
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
    setupCropByAspectRatio   
  };
}