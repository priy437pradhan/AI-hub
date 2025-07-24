import React from 'react';
import { Maximize2, Minimize2, Square, Monitor } from 'lucide-react';
import useMobileGridButton from '../../../hooks/useMobileGridButton'

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
      icon: Maximize2,
      action: () => handleResize('enlarge')
    },
    {
      id: 'shrink',
      label: 'Shrink', 
      icon: Minimize2,
      action: () => handleResize('shrink')
    },
    {
      id: 'fitToScreen',
      label: 'Fit to Screen',
      icon: Monitor,
      action: () => handleResize('fitToScreen')
    },
    {
      id: 'original',
      label: 'Original Size',
      icon: Square,
      action: () => handleResize('original')
    }
  ];

  // For mobile, use horizontal scrolling layout
  const containerClass = isMobile 
    ? gridConfig.containerClass 
    : "grid grid-cols-2 gap-3";

  return (
    <div className={containerClass} style={gridConfig.containerStyle}>
      {resizeOptions.map((option) => {
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

export default ResizeComponent;