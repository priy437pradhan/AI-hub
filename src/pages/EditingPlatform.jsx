'use client'
import { useState, useRef, useEffect } from 'react';
import Header from '../components/EditingPlatform/Header'
import Sidebar from '../components/EditingPlatform/Sidebar';
import ToolPanel from '../components/EditingPlatform/ToolPanel/ToolPanel';
import BottomToolbar from '../components/EditingPlatform/ToolPanel/BottomToolbar';
import BottomSheet from '../components/EditingPlatform/ToolPanel/BottomSheet'
import ImageCanvas from '../components/EditingPlatform/ImageCanvas';
import { useCropImage } from '../components/EditingPlatform/tools/Crop';
import { useFlipImage } from '../components/EditingPlatform/tools/useFlipImage';

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
  
  const {
    isFlippedHorizontally,
    isFlippedVertically,
    performFlipBase
  } = useFlipImage({ imageRef });
  
  
  // Function to perform rotation
  const performRotateBase = async (angle) => {
    if (!imageRef.current) return null;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    // For 90-degree rotations, we need to swap width and height
    const swapDimensions = angle === 'left' || angle === 'right';
    canvas.width = swapDimensions ? img.naturalHeight : img.naturalWidth;
    canvas.height = swapDimensions ? img.naturalWidth : img.naturalHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Move to the center of the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Rotate based on direction
    if (angle === 'left') {
      ctx.rotate(-Math.PI / 2);
    } else if (angle === 'right') {
      ctx.rotate(Math.PI / 2);
    }
    
    // Draw the image centered
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    
    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    return canvas.toDataURL('image/jpeg');
  };
  
  // Wrapper functions for the image transformations
  const performRotate = async (angle) => {
    const newImageUrl = await performRotateBase(angle);
    if (newImageUrl) {
      setImagePreview(newImageUrl);
    }
  };
  
  const performFlip = async (direction) => {
    const newImageUrl = await performFlipBase(direction);
    if (newImageUrl) {
      setImagePreview(newImageUrl);
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
              performFlip={performFlip}
              performRotate={performRotate}
            />
          </BottomSheet>
        </>
      )}
    </div>
  );
}