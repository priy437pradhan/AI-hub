'use client';
import { useState, useEffect } from 'react';

export default function useCropImage({ 
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
  // State for crop area
  const [cropArea, setCropArea] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  
  // Additional state for drag and resize
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeDirection, setResizeDirection] = useState(null);
  const [initialCropArea, setInitialCropArea] = useState(null);

  // Define social media formats
  const socialMediaFormats = {
    'whatsapp-dp': { width: 640, height: 640 }, // 1:1 for WhatsApp display picture
    'instagram-post': { width: 1080, height: 1080 }, // Standard square IG post
    'youtube-thumbnail': { width: 1280, height: 720 }, // 16:9 YouTube thumbnail
  };

  // Reset crop area when image changes
  useEffect(() => {
    if (imageRef.current && imagePreview) {
      // Wait for image to load to get accurate dimensions
      const img = imageRef.current;
      if (img.complete) {
        initializeCropArea();
      } else {
        img.onload = initializeCropArea;
      }
    }
  }, [imagePreview]);

  // Update crop area when aspect ratio changes
  useEffect(() => {
    if (isCropping && imageRef.current && aspectRatio && cropArea) {
      applyAspectRatio(aspectRatio);
    }
  }, [aspectRatio]);

  // Initialize crop area based on image dimensions
  const initializeCropArea = () => {
    if (!imageRef.current) return;
    
    const img = imageRef.current;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    
    // Default to 80% of the image size
    const defaultWidth = imgWidth * 0.8;
    const defaultHeight = imgHeight * 0.8;
    
    // Center the crop area
    const x = (imgWidth - defaultWidth) / 2;
    const y = (imgHeight - defaultHeight) / 2;
    
    setCropArea({
      x,
      y,
      width: defaultWidth,
      height: defaultHeight
    });
    
    // Update width and height inputs
    setWidth(Math.round(defaultWidth).toString());
    setHeight(Math.round(defaultHeight).toString());
  };

  // Apply aspect ratio to current crop area
  const applyAspectRatio = (ratioId) => {
    if (!imageRef.current || !cropArea) return;
    
    const img = imageRef.current;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    
    // Keep current center point
    const centerX = cropArea.x + cropArea.width / 2;
    const centerY = cropArea.y + cropArea.height / 2;
    
    let newWidth = cropArea.width;
    let newHeight = cropArea.height;
    
    // Handle special ratios like social media formats
    if (ratioId === 'whatsapp-dp') {
      const ratio = socialMediaFormats['whatsapp-dp'].width / socialMediaFormats['whatsapp-dp'].height;
      newHeight = Math.min(cropArea.width / ratio, cropArea.height, imgHeight);
      newWidth = newHeight * ratio;
    } else if (ratioId === 'instagram-post') {
      const ratio = socialMediaFormats['instagram-post'].width / socialMediaFormats['instagram-post'].height;
      newHeight = Math.min(cropArea.width / ratio, cropArea.height, imgHeight);
      newWidth = newHeight * ratio;
    } else if (ratioId === 'youtube-thumbnail') {
      const ratio = socialMediaFormats['youtube-thumbnail'].width / socialMediaFormats['youtube-thumbnail'].height;
      newHeight = Math.min(cropArea.width / ratio, cropArea.height, imgHeight);
      newWidth = newHeight * ratio;
    } else if (ratioId !== 'freeform') {
      // Find the ratio from aspect ratios array
      const selectedRatio = aspectRatios.find(r => r.id === ratioId);
      
      if (selectedRatio?.dimensions) {
        const { width: rWidth, height: rHeight } = selectedRatio.dimensions;
        const ratio = rWidth / rHeight;
        
        // Calculate new dimensions while maintaining center point
        if (cropArea.width / cropArea.height > ratio) {
          // Current crop is wider than the target ratio
          newWidth = cropArea.height * ratio;
          newHeight = cropArea.height;
        } else {
          // Current crop is taller than the target ratio
          newWidth = cropArea.width;
          newHeight = cropArea.width / ratio;
        }
      } else if (ratioId === 'original') {
        // Use the original image ratio
        const ratio = imgWidth / imgHeight;
        
        // Calculate dimensions while maintaining current center
        if (cropArea.width / cropArea.height > ratio) {
          newWidth = cropArea.height * ratio;
          newHeight = cropArea.height;
        } else {
          newWidth = cropArea.width;
          newHeight = cropArea.width / ratio;
        }
      }
      // For special shapes like circle, triangle, heart - we use 1:1 aspect ratio
      else if (['circle', 'triangle', 'heart'].includes(ratioId)) {
        // Make it square (1:1 ratio)
        const size = Math.min(cropArea.width, cropArea.height);
        newWidth = size;
        newHeight = size;
      }
    }
    
    // Ensure crop area stays within image bounds
    newWidth = Math.min(newWidth, imgWidth);
    newHeight = Math.min(newHeight, imgHeight);
    
    // Calculate new top-left position to maintain center point
    let newX = centerX - newWidth / 2;
    let newY = centerY - newHeight / 2;
    
    // Ensure crop area stays within image bounds
    newX = Math.max(0, Math.min(newX, imgWidth - newWidth));
    newY = Math.max(0, Math.min(newY, imgHeight - newHeight));
    
    // Update crop area
    setCropArea({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    });
    
    // Update width and height inputs
    setWidth(Math.round(newWidth).toString());
    setHeight(Math.round(newHeight).toString());
  };

  // Handle mouse down for crop area dragging
  const handleMouseDown = (e) => {
    e.preventDefault();
    if (!cropArea) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cropArea.x,
      y: e.clientY - cropArea.y
    });
  };
  
  // Handle mouse move for dragging or resizing
  const handleMouseMove = (e) => {
    if (!cropArea || (!isDragging && !isResizing)) return;
    
    const img = imageRef.current;
    if (!img) return;
    
    const imgRect = img.getBoundingClientRect();
    const imgNaturalWidth = img.naturalWidth;
    const imgNaturalHeight = img.naturalHeight;
    
    // Calculate scale factors between displayed image and natural image size
    const scaleX = imgNaturalWidth / imgRect.width;
    const scaleY = imgNaturalHeight / imgRect.height;
    
    if (isDragging) {
      // Calculate new position in natural image coordinates
      let newX = (e.clientX - dragStart.x);
      let newY = (e.clientY - dragStart.y);
      
      // Convert from screen coordinates to natural image coordinates
      newX = (newX - imgRect.left) * scaleX;
      newY = (newY - imgRect.top) * scaleY;
      
      // Ensure crop area stays within image bounds
      newX = Math.max(0, Math.min(newX, imgNaturalWidth - cropArea.width));
      newY = Math.max(0, Math.min(newY, imgNaturalHeight - cropArea.height));
      
      setCropArea({
        ...cropArea,
        x: newX,
        y: newY
      });
    } else if (isResizing) {
      // Get mouse position in natural image coordinates
      const mouseX = (e.clientX - imgRect.left) * scaleX;
      const mouseY = (e.clientY - imgRect.top) * scaleY;
      
      let newX = initialCropArea.x;
      let newY = initialCropArea.y;
      let newWidth = initialCropArea.width;
      let newHeight = initialCropArea.height;
      
      // Adjust crop area based on resize direction
      switch (resizeDirection) {
        case 'nw': // North-west (top-left)
          newX = Math.min(mouseX, initialCropArea.x + initialCropArea.width);
          newY = Math.min(mouseY, initialCropArea.y + initialCropArea.height);
          newWidth = initialCropArea.x + initialCropArea.width - newX;
          newHeight = initialCropArea.y + initialCropArea.height - newY;
          break;
        case 'ne': // North-east (top-right)
          newY = Math.min(mouseY, initialCropArea.y + initialCropArea.height);
          newWidth = mouseX - initialCropArea.x;
          newHeight = initialCropArea.y + initialCropArea.height - newY;
          break;
        case 'sw': // South-west (bottom-left)
          newX = Math.min(mouseX, initialCropArea.x + initialCropArea.width);
          newWidth = initialCropArea.x + initialCropArea.width - newX;
          newHeight = mouseY - initialCropArea.y;
          break;
        case 'se': // South-east (bottom-right)
          newWidth = mouseX - initialCropArea.x;
          newHeight = mouseY - initialCropArea.y;
          break;
        case 'n': // North (top)
          newY = Math.min(mouseY, initialCropArea.y + initialCropArea.height);
          newHeight = initialCropArea.y + initialCropArea.height - newY;
          break;
        case 's': // South (bottom)
          newHeight = mouseY - initialCropArea.y;
          break;
        case 'w': // West (left)
          newX = Math.min(mouseX, initialCropArea.x + initialCropArea.width);
          newWidth = initialCropArea.x + initialCropArea.width - newX;
          break;
        case 'e': // East (right)
          newWidth = mouseX - initialCropArea.x;
          break;
      }
      
      // Ensure width and height are positive
      newWidth = Math.max(20, newWidth);
      newHeight = Math.max(20, newHeight);
      
      // Maintain aspect ratio if needed
      if (keepAspectRatio && aspectRatio !== 'freeform') {
        let ratio = 1; // Default to 1:1
        
        // Get ratio from selected aspect ratio
        if (aspectRatio !== 'freeform' && aspectRatio !== 'original') {
          const selectedRatio = aspectRatios.find(r => r.id === aspectRatio);
          if (selectedRatio?.dimensions) {
            ratio = selectedRatio.dimensions.width / selectedRatio.dimensions.height;
          }
        } else if (aspectRatio === 'original' && img) {
          ratio = img.naturalWidth / img.naturalHeight;
        }
        
        // Adjust dimensions based on resize direction
        if (['n', 's'].includes(resizeDirection)) {
          // Vertical resize - adjust width to match ratio
          newWidth = newHeight * ratio;
        } else if (['e', 'w'].includes(resizeDirection)) {
          // Horizontal resize - adjust height to match ratio
          newHeight = newWidth / ratio;
        } else {
          // Corner resize - use aspect ratio based on larger dimension change
          const widthChange = Math.abs(newWidth - initialCropArea.width);
          const heightChange = Math.abs(newHeight - initialCropArea.height);
          
          if (widthChange >= heightChange) {
            newHeight = newWidth / ratio;
          } else {
            newWidth = newHeight * ratio;
          }
        }
        
        // Adjust position for different resize handles to maintain the right corner fixed
        if (['nw', 'w', 'sw'].includes(resizeDirection)) {
          newX = initialCropArea.x + initialCropArea.width - newWidth;
        }
        if (['nw', 'n', 'ne'].includes(resizeDirection)) {
          newY = initialCropArea.y + initialCropArea.height - newHeight;
        }
      }
      
      // Ensure crop area stays within image bounds
      newX = Math.max(0, Math.min(newX, imgNaturalWidth - newWidth));
      newY = Math.max(0, Math.min(newY, imgNaturalHeight - newHeight));
      newWidth = Math.min(newWidth, imgNaturalWidth - newX);
      newHeight = Math.min(newHeight, imgNaturalHeight - newY);
      
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
  
  // Handle mouse up to end dragging or resizing
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };
  
  // Handle resize start
  const handleResizeStart = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeDirection(direction);
    setInitialCropArea({...cropArea});
  };
  
  // Function to perform the actual crop
  const performCrop = () => {
    if (!imageRef.current || !cropArea) return null;
    
    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Create a temporary canvas for the initial crop
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Set the canvas size to the crop size
    tempCanvas.width = cropArea.width;
    tempCanvas.height = cropArea.height;
    
    // Draw the cropped portion of the image to the temporary canvas
    tempCtx.drawImage(
      img,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      0, 0, cropArea.width, cropArea.height
    );
    
    // For special shapes, we'll need a different approach
    if (['circle', 'triangle', 'heart'].includes(aspectRatio)) {
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;
      
      ctx.save();
      
      // Create clipping path based on shape
      if (aspectRatio === 'circle') {
        ctx.beginPath();
        ctx.arc(cropArea.width/2, cropArea.height/2, Math.min(cropArea.width, cropArea.height)/2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      } else if (aspectRatio === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(cropArea.width/2, 0);
        ctx.lineTo(0, cropArea.height);
        ctx.lineTo(cropArea.width, cropArea.height);
        ctx.closePath();
        ctx.clip();
      } else if (aspectRatio === 'heart') {
        ctx.beginPath();
        // Heart shape path
        const width = cropArea.width;
        const height = cropArea.height;
        const topCurveHeight = height * 0.3;
        
        ctx.moveTo(width/2, height*0.2);
        // Left top curve
        ctx.bezierCurveTo(
          width/2 - width*0.25, height*0.05, 
          0, height*0.25, 
          width*0.25, height*0.6
        );
        // Bottom point
        ctx.lineTo(width/2, height*0.95);
        // Right curve
        ctx.lineTo(width*0.75, height*0.6);
        ctx.bezierCurveTo(
          width, height*0.25, 
          width/2 + width*0.25, height*0.05, 
          width/2, height*0.2
        );
        ctx.closePath();
        ctx.clip();
      }
      
      // Draw the cropped image with the clipping path applied
      ctx.drawImage(tempCanvas, 0, 0, cropArea.width, cropArea.height);
      ctx.restore();
    } else {
      // For regular rectangular crops, just use the temp canvas
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;
      ctx.drawImage(tempCanvas, 0, 0);
    }
    
    // Convert canvas to data URL
    const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCroppedImage(croppedImageUrl);
    
    return croppedImageUrl;
  };
  
  // Function to get dimensions for displaying the crop area on the screen
  const getDisplayCropArea = () => {
    if (!imageRef.current || !cropArea) return { top: 0, left: 0, width: 0, height: 0 };
    
    const img = imageRef.current;
    const imgRect = img.getBoundingClientRect();
    
    // Calculate the scale between natural image size and displayed size
    const scaleX = imgRect.width / img.naturalWidth;
    const scaleY = imgRect.height / img.naturalHeight;
    
    // Scale crop area to match displayed image
    return {
      top: cropArea.y * scaleY,
      left: cropArea.x * scaleX,
      width: cropArea.width * scaleX,
      height: cropArea.height * scaleY
    };
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
    getDisplayCropArea
  };
}