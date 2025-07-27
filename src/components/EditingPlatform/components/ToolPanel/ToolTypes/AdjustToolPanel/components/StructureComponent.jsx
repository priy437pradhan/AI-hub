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

export default StructureComponent;