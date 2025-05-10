'use client'
import React from 'react';

const ActionButton = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-1.5 px-2 rounded font-medium text-sm transition-colors ${
      disabled 
        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
    }`}
  >
    {children}
  </button>
);

export default ActionButton;