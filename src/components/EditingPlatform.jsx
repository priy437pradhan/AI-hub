'use client';

import { useDispatch, useSelector } from 'react-redux';;
import { useRef, useEffect, useMemo } from "react";
import { useImageProcessor } from "./EditingPlatform/components/ToolPanel/hooks/useImageProcessor";
import { useCropOperations } from "./EditingPlatform/components/ToolPanel/ToolTypes/AdjustToolPanel/hooks/useCropOperations";
import Header from "./EditingPlatform/components/Header";
import Sidebar from "./EditingPlatform/components/Sidebar";
import ToolPanel from "./EditingPlatform/components/ToolPanel/ToolPanel";
import BottomToolbar from "./EditingPlatform/components/ToolPanel/BottomToolbar";
import ImageCanvas from "./EditingPlatform/components/ImageCanvas/ImageCanvas";


import {useAppDispatch,useImageState,useToolsState,useFiltersState,useUIState,useCropState,useTextState,
useFrameState,useBeautyState,} from '../app/store/hooks/redux';

import {setUploadedImage,setImagePreview,setOriginalImage,setCurrentBaseImage,
  resetToOriginal as resetImageToOriginal,} from '../app/store/slices/imageSlice';

import { setActiveTool, setActiveSubTool, toolNames,} from '../app/store/slices/toolsSlice';

import { updateFilter, resetFilters,} from '../app/store/slices/filtersSlice';

import {setIsMobile,setSidebarOpen,setIsBottomSheetOpen,} from '../app/store/slices/uiSlice';

import {resetCrop,setCropActive,setCropSettings,toggleCropMode,} from '../app/store/slices/cropSlice';

import {clearAllText,} from '../app/store/slices/textSlice';

import {resetFrameSettings,} from '../app/store/slices/frameSlice';

import {resetBeautySettings,} from '../app/store/slices/beautySlice';


import { useFlipImage } from "./EditingPlatform/components/ToolPanel/ToolTypes/AdjustToolPanel/hooks/useFlipImage";
import { useRotateImage } from "./EditingPlatform/components/ToolPanel/ToolTypes/AdjustToolPanel/hooks/useRotateImage";
import { useFrames } from "./EditingPlatform/components/ToolPanel/hooks/useFrames";
import { useTextEditor } from "./EditingPlatform/components/ToolPanel/hooks/useTextEditor";
import { useTextStyles } from "./EditingPlatform/components/ToolPanel/hooks/useTextStyle";
import { useCrop } from "./EditingPlatform/components/ToolPanel/ToolTypes/AdjustToolPanel/hooks/useCrop";


