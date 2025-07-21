"use client";
import React, { useRef, useEffect, useState } from "react";

export default function ImageCanvas({
  imagePreview,
  handleUploadClick,
  imageRef,
  activeTool,
  activeAdjustTool,
  setImagePreview,
  textElements,
  cropSettings = { x: 10, y: 10, width: 50, height: 50, isActive: false },
  updateTextElement,
  updateCropPosition = (x, y) =>
    console.log("updateCropPosition not implemented:", x, y),
  updateCropDimensions = (width, height) =>
    console.log("updateCropDimensions not implemented:", width, height),
  performCrop = (settings, src) =>
    console.log("performCrop not implemented:", settings, src),
  showSideAd = false,
  showBottomAd = false,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoverHandle, setHoverHandle] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getCropStyle = () => ({
    left: `${cropSettings.x}%`,
    top: `${cropSettings.y}%`,
    width: `${cropSettings.width}%`,
    height: `${cropSettings.height}%`,
  });

  // Get coordinates from either mouse or touch event
  const getEventCoordinates = (e) => {
    if (e.touches && e.touches[0]) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  // Generate SVG path for star shape
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

  // Generate SVG path for triangle shape
  const getTrianglePath = (width, height) => {
    return `M ${width / 2} 0 L 0 ${height} L ${width} ${height} Z`;
  };

  // Render the crop overlay based on shape
  const renderCropOverlay = () => {
    const shapeId = cropSettings.aspectRatio?.id;
    const isSpecialShape = ['circle', 'triangle', 'star'].includes(shapeId);

    if (isSpecialShape) {
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
          <div
            className="resize-handle absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize"
            onMouseDown={(e) => handleResize(e, 'top-left')}
            onTouchStart={(e) => handleResize(e, 'top-left')}
          />
          <div
            className="resize-handle absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize"
            onMouseDown={(e) => handleResize(e, 'top-right')}
            onTouchStart={(e) => handleResize(e, 'top-right')}
          />
          <div
            className="resize-handle absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize"
            onMouseDown={(e) => handleResize(e, 'bottom-left')}
            onTouchStart={(e) => handleResize(e, 'bottom-left')}
          />
          <div
            className="resize-handle absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize"
            onMouseDown={(e) => handleResize(e, 'bottom-right')}
            onTouchStart={(e) => handleResize(e, 'bottom-right')}
          />

          {/* Crop info */}
          <div className="absolute -top-10 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded">
            {Math.round(cropSettings.width)}% × {Math.round(cropSettings.height)}% ({shapeId})
          </div>
        </div>
      );
    }

    // Regular rectangular crop
    return (
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
        <div
          className="resize-handle absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize"
          onMouseDown={(e) => handleResize(e, 'top-left')}
          onTouchStart={(e) => handleResize(e, 'top-left')}
        />
        <div
          className="resize-handle absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize"
          onMouseDown={(e) => handleResize(e, 'top-right')}
          onTouchStart={(e) => handleResize(e, 'top-right')}
        />
        <div
          className="resize-handle absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize"
          onMouseDown={(e) => handleResize(e, 'bottom-left')}
          onTouchStart={(e) => handleResize(e, 'bottom-left')}
        />
        <div
          className="resize-handle absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize"
          onMouseDown={(e) => handleResize(e, 'bottom-right')}
          onTouchStart={(e) => handleResize(e, 'bottom-right')}
        />

        {/* Crop info */}
        <div className="absolute -top-10 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded">
          {Math.round(cropSettings.width)}% × {Math.round(cropSettings.height)}%
        </div>
      </div>
    );
  };

  // Unified handler for both mouse and touch start
  const handlePointerDown = (e) => {
    if (e.target.classList.contains("resize-handle")) return;
    e.preventDefault();
    setIsDragging(true);

    const coords = getEventCoordinates(e);
    const bounds = containerRef.current.getBoundingClientRect();
    const startDragX =
      ((coords.clientX - bounds.left) * 100) / bounds.width - cropSettings.x;
    const startDragY =
      ((coords.clientY - bounds.top) * 100) / bounds.height - cropSettings.y;

    setDragStart({
      x: startDragX,
      y: startDragY,
    });

    const handleGlobalMove = (moveEvent) => {
      const moveCoords = getEventCoordinates(moveEvent);
      const currentBounds = containerRef.current?.getBoundingClientRect();
      if (!currentBounds) return;

      const x = Math.max(
        0,
        Math.min(
          100 - cropSettings.width,
          ((moveCoords.clientX - currentBounds.left) * 100) /
            currentBounds.width -
            startDragX
        )
      );
      const y = Math.max(
        0,
        Math.min(
          100 - cropSettings.height,
          ((moveCoords.clientY - currentBounds.top) * 100) /
            currentBounds.height -
            startDragY
        )
      );

      if (typeof updateCropPosition === "function") {
        updateCropPosition(x, y);
      } else {
        console.warn("updateCropPosition is not a function");
      }
    };

    const handleGlobalEnd = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleGlobalMove);
      document.removeEventListener("mouseup", handleGlobalEnd);
      document.removeEventListener("touchmove", handleGlobalMove);
      document.removeEventListener("touchend", handleGlobalEnd);
    };

    document.addEventListener("mousemove", handleGlobalMove);
    document.addEventListener("mouseup", handleGlobalEnd);
    document.addEventListener("touchmove", handleGlobalMove, {
      passive: false,
    });
    document.addEventListener("touchend", handleGlobalEnd);
  };

  // Unified resize handler for both mouse and touch
  const handleResize = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);

    const coords = getEventCoordinates(e);
    const bounds = containerRef.current.getBoundingClientRect();
    const startX = coords.clientX;
    const startY = coords.clientY;
    const initialSettings = { ...cropSettings };

    const onMove = (moveEvent) => {
      const moveCoords = getEventCoordinates(moveEvent);
      const dx = ((moveCoords.clientX - startX) * 100) / bounds.width;
      const dy = ((moveCoords.clientY - startY) * 100) / bounds.height;

      let newX = initialSettings.x;
      let newY = initialSettings.y;
      let newWidth = initialSettings.width;
      let newHeight = initialSettings.height;

      if (direction.includes("right")) {
        newWidth = Math.min(
          100 - newX,
          Math.max(5, initialSettings.width + dx)
        );
      }
      if (direction.includes("bottom")) {
        newHeight = Math.min(
          100 - newY,
          Math.max(5, initialSettings.height + dy)
        );
      }
      if (direction.includes("left")) {
        const maxDx = initialSettings.width - 5;
        const constrainedDx = Math.min(maxDx, Math.max(-initialSettings.x, dx));
        newX = initialSettings.x + constrainedDx;
        newWidth = initialSettings.width - constrainedDx;
      }
      if (direction.includes("top")) {
        const maxDy = initialSettings.height - 5;
        const constrainedDy = Math.min(maxDy, Math.max(-initialSettings.y, dy));
        newY = initialSettings.y + constrainedDy;
        newHeight = initialSettings.height - constrainedDy;
      }

      if (typeof updateCropDimensions === "function") {
        updateCropDimensions(newWidth, newHeight);
      }
      if (typeof updateCropPosition === "function") {
        updateCropPosition(newX, newY);
      }
    };

    const onEnd = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && cropSettings.isActive) {
        const imgSrc = imageRef.current?.src || "";
        performCrop(cropSettings, imgSrc);
      }
      if (e.key === "Escape" && cropSettings.isActive) {
        // Cancel crop functionality could be added here
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cropSettings, imageRef, performCrop]);

  useEffect(() => {
    return () => {
      setIsDragging(false);
      setIsResizing(false);
    };
  }, []);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  // Simple Ad Component
  const AdPlaceholder = ({ type }) => (
    <div className="bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
      <span className="text-gray-500 text-sm">
        {type === 'side' ? 'Side Ad' : 'Bottom Ad'}
      </span>
    </div>
  );

  return (
 <div className="w-full min-h-screen bg-gray-50 flex flex-col pb-24">
    {/* Main Content Container */}
    <div className="flex flex-col lg:flex-row flex-1">
      {/* Main Image Area */}
      <div className={`flex-1 ${showSideAd ? 'p-4' : 'p-8'}`}>
        <div
          className={`
            w-full h-full flex justify-center items-center bg-white rounded-lg shadow-sm
            ${showSideAd ? 
              'min-h-[calc(100vh-5rem)] lg:min-h-[60vh]' : 
              'min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-8rem)]'
            }
            ${showBottomAd ? 'lg:min-h-[calc(100vh-12rem)]' : ''}
            ${!imagePreview ? 'border-2 border-dashed border-blue-400' : 'border border-gray-200'}
          `}
          ref={containerRef}
        >
          {imagePreview ? (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <div className="relative max-w-full max-h-full">
                <img
                  src={imagePreview}
                  alt="Preview"
                  ref={imageRef}
                  onLoad={handleImageLoad}
                  className={`w-full h-auto max-w-full max-h-[calc(70vh-5rem)] lg:max-h-[70vh] object-contain transition-opacity duration-500 ${
                    isImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  draggable={false}
                />

                {cropSettings?.isActive && renderCropOverlay()}
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <svg
                className="w-20 h-20 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Upload an Image</h3>
              <p className="text-gray-500 mb-6">JPG, PNG, GIF, WebP supported</p>
              <button
                onClick={handleUploadClick}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Choose Image
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Side Ad - Only show on desktop when enabled */}
      {showSideAd && (
        <div className="hidden lg:block w-60 border-l p-4">
          <AdPlaceholder type="side" />
        </div>
      )}
    </div>

    {/* Bottom Ad - Only show when enabled */}
    {showBottomAd && (
      <div className="w-full h-32 border-t p-4">
        <AdPlaceholder type="bottom" />
      </div>
    )}
  </div>
);

}