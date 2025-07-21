import React from 'react';
import { useMobileSliders } from "../../hooks/AdjustTools/useMobileSlider";
import { useDesktopSliders } from "../../hooks/AdjustTools/useDesktopSliders";
import { MobileSliderContainer } from "../../components/AdjustTools/MobileSlider";
import { DesktopSliderContainer } from "../../components/AdjustTools/DesktopSlider";

const VignetteComponent = ({
  vignette,
  setVignette,
  isMobile = false,
  expandedSliders,
  onToggleSlider
}) => {
  const { vignetteSliders } = useDesktopSliders();
  const { vignetteSliders: mobileVignetteSliders } = useMobileSliders();

  const handleVignetteChange = (property, value) => {
    setVignette((prev) => ({ ...prev, [property]: parseInt(value) }));
  };

  const resetVignette = () => {
    setVignette({
      amount: 0,
      midpoint: 50,
      roundness: 0,
      feather: 50,
    });
  };

  if (isMobile) {
    return (
      <MobileSliderContainer
        sliders={mobileVignetteSliders}
        values={vignette}
        handleChange={handleVignetteChange}
        resetFunction={resetVignette}
        expandedSliders={expandedSliders}
        onToggleSlider={onToggleSlider}
      />
    );
  }

  return (
    <DesktopSliderContainer
      sliders={vignetteSliders}
      values={vignette}
      handleChange={handleVignetteChange}
      resetFunction={resetVignette}
    />
  );
};

export default VignetteComponent;