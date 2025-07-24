import React from "react";

export const ResizeHandle = ({ position, onResize, cursor = "nwse-resize" }) => {
  // Define position classes explicitly so Tailwind can detect them
  const getPositionClasses = (pos) => {
    switch (pos) {
      case 'top-left':
        return '-left-2 -top-2';
      case 'top-right':
        return '-right-2 -top-2';
      case 'bottom-left':
        return '-left-2 -bottom-2';
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

  return (
    <div
      className={`resize-handle absolute ${getPositionClasses(position)} w-4 h-4 bg-blue-500 border-2 border-white rounded-full ${getCursorClass(cursor)} touch-none z-30`}
      onMouseDown={(e) => onResize(e, position)}
      onTouchStart={(e) => onResize(e, position)}
      style={{ 
      
        cursor: cursor 
      }}
    />
  );
};