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

// Function to determine if shape should be rendered as a circle
const isCircleShape = (shapeId) => {
  return ['circle'].includes(shapeId);
};

// FIXED: Use percentage-based coordinate system to match crop positioning
const getUnifiedViewBoxAndPath = (shapeId, cropSettings, imageWidth, imageHeight) => {
  // CRITICAL FIX: Use percentage coordinates (0-100) instead of pixels
  // This ensures the SVG coordinate system matches the crop positioning system
  const viewBoxWidth = 100;
  const viewBoxHeight = 100;
  
  console.log('Unified coordinates (FIXED):', {
    shapeId,
    viewBox: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
    cropPercent: { width: cropSettings.width, height: cropSettings.height }
  });

  // Use the percentage-based viewBox
  const viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;
  
  let shapePath = null;
  
  switch (shapeId) {
    case 'circle':
      // Circle is handled as SVG element with percentage coordinates
      break;
      
    case 'triangle':
      shapePath = getTrianglePath(viewBoxWidth, viewBoxHeight);
      break;
      
    case 'star':
      shapePath = getStarPath(viewBoxWidth, viewBoxHeight);
      break;
      
    case 'freeform':
      shapePath = getFreeformPath(viewBoxWidth, viewBoxHeight);
      break;
      
    case 'whatsapp-dp':
      const minSize = Math.min(viewBoxWidth, viewBoxHeight);
      shapePath = getWhatsAppDPPath(minSize);
      break;
      
    case '1x1':
      const squareSize = Math.min(viewBoxWidth, viewBoxHeight);
      shapePath = getSquarePath(squareSize);
      break;
      
    // All rectangular aspect ratios use the full viewBox dimensions
    case 'original':
    case 'fb-dp':
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
    default:
      shapePath = getRectanglePath(viewBoxWidth, viewBoxHeight);
      break;
  }

  return {
    viewBox,
    shapePath,
    preserveAspectRatio: 'none' // This ensures the shape stretches to fit the crop area exactly
  };
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
  isDragging,
  imageWidth, // Still received but not used for viewBox calculations
  imageHeight // Still received but not used for viewBox calculations
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

  console.log('ShapeCropOverlay: Rendering shape crop for:', shapeId, 'with percentage-based coordinates');

  const isCircle = isCircleShape(shapeId);
  const styling = getShapeSpecificStyling(shapeId);
  
  // FIXED: Use percentage-based coordinate system
  const { viewBox, shapePath, preserveAspectRatio } = getUnifiedViewBoxAndPath(
    shapeId, 
    cropSettings, 
    imageWidth, 
    imageHeight
  );

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
        viewBox={viewBox}
        preserveAspectRatio={preserveAspectRatio}
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