function EditingPlatformInternal() {
  const dispatch = useAppDispatch();
  
 
  const imageState = useImageState();
  const toolsState = useToolsState();
  const filtersState = useFiltersState();
  const uiState = useUIState();
  const cropState = useCropState();
  const textState = useTextState();
  const frameState = useFrameState();
  const beautyState = useBeautyState();

  // REPLACE the old filter logic with this:
  const { processImage, hasFilterChanges } = useImageProcessor();

  // Refs
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null); // ✅ ADD THE MISSING containerRef

  // Custom hooks (maintaining existing functionality)
  const { performFlipBase } = useFlipImage({ imageRef });
  const { performRotateBase } = useRotateImage({ imageRef });
 const cropHook = useCrop(
  imageRef, 
  (preview) => dispatch(setImagePreview(preview)),
  containerRef
);
  const frameHook = useFrames({ imageRef, setImagePreview: (preview) => dispatch(setImagePreview(preview)) });
  const textHook = useTextEditor({ imageRef, setImagePreview: (preview) => dispatch(setImagePreview(preview)) });
  const styleHook = useTextStyles({ imageRef, setImagePreview: (preview) => dispatch(setImagePreview(preview)) });

  // Helper functions
  const updateFilterState = (category, values) => {
    dispatch(updateFilter({ category, values }));
  };

  const resetAllFilters = () => {
    dispatch(resetFilters());
  };

  // CROP CONTROL FUNCTIONS - Properly using setCropActive
  const activateCropMode = () => {
    dispatch(setCropActive(true));
    // Also update the crop settings if needed
    dispatch(setCropSettings({ isActive: true }));
  };

  const deactivateCropMode = () => {
    dispatch(setCropActive(false));
    dispatch(setCropSettings({ isActive: false }));
  };

  const toggleCrop = () => {
    const newActiveState = !cropState.cropSettings.isActive;
    dispatch(setCropActive(newActiveState));
    dispatch(setCropSettings({ isActive: newActiveState }));
  };

  const resetCropState = () => {
    dispatch(resetCrop());
  };

  useEffect(() => {
  const applyFiltersToImage = async () => {
    if (!imageRef.current || !imageState.currentBaseImage) return;

    try {
      console.log('Applying filters to current base image:', imageState.currentBaseImage.substring(0, 50));
      
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      const processedDataURL = await processImage(
        imageRef, 
        canvas, 
        ctx,
        imageState.currentBaseImage 
      );
      
      if (processedDataURL && imageRef.current) {
        console.log('Setting processed image as preview:', processedDataURL.substring(0, 50));
        imageRef.current.src = processedDataURL;
        dispatch(setImagePreview(processedDataURL));
      }
    } catch (error) {
      console.error("Failed to apply filters:", error);
    }
  };

  const timeoutId = setTimeout(applyFiltersToImage, 50);
  return () => clearTimeout(timeoutId);
}, [processImage, imageState.currentBaseImage, filtersState, dispatch]);


  // UNMODIFIED: Image operations - flip and rotate work correctly
  const performImageOperation = async (operation, ...args) => {
    try {
      const result = await operation(...args);
      if (result) {
        dispatch(setImagePreview(result));
        dispatch(setCurrentBaseImage(result));

        if (
          operation === performRotateBase ||
          operation === performFlipBase ||
          operation === cropHook.performCrop
        ) {
          resetAllFilters();
        }
      }
      return result;
    } catch (error) {
      console.error("Image operation failed:", error);
      return null;
    }
  };

  const performRotate = (direction) =>
    performImageOperation(performRotateBase, direction);
  const performFlip = (direction) =>
    performImageOperation(performFlipBase, direction);
