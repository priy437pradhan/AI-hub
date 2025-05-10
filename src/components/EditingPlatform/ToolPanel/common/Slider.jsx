'use client'

import React from 'react';

const Slider = ({ label, value, min, max, onChange, showValue = true }) => (
  <div className="mb-2">
    <div className="flex justify-between mb-1">
      <label className="text-gray-300 text-xs">{label}</label>
      {showValue && <span className="text-gray-400 text-xs">{value}</span>}
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1.5 rounded-full appearance-none bg-gray-700 accent-blue-500"
    />
  </div>
);

export default Slider;