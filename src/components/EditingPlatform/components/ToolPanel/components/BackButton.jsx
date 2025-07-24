'use client';
import React from 'react';
import { ArrowLeft } from 'lucide-react'; 

const BackButton = ({ handleBack }) => {
  return (
    <button
      onClick={handleBack}
      className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-all duration-200"
    >
      <ArrowLeft size={18} className="text-white" />
      <span className="text-sm text-white">Back</span>
    </button>
  );
};

export default BackButton;
