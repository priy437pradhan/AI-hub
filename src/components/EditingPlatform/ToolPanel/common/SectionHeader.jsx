'use client'
import React from 'react';
import { ChevronUp } from 'lucide-react';

const SectionHeader = ({ title, onClick, isActive }) => (
  <div 
    onClick={onClick} 
    className="flex items-center justify-between w-full p-2 rounded hover:bg-gray-700 cursor-pointer"
  >
    <span className="text-gray-200 font-medium text-sm">{title}</span>
    <ChevronUp 
      size={14} 
      className={`text-gray-400 transform transition-transform ${isActive ? 'rotate-180' : ''}`} 
    />
  </div>
);

export default SectionHeader;