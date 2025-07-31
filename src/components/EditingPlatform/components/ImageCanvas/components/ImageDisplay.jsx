import React from "react";

export const ImageDisplay = ({
  imagePreview,
  imageRef,
  isImageLoaded,
  handleImageLoad,
  cropSettings,
  containerRef,
  renderCropOverlay,
  renderBlurOverlay
}) => {
  // Make sure we call the render functions and get JSX elements
  const cropOverlayElement = renderCropOverlay ? renderCropOverlay() : null;
  const blurOverlayElement = renderBlurOverlay ? renderBlurOverlay() : null;

  return (
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

      {/* Render crop overlay when crop is active */}
      {cropSettings?.isActive && cropOverlayElement}
      
      {/* Render blur overlay when blur is active */}
      {blurOverlayElement}
    </div>
  );
};