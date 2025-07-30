"use client";
import React, { useRef, useEffect, useState } from "react";
import { AdPlaceholder } from "./components/AdPlaceholder";
import { EmptyImageState } from "./components/EmptyImageState";
import { ImageDisplay } from "./components/ImageDisplay";
import { ShapeCropOverlay } from "./ToolTypes/AdjustToolPanel/components/ShapeCropOverlay";
import { RectangularCropOverlay } from "./ToolTypes/AdjustToolPanel/components/RectangularCropOverlay";
import { useCropHandlers } from "./ToolTypes/AdjustToolPanel/hooks/useCropHandlers";
import { useMobileHandling } from "./hooks/useMobileHandling";

import { useResize } from '../ToolPanel/ToolTypes/AdjustToolPanel/hooks/useResize';
import { useResizeOverlay } from './ToolTypes/AdjustToolPanel/components/ResizeOverlay';
import { useResizeHandlers } from './ToolTypes/AdjustToolPanel/hooks/useResizeHandler';

// Redux hooks
import { 
  useAppDispatch, 
  useImageState, 
  useToolsState, 
  useCropState, 
  useTextState 
} from '../../../../app/store/hooks/redux';

import { setImagePreview } from '../../../../app/store/slices/imageSlice';
import { updateCropPosition, updateCropDimensions } from '../../../../app/store/slices/cropSlice';
import { updateTextElement } from '../../../../app/store/slices/textSlice';

export default function ImageCanvas({
  handleUploadClick,
  imageRef,
  performCrop = (settings, src) =>
    console.log("performCrop not implemented:", settings, src),
  showSideAd = false,
  showBottomAd = false,
}) {
  const dispatch = useAppDispatch();
  
  // Redux state
  const imageState = useImageState();
  const toolsState = useToolsState();
  const cropState = useCropState();
  const textState = useTextState();

  // Local state
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const containerRef = useRef(null);

  // Extract values from Redux state
  const imagePreview = imageState.imagePreview;
  const activeTool = toolsState.activeTool;
  const activeAdjustTool = toolsState.activeTools.adjust;
  const textElements = textState.textElements;

  // FIXED: Handle the crop settings properly
  // If cropSettings is the full Redux state, extract the actual settings
  const actualCropSettings = cropState?.cropSettings || cropState || {
    x: 10, 
    y: 10, 
    width: 50, 
    height: 50, 
    isActive: false 
  };
  
  const aspectRatio = cropState?.aspectRatio || null;
  
  // Create normalized crop settings that include aspectRatio
  const normalizedCropSettings = {
    ...actualCropSettings,
    aspectRatio: aspectRatio
  };

  // FIXED: Determine when to show crop overlay
  const shouldShowCropOverlay = 
    activeTool === 'adjust' && 
    activeAdjustTool === 'crop' && 
    normalizedCropSettings.isActive;

  console.log('Debug crop overlay:', {
    activeTool,
    activeAdjustTool, 
    isActive: normalizedCropSettings.isActive,
    shouldShow: shouldShowCropOverlay,
    cropSettings: normalizedCropSettings
  });

  // Redux-enabled update functions
  const reduxUpdateCropPosition = (x, y) => {
    dispatch(updateCropPosition({ x, y }));
  };

  const reduxUpdateCropDimensions = (width, height) => {
    dispatch(updateCropDimensions({ width, height }));
  };

  const reduxUpdateTextElement = (id, updates) => {
    dispatch(updateTextElement({ id, updates }));
  };

  // Move the resize hooks AFTER the component props are available
  const {
    resizeSettings,
    performResize,
    resetResize,
    updateResizeDimensions
  } = useResize(imageRef, containerRef);

  const {
    getOverlayStyle,
    handlePointerStart
  } = useResizeOverlay(resizeSettings, containerRef, updateResizeDimensions);

  const {
    isDragging: resizeIsDragging,
    isResizing,
    handleResize: handleResizeResize
  } = useResizeHandlers(resizeSettings, containerRef, updateResizeDimensions, resetResize);

  const {
    isDragging,
    isResizing: cropIsResizing,
    setIsDragging,
    setIsResizing,
    getCropStyle,
    handlePointerDown,
    handleResize
  } = useCropHandlers(
    normalizedCropSettings,
    containerRef,
    reduxUpdateCropPosition,
    reduxUpdateCropDimensions
  );

  // Use the crop handlers' isDragging and isResizing for mobile handling
  const { isMobile } = useMobileHandling(isDragging, cropIsResizing);

  const renderCropOverlay = () => {
    // FIXED: Only render if crop should be shown
    if (!shouldShowCropOverlay) {
      console.log('Not showing crop overlay - conditions not met');
      return null;
    }

    console.log('Rendering crop overlay with settings:', normalizedCropSettings);

    const shapeId = normalizedCropSettings.aspectRatio?.id;
    const isSpecialShape = ['circle', 'triangle', 'star'].includes(shapeId);

    if (isSpecialShape) {
      return (
        <ShapeCropOverlay
          cropSettings={normalizedCropSettings}
          getCropStyle={getCropStyle}
          handlePointerDown={handlePointerDown}
          handleResize={handleResize}
          isDragging={isDragging}
        />
      );
    }

    return (
      <RectangularCropOverlay
        cropSettings={normalizedCropSettings}
        getCropStyle={getCropStyle}
        handlePointerDown={handlePointerDown}
        handleResize={handleResize}
        isDragging={isDragging}
      />
    );
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && normalizedCropSettings.isActive) {
        const imgSrc = imageRef.current?.src || "";
        performCrop(normalizedCropSettings, imgSrc);
      }
      if (e.key === "Escape" && normalizedCropSettings.isActive) {
        // Cancel crop functionality could be added here
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [normalizedCropSettings, imageRef, performCrop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsDragging(false);
      setIsResizing(false);
    };
  }, [setIsDragging, setIsResizing]);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content Container with proper spacing for bottom toolbar */}
      <div className="flex flex-col lg:flex-row flex-1 pb-20">
        {/* Main Image Area */}
        <div className={`flex-1 ${showSideAd ? 'p-4' : 'p-8'}`}>
          <div
            className={`
              w-full h-full flex justify-center items-center bg-white rounded-lg shadow-sm
              ${showSideAd ? 'min-h-[60vh]' : 'min-h-[calc(100vh-12rem)]'}
              ${showBottomAd ? 'lg:min-h-[calc(100vh-16rem)]' : ''}
              ${!imagePreview ? 'border-2 border-dashed border-blue-400' : 'border border-gray-200'}
            `}
            ref={containerRef}
          >
            {imagePreview ? (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <ImageDisplay
                  imagePreview={imagePreview}
                  imageRef={imageRef}
                  isImageLoaded={isImageLoaded}
                  handleImageLoad={handleImageLoad}
                  cropSettings={normalizedCropSettings}
                  containerRef={containerRef}
                  renderCropOverlay={renderCropOverlay}
                />
              </div>
            ) : (
              <EmptyImageState handleUploadClick={handleUploadClick} />
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
        <div className="w-full h-32 border-t p-4 mb-20">
          <AdPlaceholder type="bottom" />
        </div>
      )}
    </div>
  );
}