const cropOperations = useCropOperations(
  imageRef,
  (preview) => dispatch(setImagePreview(preview))
);
 const performCrop = async (cropSettings, imageSource) => {
    try {
      console.log('=== CROP DEBUG: Starting crop operation ===');
      
      const sourceImage = imageSource || imageState.imagePreview || imageState.currentBaseImage;
      console.log('Using source image:', sourceImage?.substring(0, 50));
      
      const result = await cropHook.performCrop(
        cropSettings,
        sourceImage,
        (newBaseImage) => {
          console.log('=== CROP DEBUG: Updating currentBaseImage ===');
          dispatch(setCurrentBaseImage(newBaseImage));
        }
      );
      
      if (result) {
        dispatch(setCurrentBaseImage(result));
        await new Promise(resolve => setTimeout(resolve, 10));
        dispatch(setImagePreview(result));
        
        if (imageRef.current) {
          imageRef.current.src = result;
        }
        
        resetAllFilters();
        dispatch(setCropActive(false));
      }
      return result;
    } catch (error) {
      console.error("Crop operation failed:", error);
      dispatch(setCropActive(false));
      return null;
    }
  };

  const performApplyFrame = (frameStyle, frameColor, frameWidth) =>
    performImageOperation(
      frameHook.applyFrame,
      frameStyle,
      frameColor,
      frameWidth,
    );
  const performApplyFrameEffects = (shadow, spread, shadowColor) =>
    performImageOperation(
      frameHook.applyFrameEffects,
      shadow,
      spread,
      shadowColor,
    );

  const handleBeautyFeature = async (feature, settings) => {
    if (!imageRef.current) return;
    // Update beauty settings in Redux store would be handled by beauty slice
  };

  const initializeDefaults = () => {
    dispatch(resetBeautySettings());
    resetAllFilters();
    frameHook.setFrameSettings({
      style: "none",
      color: "#ffffff",
      width: 10,
      shadow: 0,
      spread: 0,
      shadowColor: "#000000",
    });
    textHook.clearAllText();
    resetCropState(); // Use the proper reset function
  };

  const resetToOriginal = () => {
    if (imageState.originalImage) {
      dispatch(setImagePreview(imageState.originalImage));
      dispatch(setCurrentBaseImage(imageState.originalImage));
      initializeDefaults();
      if (imageRef.current) imageRef.current.src = imageState.originalImage;
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Store only serializable file metadata instead of the File object
    const fileMetadata = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };
    
    dispatch(setUploadedImage(fileMetadata));
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      dispatch(setImagePreview(result));
      dispatch(setOriginalImage(result));
      dispatch(setCurrentBaseImage(result));
      initializeDefaults();
    };
    reader.readAsDataURL(file);
    dispatch(setActiveTool(toolNames.ADJUST));
  };

  const handleUploadClick = () => fileInputRef.current?.click();
  const downloadImage = () => {
    if (!imageState.imagePreview) return alert("Please upload an image first.");
    const link = document.createElement("a");
    link.download = "edited-image.jpg";
    link.href = imageState.imagePreview;
    link.click();
  };

  const loadDemoImage = (index) => {
    const demoImages = [
      "/path/to/demo-image-1.jpg",
      "/path/to/demo-image-2.jpg",
    ];
    const demoImageUrl = demoImages[index];
    dispatch(setImagePreview(demoImageUrl));
    dispatch(setOriginalImage(demoImageUrl));
    dispatch(setCurrentBaseImage(demoImageUrl));
    dispatch(setUploadedImage("demo-image"));
    initializeDefaults();
    dispatch(setActiveTool(toolNames.ADJUST));
  };

  // Effects
  useEffect(() => {
    if (
      textState.textElements.length > 0 &&
      imageRef.current &&
      toolsState.activeTool === toolNames.TEXT
    ) {
      textHook.applyTextToImage().then((result) => {
        if (result) dispatch(setImagePreview(result));
      });
    }
  }, [
    textState.textElements,
    textHook.applyTextToImage,
    toolsState.activeTool,
    toolNames.TEXT,
    dispatch,
  ]);

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      dispatch(setIsMobile(isMobile));
      dispatch(setSidebarOpen(window.innerWidth >= 768));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [dispatch]);

  // Filter setter helpers
  const createFilterSetter = (category) => (values) => {
    if (typeof values === "function") {
      // Handle function updates
      const currentCategoryState = filtersState[category];
      const newValues = values(currentCategoryState);
      updateFilterState(category, values);
    } else {
      updateFilterState(category, values);
    }
  };

  const toolPanelProps = {
    
    activeTool: toolsState.activeTool,
    activeAdjustTool: toolsState.activeTools.adjust,
    setActiveAdjustTool: (tool) =>
      dispatch(setActiveSubTool({ toolType: 'adjust', subTool: tool })),
    activeBeautyTool: toolsState.activeTools.beauty,
    setActiveBeautyTool: (tool) =>
      dispatch(setActiveSubTool({ toolType: 'beauty', subTool: tool })),
    activeFramesTool: toolsState.activeTools.frames,
    setActiveFramesTool: (tool) =>
      dispatch(setActiveSubTool({ toolType: 'frames', subTool: tool })),
    activeTextTool: toolsState.activeTools.text,
    setActiveTextTool: (tool) =>
      dispatch(setActiveSubTool({ toolType: 'text', subTool: tool })),
    isMobile: uiState.isMobile,
    setSidebarOpen: (open) => dispatch(setSidebarOpen(open)),
    imageRef,
    performFlip,
    performRotate,
    performCrop,
    applyBeautyFeature: handleBeautyFeature,
    beautySettings: beautyState.beautySettings,
    applyFrame: performApplyFrame,
    applyFrameEffects: performApplyFrameEffects,

    // CROP CONTROL PROPS - Now properly connected to Redux actions
    cropSettings: cropState.cropSettings,
    activateCropMode: () => dispatch(setCropActive(true)),
    deactivateCropMode: () => dispatch(setCropActive(false)),
    toggleCrop: () => dispatch(toggleCropMode()),
    resetCropState: () => dispatch(resetCrop()),
    isCropActive: cropState.cropSettings.isActive,
     basicAdjust: filtersState.basicAdjust,
    setBasicAdjust: createFilterSetter("basicAdjust"),
    colorAdjust: filtersState.colorAdjust,
    setColorAdjust: createFilterSetter("colorAdjust"),
    fineTuneAdjust: filtersState.fineTuneAdjust,
    setfineTuneAdjust: createFilterSetter("fineTuneAdjust"),
    structureAdjust: filtersState.structureAdjust,
    setStructureAdjust: createFilterSetter("structureAdjust"),
    denoiseAdjust: filtersState.denoiseAdjust,
    setDenoiseAdjust: createFilterSetter("denoiseAdjust"),
    vignetteAdjust: filtersState.vignetteAdjust,
    setVignetteAdjust: createFilterSetter("vignetteAdjust"),
    mosaicAdjust: filtersState.mosaicAdjust,
    setMosaicAdjust: createFilterSetter("mosaicAdjust"),
    blurAdjust: filtersState.blurAdjust,
    setBlurAdjust: createFilterSetter("blurAdjust"),

    setCropWithAspectRatio: cropOperations.setCropWithAspectRatio,
    cancelCrop: () => dispatch(setCropActive(false)),

   ...cropHook,
  ...cropOperations,
    ...frameHook,
    ...textHook,
    ...styleHook,
    performFlip,
    performRotate,
    performCrop,
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-dark-bg">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <Header
        isMobile={uiState.isMobile}
        sidebarOpen={uiState.sidebarOpen}
        setSidebarOpen={(open) => dispatch(setSidebarOpen(open))}
        handleUploadClick={handleUploadClick}
        downloadImage={downloadImage}
        resetToOriginal={resetToOriginal}
        imageRef={imageRef}
        filters={filtersState}
        currentBaseImage={imageState.currentBaseImage}
        imagePreview={imageState.imagePreview}
      />

      <div className="flex flex-1 overflow-hidden">
        {uiState.sidebarOpen && !uiState.isMobile && (
          <Sidebar
            activeTool={toolsState.activeTool}
            setActiveTool={(tool) => dispatch(setActiveTool(tool))}
            isMobile={uiState.isMobile}
            setSidebarOpen={(open) => dispatch(setSidebarOpen(open))}
          />
        )}

        {!uiState.isMobile && <ToolPanel {...toolPanelProps} />}

        <div className={`flex-1 ${uiState.isMobile ? "pb-20" : ""}`}>
          <ImageCanvas
            showSideAd={true}
            showBottomAd={true}
            handleUploadClick={handleUploadClick}
            imageRef={imageRef}
            containerRef={containerRef} // ✅ PASS THE containerRef TO ImageCanvas
            performCrop={performCrop}
            // Pass crop state and controls to ImageCanvas
              cropHook={cropHook}
            cropSettings={cropState.cropSettings}
            isCropActive={cropState.cropSettings.isActive}
            activateCropMode={activateCropMode}
            deactivateCropMode={deactivateCropMode}
          />
        </div>
      </div>

      {uiState.isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900  border-gray-700 z-30">
          <BottomToolbar
            activeTool={toolsState.activeTool}
            setActiveTool={(tool) => dispatch(setActiveTool(tool))}
            setSidebarOpen={(open) => dispatch(setSidebarOpen(open))}
            isMobile={uiState.isMobile}
            setIsBottomSheetOpen={(open) => dispatch(setIsBottomSheetOpen(open))}
          />

          {toolsState.activeTool && (
            <div className="max-h-48 overflow-y-auto bg-gray-800 border-gray-700">
              <ToolPanel {...toolPanelProps} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EditingPlatformInternal