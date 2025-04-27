'use clint'
import { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ToolPanel from './components/ToolPanel';
import ImageCanvas from './components/ImageCanvas';
import { useCropImage } from './hooks/useCropImage';
import { aspectRatios } from './data/aspectRatios';

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
  
  // Cropping functionality from custom hook
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
    performCrop
  } = useCropImage({ imageRef, aspectRatio, aspectRatios, width, height, setWidth, setHeight, keepAspectRatio });
  
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
  
  // Initialize crop area when image is loaded
  useEffect(() => {
    if (imagePreview && imageRef.current) {
      const img = imageRef.current;
      
      // Wait for image to load to get its dimensions
      img.onload = () => {
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        
        // Create a crop area centered on the image
        const size = 425;
        // Make sure the square fits within the image
        const finalSize = Math.min(size, imgWidth * 0.9, imgHeight * 0.9);
        const x = (imgWidth - finalSize) / 2;
        const y = (imgHeight - finalSize) / 2;
        
        setCropArea({
          x: x,
          y: y,
          width: finalSize,
          height: finalSize
        });
        
        // Update input fields
        setWidth("425");
        setHeight("425");
        
        // Ensure crop tool is active
        setActiveTool('adjust');
        setIsCropping(true);
      };
    }
  }, [imagePreview]);
  
  // Update crop area when aspect ratio changes
  useEffect(() => {
    if (!imagePreview) return;
    if (aspectRatio === 'freeform') {
      // For freeform, don't constrain the ratio but keep current size
      setKeepAspectRatio(false);
    } else if (aspectRatio === 'circle') {
      // For circle, enforce 1:1 ratio
      setKeepAspectRatio(true);
      const imgWidth = imageRef.current.naturalWidth;
      const imgHeight = imageRef.current.naturalHeight;
      const size = Math.min(imgWidth, imgHeight) * 0.8;
      setCropArea({
        x: (imgWidth - size) / 2,
        y: (imgHeight - size) / 2,
        width: size,
        height: size
      });
      setWidth(Math.round(size).toString());
      setHeight(Math.round(size).toString());
    } else if (aspectRatio === 'triangle' || aspectRatio === 'heart') {
      // For triangle and heart, start with a square but will apply shape mask when cropping
      setKeepAspectRatio(true);
      const imgWidth = imageRef.current.naturalWidth;
      const imgHeight = imageRef.current.naturalHeight;
      const size = Math.min(imgWidth, imgHeight) * 0.8;
      setCropArea({
        x: (imgWidth - size) / 2,
        y: (imgHeight - size) / 2,
        width: size,
        height: size
      });
      setWidth(Math.round(size).toString());
      setHeight(Math.round(size).toString());
    } else if (aspectRatio !== 'original') {
      const selectedRatio = aspectRatios.find(r => r.id === aspectRatio);
      if (selectedRatio?.dimensions) {
        const { width: rWidth, height: rHeight } = selectedRatio.dimensions;
        const imgWidth = imageRef.current.naturalWidth;
        const imgHeight = imageRef.current.naturalHeight;
        // Calculate new crop dimensions based on aspect ratio
        let newWidth, newHeight;
        if ((imgWidth / imgHeight) > (rWidth / rHeight)) {
          // Image is wider than target ratio
          newHeight = imgHeight * 0.8;
          newWidth = newHeight * (rWidth / rHeight);
        } else {
          // Image is taller than target ratio
          newWidth = imgWidth * 0.8;
          newHeight = newWidth * (rHeight / rWidth);
        }
        // Center the crop area
        const newX = (imgWidth - newWidth) / 2;
        const newY = (imgHeight - newHeight) / 2;
        setCropArea({
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight
        });
        // Update input fields
        setWidth(Math.round(newWidth).toString());
        setHeight(Math.round(newHeight).toString());
      }
    }
  }, [aspectRatio, imagePreview]);
  
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
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          handleResizeStart={handleResizeStart}
          performCrop={performCrop}
          setIsCropping={setIsCropping}
          aspectRatio={aspectRatio}
          loadDemoImage={loadDemoImage}
          setImagePreview={setImagePreview}
        />
      </div>
    </div>
  );
}