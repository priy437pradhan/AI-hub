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

export default fineTuneComponent;