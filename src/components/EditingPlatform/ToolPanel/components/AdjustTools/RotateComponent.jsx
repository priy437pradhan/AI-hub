import React from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';

const RotateComponent = ({ performRotate }) => {
  const handleRotate = (direction) => {
    if (performRotate) {
      performRotate(direction);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => handleRotate("left")}
        className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-all"
      >
        <RotateCcw size={24} className="text-gray-200 mb-2" />
        <span className="text-sm text-gray-300 font-medium">Rotate Left</span>
      </button>
      
      <button
        onClick={() => handleRotate("right")}
        className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-all"
      >
        <RotateCw size={24} className="text-gray-200 mb-2" />
        <span className="text-sm text-gray-300 font-medium">Rotate Right</span>
      </button>
    </div>
  );
};

export default RotateComponent;