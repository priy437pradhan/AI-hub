'use client'
import { useState, useRef, useEffect, useMemo } from 'react';
import { applyAllFiltersToCanvas } from '../components/EditingPlatform/components/ToolPanel/utils/imageFilters';

import Header from '../components/EditingPlatform/components/Header'
import Sidebar from '../components/EditingPlatform/components/Sidebar';
import ToolPanel from '../components/EditingPlatform/components/ToolPanel/ToolPanel';
import BottomToolbar from '../components/EditingPlatform/components/ToolPanel/BottomToolbar';
import ImageCanvas from '../components/EditingPlatform/components/ImageCanvas/ImageCanvas';
import { useFlipImage } from '../components/EditingPlatform/components/ToolPanel/ToolTypes/AdjustToolPanel/hooks/useFlipImage';
import { useRotateImage } from '../components/EditingPlatform/components/ToolPanel/ToolTypes/AdjustToolPanel/hooks/useRotateImage';
import { useFrames } from '../components/EditingPlatform/components/ToolPanel/hooks/useFrames'; 
import { useTextEditor } from '../components/EditingPlatform/components/ToolPanel/hooks/useTextEditor';
import { useTextStyles } from '../components/EditingPlatform/components/ToolPanel/hooks/useTextStyle';
import { useCrop } from '../components/EditingPlatform/components/ToolPanel/ToolTypes/AdjustToolPanel/hooks/useCrop';

export default function EditingPlatform() {
  // Tool constants
  const toolNames = {
    ADJUST: 'adjust', 
    AI: 'ai', 
    EFFECTS: 'effects', 
    BEAUTY: 'beauty',
    FRAMES: 'frames', 
    TEXT: 'text', 
    ELEMENTS: 'elements'
  };

  // Core state management
  const [activeTool, setActiveTool] = useState(toolNames.ADJUST);
  const [activeTools, setActiveTools] = useState({
    adjust: null, 
    beauty: null, 
    frames: null, 
    text: null
  });
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [beautySettings, setBeautySettings] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Undo/Redo state management
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Filter states - Single source of truth - Initialize all at once
  const [basicAdjust, setBasicAdjust] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
  });

  const [colorAdjust, setColorAdjust] = useState({
    temperature: 0,
    tint: 0,
    invertcolors: 0,
  });

  const [fineTuneAdjust, setfineTuneAdjust] = useState({
    exposure: 0,
    highlights: 0,
    shadows: 0,
  });

  const [structureAdjust, setStructureAdjust] = useState({
    details: 0,
    gradient: 0,
  });

  const [denoiseAdjust, setDenoiseAdjust] = useState({
    colornoise: 0,
    luminancenoise: 0,
  });
