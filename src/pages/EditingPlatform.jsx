// Complete EditingPlatform component update
'use client'
import { useState, useRef, useEffect } from 'react';

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
    ADJUST: 'adjust', AI: 'ai', EFFECTS: 'effects', BEAUTY: 'beauty',
    FRAMES: 'frames', TEXT: 'text', ELEMENTS: 'elements'
  };

  // State management
  const [activeTool, setActiveTool] = useState(toolNames.ADJUST);
  const [activeTools, setActiveTools] = useState({
    adjust: null, beauty: null, frames: null, text: null
  });
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [beautySettings, setBeautySettings] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // ✅ ADD Filter state variables
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

  const [finetuneAdjust, setFinetuneAdjust] = useState({
    exposure: 0,
    highlights: 0,
    shadows: 0,
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
  
  // Consolidated image operations with auto-preview update
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

  // Image operation handlers
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
  
  // Utility functions
  const initializeDefaults = () => {
    setBeautySettings({});
    // ✅ Reset filter states
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
    setFinetuneAdjust({
      exposure: 0,
      highlights: 0,
      shadows: 0,
    });
    frameHook.setFrameSettings({
      style: 'none', color: '#ffffff', width: 10,
      shadow: 0, spread: 0, shadowColor: '#000000'
    });
    textHook.clearAllText();
    cropHook.resetCrop();
  };

  const resetToOriginal = () => {
    if (originalImage) {
      setImagePreview(originalImage);
      initializeDefaults();
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
      initializeDefaults();
    };
    reader.readAsDataURL(file);
    setActiveTool(toolNames.ADJUST);
  };
  
  const handleUploadClick = () => fileInputRef.current.click();
  
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
  
  // Demo images
  const loadDemoImage = (index) => {
    const demoImages = ['/path/to/demo-image-1.jpg', '/path/to/demo-image-2.jpg'];
    const demoImageUrl = demoImages[index];
    setImagePreview(demoImageUrl);
    setOriginalImage(demoImageUrl);
    setUploadedImage("demo-image");
    initializeDefaults();
    setActiveTool(toolNames.ADJUST);
  };
  
  // Effects
  useEffect(() => {
    if (textHook.textElements.length > 0 && imageRef.current && activeTool === toolNames.TEXT) {
      textHook.applyTextToImage().then(result => {
        if (result) setImagePreview(result);
      });
    }
  }, [textHook.textElements, textHook.applyTextToImage, activeTool, toolNames.TEXT]);
  
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
    activeTool, 
    activeAdjustTool: activeTools.adjust, setActiveAdjustTool: (tool) => setActiveTools(prev => ({...prev, adjust: tool})),
    activeBeautyTool: activeTools.beauty, setActiveBeautyTool: (tool) => setActiveTools(prev => ({...prev, beauty: tool})),
    activeFramesTool: activeTools.frames, setActiveFramesTool: (tool) => setActiveTools(prev => ({...prev, frames: tool})),
    activeTextTool: activeTools.text, setActiveTextTool: (tool) => setActiveTools(prev => ({...prev, text: tool})),
    isMobile, setSidebarOpen, imageRef,
    performFlip, performRotate, performCrop,
    applyBeautyFeature: handleBeautyFeature, beautySettings,
    applyFrame: performApplyFrame, applyFrameEffects: performApplyFrameEffects,
    // ✅ ADD filter state props
    basicAdjust, setBasicAdjust,
    colorAdjust, setColorAdjust,
    finetuneAdjust, setFinetuneAdjust,
    ...cropHook, ...frameHook, ...textHook, ...styleHook
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-dark-bg">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} 
             accept="image/*" className="hidden" />
      
      <Header 
        isMobile={isMobile} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
        handleUploadClick={handleUploadClick} downloadImage={downloadImage}
        resetToOriginal={resetToOriginal}
        // ✅ ADD filter state props to Header
        imageRef={imageRef}
        basicAdjust={basicAdjust}
        colorAdjust={colorAdjust}
        finetuneAdjust={finetuneAdjust}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && !isMobile && (
          <Sidebar 
            activeTool={activeTool} setActiveTool={setActiveTool}
            isMobile={isMobile} setSidebarOpen={setSidebarOpen}
          />
        )}
        
        {!isMobile && <ToolPanel {...toolPanelProps} />}
        
        <div className={`flex-1 ${isMobile ? 'pb-20' : ''}`}>
          <ImageCanvas  
            showSideAd={true} showBottomAd={true} imagePreview={imagePreview}
            handleUploadClick={handleUploadClick} imageRef={imageRef}
            activeTool={activeTool} activeAdjustTool={activeTools.adjust}
            setImagePreview={setImagePreview} textElements={textHook.textElements}
            cropSettings={cropHook.cropSettings} 
            updateTextElement={textHook.updateTextElement}
            updateCropPosition={cropHook.updateCropPosition} 
            updateCropDimensions={cropHook.updateCropDimensions}
            performCrop={performCrop}
          />
        </div>
      </div>
      
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-30">
          <BottomToolbar 
            activeTool={activeTool} setActiveTool={setActiveTool}
            setSidebarOpen={setSidebarOpen} isMobile={isMobile}
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