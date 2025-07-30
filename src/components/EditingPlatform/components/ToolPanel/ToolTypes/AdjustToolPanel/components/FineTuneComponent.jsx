
// FineTuneComponent.jsx
import React from 'react';
import { useMobileSliders } from "../../../constants/MobileSlider";
import { useDesktopSliders } from "../../../constants/DesktopSliders";
import { MobileSliderContainer } from "../../../components/MobileSlider";
import { DesktopSliderContainer } from "../../../components/DesktopSlider";

const fineTuneComponent = ({
  fineTune,
  setfineTune,
  isMobile = false,
  expandedSliders,
  onToggleSlider
}) => {
  const { fineTuneSliders } = useDesktopSliders();
  const { fineTuneSliders: mobilefineTuneSliders } = useMobileSliders();

  const handlefineTuneChange = (property, value) => {
    setfineTune((prev) => ({ ...prev, [property]: parseInt(value) }));
  };

  const resetfineTune = () => {
    setfineTune({
      exposure: 0,
      highlights: 0,
      shadows: 0,
    });
  };

  if (isMobile) {
    return (
      <MobileSliderContainer
        sliders={mobilefineTuneSliders}
        values={fineTune} 
        handleChange={handlefineTuneChange}
        resetFunction={resetfineTune}
        expandedSliders={expandedSliders}
        onToggleSlider={onToggleSlider}
      />
    );
  }

  return (
    <DesktopSliderContainer
      sliders={fineTuneSliders}
      values={fineTune}
      handleChange={handlefineTuneChange}
      resetFunction={resetfineTune}
    />
  );
};

// Export the filter function for use in main filter application
export const applyFineTuneFilters = (data, fineTuneAdjust) => {
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Calculate luminance for fine-tune adjustments
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    const normalizedLuminance = luminance / 255;

    // Apply exposure
    if (fineTuneAdjust.exposure !== 0) {
      const exposureFactor = Math.pow(2, fineTuneAdjust.exposure / 50);
      r = Math.max(0, Math.min(255, r * exposureFactor));
      g = Math.max(0, Math.min(255, g * exposureFactor));
      b = Math.max(0, Math.min(255, b * exposureFactor));
    }

    // Apply highlights
    if (fineTuneAdjust.highlights !== 0) {
      const highlightWeight = Math.max(0, (normalizedLuminance - 0.5) * 2);
      const highlightFactor = 1 + (fineTuneAdjust.highlights / 100) * highlightWeight;
      
      if (normalizedLuminance > 0.5) {
        r = Math.max(0, Math.min(255, r * highlightFactor));
        g = Math.max(0, Math.min(255, g * highlightFactor));
        b = Math.max(0, Math.min(255, b * highlightFactor));
      }
    }

    // Apply shadows
    if (fineTuneAdjust.shadows !== 0) {
      const shadowWeight = Math.max(0, (0.5 - normalizedLuminance) * 2);
      const shadowFactor = 1 + (fineTuneAdjust.shadows / 100) * shadowWeight;
      
      if (normalizedLuminance < 0.5) {
        r = Math.max(0, Math.min(255, r * shadowFactor));
        g = Math.max(0, Math.min(255, g * shadowFactor));
        b = Math.max(0, Math.min(255, b * shadowFactor));
      }
    }

    // Update pixel data
    data[i] = Math.round(r);
    data[i + 1] = Math.round(g);
    data[i + 2] = Math.round(b);
  }
};

export default fineTuneComponent;
