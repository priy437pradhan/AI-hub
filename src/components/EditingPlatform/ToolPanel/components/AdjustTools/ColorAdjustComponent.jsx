import React from 'react';
import { useMobileSliders } from "../../hooks/AdjustTools/useMobileSlider";
import { useDesktopSliders } from "../../hooks/AdjustTools/useDesktopSliders";
import { MobileSliderContainer } from "../../components/AdjustTools/MobileSlider";
import { DesktopSliderContainer } from "../../components/AdjustTools/DesktopSlider";

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
      hue: 0,
      luminance: 0,
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

export default ColorAdjustComponent;