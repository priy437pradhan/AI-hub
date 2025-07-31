"use client";
import React, { useRef, useEffect, useState } from "react";
import { AdPlaceholder } from "./components/AdPlaceholder";
import { EmptyImageState } from "./components/EmptyImageState";
import { ImageDisplay } from "./components/ImageDisplay";
import { ShapeCropOverlay } from "./ToolTypes/AdjustToolPanel/components/ShapeCropOverlay";
// import { BlurManualAdjustmentOverlay } from '../../components/ToolPanel/ToolTypes/AdjustToolPanel/components/BlurComponent';
import { BlurManualAdjustmentOverlay } from "./ToolTypes/AdjustToolPanel/components/BlurManualAdjustmentOverlay";
import { 
  useAppDispatch, 
  useImageState, 
  useToolsState, 
  useCropState, 
  useTextState 
} from '../../../../app/store/hooks/redux';

import { useSelector } from 'react-redux';
import { updateCropPosition, updateCropDimensions } from '../../../../app/store/slices/cropSlice';
import { updateTextElement } from '../../../../app/store/slices/textSlice';
import { updateFilter } from '../../../../app/store/slices/filtersSlice';

export default function ImageCanvas({
  handleUploadClick,
  imageRef,
  containerRef,
  performCrop,
  cropHook,
  showSideAd = false,
  showBottomAd = false,
}) {
  const dispatch = useAppDispatch();
  
  // Redux state
  const imageState = useImageState();
  const toolsState = useToolsState();
  const cropState = useCropState();
  const textState = useTextState();
  
  // Get blur state from Redux
  const blurAdjust = useSelector(state => state.filters.blurAdjust);

  // Local state
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageInfo, setImageInfo] = useState({ width: 0, height: 0 });

  // Extract values from Redux state
  const imagePreview = imageState.imagePreview;
  const activeTool = toolsState.activeTool;
  const activeAdjustTool = toolsState.activeTools.adjust;
  const textElements = textState.textElements;

  // Handle the crop settings properly
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

  const shouldShowCropOverlay = 
    (activeTool === 'adjust' && activeAdjustTool === 'crop') || 
    normalizedCropSettings.isActive ||
    (activeTool === 'adjust' && toolsState.activeTool === 'adjust');

  // Determine if blur overlay should be shown
  const shouldShowBlurOverlay = 
    (activeTool === 'adjust' && activeAdjustTool === 'blur') || 
    (blurAdjust?.intensity > 0);

  console.log('Debug crop overlay:', {
    activeTool,
    activeAdjustTool, 
    isActive: normalizedCropSettings.isActive,
    shouldShow: shouldShowCropOverlay,
    cropSettings: normalizedCropSettings,
    shapeId: normalizedCropSettings.aspectRatio?.id
  });

  console.log('Debug blur overlay:', {
    activeTool,
    activeAdjustTool,
    blurIntensity: blurAdjust?.intensity,
    shouldShow: shouldShowBlurOverlay,
    blurAdjust
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

  // Blur adjustment handler
  const handleBlurAdjustmentChange = (property, value) => {
    const processedValue = property === 'type' ? value : parseInt(value);
    
    dispatch(updateFilter({
      category: 'blurAdjust',
      values: { 
        [property]: processedValue
      }
    }));
  };

  const {
    isDragging,
    isResizing: cropIsResizing,
    setIsDragging,
    setIsResizing,
    getCropStyle,
    handlePointerDown,
    handleResize
  } = cropHook;

  const renderCropOverlay = () => {
    // Only render if crop should be shown and image is loaded
    if (!shouldShowCropOverlay || !isImageLoaded) {
      console.log('Not showing crop overlay - conditions not met', {
        shouldShow: shouldShowCropOverlay,
        imageLoaded: isImageLoaded
      });
      return null;
    }

    console.log('=== CROP OVERLAY RENDER DEBUG ===');
    console.log('Crop settings:', normalizedCropSettings);
    console.log('Aspect ratio:', aspectRatio);
    console.log('Image dimensions:', imageInfo);

    const shapeId = normalizedCropSettings.aspectRatio?.id;

    console.log('Shape detection:', { 
      shapeId, 
      aspectRatio: normalizedCropSettings.aspectRatio 
    });

    console.log('✓ Rendering ShapeCropOverlay for:', shapeId || 'default');
    return (
      <ShapeCropOverlay
        key={`crop-overlay-${shapeId || 'default'}`}
        cropSettings={normalizedCropSettings}
        getCropStyle={getCropStyle}
        handlePointerDown={handlePointerDown}
        handleResize={handleResize}
        isDragging={isDragging}
        imageWidth={imageInfo.width}
        imageHeight={imageInfo.height}
      />
    );
  };

  // NEW: Render blur overlay function
  const renderBlurOverlay = () => {
    // Only render if blur should be shown and image is loaded
    if (!shouldShowBlurOverlay || !isImageLoaded) {
      console.log('Not showing blur overlay - conditions not met', {
        shouldShow: shouldShowBlurOverlay,
        imageLoaded: isImageLoaded,
        blurIntensity: blurAdjust?.intensity
      });
      return null;
    }

    console.log('=== BLUR OVERLAY RENDER DEBUG ===');
    console.log('Blur settings:', blurAdjust);
    console.log('Image dimensions:', imageInfo);
    console.log('✓ Rendering BlurManualAdjustmentOverlay');

    return (
      <BlurManualAdjustmentOverlay 
        key="blur-overlay"
        blurAdjust={blurAdjust}
        onAdjustmentChange={handleBlurAdjustmentChange}
        imageWidth={imageInfo.width}
        imageHeight={imageInfo.height}
      />
    );
  };

  const handleImageLoad = (event) => {
    setIsImageLoaded(true);
    
    // Get the actual image dimensions
    if (event && event.target) {
      const img = event.target;
      setImageInfo({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      console.log('Image loaded with dimensions:', {
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    } else if (imageRef.current) {
      // Fallback: get dimensions from imageRef
      const img = imageRef.current;
      setImageInfo({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      console.log('Image dimensions from ref:', {
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    }
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
                  renderBlurOverlay={renderBlurOverlay} // NEW: Pass blur overlay renderer
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