// CropComponent.js - FIXED VERSION
import React, { useState } from 'react';
import { useAppDispatch, useCropState } from '../../../../../../../../src/app/store/hooks/redux';
import { setAspectRatio, setCropActive } from '../../../../../../../../src/app/store/slices/cropSlice';

export const aspectRatios = [
  { id: "freeform", label: "Freeform", icon: "⊞", dimensions: null },
  { id: "original", label: "Original", icon: "▣", dimensions: null },
  { id: "circle", label: "Circle", icon: "○", dimensions: null },
  { id: "triangle", label: "Triangle", icon: "△", dimensions: null },
  { id: "star", label: "Star", icon: "★", dimensions: null },

  // Standard Aspect Ratios
  { id: "1x1", label: "1:1", icon: "□", dimensions: { width: 1, height: 1 } },
  { id: "4x5", label: "4:5", icon: "▯", dimensions: { width: 4, height: 5 } },
  { id: "5x4", label: "5:4", icon: "▭", dimensions: { width: 5, height: 4 } },
  { id: "3x4", label: "3:4", icon: "▯", dimensions: { width: 3, height: 4 } },
  { id: "4x3", label: "4:3", icon: "▭", dimensions: { width: 4, height: 3 } },
  { id: "2x3", label: "2:3", icon: "▯", dimensions: { width: 2, height: 3 } },
  { id: "3x2", label: "3:2", icon: "▭", dimensions: { width: 3, height: 2 } },
  { id: "9x16", label: "9:16", icon: "▯", dimensions: { width: 9, height: 16 } },
  { id: "16x9", label: "16:9", icon: "▭", dimensions: { width: 16, height: 9 } },

  // Social Media Specific
  { id: "whatsapp-dp", label: "WhatsApp DP", title: "social", icon: "", dimensions: { width: 1, height: 1 } },
  { id: "fb-dp", label: "Facebook DP", title: "social", icon: "", dimensions: { width: 1, height: 1 } },
  { id: "fb-cover", label: "FB Cover", title: "social", icon: "", dimensions: { width: 820, height: 312 } },
  { id: "fb-post", label: "FB Post", title: "social", icon: "", dimensions: { width: 4, height: 5 } },
  { id: "yt-thumbnail", label: "YouTube Thumbnail", title: "social", icon: "", dimensions: { width: 16, height: 9 } },
];

import useMobileGridButton from '../../../hooks/useMobileGridButton';

const CropComponent = ({
  setCropWithAspectRatio,
  performCrop,
  cancelCrop,
  imagePreview,
  imageRef,
  isMobile = false
}) => {
  const dispatch = useAppDispatch();
  const { aspectRatio, cropSettings } = useCropState();
  const [keepAspectRatio, setKeepAspectRatio] = useState(false);
  const { gridConfig, getButtonStateClass, ScrollbarStyles } = useMobileGridButton(isMobile);

  const handleAspectRatioChange = (ratioId) => {
    console.log('Aspect ratio changed to:', ratioId);
    
    // Update Redux state
    const selectedRatio = aspectRatios.find(ratio => ratio.id === ratioId);
    dispatch(setAspectRatio(selectedRatio));
    
    // Enable crop mode
    dispatch(setCropActive(true));
    
    // Call the hook function if available
    if (setCropWithAspectRatio) {
      setCropWithAspectRatio(ratioId, aspectRatios, (newSettings) => {
        console.log("Crop settings updated:", newSettings);
      });
    }
  };

  const handleCropApply = async () => {
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
    
    if (!cropSettings || !cropSettings.isActive) {
      console.error("No active crop area selected");
      alert("Please select a crop area first");
      return;
    }
    
    const imageSource = imagePreview || imageRef?.current?.src;
    
    if (!imageSource) {
      console.error("No image available for cropping");
      alert("No image available for cropping");
      return;
    }
    
    try {
      console.log('Performing crop with settings:', cropSettings);
      await performCrop(cropSettings, imageSource);
      console.log('Crop applied successfully');
    } catch (error) {
      console.error("Error applying crop:", error);
      alert("Failed to apply crop: " + error.message);
    }
  };

  const handleCancelCrop = () => {
    console.log('Canceling crop');
    dispatch(setCropActive(false));
    if (cancelCrop) {
      cancelCrop();
    }
  };

  const AspectRatioGrid = () => {
    const currentAspectRatioId = aspectRatio?.id || null;
    
    return (
      <div className={gridConfig.containerClass} style={gridConfig.containerStyle}>
        {aspectRatios.map((ratio) => (
          <button
            key={ratio.id}
            onClick={() => handleAspectRatioChange(ratio.id)}
            className={`
              ${gridConfig.buttonClass} 
              ${getButtonStateClass(currentAspectRatioId === ratio.id)} 
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
    <div className="space-y-4">
      <AspectRatioGrid />
     
     

      {/* Mobile Simple Buttons */}
      {isMobile ? (
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleCropApply}
            disabled={!cropSettings?.isActive}
            className={`p-3 transition-colors touch-manipulation ${
              cropSettings?.isActive 
                ? 'text-green-500 hover:text-green-400' 
                : 'text-gray-500 cursor-not-allowed'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Apply crop">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
          </button>
          <button
            onClick={handleCancelCrop}
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
            disabled={!cropSettings?.isActive}
            className={`flex-1 py-3 rounded-lg font-medium text-white transition-colors touch-manipulation ${
              cropSettings?.isActive
                ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            Apply Crop
          </button>
          <button
            onClick={handleCancelCrop}
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