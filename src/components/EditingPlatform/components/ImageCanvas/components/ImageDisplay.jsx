// components/ImageDisplay.jsx
"use client";
import React from "react";


export const ImageDisplay = ({
  imagePreview,
  imageRef,
  isImageLoaded,
  handleImageLoad,
  cropSettings,
  containerRef,
  renderCropOverlay
}) => (
  <div className="relative max-w-full max-h-full">
    <img
      src={imagePreview}
      alt="Preview"
      ref={imageRef}
      onLoad={handleImageLoad}
      className={`w-full z-20 h-auto max-w-full max-h-[70vh] object-contain transition-opacity duration-500 select-none ${
        isImageLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      draggable={false}
      style={{
        touchAction: cropSettings?.isActive ? 'none' : 'auto',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    />

    {cropSettings?.isActive && renderCropOverlay()}
  </div>
);