"use client";
import React from "react";
import { ResizeHandle } from "./ResizeHandle";
import { CropInfo } from "./CropInfo";
import { getStarPath } from "../../../utils/shapeUtils";

export const ShapeCropOverlay = ({ 
  cropSettings, 
  getCropStyle, 
  handlePointerDown, 
  handleResize, 
  isDragging 
}) => {
  const shapeId = cropSettings.aspectRatio?.id;

  return (
    <div
      className={`absolute ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={getCropStyle()}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
    >
      {/* SVG overlay for shapes */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 100 100`}
        preserveAspectRatio="none"
      >
        <defs>
          <mask id="cropMask">
            <rect width="100" height="100" fill="black" />
            {shapeId === 'circle' && (
              <circle cx="50" cy="50" r="50" fill="white" />
            )}
            {shapeId === 'triangle' && (
              <path d="M 50 0 L 0 100 L 100 100 Z" fill="white" />
            )}
            {shapeId === 'star' && (
              <path d={getStarPath(100, 100)} fill="white" />
            )}
          </mask>
        </defs>
        
        {/* Background with shape cut out */}
        <rect 
          width="100" 
          height="100" 
          fill="rgba(59, 130, 246, 0.1)" 
          mask="url(#cropMask)" 
        />
        
        {/* Shape outline */}
        {shapeId === 'circle' && (
          <circle 
            cx="50" 
            cy="50" 
            r="49" 
            fill="none" 
            stroke="#3B82F6" 
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {shapeId === 'triangle' && (
          <path 
            d="M 50 1 L 1 99 L 99 99 Z" 
            fill="none" 
            stroke="#3B82F6" 
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {shapeId === 'star' && (
          <path 
            d={getStarPath(100, 100)} 
            fill="none" 
            stroke="#3B82F6" 
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>

      {/* Resize handles */}
      <ResizeHandle position="top-left" onResize={handleResize} cursor="nwse-resize" />
      <ResizeHandle position="top-right" onResize={handleResize} cursor="nesw-resize" />
      <ResizeHandle position="bottom-left" onResize={handleResize} cursor="nesw-resize" />
      <ResizeHandle position="bottom-right" onResize={handleResize} cursor="nwse-resize" />

      <CropInfo cropSettings={cropSettings} />
    </div>
  );
};
