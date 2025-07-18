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
    } else if (aspectRatioId === 'circle') {
      const size = Math.min(100, 100);
      setCropSettings(prev => ({
        ...prev,
        width: size,
        height: size,
        aspectRatio: selectedRatio,
        isActive: true,
        x: (100 - size) / 2,
        y: (100 - size) / 2
      }));
    }
  }, [calculateAspectRatioDimensions, cropSettings, imageRef]);

  // Perform crop
  const performCrop = useCallback((settings, imagePreview) => {
    if (!imagePreview || !imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const actualX = (settings.x / 100) * img.naturalWidth;
      const actualY = (settings.y / 100) * img.naturalHeight;
      const actualWidth = (settings.width / 100) * img.naturalWidth;
      const actualHeight = (settings.height / 100) * img.naturalHeight;

      canvas.width = actualWidth;
      canvas.height = actualHeight;

      // Handle circle crop
      if (settings.aspectRatio?.id === 'circle') {
        const centerX = actualWidth / 2;
        const centerY = actualHeight / 2;
        const radius = Math.min(actualWidth, actualHeight) / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.clip();
      }

      ctx.drawImage(
        img,
        actualX, actualY, actualWidth, actualHeight,
        0, 0, actualWidth, actualHeight
      );

      const croppedDataUrl = canvas.toDataURL('image/png', 1.0);
      setImagePreview(croppedDataUrl);

      resetCrop(); // Reset after crop
    };

    img.src = imagePreview;
  }, [imageRef, setImagePreview]);

  // 🔥 Apply crop on Enter key
  const handleCropApply = useCallback(() => {
    if (cropSettings.isActive) {
      performCrop(cropSettings, imageRef.current?.src || '');
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
