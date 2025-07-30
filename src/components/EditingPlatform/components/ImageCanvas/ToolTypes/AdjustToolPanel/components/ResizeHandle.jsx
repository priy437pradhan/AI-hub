import React from "react";

export const ResizeHandle = ({ position, onResize, cursor = "nwse-resize" }) => {
  // Define position classes explicitly so Tailwind can detect them
  const getPositionClasses = (pos) => {
    switch (pos) {
      case 'top-left':
        return '-left-2 -top-2';
      case 'top-center':
        return 'left-1/2 -translate-x-1/2 -top-2';
      case 'top-right':
        return '-right-2 -top-2';
      case 'middle-left':
        return '-left-2 top-1/2 -translate-y-1/2';
      case 'middle-right':
        return '-right-2 top-1/2 -translate-y-1/2';
      case 'bottom-left':
        return '-left-2 -bottom-2';
      case 'bottom-center':
        return 'left-1/2 -translate-x-1/2 -bottom-2';
      case 'bottom-right':
        return '-right-2 -bottom-2';
      default:
        return '-right-2 -bottom-2'; // default to bottom-right
    }
  };

  // Define cursor classes explicitly
  const getCursorClass = (cursorType) => {
    const cursorMap = {
      'nwse-resize': 'cursor-nw-resize',
      'nesw-resize': 'cursor-ne-resize', 
      'ns-resize': 'cursor-ns-resize',
      'ew-resize': 'cursor-ew-resize',
      'move': 'cursor-move'
    };
    return cursorMap[cursorType] || 'cursor-nw-resize';
  };

  const handleMouseDown = (e) => {
    // Extract the direction from position for the handler
    const directionMap = {
      'top-left': 'top-left',
      'top-center': 'top',
      'top-right': 'top-right', 
      'middle-left': 'left',
      'middle-right': 'right',
      'bottom-left': 'bottom-left',
      'bottom-center': 'bottom',
      'bottom-right': 'bottom-right'
    };
    
    const direction = directionMap[position] || position;
    onResize(e, direction);
  };

  return (
    <div
      className={`resize-handle absolute ${getPositionClasses(position)} w-4 h-4 bg-blue-500 border-2 border-white rounded-full ${getCursorClass(cursor)} touch-none z-30 hover:bg-blue-600 transition-colors`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{ 
        cursor: cursor 
      }}
    />
  );
};