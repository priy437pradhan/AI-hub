import React from 'react';
import { Focus } from 'lucide-react';
import { useMobileSliders } from "../../../constants/MobileSlider";
import { useDesktopSliders } from "../../../constants/DesktopSliders";
import { MobileSliderContainer } from "../../../components/MobileSlider";
import { DesktopSliderContainer } from "../../../components/DesktopSlider";

const VignetteComponent = ({
  vignetteAdjust,
  setVignetteAdjust,
  isMobile = false,
  expandedSliders,
  onToggleSlider
}) => {
  const { vignetteAdjustSliders } = useDesktopSliders();
  const { vignetteAdjustSliders: mobileVignetteAdjustSliders } = useMobileSliders();

  const handleVignetteAdjustChange = (property, value) => {
    setVignetteAdjust((prev) => ({ ...prev, [property]: parseInt(value) }));
  };

  const resetVignetteAdjust = () => {
    setVignetteAdjust({
      intensity: 0,
      size: 50, // Size of the vignette effect (0-100)
      feather: 50, // Softness of the vignette edge (0-100)
    });
  };

  if (isMobile) {
    return (
      <MobileSliderContainer
        sliders={mobileVignetteAdjustSliders}
        values={vignetteAdjust}
        handleChange={handleVignetteAdjustChange}
        resetFunction={resetVignetteAdjust}
        expandedSliders={expandedSliders}
        onToggleSlider={onToggleSlider}
      />
    );
  }

  return (
    <DesktopSliderContainer
      sliders={vignetteAdjustSliders}
      values={vignetteAdjust}
      handleChange={handleVignetteAdjustChange}
      resetFunction={resetVignetteAdjust}
    />
  );
};

export default VignetteComponent;