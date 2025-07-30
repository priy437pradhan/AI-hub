// StructureComponent.jsx
import React from 'react';
import { Zap } from 'lucide-react';
import { useMobileSliders } from "../../../constants/MobileSlider";
import { useDesktopSliders } from "../../../constants/DesktopSliders";
import { MobileSliderContainer } from "../../../components/MobileSlider";
import { DesktopSliderContainer } from "../../../components/DesktopSlider";

const StructureComponent = ({
  structureAdjust,
  setStructureAdjust,
  isMobile = false,
  expandedSliders,
  onToggleSlider
}) => {
  const { structureAdjustSliders } = useDesktopSliders();
  const { structureAdjustSliders: mobileStructureAdjustSliders } = useMobileSliders();

  const handleStructureAdjustChange = (property, value) => {
    setStructureAdjust((prev) => ({ ...prev, [property]: parseInt(value) }));
  };

  const resetStructureAdjust = () => {
    setStructureAdjust({
      details: 0,
      gradient: 0,
    });
  };

  if (isMobile) {
    return (
      <MobileSliderContainer
        sliders={mobileStructureAdjustSliders}
        values={structureAdjust}
        handleChange={handleStructureAdjustChange}
        resetFunction={resetStructureAdjust}
        expandedSliders={expandedSliders}
        onToggleSlider={onToggleSlider}
      />
    );
  }

  return (
    <DesktopSliderContainer
      sliders={structureAdjustSliders}
      values={structureAdjust}
      handleChange={handleStructureAdjustChange}
      resetFunction={resetStructureAdjust}
    />
  );
};

// Export the filter function for use in main filter application
export const applyStructureFilters = (data, structureAdjust, canvas) => {
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Apply details (enhances local contrast)
    if (structureAdjust.details !== 0) {
      const detailFactor = structureAdjust.details / 100;
      const pixelIntensity = (r + g + b) / 3;
      const enhancement = detailFactor * 20;
      
      r = Math.max(0, Math.min(255, r + (r - pixelIntensity) * enhancement / 100));
      g = Math.max(0, Math.min(255, g + (g - pixelIntensity) * enhancement / 100));
      b = Math.max(0, Math.min(255, b + (b - pixelIntensity) * enhancement / 100));
    }

    // Apply gradient (creates a subtle vignette effect)
    if (structureAdjust.gradient !== 0) {
      const x = (i / 4) % canvas.width;
      const y = Math.floor((i / 4) / canvas.width);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      const gradientFactor = 1 - (structureAdjust.gradient / 100) * (distance / maxDistance) * 0.5;
      
      r = Math.max(0, Math.min(255, r * gradientFactor));
      g = Math.max(0, Math.min(255, g * gradientFactor));
      b = Math.max(0, Math.min(255, b * gradientFactor));
    }

    // Update pixel data
    data[i] = Math.round(r);
    data[i + 1] = Math.round(g);
    data[i + 2] = Math.round(b);
  }
};

export default StructureComponent;