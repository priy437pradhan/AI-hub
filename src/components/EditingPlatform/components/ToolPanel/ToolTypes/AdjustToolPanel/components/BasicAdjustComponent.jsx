// BasicAdjustComponent.jsx
import React from 'react';
import { Zap } from 'lucide-react';
import { useMobileSliders } from "../../../constants/MobileSlider";
import { useDesktopSliders } from "../../../constants/DesktopSliders";
import { MobileSliderContainer } from "../../../components/MobileSlider";
import { DesktopSliderContainer } from "../../../components/DesktopSlider";

const BasicAdjustComponent = ({
  basicAdjust,
  setBasicAdjust,
  isMobile = false,
  expandedSliders,
  onToggleSlider
}) => {
  const { basicAdjustSliders } = useDesktopSliders();
  const { basicAdjustSliders: mobileBasicSliders } = useMobileSliders();

  const handleBasicAdjustChange = (property, value) => {
    setBasicAdjust((prev) => ({ ...prev, [property]: parseInt(value) }));
  };

  const resetBasicAdjust = () => {
    setBasicAdjust({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpness: 0,
    });
  };

  // Basic adjustment filter function
  const applyBasicFilters = (data, basicAdjust) => {
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Apply brightness
      if (basicAdjust.brightness !== 0) {
        const brightnessFactor = basicAdjust.brightness * 2.55; 
        r = Math.max(0, Math.min(255, r + brightnessFactor));
        g = Math.max(0, Math.min(255, g + brightnessFactor));
        b = Math.max(0, Math.min(255, b + brightnessFactor));
      }

      // Apply contrast
      if (basicAdjust.contrast !== 0) {
        const contrastFactor = (259 * (basicAdjust.contrast + 255)) / (255 * (259 - basicAdjust.contrast));
        r = Math.max(0, Math.min(255, contrastFactor * (r - 128) + 128));
        g = Math.max(0, Math.min(255, contrastFactor * (g - 128) + 128));
        b = Math.max(0, Math.min(255, contrastFactor * (b - 128) + 128));
      }

      // Apply saturation
      if (basicAdjust.saturation !== 0) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const saturationFactor = (basicAdjust.saturation + 100) / 100;
        r = Math.max(0, Math.min(255, gray + saturationFactor * (r - gray)));
        g = Math.max(0, Math.min(255, gray + saturationFactor * (g - gray)));
        b = Math.max(0, Math.min(255, gray + saturationFactor * (b - gray)));
      }

      // Apply sharpness
      if (basicAdjust.sharpness !== 0) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const sharpnessFactor = (basicAdjust.sharpness + 100) / 100;
        r = Math.max(0, Math.min(255, gray + sharpnessFactor * (r - gray)));
        g = Math.max(0, Math.min(255, gray + sharpnessFactor * (g - gray)));
        b = Math.max(0, Math.min(255, gray + sharpnessFactor * (b - gray)));
      }

      // Update pixel data
      data[i] = Math.round(r);
      data[i + 1] = Math.round(g);
      data[i + 2] = Math.round(b);
    }
  };

  if (isMobile) {
    return (
      <MobileSliderContainer
        sliders={mobileBasicSliders}
        values={basicAdjust}
        handleChange={handleBasicAdjustChange}
        resetFunction={resetBasicAdjust}
        expandedSliders={expandedSliders}
        onToggleSlider={onToggleSlider}
      />
    );
  }

  return (
    <DesktopSliderContainer
      sliders={basicAdjustSliders}
      values={basicAdjust}
      handleChange={handleBasicAdjustChange}
      resetFunction={resetBasicAdjust}
    />
  );
};

// Export the filter function for use in main filter application
export const applyBasicFilters = (data, basicAdjust) => {
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Apply brightness
    if (basicAdjust.brightness !== 0) {
      const brightnessFactor = basicAdjust.brightness * 2.55; 
      r = Math.max(0, Math.min(255, r + brightnessFactor));
      g = Math.max(0, Math.min(255, g + brightnessFactor));
      b = Math.max(0, Math.min(255, b + brightnessFactor));
    }

    // Apply contrast
    if (basicAdjust.contrast !== 0) {
      const contrastFactor = (259 * (basicAdjust.contrast + 255)) / (255 * (259 - basicAdjust.contrast));
      r = Math.max(0, Math.min(255, contrastFactor * (r - 128) + 128));
      g = Math.max(0, Math.min(255, contrastFactor * (g - 128) + 128));
      b = Math.max(0, Math.min(255, contrastFactor * (b - 128) + 128));
    }

    // Apply saturation
    if (basicAdjust.saturation !== 0) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const saturationFactor = (basicAdjust.saturation + 100) / 100;
      r = Math.max(0, Math.min(255, gray + saturationFactor * (r - gray)));
      g = Math.max(0, Math.min(255, gray + saturationFactor * (g - gray)));
      b = Math.max(0, Math.min(255, gray + saturationFactor * (b - gray)));
    }

    // Apply sharpness
    if (basicAdjust.sharpness !== 0) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const sharpnessFactor = (basicAdjust.sharpness + 100) / 100;
      r = Math.max(0, Math.min(255, gray + sharpnessFactor * (r - gray)));
      g = Math.max(0, Math.min(255, gray + sharpnessFactor * (g - gray)));
      b = Math.max(0, Math.min(255, gray + sharpnessFactor * (b - gray)));
    }

    // Update pixel data
    data[i] = Math.round(r);
    data[i + 1] = Math.round(g);
    data[i + 2] = Math.round(b);
  }
};

export default BasicAdjustComponent;