import React from 'react';
import { useMobileSliders } from "../../../hooks/useMobileSlider";
import { useDesktopSliders } from "../../../hooks/useDesktopSliders";
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

export default ColorAdjustComponent;