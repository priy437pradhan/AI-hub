"use client";
import React from "react";

export const AdPlaceholder = ({ type }) => (
  <div className="bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
    <span className="text-gray-500 text-sm">
      {type === 'side' ? 'Side Ad' : 'Bottom Ad'}
    </span>
  </div>
);