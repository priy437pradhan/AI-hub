'use client'
import { useState, useRef, useEffect } from 'react';
import Header from '../components/EditingPlatform/Header'
import Sidebar from '../components/EditingPlatform/Sidebar';
import ToolPanel from '../components/EditingPlatform/ToolPanel/ToolPanel';
import BottomToolbar from '../components/EditingPlatform/ToolPanel/BottomToolbar';
import BottomSheet from '../components/EditingPlatform/ToolPanel/BottomSheet'
import ImageCanvas from '../components/EditingPlatform/ImageCanvas';
import { useFlipImage } from '../components/EditingPlatform/tools/useFlipImage';
import { useRotateImage } from '../components/EditingPlatform/tools/useRotateImage';
import { useBeautyFilters } from '../components/EditingPlatform/tools/useBeautyFilter';
import { useFrames } from '../components/EditingPlatform/tools/useFrames'; // Add this import

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
  const [activeFramesTool, setActiveFramesTool] = useState(null); // Add this state
  
  // Bottom sheet state for mobile
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
  // State for image upload
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  
  // Use the flip image hook
  const {
    isFlippedHorizontally,
    isFlippedVertically,
    performFlipBase
  } = useFlipImage({ imageRef });
  
  // Use the rotate image hook
  const { 
    rotationDegrees, 
    performRotateBase 
  } = useRotateImage({ imageRef });
  
  // Use the beauty filters hook
  const {
    beautySettings,
    setBeautySettings,
    applyBeautyFilter
  } = useBeautyFilters({ 
    imageRef, 
    setImagePreview 
  });
  
  // Use the frames hook - ADD THIS
  const {
    frameSettings,
    setFrameSettings,
    applyFrame: applyFrameBase,
    applyFrameEffects: applyFrameEffectsBase
  } = useFrames({ imageRef, setImagePreview });
  
  // Wrapper functions for the image transformations
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
  
  // Frame wrapper functions - ADD THESE
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
  
  // Beauty filter handler
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
  
  // Reset image to original
  const resetToOriginal = () => {
    if (originalImage) {
      setImagePreview(originalImage);
      setBeautySettings({});
      setFrameSettings({ // Add this to reset frame settings
        style: 'none',
        color: '#ffffff',
        width: 10,
        shadow: 0,
        spread: 0,
        shadowColor: '#000000'
      });
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
        setFrameSettings({ // Reset frame settings on new image
          style: 'none',
          color: '#ffffff',
          width: 10,
          shadow: 0,
          spread: 0,
          shadowColor: '#000000'
        });
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
    setFrameSettings({ // Reset frame settings
      style: 'none',
      color: '#ffffff',
      width: 10,
      shadow: 0,
      spread: 0,
      shadowColor: '#000000'
    });
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
        {sidebarOpen && !isMobile && (
          <Sidebar 
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            isMobile={isMobile}
            setSidebarOpen={setSidebarOpen}
          />
        )}
        
        {(!isMobile || (isMobile && activeTool !== toolNames.ADJUST)) && (
          <ToolPanel 
            activeTool={activeTool}
            activeAdjustTool={activeAdjustTool}
            setActiveAdjustTool={setActiveAdjustTool}
            activeBeautyTool={activeBeautyTool}
            setActiveBeautyTool={setActiveBeautyTool}
            activeFramesTool={activeFramesTool} // Add this
            setActiveFramesTool={setActiveFramesTool} // Add this
            isMobile={isMobile}
            setSidebarOpen={setSidebarOpen}
            imageRef={imageRef}
            performFlip={performFlip}
            performRotate={performRotate}
            applyBeautyFeature={handleBeautyFeature}
            beautySettings={beautySettings}
            frameSettings={frameSettings} // Add this
            setFrameSettings={setFrameSettings} // Add this
            applyFrame={performApplyFrame} // Add this
            applyFrameEffects={performApplyFrameEffects} // Add this
          />
        )}
        
        <div className={`flex-1 ${isMobile ? 'pb-16' : ''}`}>
          <ImageCanvas 
            imagePreview={imagePreview}
            handleUploadClick={handleUploadClick}
            imageRef={imageRef}
            activeTool={activeTool}
            activeAdjustTool={activeAdjustTool}
            loadDemoImage={loadDemoImage}
            setImagePreview={setImagePreview}
          />
        </div>
      </div>
      
      {isMobile && (
        <>
          <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-900 border-t border-gray-800 z-30">
            <BottomToolbar 
              activeTool={activeTool} 
              setActiveTool={setActiveTool}
              setSidebarOpen={setSidebarOpen} 
              isMobile={isMobile}
              setIsBottomSheetOpen={setIsBottomSheetOpen} 
            />
          </div>
          
          <BottomSheet 
            isOpen={isBottomSheetOpen} 
            onClose={() => setIsBottomSheetOpen(false)}
          >
            <ToolPanel 
              activeTool={activeTool}
              activeAdjustTool={activeAdjustTool}
              setActiveAdjustTool={setActiveAdjustTool}
              activeBeautyTool={activeBeautyTool}
              setActiveBeautyTool={setActiveBeautyTool}
              activeFramesTool={activeFramesTool} // Add this
              setActiveFramesTool={setActiveFramesTool} // Add this
              isMobile={isMobile}
              setSidebarOpen={setSidebarOpen}
              imageRef={imageRef}
              performFlip={performFlip}
              performRotate={performRotate}
              applyBeautyFeature={handleBeautyFeature}
              beautySettings={beautySettings}
              frameSettings={frameSettings} // Add this
              setFrameSettings={setFrameSettings} // Add this
              applyFrame={performApplyFrame} // Add this
              applyFrameEffects={performApplyFrameEffects} // Add this
            />
          </BottomSheet>
        </>
      )}
    </div>
  );
}