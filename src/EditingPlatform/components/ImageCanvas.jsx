'use client'

import { Crop, Check } from 'lucide-react';
import { useEffect } from 'react';

export default function ImageCanvas({
  imagePreview,
  handleUploadClick,
  imageRef,
  isCropping,
  activeTool,
  cropArea,
  setCropArea,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleResizeStart,
  performCrop,
  setIsCropping,
  aspectRatio,
  loadDemoImage,
  setImagePreview  // Add this prop to accept the image setter function
}) {
  // Calculate display coordinates for the crop area
  const getDisplayCropArea = () => {
    if (!imageRef.current || !cropArea) return { top: 0, left: 0, width: 0, height: 0 };
    
    const img = imageRef.current;
    const scaleX = img.clientWidth / img.naturalWidth;
    const scaleY = img.clientHeight / img.naturalHeight;
    
    return {
      top: cropArea.y * scaleY,
      left: cropArea.x * scaleX,
      width: cropArea.width * scaleX,
      height: cropArea.height * scaleY
    };
  };

  // Get display coordinates
  const displayCrop = getDisplayCropArea();

  // Add useEffect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Force re-render to update display crop coordinates
      if (imageRef.current && cropArea) {
        setCropArea({...cropArea});
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cropArea, setCropArea]);

  return (
    <div 
      className="flex-1 flex items-center justify-center bg-gray-200 dark:bg-dark-bg p-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {!imagePreview ? (
        <div 
          onClick={handleUploadClick}
          className="w-full max-w-3xl aspect-auto border-2 border-dashed border-gray-300 dark:border-dark-border rounded-md flex flex-col items-center justify-center p-8 cursor-pointer"
        >
          <div className="mb-4">
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-gray-400 text-3xl">+</span>
            </div>
          </div>
          <p className="text-gray-700 dark:text-dark-text mb-4">Drag or upload your own images</p>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-md flex items-center">
            Open Image
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-full h-full flex items-center justify-center overflow-hidden">
          <img 
            ref={imageRef}
            src={imagePreview}
            alt="Uploaded preview" 
            className="max-w-full max-h-full object-contain"
          />
          
          {isCropping && activeTool === 'adjust' && cropArea && cropArea.width > 0 && (
            <>
              {/* Semi-transparent dark overlay for non-selected areas */}
              <div className="absolute inset-0 bg-black bg-opacity-50">
                {/* This overlay will be placed over the entire image */}
              </div>
              
              {/* Crop area */}
              <div 
                className="absolute border-2 border-blue-500 cursor-move"
                style={{
                  top: `${displayCrop.top}px`,
                  left: `${displayCrop.left}px`,
                  width: `${displayCrop.width}px`,
                  height: `${displayCrop.height}px`,
                  clipPath: aspectRatio === 'circle' ? 'circle(50%)' : 
                            aspectRatio === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
                            aspectRatio === 'heart' ? 'path("M50,20 C90,0 100,40 100,50 C100,70 70,90 50,100 C30,90 0,70 0,50 C0,40 10,0 50,20 Z")' : 
                            'none'
                }}
                onMouseDown={handleMouseDown}
              >
                {/* Make the selected area clear */}
                <div className="absolute inset-0 bg-transparent"></div>
                
                {/* Resize handles - only show if not a special shape */}
                {aspectRatio !== 'circle' && aspectRatio !== 'triangle' && aspectRatio !== 'heart' && (
                  <>
                    <div className="absolute top-0 left-0 w-3 h-3 bg-blue-500 border border-white cursor-nw-resize" 
                         onMouseDown={(e) => handleResizeStart(e, 'nw')}></div>
                    <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 border border-white cursor-ne-resize" 
                         onMouseDown={(e) => handleResizeStart(e, 'ne')}></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 border border-white cursor-sw-resize" 
                         onMouseDown={(e) => handleResizeStart(e, 'sw')}></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border border-white cursor-se-resize" 
                         onMouseDown={(e) => handleResizeStart(e, 'se')}></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white cursor-n-resize" 
                         onMouseDown={(e) => handleResizeStart(e, 'n')}></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white cursor-s-resize" 
                         onMouseDown={(e) => handleResizeStart(e, 's')}></div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white cursor-w-resize" 
                         onMouseDown={(e) => handleResizeStart(e, 'w')}></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white cursor-e-resize" 
                         onMouseDown={(e) => handleResizeStart(e, 'e')}></div>
                  </>
                )}
              </div>
            </>
          )}
          
          {/* Overlay when cropping is active */}
          {isCropping && activeTool === 'adjust' && (
            <div className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-75 p-3 rounded-lg flex space-x-3">
             <button 
  onClick={() => {
    const croppedImageUrl = performCrop();
    if (croppedImageUrl && setImagePreview) {
      setImagePreview(croppedImageUrl);  // Update the image preview with cropped image
    }
  }}
  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
  title="Apply Crop"
>
  <Check size={20} />
</button>
              <button 
                onClick={() => setIsCropping(false)}
                className="p-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600"
                title="Cancel"
              >
                <Crop size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}