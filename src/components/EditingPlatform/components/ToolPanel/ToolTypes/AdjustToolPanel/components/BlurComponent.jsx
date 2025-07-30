import React, { useState } from 'react';
import { Blur, Circle, Minus } from 'lucide-react';
import { useMobileSliders } from "../../../constants/MobileSlider";
import { useDesktopSliders } from "../../../constants/DesktopSliders";
import { MobileSliderContainer } from "../../../components/MobileSlider";
import { DesktopSliderContainer } from "../../../components/DesktopSlider";

// Blur filter functions integrated into component
const applyBlurFilter = (canvas, ctx, blurAdjust) => {
  const { type, intensity } = blurAdjust;
  
  if (intensity === 0) return;
  
  console.log('Applying blur filter:', blurAdjust);
  
  // Create a temporary canvas for blur processing
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  
  // Copy current canvas to temp canvas
  tempCtx.drawImage(canvas, 0, 0);
  
  if (type === 'circular') {
    applyCircularBlur(canvas, ctx, tempCanvas, intensity);
  } else if (type === 'linear') {
    applyLinearBlur(canvas, ctx, tempCanvas, intensity);
  }
};

// Circular blur implementation (radial blur from center)
const applyCircularBlur = (canvas, ctx, sourceCanvas, intensity) => {
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
  
  const imageData = ctx.getImageData(0, 0, width, height);
  const sourceImageData = sourceCanvas.getContext('2d').getImageData(0, 0, width, height);
  const data = imageData.data;
  const sourceData = sourceImageData.data;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Calculate distance from center
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const normalizedDistance = distance / maxDistance;
      
      // Calculate blur amount based on distance from center
      const blurAmount = Math.floor(normalizedDistance * intensity / 10);
      
      if (blurAmount > 0) {
        const blurred = getAverageColor(sourceData, x, y, width, height, blurAmount);
        data[idx] = blurred.r;
        data[idx + 1] = blurred.g;
        data[idx + 2] = blurred.b;
        // Alpha remains unchanged
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// Linear blur implementation (motion blur effect)
const applyLinearBlur = (canvas, ctx, sourceCanvas, intensity) => {
  const width = canvas.width;
  const height = canvas.height;
  
  const imageData = ctx.getImageData(0, 0, width, height);
  const sourceImageData = sourceCanvas.getContext('2d').getImageData(0, 0, width, height);
  const data = imageData.data;
  const sourceData = sourceImageData.data;
  
  const blurDistance = Math.floor(intensity / 5);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Apply horizontal blur
      let r = 0, g = 0, b = 0, count = 0;
      
      for (let i = -blurDistance; i <= blurDistance; i++) {
        const sampleX = Math.max(0, Math.min(width - 1, x + i));
        const sampleIdx = (y * width + sampleX) * 4;
        
        r += sourceData[sampleIdx];
        g += sourceData[sampleIdx + 1];
        b += sourceData[sampleIdx + 2];
        count++;
      }
      
      data[idx] = Math.floor(r / count);
      data[idx + 1] = Math.floor(g / count);
      data[idx + 2] = Math.floor(b / count);
      // Alpha remains unchanged
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// Helper function to get average color in a radius
const getAverageColor = (data, centerX, centerY, width, height, radius) => {
  let r = 0, g = 0, b = 0, count = 0;
  
  for (let y = Math.max(0, centerY - radius); y <= Math.min(height - 1, centerY + radius); y++) {
    for (let x = Math.max(0, centerX - radius); x <= Math.min(width - 1, centerX + radius); x++) {
      const idx = (y * width + x) * 4;
      r += data[idx];
      g += data[idx + 1];
      b += data[idx + 2];
      count++;
    }
  }
  
  return {
    r: Math.floor(r / count),
    g: Math.floor(g / count),
    b: Math.floor(b / count)
  };
};

const hasBlurAdjustments = (blurAdjust) => {
  return blurAdjust && blurAdjust.intensity > 0 && (blurAdjust.preview || blurAdjust.applied);
};

const BlurComponent = ({
  blurAdjust,
  setBlurAdjust,
  isMobile = false,
  expandedSliders,
  onToggleSlider,
  onApplyBlur 
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
      type: 'circular', 
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


export { applyBlurFilter, hasBlurAdjustments };
export default BlurComponent;