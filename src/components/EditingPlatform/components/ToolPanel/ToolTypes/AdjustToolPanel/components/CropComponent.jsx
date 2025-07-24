import React, { useState } from 'react';
import { aspectRatios } from '../constants/aspectRatios';
import useMobileGridButton from '../../../hooks/useMobileGridButton';

const CropComponent = ({
  aspectRatio,
  setAspectRatio,
  setCropWithAspectRatio,
  performCrop,
  cancelCrop,
  cropSettings,
  imagePreview,
  imageRef,
  isMobile = false
}) => {
  const [keepAspectRatio, setKeepAspectRatio] = useState(false);
  const { gridConfig, getButtonStateClass, ScrollbarStyles } = useMobileGridButton(isMobile);

  const handleAspectRatioChange = (ratioId) => {
    setAspectRatio(ratioId);
    if (setCropWithAspectRatio) {
      setCropWithAspectRatio(ratioId, aspectRatios, (newSettings) => {
        console.log("Crop settings updated:", newSettings);
      });
    }
  };

  const handleCropApply = () => {
    console.log("Apply crop clicked", {
      performCrop,
      cropSettings,
      imagePreview,
      imageRef: imageRef?.current
    });
    
    if (!performCrop) {
      console.error("performCrop function is not available");
      alert("Crop function not available");
      return;
    }
    
    if (!cropSettings) {
      console.error("cropSettings is not available");
      alert("No crop area selected");
      return;
    }
    
    const imageSource = imagePreview || imageRef?.current;
    
    if (!imageSource) {
      console.error("Neither imagePreview nor imageRef is available");
      alert("No image available for cropping");
      return;
    }
    
    try {
      performCrop(cropSettings, imageSource);
    } catch (error) {
      console.error("Error applying crop:", error);
      alert("Failed to apply crop");
    }
  };

  const AspectRatioGrid = () => {
    return (
      <div className={gridConfig.containerClass} style={gridConfig.containerStyle}>
        {aspectRatios.map((ratio) => (
          <button
            key={ratio.id}
            onClick={() => handleAspectRatioChange(ratio.id)}
            className={`
  ${gridConfig.buttonClass} 
  ${getButtonStateClass(aspectRatio === ratio.id)} 
  ${!isMobile && ratio.title === "social" ? "col-span-2" : "col-span-1"}
  ${isMobile ? 'border-0' : ''}
`}
          >
            <span className={`${isMobile ? 'text-sm' : 'text-lg'} mb-1`}>{ratio.icon}</span>
            <span className="text-xs font-medium">{ratio.label}</span>
          </button>
        ))}
        <ScrollbarStyles />
      </div>
    );
  };

  return (
    <div className="space-y-0">
      <AspectRatioGrid />
     
      {/* Mobile Simple Buttons */}
      {isMobile ? (
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleCropApply}
            className="p-3 text-green-500 hover:text-green-400 transition-colors touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Apply crop">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
          </button>
          <button
            onClick={cancelCrop}
            className="p-3 text-red-500 hover:text-red-400 transition-colors touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Cancel crop"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      ) : (
        /* Desktop Full Buttons */
        <div className="flex space-x-2">
          <button
            onClick={handleCropApply}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg font-medium text-white transition-colors touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            Apply Crop
          </button>
          <button
            onClick={cancelCrop}
            className="px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default CropComponent;