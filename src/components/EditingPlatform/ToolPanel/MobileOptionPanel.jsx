'use client'
import { useState, useEffect } from 'react';
import { ChevronLeft, X } from 'lucide-react';

const MobileOptionsPanel = ({ 
  activeTool, 
  onClose,
  children
}) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 z-10">
          <div className="flex items-center">
            <button 
              onClick={onClose} 
              className="text-gray-300 hover:text-white p-1 flex items-center"
            >
              <ChevronLeft size={24} />
              <span className="text-sm ml-1">Back</span>
            </button>
            <h2 className="text-lg font-medium text-white text-center flex-1 -ml-8">
              {activeTool ? activeTool.charAt(0).toUpperCase() + activeTool.slice(1) : 'Options'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-300 hover:text-white p-1"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileOptionsPanel;