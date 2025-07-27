import React from 'react';
import { Zap } from 'lucide-react';
import { useMobileSliders } from "../../../constants/MobileSlider";
import { useDesktopSliders } from "../../../constants/DesktopSliders";
import { MobileSliderContainer } from "../../../components/MobileSlider";
import { DesktopSliderContainer } from "../../../components/DesktopSlider";

const DenoiseComponent = ({
  denoiseAdjust,
  setDenoiseAdjust,
  isMobile = false,
  expandedSliders,
  onToggleSlider
}) => {
  const { denoiseAdjustSliders } = useDesktopSliders();
  const { denoiseAdjustSliders: mobileDenoiseAdjustSliders } = useMobileSliders();

  const handleDenoiseAdjustChange = (property, value) => {
    setDenoiseAdjust((prev) => ({ ...prev, [property]: parseInt(value) }));
  };

  const resetDenoiseAdjust = () => {
    setDenoiseAdjust({
      colornoise: 0,
      luminancenoise: 0, 
    });
  };

  if (isMobile) {
    return (
      <MobileSliderContainer
        sliders={mobileDenoiseAdjustSliders}
        values={denoiseAdjust}
        handleChange={handleDenoiseAdjustChange}
        resetFunction={resetDenoiseAdjust}
        expandedSliders={expandedSliders}
        onToggleSlider={onToggleSlider}
      />
    );
  }

  return (
    <DesktopSliderContainer
      sliders={denoiseAdjustSliders}
      values={denoiseAdjust}
      handleChange={handleDenoiseAdjustChange}
      resetFunction={resetDenoiseAdjust}
    />
  );
};

export default DenoiseComponent;