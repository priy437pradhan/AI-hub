import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const BottomSheet = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
      <div 
        className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-lg z-50 max-h-[80vh] overflow-y-auto"
        style={{ height: 'auto', maxHeight: '80vh' }}
      >
        <div className="sticky top-0 bg-gray-800 p-2 flex justify-between items-center border-b border-gray-700">
          <div className="w-8"></div>
          <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto"></div>
          <button onClick={onClose} className="p-1">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="p-3 pb-16">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;