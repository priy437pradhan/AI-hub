import { useState, useCallback } from 'react';

// Custom hook for image cropping functionality
export const useCrop = (imageRef, setImagePreview) => {
  const [cropSettings, setCropSettings] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    aspectRatio: null,
    isActive: false
  });

  // Calculate dimensions based on aspect ratio
  const calculateAspectRatioDimensions = useCallback((aspectRatio, containerWidth, containerHeight) => {
    if (!aspectRatio || !aspectRatio.dimensions) {
      return { width: 100, height: 100 };
    }

    const { width: ratioWidth, height: ratioHeight } = aspectRatio.dimensions;
    const aspectValue = ratioWidth / ratioHeight;

    let newWidth, newHeight;

    if (containerWidth / containerHeight > aspectValue) {
      // Container is wider than aspect ratio
      newHeight = 100;
      newWidth = (100 * aspectValue * containerHeight) / containerWidth;
    } else {
      // Container is taller than aspect ratio
      newWidth = 100;
      newHeight = (100 * containerWidth) / (aspectValue * containerHeight);
    }

    return {
      width: Math.min(newWidth, 100),
      height: Math.min(newHeight, 100)
    };
  }, []);

  // Set crop with specific aspect ratio
  const setCropWithAspectRatio = useCallback((aspectRatioId, aspectRatios) => {
    const selectedRatio = aspectRatios.find(ratio => ratio.id === aspectRatioId);

    if (selectedRatio && selectedRatio.dimensions && imageRef.current) {
      const imgRect = imageRef.current.getBoundingClientRect();
      const dimensions = calculateAspectRatioDimensions(
        selectedRatio,
        imgRect.width,
        imgRect.height
      );

      setCropSettings(prev => ({
        ...prev,
        width: dimensions.width,
        height: dimensions.height,
        aspectRatio: selectedRatio,
        isActive: true,
        // Center the crop area
        x: (100 - dimensions.width) / 2,
        y: (100 - dimensions.height) / 2
      }));
    } else if (aspectRatioId === 'freeform') {
      setCropSettings(prev => ({
        ...prev,
        aspectRatio: null,
        isActive: true
      }));
    } else if (aspectRatioId === 'original') {
      setCropSettings({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        aspectRatio: null,
        isActive: false
      });
    } else if (aspectRatioId === 'circle') {
      // For circle crop, make it square and centered
      const size = Math.min(100, 100); // Could be adjusted based on image dimensions
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
  }, [calculateAspectRatioDimensions, imageRef]);

  // Perform the actual crop operation
  const performCrop = useCallback((settings, imagePreview) => {
    if (!imagePreview || !imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate actual pixel dimensions from percentages
      const actualX = (settings.x / 100) * img.naturalWidth;
      const actualY = (settings.y / 100) * img.naturalHeight;
      const actualWidth = (settings.width / 100) * img.naturalWidth;
      const actualHeight = (settings.height / 100) * img.naturalHeight;

      // Set canvas dimensions to crop size
      canvas.width = actualWidth;
      canvas.height = actualHeight;

      // Handle circle crop
      if (settings.aspectRatio && settings.aspectRatio.id === 'circle') {
        // Create circular clipping path
        const centerX = actualWidth / 2;
        const centerY = actualHeight / 2;
        const radius = Math.min(actualWidth, actualHeight) / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.clip();
      }

      // Draw the cropped portion
      ctx.drawImage(
        img,
        actualX, actualY, actualWidth, actualHeight, // Source rectangle
        0, 0, actualWidth, actualHeight // Destination rectangle
      );

      // Convert canvas to data URL and update image
      const croppedDataUrl = canvas.toDataURL('image/png', 1.0);
      setImagePreview(croppedDataUrl);

      // Reset crop settings after applying
      setCropSettings({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        aspectRatio: null,
        isActive: false
      });
    };

    img.src = imagePreview;
  }, [imageRef, setImagePreview]);

  // Toggle crop mode
  const toggleCropMode = useCallback(() => {
    setCropSettings(prev => ({
      ...prev,
      isActive: !prev.isActive
    }));
  }, []);

  // Cancel crop
  const cancelCrop = useCallback(() => {
    setCropSettings(prev => ({
      ...prev,
      isActive: false
    }));
  }, []);

  // Update crop position
  const updateCropPosition = useCallback((x, y) => {
    setCropSettings(prev => ({
      ...prev,
      x: Math.max(0, Math.min(100 - prev.width, x)),
      y: Math.max(0, Math.min(100 - prev.height, y))
    }));
  }, []);

  // Update crop dimensions
  const updateCropDimensions = useCallback((width, height) => {
    setCropSettings(prev => ({
      ...prev,
      width: Math.max(1, Math.min(100, width)),
      height: Math.max(1, Math.min(100, height)),
      // Adjust position if crop goes outside bounds
      x: Math.max(0, Math.min(100 - width, prev.x)),
      y: Math.max(0, Math.min(100 - height, prev.y))
    }));
  }, []);

  // Reset crop to full image
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
    // State
    cropSettings,
    setCropSettings,
    
    // Actions
    performCrop,
    setCropWithAspectRatio,
    toggleCropMode,
    cancelCrop,
    updateCropPosition,
    updateCropDimensions,
    resetCrop,
    
    // Utilities
    calculateAspectRatioDimensions
  };
};

// Usage example in your main component:
/*
const ImageEditor = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const imageRef = useRef(null);
  
  // Use the crop hook
  const {
    cropSettings,
    setCropSettings,
    performCrop,
    setCropWithAspectRatio,
    toggleCropMode,
    cancelCrop,
    updateCropPosition,
    updateCropDimensions,
    resetCrop
  } = useCrop(imageRef, setImagePreview);

  // Pass these to your components as needed
  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex-1">
        <ImageCanvas
          imagePreview={imagePreview}
          imageRef={imageRef}
          cropSettings={cropSettings}
          // ... other props
        />
      </div>
      
      <div className="w-80 border-l border-gray-700">
        <AdjustToolPanel
          performCrop={() => performCrop(cropSettings, imagePreview)}
          setCropWithAspectRatio={setCropWithAspectRatio}
          toggleCropMode={toggleCropMode}
          cancelCrop={cancelCrop}
          updateCropPosition={updateCropPosition}
          updateCropDimensions={updateCropDimensions}
          resetCrop={resetCrop}
          cropSettings={cropSettings}
          setCropSettings={setCropSettings}
          // ... other props
        />
      </div>
    </div>
  );
};
*/