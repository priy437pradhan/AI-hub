import React from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import useMobileGridButton from '../../../hooks/useMobileGridButton'
const RotateComponent = ({ performRotate, isMobile = false }) => {
  const { gridConfig, getButtonStateClass, ScrollbarStyles } = useMobileGridButton(isMobile);

  const handleRotate = (direction) => {
    if (performRotate) {
      performRotate(direction);
    }
  };

  const rotateOptions = [
    {
      id: 'left',
      label: 'Rotate Left',
      icon: RotateCcw,
      action: () => handleRotate('left')
    },
    {
      id: 'right',
      label: 'Rotate Right',
      icon: RotateCw, 
      action: () => handleRotate('right')
    }
  ];

  return (
    <div className={gridConfig.containerClass} style={gridConfig.containerStyle}>
      {rotateOptions.map((option) => {
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

export default RotateComponent;