import React from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import useMobileGridButton from '../../../hooks/useMobileGridButton';

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
      icon: <RotateCcw size={24} />,
      action: () => handleRotate('left')
    },
    {
      id: 'right',
      label: 'Rotate Right',
      icon: <RotateCw size={24} />,
      action: () => handleRotate('right')
    }
  ];

  const RotateGrid = () => {
    return (
      <div className={gridConfig.containerClass} style={gridConfig.containerStyle}>
        {rotateOptions.map((option) => (
          <button
            key={option.id}
            onClick={option.action}
            className={`
              ${gridConfig.buttonClass} 
              ${getButtonStateClass(false)} 
              col-span-1
              ${isMobile ? 'border-0' : ''}
            `}
          >
            <span className={`${isMobile ? 'text-sm' : 'text-lg'} mb-1`}>{option.icon}</span>
            <span className="text-xs font-medium">{option.label}</span>
          </button>
        ))}
        <ScrollbarStyles />
      </div>
    );
  };

  return (
  <div className="flex items-center justify-center h-16 md:h-auto">

  <RotateGrid />
</div>

  );
};

export default RotateComponent;