import React from 'react';
import { FlipHorizontal, FlipVertical } from 'lucide-react';

const FlipComponent = ({ performFlip }) => {
  const handleFlip = (direction) => {
    if (performFlip) {
      performFlip(direction);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => handleFlip("horizontal")}
        className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-all"
      >
        <FlipHorizontal size={24} className="text-gray-200 mb-2" />
        <span className="text-sm text-gray-300 font-medium">Horizontal</span>
      </button>
      
      <button
        onClick={() => handleFlip("vertical")}
        className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-all"
      >
        <FlipVertical size={24} className="text-gray-200 mb-2" />
        <span className="text-sm text-gray-300 font-medium">Vertical</span>
      </button>
    </div>
  );
};

export default FlipComponent;