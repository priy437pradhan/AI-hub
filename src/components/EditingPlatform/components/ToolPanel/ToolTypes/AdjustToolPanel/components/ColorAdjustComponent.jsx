// ColorAdjustComponent.jsx
import React from 'react';
import { useMobileSliders } from "../../../constants/MobileSlider";
import { useDesktopSliders } from "../../../constants/DesktopSliders";
import { MobileSliderContainer } from "../../../components/MobileSlider";
import { DesktopSliderContainer } from "../../../components/DesktopSlider";

const ColorAdjustComponent = ({
  colorAdjust,
  setColorAdjust,
  isMobile = false,
  expandedSliders,
  onToggleSlider
}) => {
  const { colorAdjustSliders } = useDesktopSliders();
  const { colorAdjustSliders: mobileColorSliders } = useMobileSliders();

  const handleColorAdjustChange = (property, value) => {
    setColorAdjust((prev) => ({ ...prev, [property]: parseInt(value) }));
  };

  const resetColorAdjust = () => {
    setColorAdjust({
      temperature: 0,
      tint: 0,
      invertcolors: 0,
    });
  };

  if (isMobile) {
    return (
      <MobileSliderContainer
        sliders={mobileColorSliders}
        values={colorAdjust}
        handleChange={handleColorAdjustChange}
        resetFunction={resetColorAdjust}
        expandedSliders={expandedSliders}
        onToggleSlider={onToggleSlider}
      />
    );
  }

  return (
    <DesktopSliderContainer
      sliders={colorAdjustSliders}
      values={colorAdjust}
      handleChange={handleColorAdjustChange}
      resetFunction={resetColorAdjust}
    />
  );
};

// Export the filter function for use in main filter application
export const applyColorFilters = (data, colorAdjust) => {
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Apply temperature
    if (colorAdjust.temperature !== 0) {
      const tempFactor = colorAdjust.temperature / 100;
      if (tempFactor > 0) {
        r = Math.min(255, r + tempFactor * 50);
        b = Math.max(0, b - tempFactor * 50);
      } else {
        r = Math.max(0, r + tempFactor * 50);
        b = Math.min(255, b - tempFactor * 50);
      }
    }

    // Apply invertcolors
    if (colorAdjust.invertcolors !== 0) {
      const invertFactor = colorAdjust.invertcolors / 100;
      if (invertFactor > 0) {
        r = Math.min(255, r + invertFactor * 50);
        b = Math.max(0, b - invertFactor * 50);
      } else {
        r = Math.max(0, r + invertFactor * 50);
        b = Math.min(255, b - invertFactor * 50);
      }
    }

    // Apply tint
    if (colorAdjust.tint !== 0) {
      const tintFactor = colorAdjust.tint / 100;
      if (tintFactor > 0) {
        r = Math.min(255, r + tintFactor * 30);
        b = Math.min(255, b + tintFactor * 30);
      } else {
        g = Math.min(255, g - tintFactor * 30);
      }
    }

    // Update pixel data
    data[i] = Math.round(r);
    data[i + 1] = Math.round(g);
    data[i + 2] = Math.round(b);
  }
};

export default ColorAdjustComponent;