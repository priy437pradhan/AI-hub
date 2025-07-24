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
      label: 'Flip Horizontal',
      icon: <FlipHorizontal size={24} />,
      action: () => handleFlip('horizontal')
    },
    {
      id: 'vertical', 
      label: 'Flip Vertical',
      icon: <FlipVertical size={24} />,
      action: () => handleFlip('vertical')
    }
  ];

  const FlipGrid = () => {
    return (
      <div className={gridConfig.containerClass} style={gridConfig.containerStyle}>
        {flipOptions.map((option) => (
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
    <div className="flex items-center justify-center h-14">
      <FlipGrid />
    </div>
  );
};

export default FlipComponent;