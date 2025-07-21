'use client'
import React from 'react';

const ColorPicker = ({ colors, activeColor, onChange }) => (
  <div className="flex flex-wrap gap-1 mb-2">
    {colors.map((color) => (
      <div
        key={color}
        onClick={() => onChange(color)}
        className={`w-5 h-5 rounded-full cursor-pointer transition-all ${
          activeColor === color ? 'ring-1 ring-blue-500 ring-offset-1 ring-offset-gray-800' : ''
        }`}
        style={{ backgroundColor: color }}
      />
    ))}
    <div className="relative w-5 h-5 overflow-hidden rounded-full">
      <input
        type="color"
        value={activeColor || '#ffffff'}
        onChange={(e) => onChange(e.target.value)}
        className="absolute top-0 left-0 w-6 h-6 cursor-pointer opacity-0"
      />
      <div className="w-5 h-5 bg-gradient-to-br from-red-500 via-green-500 to-blue-500 rounded-full" />
    </div>
  </div>
);

export default ColorPicker;