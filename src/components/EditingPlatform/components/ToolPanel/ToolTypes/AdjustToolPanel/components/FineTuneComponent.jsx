import React from 'react';
import { useMobileSliders } from "../../../hooks/useMobileSlider";
import { useDesktopSliders } from "../../../hooks/useDesktopSliders";
import { MobileSliderContainer } from "../../../components/MobileSlider";
import { DesktopSliderContainer } from "../../../components/DesktopSlider";

const FineTuneComponent = ({
  finetune,
  setFinetune,
  isMobile = false,
  expandedSliders,
  onToggleSlider
}) => {
  const { fineTuneSliders } = useDesktopSliders();
  const { finetuneSliders: mobileFinetuneSliders } = useMobileSliders();

  const handleFinetuneChange = (property, value) => {
    setFinetune((prev) => ({ ...prev, [property]: parseInt(value) }));
  };

  const resetFinetune = () => {
    setFinetune({
      exposure: 0,
      highlights: 0,
      shadows: 0,
    });
  };

  if (isMobile) {
    return (
      <MobileSliderContainer
        sliders={mobileFinetuneSliders}
        values={finetune} 
        handleChange={handleFinetuneChange}
        resetFunction={resetFinetune}
        expandedSliders={expandedSliders}
        onToggleSlider={onToggleSlider}
      />
    );
  }

  return (
    <DesktopSliderContainer
      sliders={fineTuneSliders}
      values={finetune}
      handleChange={handleFinetuneChange}
      resetFunction={resetFinetune}
    />
  );
};

export default FineTuneComponent;