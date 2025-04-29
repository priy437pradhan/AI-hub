'use client'
import { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ToolPanel from './Tools/ToolPanel';
import ImageCanvas from './components/ImageCanvas';
import { useCropImage } from './Tools/Adjust/hooks/useCropImage';
import { aspectRatios } from './Tools/Adjust/data/aspectRatios';
import { useImageTransform } from './Tools/Adjust/hooks/useImageTransform';

export default function AIhubEditor() {
  // State for active tool selection
  const [activeTool, setActiveTool] = useState('adjust');
  const [aspectRatio, setAspectRatio] = useState('freeform');
  const [width, setWidth] = useState('475');
  const [height, setHeight] = useState('475');
  const [keepAspectRatio, setKeepAspectRatio] = useState(false);
  
  // State for image upload
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  
  
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
    rotationAngle,
    setRotationAngle,
    performRotate: performRotateBase,
    performFlip: performFlipBase
  } = useImageTransform();
  
  // Create wrapper functions to apply the transformations and update the image
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
  
  // Sample demo images
  const demoImages = [
    "/api/placeholder/500/500",
    "/api/placeholder/500/500",
    "/api/placeholder/500/500"
  ];
  
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
      setActiveTool('adjust');
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
    link.download = 'cropped-image.jpg';
    link.href = croppedImage || imagePreview;
    link.click();
  };
  
  // Load demo image
  const loadDemoImage = (index) => {
    setImagePreview(demoImages[index]);
    setUploadedImage("demo-image");
    setCroppedImage(null);
    setActiveTool('adjust');
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
      
      {/* Header Component */}
      <Header 
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleUploadClick={handleUploadClick}
        downloadImage={downloadImage}
      />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Component */}
        {sidebarOpen && (
          <Sidebar 
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            isMobile={isMobile}
            setSidebarOpen={setSidebarOpen}
          />
        )}
        
        {/* Tool Panel Component */}
        {(!isMobile || (isMobile && activeTool !== 'adjust')) && (
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
            rotationAngle={rotationAngle}
            setRotationAngle={setRotationAngle}
          />
        )}
        
        {/* Canvas Area */}
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
  );
}