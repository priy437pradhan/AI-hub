import { useState, useCallback } from 'react';

export const useCrop = (imageRef, setImagePreview) => {
  const [cropSettings, setCropSettings] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    aspectRatio: null,
    isActive: false
  });

  // Draw triangle path
  const drawTriangle = useCallback((ctx, width, height) => {
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);           
    ctx.lineTo(0, height);             
    ctx.lineTo(width, height);          
    ctx.closePath();
  }, []);

  // Draw star path
  const drawStar = useCallback((ctx, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) / 2;
    const innerRadius = outerRadius * 0.4;
    const spikes = 5;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = centerX + Math.cos(angle - Math.PI / 2) * radius;
      const y = centerY + Math.sin(angle - Math.PI / 2) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
  }, []);

  // Calculate aspect ratio dimensions in percentage
  const calculateAspectRatioDimensions = useCallback((aspectRatio, containerWidth, containerHeight) => {
    if (!aspectRatio?.dimensions) {
      return { width: 100, height: 100 };
    }

    const { width: ratioWidth, height: ratioHeight } = aspectRatio.dimensions;
    const aspectValue = ratioWidth / ratioHeight;

    let newWidth, newHeight;

    if (containerWidth / containerHeight > aspectValue) {
      newHeight = 100;
      newWidth = (100 * aspectValue * containerHeight) / containerWidth;
    } else {
      newWidth = 100;
      newHeight = (100 * containerWidth) / (aspectValue * containerHeight);
    }

    return {
      width: Math.min(newWidth, 100),
      height: Math.min(newHeight, 100)
    };
  }, []);

  // MOVED: resetCrop defined before performCrop
  const resetCrop = useCallback(() => {
    setCropSettings({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      aspectRatio: null,
      isActive: false
    });
  }, []);

  // Set crop with aspect ratio
  const setCropWithAspectRatio = useCallback((aspectRatioId, aspectRatios, callback) => {
    const selectedRatio = aspectRatios.find(ratio => ratio.id === aspectRatioId);

    if (selectedRatio?.dimensions && imageRef.current) {
      const imgRect = imageRef.current.getBoundingClientRect();
      const dimensions = calculateAspectRatioDimensions(
        selectedRatio,
        imgRect.width,
        imgRect.height
      );

      const newSettings = {
        ...cropSettings,
        width: dimensions.width,
        height: dimensions.height,
        aspectRatio: selectedRatio,
        isActive: true,
        x: (100 - dimensions.width) / 2,
        y: (100 - dimensions.height) / 2
      };

      setCropSettings(newSettings);

      if (typeof callback === 'function') {
        setTimeout(() => callback(newSettings), 0);
      }
    } else if (aspectRatioId === 'freeform') {
      setCropSettings(prev => ({
        ...prev,
        aspectRatio: null,
        isActive: true
      }));
    } else if (aspectRatioId === 'original') {
      resetCrop();
    } else if (['circle', 'triangle', 'star'].includes(aspectRatioId)) {
      // Handle special shapes (circle, triangle, star)
      if (!imageRef.current) return;
      
      const imgRect = imageRef.current.getBoundingClientRect();
      const containerAspectRatio = imgRect.width / imgRect.height;
      
      // For shapes, we want a square crop that fits within the image
      let size;
      if (containerAspectRatio > 1) {
        // Image is wider than tall - constrain by height
        size = Math.min(80, (80 * imgRect.height) / imgRect.width);
      } else {
        // Image is taller than wide - constrain by width  
        size = Math.min(80, (80 * imgRect.width) / imgRect.height);
      }
      
      const newSettings = {
        ...cropSettings,
        width: size,
        height: size,
        aspectRatio: selectedRatio,
        isActive: true,
        x: (100 - size) / 2,
        y: (100 - size) / 2
      };
      
      setCropSettings(newSettings);
      
      if (typeof callback === 'function') {
        setTimeout(() => callback(newSettings), 0);
      }
    }
  }, [calculateAspectRatioDimensions, cropSettings, imageRef, resetCrop]);

  // FIXED: Perform crop - with better error handling and image source validation
  const performCrop = useCallback((settings, imagePreview) => {
    if (!imagePreview || !imageRef.current) {
      console.error('Missing imagePreview or imageRef');
      return;
    }

    // Validate image source
    const imageSrc = typeof imagePreview === 'string' ? imagePreview : imageRef.current.src;
    if (!imageSrc || imageSrc === '' || imageSrc === 'data:') {
      console.error('Invalid image source:', imageSrc);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Enable CORS for external images
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        // Validate image dimensions
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
          console.error('Image has invalid dimensions');
          return;
        }

        // Calculate actual crop coordinates based on the natural image size
        const actualX = Math.max(0, (settings.x / 100) * img.naturalWidth);
        const actualY = Math.max(0, (settings.y / 100) * img.naturalHeight);
        const actualWidth = Math.min(
          (settings.width / 100) * img.naturalWidth,
          img.naturalWidth - actualX
        );
        const actualHeight = Math.min(
          (settings.height / 100) * img.naturalHeight,
          img.naturalHeight - actualY
        );

        // Validate crop dimensions
        if (actualWidth <= 0 || actualHeight <= 0) {
          console.error('Invalid crop dimensions');
          return;
        }

        // Set canvas size to the crop area size
        canvas.width = Math.floor(actualWidth);
        canvas.height = Math.floor(actualHeight);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Handle different shapes
        if (settings.aspectRatio?.id === 'circle') {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = Math.min(canvas.width, canvas.height) / 2;

          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.clip();
        } else if (settings.aspectRatio?.id === 'triangle') {
          drawTriangle(ctx, canvas.width, canvas.height);
          ctx.clip();
        } else if (settings.aspectRatio?.id === 'star') {
          drawStar(ctx, canvas.width, canvas.height);
          ctx.clip();
        }

        // Draw the cropped portion of the source image
        ctx.drawImage(
          img,
          Math.floor(actualX), Math.floor(actualY), Math.floor(actualWidth), Math.floor(actualHeight),  // Source crop area
          0, 0, canvas.width, canvas.height              // Destination (full canvas)
        );

        // Convert to data URL with high quality
        const croppedDataUrl = canvas.toDataURL('image/png', 1.0);
        
        // Validate the result
        if (croppedDataUrl && croppedDataUrl.length > 100) {
          setImagePreview(croppedDataUrl);
          resetCrop();
        } else {
          console.error('Failed to generate cropped image data');
        }
      } catch (error) {
        console.error('Error during crop processing:', error);
      }
    };

    img.onerror = (error) => {
      console.error('Error loading image for crop. Source:', imageSrc, 'Error:', error);
      console.error('Image element:', img);
    };

    // Load the current image
    console.log('Loading image for crop:', imageSrc);
    img.src = imageSrc;
  }, [imageRef, setImagePreview, drawTriangle, drawStar, resetCrop]);

  // Apply crop on Enter key
  const handleCropApply = useCallback(() => {
    if (cropSettings.isActive && imageRef.current?.src) {
      performCrop(cropSettings, imageRef.current.src);
    }
  }, [cropSettings, performCrop, imageRef]);

  const toggleCropMode = useCallback(() => {
    setCropSettings(prev => ({
      ...prev,
      isActive: !prev.isActive
    }));
  }, []);

  const cancelCrop = useCallback(() => {
    setCropSettings(prev => ({
      ...prev,
      isActive: false
    }));
  }, []);

  const updateCropPosition = useCallback((x, y) => {
    setCropSettings(prev => ({
      ...prev,
      x: Math.max(0, Math.min(100 - prev.width, x)),
      y: Math.max(0, Math.min(100 - prev.height, y))
    }));
  }, []);

  const updateCropDimensions = useCallback((width, height) => {
    setCropSettings(prev => ({
      ...prev,
      width: Math.max(1, Math.min(100, width)),
      height: Math.max(1, Math.min(100, height)),
      x: Math.max(0, Math.min(100 - width, prev.x)),
      y: Math.max(0, Math.min(100 - height, prev.y))
    }));
  }, []);

  return {
    cropSettings,
    setCropSettings,
    performCrop,
    setCropWithAspectRatio,
    toggleCropMode,
    cancelCrop,
    updateCropPosition,    
    updateCropDimensions,   
    resetCrop,
    handleCropApply,
    calculateAspectRatioDimensions
  };
};