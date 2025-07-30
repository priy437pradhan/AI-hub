"use client";
import React from "react";
import { ResizeHandle } from "./ResizeHandle";
import { CropInfo } from "./CropInfo";

// Define shape utility functions within this component
const getStarPath = (width, height) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(width, height) / 2;
  const innerRadius = outerRadius * 0.4;
  const spikes = 5;
  
  let path = '';
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = centerX + Math.cos(angle - Math.PI / 2) * radius;
    const y = centerY + Math.sin(angle - Math.PI / 2) * radius;
    
    if (i === 0) {
      path += `M ${x} ${y}`;
    } else {
      path += ` L ${x} ${y}`;
    }
  }
  path += ' Z';
  return path;
};

const getTrianglePath = (width, height) => {
  return `M ${width / 2} 0 L 0 ${height} L ${width} ${height} Z`;
};

const getRectanglePath = (width, height) => {
  return `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z`;
};

const getSquarePath = (size) => {
  return `M 0 0 L ${size} 0 L ${size} ${size} L 0 ${size} Z`;
};

const getFreeformPath = (width, height) => {
  // Organic, free-flowing shape
  const w = width, h = height;
  return `M ${w * 0.1} ${h * 0.3} 
          C ${w * 0.1} ${h * 0.1}, ${w * 0.3} ${h * 0.05}, ${w * 0.6} ${h * 0.15}
          C ${w * 0.8} ${h * 0.2}, ${w * 0.95} ${h * 0.4}, ${w * 0.9} ${h * 0.7}
          C ${w * 0.85} ${h * 0.9}, ${w * 0.6} ${h * 0.95}, ${w * 0.3} ${h * 0.85}
          C ${w * 0.1} ${h * 0.75}, ${w * 0.05} ${h * 0.5}, ${w * 0.1} ${h * 0.3} Z`;
};

const getWhatsAppDPPath = (size) => {
  // WhatsApp style rounded square with slight curves
  const r = size * 0.15; // Corner radius
  return `M ${r} 0 
          L ${size - r} 0 
          Q ${size} 0 ${size} ${r}
          L ${size} ${size - r}
          Q ${size} ${size} ${size - r} ${size}
          L ${r} ${size}
          Q 0 ${size} 0 ${size - r}
          L 0 ${r}
          Q 0 0 ${r} 0 Z`;
};

// Function to get the appropriate shape path with proper dimensions
const getShapePath = (shapeId, width, height) => {
  switch (shapeId) {
    case 'circle':
    case 'fb-dp':
      return null; 
    case 'triangle':
      return getTrianglePath(width, height);
    case 'star':
      return getStarPath(width, height);
    case 'freeform':
      return getFreeformPath(width, height);
    case 'original':
      return getRectanglePath(width, height);
    case '1x1':
      return getSquarePath(Math.min(width, height));
    case 'whatsapp-dp':
      return getWhatsAppDPPath(Math.min(width, height));
   
    case 'fb-cover':
    case 'fb-post':
    case 'yt-thumbnail':
    case '4x5':
    case '5x4':
    case '3x4':
    case '4x3':
    case '2x3':
    case '3x2':
    case '9x16':
    case '16x9':
      return getRectanglePath(width, height);
    default:
      return getRectanglePath(width, height);
  }
};

// Function to determine if shape should be rendered as a circle
const isCircleShape = (shapeId) => {
  return ['circle', 'fb-dp'].includes(shapeId);
};

// CRITICAL FIX: Function to get PROPER viewBox dimensions for each aspect ratio
const getViewBoxAndAspect = (shapeId) => {
  switch (shapeId) {
    // Square shapes
    case 'circle':
    case 'fb-dp':
    case '1x1':
    case 'whatsapp-dp':
      return { viewBox: '0 0 100 100', preserveAspectRatio: 'none' };
    
    // Special shapes that need square canvas
    case 'triangle':
    case 'star':
    case 'freeform':
      return { viewBox: '0 0 100 100', preserveAspectRatio: 'none' };
    
    // DIFFERENT RECTANGULAR RATIOS - EACH GETS UNIQUE VIEWBOX
    case '4x5':
      return { viewBox: '0 0 400 500', preserveAspectRatio: 'none' };
    case '5x4':
      return { viewBox: '0 0 500 400', preserveAspectRatio: 'none' };
    case '3x4':
      return { viewBox: '0 0 300 400', preserveAspectRatio: 'none' };
    case '4x3':
      return { viewBox: '0 0 400 300', preserveAspectRatio: 'none' };
    case '2x3':
      return { viewBox: '0 0 200 300', preserveAspectRatio: 'none' };
    case '3x2':
      return { viewBox: '0 0 300 200', preserveAspectRatio: 'none' };
    case '9x16':
      return { viewBox: '0 0 900 1600', preserveAspectRatio: 'none' };
    case '16x9':
      return { viewBox: '0 0 1600 900', preserveAspectRatio: 'none' };
    
    // Social media - simplified, no special decorations
    case 'fb-cover':
      return { viewBox: '0 0 820 312', preserveAspectRatio: 'none' };
    case 'fb-post':
      return { viewBox: '0 0 400 500', preserveAspectRatio: 'none' };
    case 'yt-thumbnail':
      return { viewBox: '0 0 1600 900', preserveAspectRatio: 'none' };
    
    default:
      return { viewBox: '0 0 100 100', preserveAspectRatio: 'none' };
  }
};

