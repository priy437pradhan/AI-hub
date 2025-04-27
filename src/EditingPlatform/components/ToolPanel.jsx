'use client'
import { ChevronDown, ArrowRight } from 'lucide-react';
import { aspectRatios } from '../data/aspectRatios';

export default function ToolPanel({
  activeTool,
  isMobile,
  setSidebarOpen,
  aspectRatio,
  setAspectRatio,
  width,
  setWidth,
  height,
  setHeight,
  keepAspectRatio,
  setKeepAspectRatio,
  performCrop,
  setIsCropping,
  cropArea,
  setCropArea,
  imageRef,
  setupCropByAspectRatio   // Add this function from the hook
}) {
  // Function to apply aspect ratio to crop area
  const applyAspectRatio = (ratioId) => {
    // Safety check
    if (!imageRef.current) return;
    
    setAspectRatio(ratioId);
    setIsCropping(true);
    
    // Use the function from the hook
    setupCropByAspectRatio(ratioId);
  };

  return (
    <div className={`${isMobile ? 'absolute inset-0 z-20 w-full' : 'w-72'} bg-gray-900 dark:bg-dark-card border-r border-gray-700 dark:border-dark-border overflow-y-auto`}>
      <div className="p-4">
        {isMobile && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-300 font-medium">{activeTool.charAt(0).toUpperCase() + activeTool.slice(1)} Tools</h2>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-gray-800 rounded-full"
            >
              <ArrowRight size={16} className="text-gray-400" />
            </button>
          </div>
        )}
        
        {activeTool === 'ai' && (
          <div>
            <h2 className="text-gray-300 mb-4 font-medium">AI Tools</h2>
            <div className="bg-gray-800 dark:bg-dark-border rounded-md p-4 mb-4">
              <h3 className="text-gray-300 mb-2">AI Background Remover</h3>
              <p className="text-gray-400 text-sm mb-4">Remove image backgrounds automatically with AI</p>
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Remove Background
              </button>
            </div>
          </div>
        )}
        
        {activeTool === 'adjust' && (
          <div>
            <h2 className="text-gray-400 mb-2">Size</h2>
            <div className="bg-gray-800 dark:bg-dark-border rounded-md p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Crop</span>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
              
              {/* Grid of aspect ratios */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {aspectRatios.slice(0, 12).map((ratio) => (
                  <div 
                    key={ratio.id}
                    onClick={() => applyAspectRatio(ratio.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded cursor-pointer ${aspectRatio === ratio.id ? 'border-2 border-blue-500' : 'border border-gray-600 hover:border-gray-500'}`}
                  >
                    <div className="text-2xl text-gray-300 mb-1">{ratio.icon}</div>
                    <span className="text-xs text-gray-400">{ratio.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="h-4 w-4 mr-2 border-b-2 border-r-2 border-gray-500"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={width}
                      onChange={(e) => {
                        setWidth(e.target.value);
                        if (keepAspectRatio && cropArea) {
                          const newWidth = parseInt(e.target.value) || cropArea.width;
                          const ratio = cropArea.height / cropArea.width;
                          setHeight(Math.round(newWidth * ratio).toString());
                        }
                      }}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-300"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">×</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => {
                        setHeight(e.target.value);
                        if (keepAspectRatio && cropArea) {
                          const newHeight = parseInt(e.target.value) || cropArea.height;
                          const ratio = cropArea.width / cropArea.height;
                          setWidth(Math.round(newHeight * ratio).toString());
                        }
                      }}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-300"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if (imageRef.current) {
                        const newWidth = parseInt(width) || 0;
                        const newHeight = parseInt(height) || 0;
                        
                        if (newWidth <= 0 || newHeight <= 0) return;
                        
                        // Center the crop area
                        const img = imageRef.current;
                        const imgWidth = img.naturalWidth;
                        const imgHeight = img.naturalHeight;
                        const newX = Math.max(0, Math.min((imgWidth - newWidth) / 2, imgWidth - newWidth));
                        const newY = Math.max(0, Math.min((imgHeight - newHeight) / 2, imgHeight - newHeight));
                        
                        setCropArea({
                          x: newX,
                          y: newY,
                          width: newWidth,
                          height: newHeight
                        });
                        
                        // Start cropping mode
                        setIsCropping(true);
                      }
                    }}
                    className="p-2 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600"
                  >
                    <ArrowRight size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="keepAspect"
                  checked={keepAspectRatio}
                  onChange={() => setKeepAspectRatio(!keepAspectRatio)}
                  className="mr-2"
                />
                <label htmlFor="keepAspect" className="text-gray-400 text-sm">Keep Aspect Ratio</label>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={performCrop}
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Apply
                </button>
                <button 
                  onClick={() => setIsCropping(false)}
                  className="flex-1 bg-gray-700 text-gray-300 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTool !== 'ai' && activeTool !== 'adjust' && (
          <div className="py-6 px-4 text-center">
            <h3 className="text-gray-300 mb-2">Tool: {activeTool}</h3>
            <p className="text-gray-400 text-sm">This tool panel would show options for the {activeTool} tool.</p>
          </div>
        )}
      </div>
    </div>
  );
}