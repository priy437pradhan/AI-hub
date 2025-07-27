import React from 'react';
import { Grid, Square, Triangle } from 'lucide-react';
import { useMobileSliders } from "../../../constants/MobileSlider";
import { useDesktopSliders } from "../../../constants/DesktopSliders";
import { MobileSliderContainer } from "../../../components/MobileSlider";
import { DesktopSliderContainer } from "../../../components/DesktopSlider";

const MosaicComponent = ({
  mosaicAdjust,
  setMosaicAdjust,
  isMobile = false,
  expandedSliders,
  onToggleSlider
}) => {
  // Define sliders with proper JSX icons instead of using hooks
  const mosaicAdjustSliders = [
    { 
      key: 'type', 
      label: 'Type', 
      icon: <Grid size={16} />, 
      color: 'purple', 
      type: 'select',
      options: [
        { value: 'square', label: 'Square' },
        { value: 'triangular', label: 'Triangular' },
        { value: 'hexagonal', label: 'Hexagonal' }
      ],
      defaultValue: 'square'
    },
    { key: 'size', label: 'Size', icon: <Square size={16} />, color: 'purple', min: 1, max: 50, defaultValue: 10 },
    { key: 'pixelSize', label: 'Pixel Size', icon: <Triangle size={16} />, color: 'purple', min: 1, max: 10, defaultValue: 1 },
  ];

  const mobileMosaicAdjustSliders = mosaicAdjustSliders; // Use the same for mobile

  const handleMosaicAdjustChange = (property, value) => {
    if (property === 'type') {
      setMosaicAdjust((prev) => ({ ...prev, [property]: value }));
    } else {
      setMosaicAdjust((prev) => ({ ...prev, [property]: parseInt(value) }));
    }
  };

  const resetMosaicAdjust = () => {
    setMosaicAdjust({
      type: 'square', 
      size: 0, 
      pixelSize: 1,
    });
  };

  if (isMobile) {
    return (
      <MobileSliderContainer
        sliders={mobileMosaicAdjustSliders}
        values={mosaicAdjust}
        handleChange={handleMosaicAdjustChange}
        resetFunction={resetMosaicAdjust}
        expandedSliders={expandedSliders}
        onToggleSlider={onToggleSlider}
      />
    );
  }

  return (
    <DesktopSliderContainer
      sliders={mosaicAdjustSliders}
      values={mosaicAdjust}
      handleChange={handleMosaicAdjustChange}
      resetFunction={resetMosaicAdjust}
    />
  );
};

export default MosaicComponent;