const [vignetteAdjust, setVignetteAdjust] = useState({
  intensity: 0,
  size: 50,
  feather: 50,
});
const [mosaicAdjust, setMosaicAdjust] = useState({
  type: 'square',
  size: 0,
  pixelSize: 1,
});
const [blurAdjust, setBlurAdjust] = useState({
  type: 'circular', // 'circular' or 'linear'
  intensity: 0,
   preview: false,
  applied: false
});
  // Refs
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  
  // Custom hooks
  const { performFlipBase } = useFlipImage({ imageRef });
  const { performRotateBase } = useRotateImage({ imageRef });
  const cropHook = useCrop(imageRef, setImagePreview);
  const frameHook = useFrames({ imageRef, setImagePreview });
  const textHook = useTextEditor({ imageRef, setImagePreview });
  const styleHook = useTextStyles({ imageRef, setImagePreview });
  
  // Undo/Redo functionality
  const saveToHistory = (imageData, filterState) => {
    const newHistoryItem = {
      imageData,
      filterState: {
        basicAdjust: { ...filterState.basicAdjust },
        colorAdjust: { ...filterState.colorAdjust },
        fineTuneAdjust: { ...filterState.fineTuneAdjust },
        structureAdjust: { ...filterState.structureAdjust },
        denoiseAdjust: { ...filterState.denoiseAdjust },
        vignetteAdjust: { ...filterState.vignetteAdjust },
        mosaicAdjust: { ...filterState.mosaicAdjust}
      },
      timestamp: Date.now()
    };

    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newHistoryItem);
    
    // Limit history to 50 items to prevent memory issues
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }
    
    setHistory(newHistory);
  };

  const performUndo = () => {
    if (historyIndex > 0) {
      const previousIndex = historyIndex - 1;
      const previousState = history[previousIndex];
      
      // Restore image and filter states
      setImagePreview(previousState.imageData);
      setBasicAdjust(previousState.filterState.basicAdjust);
      setColorAdjust(previousState.filterState.colorAdjust);
      setfineTuneAdjust(previousState.filterState.fineTuneAdjust);
      setStructureAdjust(previousState.filterState.structureAdjust);
      setDenoiseAdjust(previousState.filterState.denoiseAdjust);
      setVignetteAdjust(previousState.filterState.vignetteAdjust);
      setMosaicAdjust(previousState.filterState.setMosaicAdjust);
      
      setHistoryIndex(previousIndex);
    }
  };

  const performRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextState = history[nextIndex];
      
      // Restore image and filter states
      setImagePreview(nextState.imageData);
      setBasicAdjust(nextState.filterState.basicAdjust);
      setColorAdjust(nextState.filterState.colorAdjust);
      setfineTuneAdjust(nextState.filterState.fineTuneAdjust);
      setStructureAdjust(nextState.filterState.structureAdjust);
      setDenoiseAdjust(nextState.filterState.denoiseAdjust);
            setVignetteAdjust(nextState.filterState.vignetteAdjust);
      setMosaicAdjust(nextState.filterState.setMosaicAdjust);
      setHistoryIndex(nextIndex);
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  
  // Memoize the filter values to ensure stable references
  const filterValues = useMemo(() => ({
    basicAdjust,
    colorAdjust,
    fineTuneAdjust,
    structureAdjust,
    denoiseAdjust,
    vignetteAdjust,
    mosaicAdjust,
    blurAdjust  
  }), [basicAdjust, colorAdjust, fineTuneAdjust, structureAdjust, denoiseAdjust,vignetteAdjust, mosaicAdjust ,blurAdjust ]);

  // Centralized filter application effect
  useEffect(() => {
    const applyFiltersToImage = async () => {
      if (!imageRef.current) return;

      // Store original image source if not already stored
      if (!imageRef.current.getAttribute('data-original-src')) {
        imageRef.current.setAttribute('data-original-src', imageRef.current.src);
      }

      // Check if any filters are applied using the memoized values
      const hasChanges = Object.values({
        ...filterValues.basicAdjust, 
        ...filterValues.colorAdjust, 
        ...filterValues.fineTuneAdjust,
        ...filterValues.structureAdjust,
        ...filterValues.denoiseAdjust,
        ...filterValues.vignetteAdjust,
        ...filterValues.mosaicAdjust,
        ...filterValues.blurAdjust
      }).some(value => value !== 0);

      if (!hasChanges) {
        // Reset to original if no filters
        const originalSrc = imageRef.current.getAttribute('data-original-src');
        if (originalSrc && imageRef.current.src !== originalSrc) {
          imageRef.current.src = originalSrc;
        }
        return;
      }

      // Apply filters to create new image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const originalImg = new Image();
      originalImg.crossOrigin = "anonymous";
      
      originalImg.onload = () => {
        try {
          const processedDataURL = applyAllFiltersToCanvas(
            canvas, 
            ctx, 
            originalImg, 
            filterValues.basicAdjust, 
            filterValues.colorAdjust, 
            filterValues.fineTuneAdjust,
            filterValues.structureAdjust,
            filterValues.denoiseAdjust,
            filterValues.vignetteAdjust,
            filterValues.mosaicAdjust,
            filterValues.blurAdjust
          );
          
          // Update the image with processed version
          if (imageRef.current && imageRef.current.src !== processedDataURL) {
            imageRef.current.src = processedDataURL;
            setImagePreview(processedDataURL);
          }
        } catch (error) {
          console.error('Failed to apply filters:', error);
        }
      };

      originalImg.onerror = () => {
        console.error('Failed to load original image for filter application');
      };

      originalImg.src = imageRef.current.getAttribute('data-original-src');
    };

    applyFiltersToImage();
  }, [filterValues]); // Use the memoized object as dependency

  // Save to history when filters change (debounced)
  useEffect(() => {
    if (imagePreview && imageRef.current) {
      const currentFilterState = {
        basicAdjust,
        colorAdjust,
        fineTuneAdjust,
        structureAdjust,
        denoiseAdjust,
        vignetteAdjust,
        mosaicAdjust
      };
      
      // Only save if there are actual changes
      const hasChanges = Object.values({
        ...basicAdjust,
        ...colorAdjust,
        ...fineTuneAdjust,
        ...structureAdjust,
        ...denoiseAdjust,
        ...vignetteAdjust,
        ...mosaicAdjust
      }).some(value => value !== 0);
      
      if (hasChanges) {
        // Debounce the history saving to avoid too many entries
        const timeoutId = setTimeout(() => {
          saveToHistory(imagePreview, currentFilterState);
        }, 1000); // Save after 1 second of no changes
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [imagePreview, basicAdjust, colorAdjust, fineTuneAdjust, structureAdjust, denoiseAdjust, vignetteAdjust, mosaicAdjust,historyIndex]);

  // Image operation wrapper
  const performImageOperation = async (operation, ...args) => {
    try {
      const result = await operation(...args);
      if (result) setImagePreview(result);
      return result;
    } catch (error) {
      console.error('Image operation failed:', error);
      return null;
    }
  };

  // Image transformation functions
  const performRotate = (direction) => performImageOperation(performRotateBase, direction);
  const performFlip = (direction) => performImageOperation(performFlipBase, direction);
  const performCrop = () => performImageOperation(cropHook.performCrop, cropHook.cropSettings, imagePreview);
  const performApplyFrame = (frameStyle, frameColor, frameWidth) => 
    performImageOperation(frameHook.applyFrame, frameStyle, frameColor, frameWidth);
  const performApplyFrameEffects = (shadow, spread, shadowColor) => 
    performImageOperation(frameHook.applyFrameEffects, shadow, spread, shadowColor);
  
  // Beauty filter handler
  const handleBeautyFeature = async (feature, settings) => {
    if (!imageRef.current) return;
    console.log('Applying beauty filter:', feature, settings);
    setBeautySettings(prev => ({ ...prev, [feature]: settings }));
  };
  
  const initializeDefaults = () => {
    setBeautySettings({});
    
    // Reset all filter states
    setBasicAdjust({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpness: 0,
    });
    
    setColorAdjust({
      temperature: 0,
      tint: 0,
      invertcolors: 0,
    });
    
    setfineTuneAdjust({
      exposure: 0,
      highlights: 0,
      shadows: 0,
    });
    
    setStructureAdjust({
      details: 0,
      gradient: 0,
    });
    
    setDenoiseAdjust({
      colornoise: 0,
      luminancenoise: 0,
    });
      setVignetteAdjust({
    intensity: 0,
    size: 50,
    feather: 50,
  });
   setMosaicAdjust({
      type: 'square', 
      size: 0, 
      pixelSize: 1,
    });
    // Reset history
    setHistory([]);
    setHistoryIndex(-1);
    
    // Reset other tools
    frameHook.setFrameSettings({
      style: 'none', 
      color: '#ffffff', 
      width: 10,
      shadow: 0, 
      spread: 0, 
      shadowColor: '#000000'
    });
    
    textHook.clearAllText();
    cropHook.resetCrop();
  };

  // Reset to original image
  const resetToOriginal = () => {
    if (originalImage) {
      setImagePreview(originalImage);
      initializeDefaults();
      
      // Reset image ref to original
      if (imageRef.current) {
        imageRef.current.src = originalImage;
        imageRef.current.setAttribute('data-original-src', originalImage);
      }
    }
  };
  
  // File handling
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setImagePreview(result);
      setOriginalImage(result);
      
      // Initialize history with original image
      const initialState = {
        basicAdjust: { brightness: 0, contrast: 0, saturation: 0, sharpness: 0 },
        colorAdjust: { temperature: 0, tint: 0, invertcolors: 0 },
        fineTuneAdjust: { exposure: 0, highlights: 0, shadows: 0 },
        structureAdjust: { details: 0, gradient: 0 },
        denoiseAdjust: { colornoise: 0, luminancenoise: 0 },
        vignetteAdjust:{intensity: 0,
      size: 50, 
      feather: 50,}
      };
       setMosaicAdjust({
      type: 'square', 
      size: 0, 
      pixelSize: 1,
    });
      
      setHistory([{
        imageData: result,
        filterState: initialState,
        timestamp: Date.now()
      }]);
      setHistoryIndex(0);
      
      initializeDefaults();
    };
    reader.readAsDataURL(file);
    setActiveTool(toolNames.ADJUST);
  };
  
  const handleUploadClick = () => fileInputRef.current?.click();
  
  const downloadImage = () => {
    if (!imagePreview) {
      alert("Please upload an image first.");
      return;
    }
    const link = document.createElement('a');
    link.download = 'edited-image.jpg';
    link.href = imagePreview;
    link.click();
  };
  
  // Demo images loader
  const loadDemoImage = (index) => {
    const demoImages = ['/path/to/demo-image-1.jpg', '/path/to/demo-image-2.jpg'];
    const demoImageUrl = demoImages[index];
    setImagePreview(demoImageUrl);
    setOriginalImage(demoImageUrl);
    setUploadedImage("demo-image");
    
    // Initialize history with demo image
    const initialState = {
      basicAdjust: { brightness: 0, contrast: 0, saturation: 0, sharpness: 0 },
      colorAdjust: { temperature: 0, tint: 0, invertcolors: 0 },
      fineTuneAdjust: { exposure: 0, highlights: 0, shadows: 0 },
      structureAdjust: { details: 0, gradient: 0 },
      denoiseAdjust: { colornoise: 0, luminancenoise: 0 },
          vignetteAdjust:{intensity: 0,
      size: 50, 
      feather: 50,},
        mosaicAdjust:{ type: 'square', 
      size: 0, 
      pixelSize: 1,}
    };
  
    
    setHistory([{
      imageData: demoImageUrl,
      filterState: initialState,
      timestamp: Date.now()
    }]);
    setHistoryIndex(0);
    
    initializeDefaults();
    setActiveTool(toolNames.ADJUST);
  };
  
  // Text editor effect
  useEffect(() => {
    if (textHook.textElements.length > 0 && imageRef.current && activeTool === toolNames.TEXT) {
      textHook.applyTextToImage().then(result => {
        if (result) setImagePreview(result);
      });
    }
  }, [textHook.textElements, textHook.applyTextToImage, activeTool, toolNames.TEXT]);
  
  // Mobile/desktop detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Consolidated tool panel props
  const toolPanelProps = {
    // Tool states
    activeTool, 
    activeAdjustTool: activeTools.adjust, 
    setActiveAdjustTool: (tool) => setActiveTools(prev => ({...prev, adjust: tool})),
    activeBeautyTool: activeTools.beauty, 
    setActiveBeautyTool: (tool) => setActiveTools(prev => ({...prev, beauty: tool})),
    activeFramesTool: activeTools.frames, 
    setActiveFramesTool: (tool) => setActiveTools(prev => ({...prev, frames: tool})),
    activeTextTool: activeTools.text, 
    setActiveTextTool: (tool) => setActiveTools(prev => ({...prev, text: tool})),
    
    // UI states
    isMobile, 
    setSidebarOpen, 
    imageRef,
    
    // Undo/Redo functionality
    canUndo,
    canRedo,
    performUndo,
    performRedo,
    
    // Image operations
    performFlip, 
    performRotate, 
    performCrop,
    applyBeautyFeature: handleBeautyFeature, 
    beautySettings,
    applyFrame: performApplyFrame, 
    applyFrameEffects: performApplyFrameEffects,
    
    // Filter states
    basicAdjust, 
    setBasicAdjust,
    colorAdjust, 
    setColorAdjust,
    fineTuneAdjust, 
    setfineTuneAdjust,
    structureAdjust,
    setStructureAdjust,
    denoiseAdjust,
    setDenoiseAdjust,
    vignetteAdjust,
  setVignetteAdjust,
  mosaicAdjust,
  setMosaicAdjust,
  blurAdjust,
  setBlurAdjust,
  
    // Hook props spread
    ...cropHook, 
    ...frameHook, 
    ...textHook, 
    ...styleHook
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-dark-bg">
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      {/* Header */}
      <Header 
        isMobile={isMobile} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        handleUploadClick={handleUploadClick} 
        downloadImage={downloadImage}
        resetToOriginal={resetToOriginal}
        imageRef={imageRef}
        basicAdjust={basicAdjust}
        colorAdjust={colorAdjust}
        fineTuneAdjust={fineTuneAdjust}
        structureAdjust={structureAdjust}
        denoiseAdjust={denoiseAdjust}
        vignetteAdjust ={vignetteAdjust}
         mosaicAdjust ={mosaicAdjust}
      />
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop only */}
        {sidebarOpen && !isMobile && (
          <Sidebar 
            activeTool={activeTool} 
            setActiveTool={setActiveTool}
            isMobile={isMobile} 
            setSidebarOpen={setSidebarOpen}
          />
        )}
        
        {/* Tool Panel - Desktop only */}
        {!isMobile && <ToolPanel {...toolPanelProps} />}
        
        {/* Image Canvas */}
        <div className={`flex-1 ${isMobile ? 'pb-20' : ''}`}>
          <ImageCanvas  
            showSideAd={true} 
            showBottomAd={true} 
            imagePreview={imagePreview}
            handleUploadClick={handleUploadClick} 
            imageRef={imageRef}
            activeTool={activeTool} 
            activeAdjustTool={activeTools.adjust}
            setImagePreview={setImagePreview} 
            textElements={textHook.textElements}
            cropSettings={cropHook.cropSettings} 
            updateTextElement={textHook.updateTextElement}
            updateCropPosition={cropHook.updateCropPosition} 
            updateCropDimensions={cropHook.updateCropDimensions}
            performCrop={performCrop}
          />
        </div>
      </div>
      
      {/* Mobile bottom toolbar and tool panel */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-30">
          <BottomToolbar 
            activeTool={activeTool} 
            setActiveTool={setActiveTool}
            setSidebarOpen={setSidebarOpen} 
            isMobile={isMobile}
            setIsBottomSheetOpen={setIsBottomSheetOpen} 
          />
          
          {activeTool && (
            <div className="max-h-48 overflow-y-auto bg-gray-800 border-t border-gray-700">
              <ToolPanel {...toolPanelProps} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}