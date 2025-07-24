import React from 'react';
import { Maximize2, Minimize2, Square, Monitor } from 'lucide-react';
import useMobileGridButton from '../../../hooks/useMobileGridButton';

const ResizeComponent = ({ performResize, imageRef, isMobile = false }) => {
  const { gridConfig, getButtonStateClass, ScrollbarStyles } = useMobileGridButton(isMobile);

  const handleResize = (type) => {
    if (performResize) {
      performResize(type);
    }
  };

  const resizeOptions = [
    {
      id: 'enlarge',
      label: 'Enlarge',
      icon: <Maximize2 size={24} />,
      action: () => handleResize('enlarge')
    },
    {
      id: 'shrink',
      label: 'Shrink', 
      icon: <Minimize2 size={24} />,
      action: () => handleResize('shrink')
    },
    {
      id: 'fitToScreen',
      label: 'Fit to Screen',
      icon: <Monitor size={24} />,
      action: () => handleResize('fitToScreen')
    },
    {
      id: 'original',
      label: 'Original Size',
      icon: <Square size={24} />,
      action: () => handleResize('original')
    }
  ];

  const ResizeGrid = () => {
    return (
      <div className={gridConfig.containerClass} style={gridConfig.containerStyle}>
        {resizeOptions.map((option) => (
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
      <ResizeGrid />
    </div>
  );
};

export default ResizeComponent;