import React from 'react';
import { Zap } from 'lucide-react';
import { useMobileSliders } from "../../../hooks/useMobileSlider";
import { useDesktopSliders } from "../../../hooks/useDesktopSliders";
import { MobileSliderContainer } from "../../../components/MobileSlider";
import { DesktopSliderContainer } from "../../../components/DesktopSlider";

const BasicAdjustComponent = ({
  basicAdjust,
  setBasicAdjust,
  isMobile = false,
  expandedSliders,
  onToggleSlider
}) => {
  const { basicAdjustSliders } = useDesktopSliders();
  const { basicAdjustSliders: mobileBasicSliders } = useMobileSliders();

  const handleBasicAdjustChange = (property, value) => {
    setBasicAdjust((prev) => ({ ...prev, [property]: parseInt(value) }));
  };

  const resetBasicAdjust = () => {
    setBasicAdjust({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpness: 0,
      // exposure: 0,
      // highlights: 0,
      // shadows: 0,
      // whites: 0,
      // blacks: 0,
      // vibrance: 0,
      // clarity: 0,
      // dehaze: 0,
    });
  };

  const handleOneTagEnhance = () => {
    setBasicAdjust({
      brightness: 10,
      contrast: 15,
      saturation: 20,
      sharpness: 10,
      // exposure: 5,
      // highlights: -10,
      // shadows: 15,
      // whites: 5,
      // blacks: -5,
      // vibrance: 25,
      // clarity: 15,
      // dehaze: 10,
    });
  };

  const enhanceButton = (
    <button
      onClick={handleOneTagEnhance}
      className={`flex items-center space-x-2 px-${isMobile ? '3' : '4'} py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all ${isMobile ? 'whitespace-nowrap flex-shrink-0' : ''}`}
    >
      <Zap size={isMobile ? 14 : 16} />
      <span className={isMobile ? 'text-xs' : ''}>{isMobile ? '1-Tap' : '1-Tap Enhance'}</span>
    </button>
  );

  if (isMobile) {
    return (
      <MobileSliderContainer
        sliders={mobileBasicSliders}
        values={basicAdjust}
        handleChange={handleBasicAdjustChange}
        resetFunction={resetBasicAdjust}
        enhanceButton={enhanceButton}
        expandedSliders={expandedSliders}
        onToggleSlider={onToggleSlider}
      />
    );
  }

  return (
    <DesktopSliderContainer
      sliders={basicAdjustSliders}
      values={basicAdjust}
      handleChange={handleBasicAdjustChange}
      resetFunction={resetBasicAdjust}
      enhanceButton={enhanceButton}
    />
  );
};

export default BasicAdjustComponent;