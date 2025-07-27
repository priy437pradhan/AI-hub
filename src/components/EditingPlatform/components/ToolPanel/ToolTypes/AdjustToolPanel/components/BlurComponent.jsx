import React, { useState } from 'react';
import { Blur, Circle, Minus } from 'lucide-react';
import { useMobileSliders } from "../../../constants/MobileSlider";
import { useDesktopSliders } from "../../../constants/DesktopSliders";
import { MobileSliderContainer } from "../../../components/MobileSlider";
import { DesktopSliderContainer } from "../../../components/DesktopSlider";

const BlurComponent = ({
  blurAdjust,
  setBlurAdjust,
  isMobile = false,
  expandedSliders,
  onToggleSlider,
  onApplyBlur // Callback for apply button
}) => {
  const { blurAdjustSliders } = useDesktopSliders();
  const { blurAdjustSliders: mobileBlurAdjustSliders } = useMobileSliders();

  const handleBlurAdjustChange = (property, value) => {
    // Update blur with preview enabled but not applied
    setBlurAdjust((prev) => ({ 
      ...prev, 
      [property]: parseInt(value),
      preview: true,
      applied: false 
    }));
  };

  const handleBlurTypeChange = (type) => {
    setBlurAdjust((prev) => ({ 
      ...prev, 
      type,
      preview: prev.intensity > 0,
      applied: false 
    }));
  };

  const resetBlurAdjust = () => {
    setBlurAdjust({
      type: 'circular', // 'circular' or 'linear'
      intensity: 0,
      preview: false,
      applied: false
    });
  };

  const handleApplyBlur = () => {
    console.log('Applying blur:', blurAdjust);
    setBlurAdjust((prev) => ({ 
      ...prev, 
      applied: true,
      preview: false 
    }));
    if (onApplyBlur) {
      onApplyBlur();
    }
  };

  // Blur type selection component
  const BlurTypeSelector = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Blur Type</label>
      <div className="flex gap-2">
        <button
          onClick={() => handleBlurTypeChange('circular')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            blurAdjust.type === 'circular'
              ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
              : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
          }`}
        >
          <Circle size={16} />
          Circular
        </button>
        <button
          onClick={() => handleBlurTypeChange('linear')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            blurAdjust.type === 'linear'
              ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
              : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
          }`}
        >
          <Minus size={16} />
          Linear
        </button>
      </div>
    </div>
  );

  // Apply button component
  const ApplyButton = () => (
    <div className="mt-4">
      <button
        onClick={handleApplyBlur}
        disabled={blurAdjust.intensity === 0 || blurAdjust.applied}
        className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          blurAdjust.intensity === 0 || blurAdjust.applied
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
        }`}
      >
        {blurAdjust.applied ? 'Blur Applied' : 'Apply Blur'}
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <div>
        <BlurTypeSelector />
        <MobileSliderContainer
          sliders={mobileBlurAdjustSliders}
          values={blurAdjust}
          handleChange={handleBlurAdjustChange}
          resetFunction={resetBlurAdjust}
          expandedSliders={expandedSliders}
          onToggleSlider={onToggleSlider}
        />
        <ApplyButton />
      </div>
    );
  }

  return (
    <div>
      <BlurTypeSelector />
      <DesktopSliderContainer
        sliders={blurAdjustSliders}
        values={blurAdjust}
        handleChange={handleBlurAdjustChange}
        resetFunction={resetBlurAdjust}
      />
      <ApplyButton />
    </div>
  );
};

export default BlurComponent;
