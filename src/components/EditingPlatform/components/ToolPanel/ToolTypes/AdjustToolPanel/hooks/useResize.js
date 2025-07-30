import { useState, useCallback } from 'react';

export const useResize = (imageRef, containerRef) => {
  const [resizeSettings, setResizeSettings] = useState({
    scale: 1,
    width: null,
    height: null,
    originalWidth: null,
    originalHeight: null,
    isActive: false,
    type: null 
  });

  // Initialize original dimensions when image loads
  const initializeResize = useCallback(() => {
    if (imageRef.current && !resizeSettings.originalWidth) {
      const img = imageRef.current;
      setResizeSettings(prev => ({
        ...prev,
        originalWidth: img.naturalWidth,
        originalHeight: img.naturalHeight,
        width: img.naturalWidth,
        height: img.naturalHeight
      }));
    }
  }, [imageRef, resizeSettings.originalWidth]);

  // Calculate container dimensions
  const getContainerDimensions = useCallback(() => {
    if (!containerRef.current) return { width: 0, height: 0 };
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    return {
      width: rect.width - 32, // Account for padding
      height: rect.height - 32
    };
  }, [containerRef]);

  // Calculate scale to fit container
  const calculateFitScale = useCallback(() => {
    if (!resizeSettings.originalWidth || !resizeSettings.originalHeight) return 1;
    
    const container = getContainerDimensions();
    const scaleX = container.width / resizeSettings.originalWidth;
    const scaleY = container.height / resizeSettings.originalHeight;
    
    return Math.min(scaleX, scaleY, 1); // Don't exceed original size
  }, [resizeSettings.originalWidth, resizeSettings.originalHeight, getContainerDimensions]);

  // Perform resize operation
  const performResize = useCallback((type) => {
    if (!resizeSettings.originalWidth || !resizeSettings.originalHeight) {
      initializeResize();
      return;
    }

    let newScale = resizeSettings.scale;
    let newWidth, newHeight;

    switch (type) {
      case 'enlarge':
        newScale = Math.min(resizeSettings.scale * 1.25, 3); // Max 3x zoom
        break;
      
      case 'shrink':
        newScale = Math.max(resizeSettings.scale * 0.8, 0.1); // Min 10% of original
        break;
      
      case 'fitToScreen':
        newScale = calculateFitScale();
        break;
      
      case 'original':
        newScale = 1;
        break;
      
      default:
        return;
    }

    newWidth = Math.round(resizeSettings.originalWidth * newScale);
    newHeight = Math.round(resizeSettings.originalHeight * newScale);

    setResizeSettings(prev => ({
      ...prev,
      scale: newScale,
      width: newWidth,
      height: newHeight,
      isActive: true,
      type
    }));

    // Apply resize to image element
    if (imageRef.current) {
      imageRef.current.style.width = `${newWidth}px`;
      imageRef.current.style.height = `${newHeight}px`;
      imageRef.current.style.maxWidth = 'none';
      imageRef.current.style.maxHeight = 'none';
    }
  }, [resizeSettings, imageRef, initializeResize, calculateFitScale]);

  // Reset resize
  const resetResize = useCallback(() => {
    if (imageRef.current) {
      imageRef.current.style.width = '';
      imageRef.current.style.height = '';
      imageRef.current.style.maxWidth = '';
      imageRef.current.style.maxHeight = '';
    }

    setResizeSettings(prev => ({
      ...prev,
      scale: 1,
      width: prev.originalWidth,
      height: prev.originalHeight,
      isActive: false,
      type: null
    }));
  }, [imageRef]);

  // Update resize dimensions manually
  const updateResizeDimensions = useCallback((width, height) => {
    const newScale = resizeSettings.originalWidth 
      ? width / resizeSettings.originalWidth 
      : 1;

    setResizeSettings(prev => ({
      ...prev,
      scale: newScale,
      width: Math.round(width),
      height: Math.round(height),
      isActive: true
    }));

    if (imageRef.current) {
      imageRef.current.style.width = `${width}px`;
      imageRef.current.style.height = `${height}px`;
    }
  }, [resizeSettings.originalWidth, imageRef]);

  return {
    resizeSettings,
    setResizeSettings,
    performResize,
    resetResize,
    initializeResize,
    updateResizeDimensions,
    calculateFitScale
  };
};