// Function to get shape path with correct viewBox dimensions
const getShapePathForViewBox = (shapeId, viewBoxConfig) => {
  const viewBoxDimensions = viewBoxConfig.viewBox.split(' ');
  const width = parseInt(viewBoxDimensions[2]);
  const height = parseInt(viewBoxDimensions[3]);
  
  return getShapePath(shapeId, width, height);
};

// SIMPLIFIED: Function to get basic styling for different shapes
const getShapeSpecificStyling = (shapeId) => {
  switch (shapeId) {
    case 'freeform':
      return { stroke: '#8B5CF6', fill: 'rgba(139, 92, 246, 0.1)' };
    case 'star':
      return { stroke: '#F59E0B', fill: 'rgba(245, 158, 11, 0.1)' };
    case 'triangle':
      return { stroke: '#EF4444', fill: 'rgba(239, 68, 68, 0.1)' };
    case 'circle':
    case 'fb-dp':
      return { stroke: '#10B981', fill: 'rgba(16, 185, 129, 0.1)' };
    // ALL OTHER SHAPES GET SIMPLE BLUE STYLING
    default:
      return { stroke: '#3B82F6', fill: 'rgba(59, 130, 246, 0.1)' };
  }
};

export const ShapeCropOverlay = ({
  cropSettings,
  getCropStyle,
  handlePointerDown,
  handleResize,
  isDragging
}) => {
  const shapeId = cropSettings.aspectRatio?.id;
  
  // All supported shapes and aspect ratios
  const supportedShapes = [
    'freeform', 'original', 'circle', 'triangle', 'star',
    '1x1', '4x5', '5x4', '3x4', '4x3', '2x3', '3x2', '9x16', '16x9',
    'whatsapp-dp', 'fb-dp', 'fb-cover', 'fb-post', 'yt-thumbnail'
  ];
  
  const isSupported = supportedShapes.includes(shapeId);
  
  if (!isSupported) {
    console.log('ShapeCropOverlay: Unsupported shape crop, refusing to render:', shapeId);
    return null;
  }

  if (!cropSettings.isActive) {
    console.log('ShapeCropOverlay: Crop not active, not rendering');
    return null;
  }

  console.log('ShapeCropOverlay: Rendering shape crop for:', shapeId);

  const isCircle = isCircleShape(shapeId);
  const styling = getShapeSpecificStyling(shapeId);
  const viewBoxConfig = getViewBoxAndAspect(shapeId);
  const shapePath = isCircle ? null : getShapePathForViewBox(shapeId, viewBoxConfig);

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
        viewBox={viewBoxConfig.viewBox}
        preserveAspectRatio={viewBoxConfig.preserveAspectRatio}
      >
        <defs>
          <mask id={`shapeCropMask-${shapeId}`}>
            <rect width="100%" height="100%" fill="black" />
            {isCircle ? (
              <circle cx="50%" cy="50%" r="50%" fill="white" />
            ) : (
              <path d={shapePath} fill="white" />
            )}
          </mask>
        </defs>
        
        {/* Background with shape cut out */}
        <rect 
          width="100%" 
          height="100%" 
          fill={styling.fill} 
          mask={`url(#shapeCropMask-${shapeId})`} 
        />
        
        {/* Shape outline */}
        {isCircle ? (
          <circle 
            cx="50%" 
            cy="50%" 
            r="49%" 
            fill="none" 
            stroke={styling.stroke} 
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        ) : (
          <path 
            d={shapePath} 
            fill="none" 
            stroke={styling.stroke} 
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>

      {/* Resize handles - corner handles for shapes to maintain proportions */}
      <ResizeHandle position="top-left" onResize={handleResize} cursor="nwse-resize" />
      <ResizeHandle position="top-right" onResize={handleResize} cursor="nesw-resize" />
      <ResizeHandle position="bottom-left" onResize={handleResize} cursor="nesw-resize" />
      <ResizeHandle position="bottom-right" onResize={handleResize} cursor="nwse-resize" />

      {/* Add edge handles for rectangular aspect ratios */}
      {!['circle', 'triangle', 'star', 'freeform', 'fb-dp', 'whatsapp-dp'].includes(shapeId) && (
        <>
          <ResizeHandle position="top" onResize={handleResize} cursor="ns-resize" />
          <ResizeHandle position="bottom" onResize={handleResize} cursor="ns-resize" />
          <ResizeHandle position="left" onResize={handleResize} cursor="ew-resize" />
          <ResizeHandle position="right" onResize={handleResize} cursor="ew-resize" />
        </>
      )}

      <CropInfo cropSettings={cropSettings} />
    </div>
  );
};