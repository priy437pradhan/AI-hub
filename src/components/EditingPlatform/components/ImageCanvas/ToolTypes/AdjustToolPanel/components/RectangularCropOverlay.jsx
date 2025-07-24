"use client";
import React from "react";
import { ResizeHandle } from "./ResizeHandle";
import { CropInfo } from "./CropInfo";

export const RectangularCropOverlay = ({ 
  cropSettings, 
  getCropStyle, 
  handlePointerDown, 
  handleResize, 
  isDragging 
}) => (
  <div
    className={`absolute border-2 border-blue-500 bg-blue-500/10 ${
      isDragging ? 'cursor-grabbing' : 'cursor-grab'
    }`}
    style={getCropStyle()}
    onMouseDown={handlePointerDown}
    onTouchStart={handlePointerDown}
  >
    {/* Crop grid */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="border border-blue-400/30" />
        ))}
      </div>
    </div>

    {/* Resize handles */}
    <ResizeHandle position="top-left" onResize={handleResize} cursor="nwse-resize" />
    <ResizeHandle position="top-right" onResize={handleResize} cursor="nesw-resize" />
    <ResizeHandle position="bottom-left" onResize={handleResize} cursor="nesw-resize" />
    <ResizeHandle position="bottom-right" onResize={handleResize} cursor="nwse-resize" />

    <CropInfo cropSettings={cropSettings} />
  </div>
);

