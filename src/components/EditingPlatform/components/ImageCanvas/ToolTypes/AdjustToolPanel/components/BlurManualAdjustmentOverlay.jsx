import React, { useState, useCallback, useRef, useEffect } from 'react';

export const BlurManualAdjustmentOverlay = ({
  blurAdjust,
  onAdjustmentChange,
  imageWidth,
  imageHeight
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const overlayRef = useRef(null);

  // Default blur settings
  const {
    type = 'linear',
    intensity = 67,
    startX = 25,
    startY = 25,
    endX = 75,
    endY = 75,
    angle = 0
  } = blurAdjust || {};

  // Calculate positions as percentages for responsiveness
  const startXPercent = startX;
  const startYPercent = startY;
  const endXPercent = endX;
  const endYPercent = endY;

  const handlePointerDown = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragType(type);
    
    const rect = overlayRef.current?.getBoundingClientRect();
    if (rect) {
      setStartPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    
    // Add global listeners
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging || !overlayRef.current) return;

    e.preventDefault();
    const rect = overlayRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp values between 0 and 100
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    if (dragType === 'start') {
      onAdjustmentChange('startX', clampedX);
      onAdjustmentChange('startY', clampedY);
    } else if (dragType === 'end') {
      onAdjustmentChange('endX', clampedX);
      onAdjustmentChange('endY', clampedY);
    } else if (dragType === 'line') {
      // Move the entire line
      const deltaX = clampedX - (startXPercent + endXPercent) / 2;
      const deltaY = clampedY - (startYPercent + endYPercent) / 2;
      
      const newStartX = Math.max(0, Math.min(100, startXPercent + deltaX));
      const newStartY = Math.max(0, Math.min(100, startYPercent + deltaY));
      const newEndX = Math.max(0, Math.min(100, endXPercent + deltaX));
      const newEndY = Math.max(0, Math.min(100, endYPercent + deltaY));
      
      onAdjustmentChange('startX', newStartX);
      onAdjustmentChange('startY', newStartY);
      onAdjustmentChange('endX', newEndX);
      onAdjustmentChange('endY', newEndY);
    }
  }, [isDragging, dragType, startXPercent, startYPercent, endXPercent, endYPercent, onAdjustmentChange]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setDragType(null);
    
    // Remove global listeners
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  // Generate gradient for linear blur visualization
  const generateGradient = () => {
    if (type === 'linear') {
      const angle = Math.atan2(endYPercent - startYPercent, endXPercent - startXPercent) * 180 / Math.PI;
      return `linear-gradient(${angle}deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(59, 130, 246, 0.3) 100%)`;
    }
    return 'rgba(59, 130, 246, 0.2)';
  };

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 pointer-events-auto z-30"
      style={{
        background: generateGradient(),
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {/* Blur intensity indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
        Linear Blur: {intensity}%
      </div>

      {/* Linear blur line */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 31 }}
      >
        <defs>
          <marker
            id="startCircle"
            markerWidth="12"
            markerHeight="12"
            refX="6"
            refY="6"
            markerUnits="strokeWidth"
          >
            <circle cx="6" cy="6" r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
          </marker>
          <marker
            id="endCircle"
            markerWidth="12"
            markerHeight="12"
            refX="6"
            refY="6"
            markerUnits="strokeWidth"
          >
            <circle cx="6" cy="6" r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
          </marker>
        </defs>
        
        <line
          x1={`${startXPercent}%`}
          y1={`${startYPercent}%`}
          x2={`${endXPercent}%`}
          y2={`${endYPercent}%`}
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
          markerStart="url(#startCircle)"
          markerEnd="url(#endCircle)"
        />
      </svg>

      {/* Interactive handles */}
      <div
        className="absolute w-6 h-6 bg-blue-500 border-2 border-white rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 hover:bg-blue-600 transition-colors pointer-events-auto"
        style={{
          left: `${startXPercent}%`,
          top: `${startYPercent}%`,
          zIndex: 32
        }}
        onPointerDown={(e) => handlePointerDown(e, 'start')}
      />
      
      <div
        className="absolute w-6 h-6 bg-blue-500 border-2 border-white rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 hover:bg-blue-600 transition-colors pointer-events-auto"
        style={{
          left: `${endXPercent}%`,
          top: `${endYPercent}%`,
          zIndex: 32
        }}
        onPointerDown={(e) => handlePointerDown(e, 'end')}
      />

      {/* Center handle for moving the entire line */}
      <div
        className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-move transform -translate-x-1/2 -translate-y-1/2 hover:bg-blue-600 transition-colors pointer-events-auto"
        style={{
          left: `${(startXPercent + endXPercent) / 2}%`,
          top: `${(startYPercent + endYPercent) / 2}%`,
          zIndex: 32
        }}
        onPointerDown={(e) => handlePointerDown(e, 'line')}
      />

      {/* Additional corner handles for rectangular selection (optional) */}
      {type === 'linear' && (
        <>
          <div
            className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 hover:bg-blue-600 transition-colors pointer-events-auto"
            style={{
              left: `${startXPercent}%`,
              top: `${endYPercent}%`,
              zIndex: 32
            }}
            onPointerDown={(e) => handlePointerDown(e, 'corner1')}
          />
          <div
            className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 hover:bg-blue-600 transition-colors pointer-events-auto"
            style={{
              left: `${endXPercent}%`,
              top: `${startYPercent}%`,
              zIndex: 32
            }}
            onPointerDown={(e) => handlePointerDown(e, 'corner2')}
          />
          <div
            className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 hover:bg-blue-600 transition-colors pointer-events-auto"
            style={{
              left: `${(startXPercent + endXPercent) / 2}%`,
              top: `${startYPercent}%`,
              zIndex: 32
            }}
            onPointerDown={(e) => handlePointerDown(e, 'top')}
          />
          <div
            className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 hover:bg-blue-600 transition-colors pointer-events-auto"
            style={{
              left: `${(startXPercent + endXPercent) / 2}%`,
              top: `${endYPercent}%`,
              zIndex: 32
            }}
            onPointerDown={(e) => handlePointerDown(e, 'bottom')}
          />
        </>
      )}
    </div>
  );
};