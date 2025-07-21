'use client'
import { useState, useRef, useEffect } from 'react';
import Header from '../components/EditingPlatform/Header'
import Sidebar from '../components/EditingPlatform/Sidebar';
import ToolPanel from '../components/EditingPlatform/ToolPanel/ToolPanel';
import BottomToolbar from '../components/EditingPlatform/ToolPanel/BottomToolbar';
// import BottomSheet from '../components/EditingPlatform/ToolPanel/BottomSheet'
import ImageCanvas from '../components/EditingPlatform/ImageCanvas';
import { useFlipImage } from '../components/EditingPlatform/tools/useFlipImage';
import { useResizeImage } from '../components/EditingPlatform/tools/useResizeImage';
import { useRotateImage } from '../components/EditingPlatform/tools/useRotateImage';
import { useFrames } from '../components/EditingPlatform/tools/useFrames'; 
import { useTextEditor } from '../components/EditingPlatform/tools/useTextEditor';
import { useTextStyles } from '../components/EditingPlatform/tools/useTextStyle';
import { useCrop } from '../components/EditingPlatform/tools/useCrop';


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

  // State for active tool selection
  const [activeTool, setActiveTool] = useState(toolNames.ADJUST);
  const [activeAdjustTool, setActiveAdjustTool] = useState(null);
  const [activeBeautyTool, setActiveBeautyTool] = useState(null);
  const [activeFramesTool, setActiveFramesTool] = useState(null);
  const [activeTextTool, setActiveTextTool] = useState(null);
  
  // Bottom sheet state for mobile (no longer used with new navigation)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
  // State for image upload
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  
  const {
    isFlippedHorizontally,
    isFlippedVertically,
    performFlipBase
  } = useFlipImage({ imageRef });
  
  const { 
    rotationDegrees, 
    performRotateBase 
  } = useRotateImage({ imageRef });

 const { 
  performResizeBase,
   scale 
  } = useResizeImage({ imageRef });

  const {
    cropSettings,
    setCropSettings,
    performCrop: performCropBase,
    setCropWithAspectRatio,
    toggleCropMode,
    cancelCrop,
    updateCropPosition,
    updateCropDimensions,
    resetCrop
  } = useCrop(imageRef, setImagePreview);
  
  // Temporary beauty settings state (since useBeautyFilters is commented out)
  const [beautySettings, setBeautySettings] = useState({});
  
  // Temporary beauty filter function (since useBeautyFilters is commented out)
  const applyBeautyFilter = async (feature, settings) => {
    // This is a placeholder - implement actual beauty filter logic
    console.log('Applying beauty filter:', feature, settings);
    return null;
  };
  
  // Use the frames hook
  const {
    frameSettings,
    setFrameSettings,
    applyFrame: applyFrameBase,
    applyFrameEffects: applyFrameEffectsBase
  } = useFrames({ imageRef, setImagePreview });
  
  // Use the text editor hook
  const {
    textElements,
    textSettings,
    setTextSettings,
    addTextElement,
    removeTextElement,
    updateTextElement,
    applyTextToImage,
    clearAllText
  } = useTextEditor({ imageRef, setImagePreview });
  
  // Use the text styles hook
  const {
    styleSettings,
    setStyleSettings,
    applyTextStyle,
    toggleStyle,
    updateStyleSetting
  } = useTextStyles({ imageRef, setImagePreview });
  
 const performResize = async (direction) => {
  const resizedImageUrl = await performResizeBase(direction);
  if (resizedImageUrl) {
    setImagePreview(resizedImageUrl);

    if (imageRef.current) {
      imageRef.current.src = resizedImageUrl; 
    }
  }
};


  const performRotate = async (direction) => {
    const rotatedImageUrl = await performRotateBase(direction);
    if (rotatedImageUrl) {
      setImagePreview(rotatedImageUrl);
    }
  };
  
  const performFlip = async (direction) => {
    const flippedImageUrl = await performFlipBase(direction);
    if (flippedImageUrl) {
      setImagePreview(flippedImageUrl);
    }
  };
  
  // Crop wrapper function
  const performCrop = async () => {
    const croppedImageUrl = await performCropBase(cropSettings, imagePreview);
    if (croppedImageUrl) {
      setImagePreview(croppedImageUrl);
    }
  };
  
  // Frame wrapper functions
  const performApplyFrame = async (frameStyle, frameColor, frameWidth) => {
    const framedImageUrl = await applyFrameBase(frameStyle, frameColor, frameWidth);
    if (framedImageUrl) {
      setImagePreview(framedImageUrl);
    }
  };

  const performApplyFrameEffects = async (shadow, spread, shadowColor) => {
    const effectImageUrl = await applyFrameEffectsBase(shadow, spread, shadowColor);
    if (effectImageUrl) {
      setImagePreview(effectImageUrl);
    }
  };
  
  // Handle beauty filter application
  const handleBeautyFeature = async (feature, settings) => {
    console.log('Applying beauty feature:', feature, 'with settings:', settings);
    
    if (!imageRef.current) {
      console.error('No image reference available for beauty filters');
      return;
    }
    
    try {
      const filteredImageUrl = await applyBeautyFilter(feature, settings);
      if (filteredImageUrl) {
        console.log('Beauty filter applied successfully, updating image preview');
        
        if (imagePreview && imagePreview.startsWith('blob:')) {
          URL.revokeObjectURL(imagePreview);
        }
        
        setImagePreview(filteredImageUrl);
        
        setBeautySettings(prevSettings => ({
          ...prevSettings,
          [feature]: settings
        }));
        
        console.log('Image preview updated with beauty filter');
      } else {
        console.error('Failed to apply beauty filter - no URL returned');
      }
    } catch (error) {
      console.error('Error applying beauty filter:', error);
      alert('Failed to apply beauty filter. Please try again.');
    }
  };
  
  // Effect to update image with text when text elements change
  useEffect(() => {
    if (textElements.length > 0 && imageRef.current) {
      const applyText = async () => {
        const updatedImageUrl = await applyTextToImage();
        if (updatedImageUrl) {
          setImagePreview(updatedImageUrl);
        }
      };
      // Only apply text when in TEXT tool mode
      if (activeTool === toolNames.TEXT) {
        applyText();
      }
    }
  }, [textElements, applyTextToImage, activeTool, toolNames.TEXT]);
  
  // Reset image to original
  const resetToOriginal = () => {
    if (originalImage) {
      setImagePreview(originalImage);
      setBeautySettings({});
      setFrameSettings({
        style: 'none',
        color: '#ffffff',
        width: 10,
        shadow: 0,
        spread: 0,
        shadowColor: '#000000'
      });
      // Clear text elements
      clearAllText();
      // Reset crop settings
      resetCrop();
    }
  };
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      } 
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setImagePreview(result);
        setOriginalImage(result);
        setBeautySettings({});
        setFrameSettings({
          style: 'none',
          color: '#ffffff',
          width: 10,
          shadow: 0,
          spread: 0,
          shadowColor: '#000000'
        });
        // Clear text elements
        clearAllText();
        // Reset crop settings
        resetCrop();
      };
      reader.readAsDataURL(file);
      setActiveTool(toolNames.ADJUST);
    }
  };
  
  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  // Download the image
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
  
  const demoImages = [
    '/path/to/demo-image-1.jpg',
    '/path/to/demo-image-2.jpg'
  ];
  
  // Load demo image
  const loadDemoImage = (index) => {
    const demoImageUrl = demoImages[index];
    setImagePreview(demoImageUrl);
    setOriginalImage(demoImageUrl);
    setUploadedImage("demo-image");
    setBeautySettings({});
    setFrameSettings({
      style: 'none',
      color: '#ffffff',
      width: 10,
      shadow: 0,
      spread: 0,
      shadowColor: '#000000'
    });
    clearAllText();
    resetCrop();
    setActiveTool(toolNames.ADJUST);
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
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleUploadClick={handleUploadClick}
        downloadImage={downloadImage}
        resetToOriginal={resetToOriginal}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Show sidebar only on desktop and when it's open */}
        {sidebarOpen && !isMobile && (
          <Sidebar 
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            isMobile={isMobile}
            setSidebarOpen={setSidebarOpen}
          />
        )}
        
        {/* Only show the tool panel on desktop */}
        {!isMobile && (
          <ToolPanel 
          
            activeTool={activeTool}
            activeAdjustTool={activeAdjustTool}
            setActiveAdjustTool={setActiveAdjustTool}
            activeBeautyTool={activeBeautyTool}
            setActiveBeautyTool={setActiveBeautyTool}
            activeFramesTool={activeFramesTool}
            setActiveFramesTool={setActiveFramesTool}
            activeTextTool={activeTextTool}
            setActiveTextTool={setActiveTextTool}
            isMobile={isMobile}
            setSidebarOpen={setSidebarOpen}
            imageRef={imageRef}
            performFlip={performFlip}
            performRotate={performRotate}
            performResize={performResize}
            // Crop functionality props
           cropSettings={cropSettings}
          imagePreview={imagePreview}
          setCropSettings={setCropSettings}
          performCrop={() => performCrop(cropSettings, imagePreview)}
          setCropWithAspectRatio={setCropWithAspectRatio}
          toggleCropMode={toggleCropMode}
          cancelCrop={cancelCrop}
          updateCropPosition={updateCropPosition}
          updateCropDimensions={updateCropDimensions}
          resetCrop={resetCrop}
            // Other existing props
            applyBeautyFeature={handleBeautyFeature}
            beautySettings={beautySettings}
            frameSettings={frameSettings}
            setFrameSettings={setFrameSettings}
            applyFrame={performApplyFrame}
            applyFrameEffects={performApplyFrameEffects}
            textElements={textElements}
            textSettings={textSettings}
            setTextSettings={setTextSettings}
            addTextElement={addTextElement}
            removeTextElement={removeTextElement}
            updateTextElement={updateTextElement}
            applyTextToImage={applyTextToImage}
            clearAllText={clearAllText}
            styleSettings={styleSettings}
            setStyleSettings={setStyleSettings}
            applyTextStyle={applyTextStyle}
            toggleStyle={toggleStyle}
            updateStyleSetting={updateStyleSetting}
              
          />
        )}
        
        <div className={`flex-1 ${isMobile ? 'pb-20' : ''}`}>
          
  <ImageCanvas  showSideAd={true} showBottomAd={false} 
  imagePreview={imagePreview}
  handleUploadClick={handleUploadClick}
  imageRef={imageRef}
  activeTool={activeTool}
  activeAdjustTool={activeAdjustTool}
  setImagePreview={setImagePreview}
  textElements={textElements}
  cropSettings={cropSettings}
  updateTextElement={updateTextElement}
  updateCropPosition={updateCropPosition}  
  updateCropDimensions={updateCropDimensions}
  performCrop={performCrop} 

/>
        </div>
      </div>
      
      {/* Mobile Layout - Navigation + Tool Panel */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-30">
          {/* Bottom Navigation Toolbar */}
          <BottomToolbar 
            activeTool={activeTool} 
            setActiveTool={setActiveTool}
            setSidebarOpen={setSidebarOpen} 
            isMobile={isMobile}
            setIsBottomSheetOpen={setIsBottomSheetOpen} 
          />
          
          {/* Inline Tool Panel for Active Tool */}
          {activeTool && (
            <div className="max-h-48 overflow-y-auto bg-gray-800 border-t border-gray-700">
              <ToolPanel 
                activeTool={activeTool}
                activeAdjustTool={activeAdjustTool}
                setActiveAdjustTool={setActiveAdjustTool}
                activeBeautyTool={activeBeautyTool}
                setActiveBeautyTool={setActiveBeautyTool}
                activeFramesTool={activeFramesTool}
                setActiveFramesTool={setActiveFramesTool}
                activeTextTool={activeTextTool}
                setActiveTextTool={setActiveTextTool}
                isMobile={isMobile}
                setSidebarOpen={setSidebarOpen}
                imageRef={imageRef}
                performFlip={performFlip}
                performRotate={performRotate}
                performResize={performResize}
                // Crop functionality props for mobile
                cropSettings={cropSettings}
                setCropSettings={setCropSettings}
                performCrop={() => performCrop(cropSettings, imagePreview)}
                setCropWithAspectRatio={setCropWithAspectRatio}
                toggleCropMode={toggleCropMode}
                cancelCrop={cancelCrop}
                updateCropPosition={updateCropPosition}
                updateCropDimensions={updateCropDimensions}
                resetCrop={resetCrop}
                // Other existing props
                applyBeautyFeature={handleBeautyFeature}
                beautySettings={beautySettings}
                frameSettings={frameSettings}
                setFrameSettings={setFrameSettings}
                applyFrame={performApplyFrame}
                applyFrameEffects={performApplyFrameEffects}
                textElements={textElements}
                textSettings={textSettings}
                setTextSettings={setTextSettings}
                addTextElement={addTextElement}
                removeTextElement={removeTextElement}
                updateTextElement={updateTextElement}
                applyTextToImage={applyTextToImage}
                clearAllText={clearAllText}
                styleSettings={styleSettings}
                setStyleSettings={setStyleSettings}
                applyTextStyle={applyTextStyle}
                toggleStyle={toggleStyle}
                updateStyleSetting={updateStyleSetting}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}