'use client'
import { useState, useRef, useEffect } from 'react';
import Header from '../components/EditingPlatform/Header'
import Sidebar from '../components/EditingPlatform/Sidebar';
import ToolPanel from '../components/EditingPlatform/ToolPanel/ToolPanel';
import BottomToolbar from '../components/EditingPlatform/ToolPanel/BottomToolbar';
import BottomSheet from '../components/EditingPlatform/ToolPanel/BottomSheet'
import ImageCanvas from '../components/EditingPlatform/ImageCanvas';
import { useCropImage } from '../components/EditingPlatform/tools/useCropImage';
import { useFlipImage } from '../components/EditingPlatform/tools/useFlipImage';
import { useRotateImage } from '../components/EditingPlatform/tools/useRotateImage';

export const aspectRatios = [
    { id: 'freeform', label: 'Freeform', icon: '⊞', dimensions: null },
    { id: '1x1', label: '1 x 1', icon: '□', dimensions: { width: 1, height: 1 } },
    { id: '3x2', label: '3 x 2', icon: '▭', dimensions: { width: 3, height: 2 } },
    { id: '2x3', label: '2 x 3', icon: '▯', dimensions: { width: 2, height: 3 } },
    { id: '4x3', label: '4 x 3', icon: '▭', dimensions: { width: 4, height: 3 } },
    { id: '3x4', label: '3 x 4', icon: '▯', dimensions: { width: 3, height: 4 } },
    { id: '16x9', label: '16 x 9', icon: '▭', dimensions: { width: 16, height: 9 } },
    { id: '9x16', label: '9 x 16', icon: '▯', dimensions: { width: 9, height: 16 } },
    { id: 'original', label: 'Original Ratio', icon: '▣', dimensions: null },
    { id: 'circle', label: 'Circle', icon: '○', dimensions: null },
    { id: 'triangle', label: 'Triangle', icon: '△', dimensions: null },
    { id: 'heart', label: 'Heart-shape', icon: '♥', dimensions: null },
];

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
  const [aspectRatio, setAspectRatio] = useState('freeform');
  const [width, setWidth] = useState('475');
  const [height, setHeight] = useState('475');
  const [keepAspectRatio, setKeepAspectRatio] = useState(false);
  
  // Bottom sheet state for mobile
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
  // State for image upload
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  
  // Use the crop image hook
  const {
    cropArea,
    setCropArea,
    isCropping,
    setIsCropping,
    croppedImage,
    setCroppedImage,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleResizeStart,
    performCrop,
    getDisplayCropArea
  } = useCropImage({ 
    imageRef, 
    aspectRatio, 
    aspectRatios, 
    width, 
    height, 
    setWidth, 
    setHeight, 
    keepAspectRatio,
    setKeepAspectRatio,
    imagePreview 
  });
  
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
  
  // Setup crop by aspect ratio function
  const setupCropByAspectRatio = (ratioId) => {
    if (!imageRef.current) return;
    
    const img = imageRef.current;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    
    // Default to a centered crop at 80% of the image
    let newWidth = imgWidth * 0.8;
    let newHeight = imgHeight * 0.8;
    
    // Adjust dimensions based on selected aspect ratio
    if (ratioId !== 'freeform' && ratioId !== 'original') {
      const selectedRatio = aspectRatios.find(r => r.id === ratioId);
      if (selectedRatio?.dimensions) {
        const { width: rWidth, height: rHeight } = selectedRatio.dimensions;
        const ratio = rWidth / rHeight;
        
        // Calculate dimensions while maintaining the aspect ratio
        if (imgWidth / imgHeight > ratio) {
          // Image is wider than the target ratio
          newHeight = imgHeight * 0.8;
          newWidth = newHeight * ratio;
        } else {
          // Image is taller than the target ratio
          newWidth = imgWidth * 0.8;
          newHeight = newWidth / ratio;
        }
      }
    } else if (ratioId === 'original') {
      newWidth = imgWidth;
      newHeight = imgHeight;
    }
    
    // Center the crop area
    const newX = (imgWidth - newWidth) / 2;
    const newY = (imgHeight - newHeight) / 2;
    
    // Update crop area
    setCropArea({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    });
    
    // Update width and height inputs
    setWidth(Math.round(newWidth).toString());
    setHeight(Math.round(newHeight).toString());
  };
  
  // Wrapper functions for the image transformations
  const performRotate = async (direction) => {
    // Make sure crop mode is off
    setIsCropping(false);
    
    const rotatedImageUrl = await performRotateBase(direction);
    if (rotatedImageUrl) {
      setImagePreview(rotatedImageUrl);
    }
  };
  
  const performFlip = async (direction) => {
    // Make sure crop mode is off
    setIsCropping(false);
    
    const flippedImageUrl = await performFlipBase(direction);
    if (flippedImageUrl) {
      setImagePreview(flippedImageUrl);
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
        setImagePreview(reader.result);
        setCroppedImage(null);
      };
      reader.readAsDataURL(file);
      setActiveTool(toolNames.ADJUST);
      setIsCropping(true);
    }
  };
  
  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  // Download the cropped image
  const downloadImage = () => {
    if (!croppedImage && !imagePreview) {
      alert("Please upload and crop an image first.");
      return;
    }
    // Create a download link
    const link = document.createElement('a');
    link.download = 'edited-image.jpg';
    link.href = croppedImage || imagePreview;
    link.click();
  };
  
  const demoImages = [
    '/path/to/demo-image-1.jpg',
    '/path/to/demo-image-2.jpg'
  ];
  
  // Load demo image
  const loadDemoImage = (index) => {
    setImagePreview(demoImages[index]);
    setUploadedImage("demo-image");
    setCroppedImage(null);
    setActiveTool(toolNames.ADJUST);
    setIsCropping(true);
    setAspectRatio('freeform');
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
      <Header 
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleUploadClick={handleUploadClick}
        downloadImage={downloadImage}
      />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Component - Desktop Only */}
        {sidebarOpen && !isMobile && (
          <Sidebar 
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            isMobile={isMobile}
            setSidebarOpen={setSidebarOpen}
          />
        )}
        
        {/* Tool Panel Component */}
        {(!isMobile || (isMobile && activeTool !== toolNames.ADJUST)) && (
          <ToolPanel 
            activeTool={activeTool}
            activeAdjustTool={activeAdjustTool}
            setActiveAdjustTool={setActiveAdjustTool}
            isMobile={isMobile}
            setSidebarOpen={setSidebarOpen}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            width={width}
            setWidth={setWidth}
            height={height}
            setHeight={setHeight}
            keepAspectRatio={keepAspectRatio}
            setKeepAspectRatio={setKeepAspectRatio}
            performCrop={performCrop}
            setIsCropping={setIsCropping}
            cropArea={cropArea}
            setCropArea={setCropArea}
            imageRef={imageRef}
            setupCropByAspectRatio={setupCropByAspectRatio}
            performFlip={performFlip}
            performRotate={performRotate}
          />
        )}
        
        {/* Canvas Area - Takes full width on mobile */}
        <div className={`flex-1 ${isMobile ? 'pb-16' : ''}`}>
          <ImageCanvas 
            imagePreview={imagePreview}
            handleUploadClick={handleUploadClick}
            imageRef={imageRef}
            isCropping={isCropping}
            activeTool={activeTool}
            activeAdjustTool={activeAdjustTool}
            cropArea={cropArea}
            setCropArea={setCropArea}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            handleResizeStart={handleResizeStart}
            performCrop={performCrop}
            setIsCropping={setIsCropping}
            aspectRatio={aspectRatio}
            loadDemoImage={loadDemoImage}
            setImagePreview={setImagePreview}
            getDisplayCropArea={getDisplayCropArea}
          />
        </div>
      </div>
      
      {/* Mobile Bottom Toolbar */}
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
          
          {/* Bottom Sheet for Mobile Tool Options */}
          <BottomSheet 
            isOpen={isBottomSheetOpen} 
            onClose={() => setIsBottomSheetOpen(false)}
          >
            <ToolPanel 
              activeTool={activeTool}
              activeAdjustTool={activeAdjustTool}
              setActiveAdjustTool={setActiveAdjustTool}
              isMobile={isMobile}
              setSidebarOpen={setSidebarOpen}
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
              width={width}
              setWidth={setWidth}
              height={height}
              setHeight={setHeight}
              keepAspectRatio={keepAspectRatio}
              setKeepAspectRatio={setKeepAspectRatio}
              performCrop={performCrop}
              setIsCropping={setIsCropping}
              cropArea={cropArea}
              setCropArea={setCropArea}
              imageRef={imageRef}
              setupCropByAspectRatio={setupCropByAspectRatio}
              performFlip={performFlip}
              performRotate={performRotate}
            />
          </BottomSheet>
        </>
      )}
    </div>
  );
}