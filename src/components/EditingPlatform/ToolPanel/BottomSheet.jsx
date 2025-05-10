'use client'
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const BottomSheet = ({ isOpen, onClose, children, title = "Options" }) => {
  const sheetRef = useRef(null);
  
  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };
    
    // Block body scroll when sheet is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Animation classes
  const sheetClasses = isOpen 
    ? "translate-y-0 opacity-100"
    : "translate-y-full opacity-0";
    
  const overlayClasses = isOpen
    ? "opacity-50"
    : "opacity-0 pointer-events-none";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop overlay */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${overlayClasses}`}
        onClick={onClose}
      />
      
      {/* Bottom sheet */}
      <div 
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 bg-gray-800 rounded-t-xl shadow-lg transform transition-transform duration-300 ease-in-out ${sheetClasses}`}
        style={{ 
          maxHeight: '85vh',
          zIndex: 51
        }}
      >
        {/* Header bar with handle */}
        <div className="sticky top-0 bg-gray-800 rounded-t-xl p-2 border-b border-gray-700">
          <div className="flex items-center justify-between px-2">
            <div className="invisible w-8">
              <X size={24} />
            </div>
            <div className="mx-auto w-12 h-1 bg-gray-600 rounded-full mb-2"></div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
              aria-label="Close panel"
            >
              <X size={24} />
            </button>
          </div>
          <h2 className="text-lg font-medium text-white text-center">{title}</h2>
        </div>
        
        {/* Content with scrolling */}
        <div className="overflow-y-auto p-4 pb-20" style={{ maxHeight: 'calc(85vh - 64px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;