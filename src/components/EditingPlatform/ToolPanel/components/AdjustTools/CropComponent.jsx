import React, { useState } from 'react';
import { aspectRatios } from '../../constants/AdjustTools/aspectRatios';

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
    const hasSocialItems = aspectRatios.some(ratio => ratio.title === "social");
    const gridCols = hasSocialItems ? "grid-cols-2" : "grid-cols-2";
    const gapSize = hasSocialItems ? "gap-2" : "gap-3";

    if (isMobile) {
      return (
        <div
          className="flex space-x-2 overflow-x-auto mb-4 flex-shrink-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {aspectRatios.map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => handleAspectRatioChange(ratio.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 min-w-[60px]
                ${
                  aspectRatio === ratio.id
                    ? "bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400"
                    : "border border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300"
                }
              `}
            >
              <span className="text-sm mb-1">{ratio.icon}</span>
              <span className="text-xs font-medium">{ratio.label}</span>
            </button>
          ))}
          <style jsx>
            {`
              div::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
        </div>
      );
    }

    return (
      <div className={`grid ${gridCols} ${gapSize} mb-4`}>
        {aspectRatios.map((ratio) => (
          <button
            key={ratio.id}
            onClick={() => handleAspectRatioChange(ratio.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 
              ${
                aspectRatio === ratio.id
                  ? "bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400"
                  : "border border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300"
              }
              ${ratio.title === "social" ? "col-span-2" : "col-span-1"}
            `}
          >
            <span className="text-lg mb-1">{ratio.icon}</span>
            <span className="text-xs font-medium">{ratio.label}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <AspectRatioGrid />
      
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          id="keepAspect"
          checked={keepAspectRatio}
          onChange={() => setKeepAspectRatio(!keepAspectRatio)}
          className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="keepAspect" className="text-sm text-gray-300">
          Lock aspect ratio
        </label>
      </div>
      
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
    </div>
  );
};

export default CropComponent;