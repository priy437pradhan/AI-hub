'use client'
import { ChevronDown, ArrowRight } from 'lucide-react';
import { aspectRatios } from './Adjust/data/aspectRatios';
import { useState } from 'react';
import { 
  RotateCw, 
  RotateCcw, 
  RefreshCw, 
  FlipHorizontal, 
  FlipVertical 
} from 'lucide-react';

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
  setupCropByAspectRatio,
  performFlip,
  performRotate,
  rotationAngle,
  setRotationAngle
}) {
  // Track which specific adjust tool is active
  const [activeAdjustTool, setActiveAdjustTool] = useState(null);
  
  // Function to apply aspect ratio to crop area
  const applyAspectRatio = (ratioId) => {
    // Safety check
    if (!imageRef.current) return;
    
    setAspectRatio(ratioId);
    setIsCropping(true);
    
    // Use the function from the hook
    setupCropByAspectRatio(ratioId);
  };

  // Function to handle tool selection and toggle
  const handleToolToggle = (tool) => {
    if (activeAdjustTool === tool) {
      setActiveAdjustTool(null);
      // If closing crop tool, disable cropping mode
      if (tool === 'crop') {
        setIsCropping(false);
      }
    } else {
      // First close any active tool
      if (activeAdjustTool === 'crop') {
        setIsCropping(false);
      }
      
      // Now set the new active tool
      setActiveAdjustTool(tool);
      
      // If opening crop tool, enable cropping mode
      if (tool === 'crop') {
        setIsCropping(true);
      } else {
        // When selecting other tools, ensure cropping is disabled
        setIsCropping(false);
      }
    }
  };

  // Conditionally render different tool panels based on activeTool
  const renderToolPanel = () => {
    switch (activeTool) {
      case 'adjust':
        return renderAdjustToolPanel();
      case 'ai':
        return renderAIToolPanel();
      case 'effects':
        return renderEffectsToolPanel();
      case 'beauty':
        return renderBeautyToolPanel();
      case 'frames':
        return renderFramesToolPanel();
      case 'text':
        return renderTextToolPanel();
      case 'element':
        return renderElementToolPanel();
      default:
        return null;
    }
  };

  // Render the Adjust tool panel with crop, flip, and rotate options
  const renderAdjustToolPanel = () => (
    <div>
      <h2 className="text-gray-400 mb-2">Size & Orientation</h2>
      <div className="bg-gray-800 dark:bg-dark-border rounded-md p-3 mb-4">
        {/* Crop Tool */}
        <div className="flex items-center justify-between mb-2 cursor-pointer">
          <div 
            className="flex items-center justify-between w-full"
            onClick={() => handleToolToggle('crop')}
          >
            <span className="text-gray-300">Crop</span>
            <ChevronDown size={16} className={`text-gray-400 transform ${activeAdjustTool === 'crop' ? 'rotate-180' : ''}`} />
          </div>
        </div>
        
        {activeAdjustTool === 'crop' && (
          <>
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
            
            {/* Dimensions controls */}
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
          </>
        )}
        
        {/* Flip Tool */}
        <div className="flex items-center justify-between mb-2 cursor-pointer mt-4">
          <div 
            className="flex items-center justify-between w-full"
            onClick={() => handleToolToggle('flip')}
          >
            <span className="text-gray-300">Flip</span>
            <ChevronDown size={16} className={`text-gray-400 transform ${activeAdjustTool === 'flip' ? 'rotate-180' : ''}`} />
          </div>
        </div>
        
        {activeAdjustTool === 'flip' && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button 
              onClick={() => {
                const dataUrl = performFlip('horizontal');
                if (dataUrl) {
                  // Create a new Image object to replace the current one
                  const img = new Image();
                  img.onload = () => {
                    // Once loaded, update the imageRef source
                    if (imageRef.current) {
                      imageRef.current.src = dataUrl;
                    }
                  };
                  img.src = dataUrl;
                }
              }}
              className="flex flex-col items-center justify-center p-3 rounded cursor-pointer border border-gray-600 hover:border-gray-500"
            >
              <div className="text-gray-300 mb-1">
                <FlipHorizontal size={20} />
              </div>
              <span className="text-xs text-gray-400">Horizontal</span>
            </button>
            <button 
              onClick={() => {
                const dataUrl = performFlip('vertical');
                if (dataUrl) {
                  // Create a new Image object to replace the current one
                  const img = new Image();
                  img.onload = () => {
                    // Once loaded, update the imageRef source
                    if (imageRef.current) {
                      imageRef.current.src = dataUrl;
                    }
                  };
                  img.src = dataUrl;
                }
              }}
              className="flex flex-col items-center justify-center p-3 rounded cursor-pointer border border-gray-600 hover:border-gray-500"
            >
              <div className="text-gray-300 mb-1">
                <FlipVertical size={20} />
              </div>
              <span className="text-xs text-gray-400">Vertical</span>
            </button>
          </div>
        )}
        
        {/* Rotate Tool */}
        <div className="flex items-center justify-between mb-2 cursor-pointer mt-4">
          <div 
            className="flex items-center justify-between w-full"
            onClick={() => handleToolToggle('rotate')}
          >
            <span className="text-gray-300">Rotate</span>
            <ChevronDown size={16} className={`text-gray-400 transform ${activeAdjustTool === 'rotate' ? 'rotate-180' : ''}`} />
          </div>
        </div>
        
        {activeAdjustTool === 'rotate' && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button 
                onClick={() => {
                  const dataUrl = performRotate(-90);
                  if (dataUrl) {
                    // Create a new Image object to replace the current one
                    const img = new Image();
                    img.onload = () => {
                      // Once loaded, update the imageRef source
                      if (imageRef.current) {
                        imageRef.current.src = dataUrl;
                      }
                    };
                    img.src = dataUrl;
                  }
                }}
                className="flex flex-col items-center justify-center p-3 rounded cursor-pointer border border-gray-600 hover:border-gray-500"
              >
                <div className="text-gray-300 mb-1">
                  <RotateCcw size={20} />
                </div>
                <span className="text-xs text-gray-400">-90°</span>
              </button>
              <button 
                onClick={() => {
                  const dataUrl = performRotate(180);
                  if (dataUrl) {
                    // Create a new Image object to replace the current one
                    const img = new Image();
                    img.onload = () => {
                      // Once loaded, update the imageRef source
                      if (imageRef.current) {
                        imageRef.current.src = dataUrl;
                      }
                    };
                    img.src = dataUrl;
                  }
                }}
                className="flex flex-col items-center justify-center p-3 rounded cursor-pointer border border-gray-600 hover:border-gray-500"
              >
                <div className="text-gray-300 mb-1">
                  <RefreshCw size={20} />
                </div>
                <span className="text-xs text-gray-400">180°</span>
              </button>
              <button 
                onClick={() => {
                  const dataUrl = performRotate(90);
                  if (dataUrl) {
                    // Create a new Image object to replace the current one
                    const img = new Image();
                    img.onload = () => {
                      // Once loaded, update the imageRef source
                      if (imageRef.current) {
                        imageRef.current.src = dataUrl;
                      }
                    };
                    img.src = dataUrl;
                  }
                }}
                className="flex flex-col items-center justify-center p-3 rounded cursor-pointer border border-gray-600 hover:border-gray-500"
              >
                <div className="text-gray-300 mb-1">
                  <RotateCw size={20} />
                </div>
                <span className="text-xs text-gray-400">90°</span>
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Custom Angle</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={rotationAngle}
                  onChange={(e) => setRotationAngle(parseInt(e.target.value) || 0)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-300"
                  min="-360"
                  max="360"
                />
                <button 
                  onClick={() => {
                    const dataUrl = performRotate(rotationAngle);
                    if (dataUrl) {
                      // Create a new Image object to replace the current one
                      const img = new Image();
                      img.onload = () => {
                        // Once loaded, update the imageRef source
                        if (imageRef.current) {
                          imageRef.current.src = dataUrl;
                        }
                      };
                      img.src = dataUrl;
                    }
                  }}
                  className="px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Render AI tools panel
  const renderAIToolPanel = () => (
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
  );

  // Render Effects tools panel
  const renderEffectsToolPanel = () => (
    <div>
      <h2 className="text-gray-300 mb-4 font-medium">Effects</h2>
      <div className="bg-gray-800 dark:bg-dark-border rounded-md p-4 mb-4">
        <h3 className="text-gray-300 mb-2">Image Effects</h3>
        <p className="text-gray-400 text-sm mb-4">Apply artistic filters and effects</p>
        <div className="grid grid-cols-3 gap-2">
          <button className="p-3 bg-gray-700 rounded text-gray-200 text-xs">Vintage</button>
          <button className="p-3 bg-gray-700 rounded text-gray-200 text-xs">B&W</button>
          <button className="p-3 bg-gray-700 rounded text-gray-200 text-xs">Sepia</button>
        </div>
      </div>
    </div>
  );

  // Render Beauty tools panel
  const renderBeautyToolPanel = () => (
    <div>
      <h2 className="text-gray-300 mb-4 font-medium">Beauty</h2>
      <div className="bg-gray-800 dark:bg-dark-border rounded-md p-4 mb-4">
        <h3 className="text-gray-300 mb-2">Beauty Tools</h3>
        <p className="text-gray-400 text-sm mb-4">Enhance and retouch photos</p>
        <div className="space-y-3">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Smoothing</label>
            <input type="range" className="w-full" min="0" max="100" defaultValue="0" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Clarity</label>
            <input type="range" className="w-full" min="0" max="100" defaultValue="50" />
          </div>
        </div>
      </div>
    </div>
  );

  // Render Frames tools panel
  const renderFramesToolPanel = () => (
    <div>
      <h2 className="text-gray-300 mb-4 font-medium">Frames</h2>
      <div className="bg-gray-800 dark:bg-dark-border rounded-md p-4 mb-4">
        <h3 className="text-gray-300 mb-2">Frame Gallery</h3>
        <p className="text-gray-400 text-sm mb-4">Add beautiful frames to your image</p>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-3 bg-gray-700 rounded text-gray-200 text-xs">Simple</button>
          <button className="p-3 bg-gray-700 rounded text-gray-200 text-xs">Fancy</button>
          <button className="p-3 bg-gray-700 rounded text-gray-200 text-xs">Modern</button>
          <button className="p-3 bg-gray-700 rounded text-gray-200 text-xs">Vintage</button>
        </div>
      </div>
    </div>
  );

  // Render Text tools panel
  const renderTextToolPanel = () => (
    <div>
      <h2 className="text-gray-300 mb-4 font-medium">Text</h2>
      <div className="bg-gray-800 dark:bg-dark-border rounded-md p-4 mb-4">
        <h3 className="text-gray-300 mb-2">Add Text</h3>
        <p className="text-gray-400 text-sm mb-4">Add text overlays to your image</p>
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Add Text
        </button>
        <div className="mt-4">
          <label className="block text-gray-400 text-sm mb-2">Font</label>
          <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-300">
            <option>Arial</option>
            <option>Helvetica</option>
            <option>Times New Roman</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Render Elements tools panel
  const renderElementToolPanel = () => (
    <div>
      <h2 className="text-gray-300 mb-4 font-medium">Elements</h2>
      <div className="bg-gray-800 dark:bg-dark-border rounded-md p-4 mb-4">
        <h3 className="text-gray-300 mb-2">Add Elements</h3>
        <p className="text-gray-400 text-sm mb-4">Add shapes, stickers and graphics</p>
        <div className="grid grid-cols-3 gap-2">
          <button className="p-3 bg-gray-700 rounded text-gray-200 text-xs">Shapes</button>
          <button className="p-3 bg-gray-700 rounded text-gray-200 text-xs">Stickers</button>
          <button className="p-3 bg-gray-700 rounded text-gray-200 text-xs">Icons</button>
        </div>
      </div>
    </div>
  );

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
        
        {renderToolPanel()}
      </div>
    </div>
  );
}