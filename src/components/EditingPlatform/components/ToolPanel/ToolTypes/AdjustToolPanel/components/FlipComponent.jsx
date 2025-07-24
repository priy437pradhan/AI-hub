import React from 'react';
import { FlipHorizontal, FlipVertical } from 'lucide-react';
 import useMobileGridButton from '../../../hooks/useMobileGridButton';

const FlipComponent = ({ performFlip, isMobile = false }) => {
  const { gridConfig, getButtonStateClass, ScrollbarStyles } = useMobileGridButton(isMobile);

  const handleFlip = (direction) => {
    if (performFlip) {
      performFlip(direction);
    }
  };

  const flipOptions = [
    {
      id: 'horizontal',
      label: 'Horizontal',
      icon: FlipHorizontal,
      action: () => handleFlip('horizontal')
    },
    {
      id: 'vertical', 
      label: 'Vertical',
      icon: FlipVertical,
      action: () => handleFlip('vertical')
    }
  ];

  return (
    <div className={gridConfig.containerClass} style={gridConfig.containerStyle}>
      {flipOptions.map((option) => {
        const IconComponent = option.icon;
        return (
          <button
            key={option.id}
            onClick={option.action}
            className={`${gridConfig.buttonClass} ${getButtonStateClass()}`}
          >
            <IconComponent size={gridConfig.iconSize} className="text-gray-200 mb-2" />
            <span className="text-sm text-gray-300 font-medium">{option.label}</span>
          </button>
        );
      })}
      <ScrollbarStyles />
    </div>
  );
};

export default FlipComponent;