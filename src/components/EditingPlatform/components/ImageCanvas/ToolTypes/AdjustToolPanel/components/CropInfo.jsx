"use client";
import React from "react";

export const CropInfo = ({ cropSettings }) => (
  <div className="absolute -top-10 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none">
    {Math.round(cropSettings.width)}% × {Math.round(cropSettings.height)}%
    {cropSettings.aspectRatio?.id && ['circle', 'triangle', 'star'].includes(cropSettings.aspectRatio.id) 
      && ` (${cropSettings.aspectRatio.id})`}
  </div>
);