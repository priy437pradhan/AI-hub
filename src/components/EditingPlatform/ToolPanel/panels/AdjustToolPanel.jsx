import React from 'react';
import { ArrowRight, RotateCcw, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';
import PanelSection from '../common/PanelSection';
import ButtonGrid from '../common/ButtonGrid';
import ActionButton from '../common/ActionButton';

// Hardcoding the constants based on what we can see in your code
const subToolNames = {
  CROP: 'crop',
  FLIP: 'flip',
  ROTATE: 'rotate'
};
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
const AdjustToolPanel = ({
  activeAdjustTool,
  setActiveAdjustTool,
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
}) => {
  console.log("AdjustToolPanel render:", { activeAdjustTool, isCropping: activeAdjustTool === subToolNames.CROP });

  // Fixed handleToolToggle function with explicit logging
  const handleToolToggle = (tool) => {
    console.log(`Toggling tool from ${activeAdjustTool} to ${tool}`);
    
    // If clicking the same tool, toggle it off
    if (activeAdjustTool === tool) {
      console.log("Deactivating tool:", tool);
      setActiveAdjustTool(null);
      if (tool === subToolNames.CROP && setIsCropping) {
        console.log("Setting isCropping to false");
        setIsCropping(false);
      }
    } else {
      // Switch to the new tool
      console.log("Activating tool:", tool);
      setActiveAdjustTool(tool);
      
      // Special handling for crop tool
      if (tool === subToolNames.CROP) {
        if (setIsCropping) {
          console.log("Setting isCropping to true");
          setIsCropping(true);
          
          // Initialize crop area if needed
          if (!cropArea && imageRef.current) {
            setupCropByAspectRatio(aspectRatio);
          }
        }
      } else if (setIsCropping) {
        // Turn off cropping for non-crop tools
        console.log("Setting isCropping to false (non-crop tool)");
        setIsCropping(false);
      }
    }
  };

  const applyAspectRatio = (ratioId) => {
    if (!imageRef.current) return;
    console.log("Applying aspect ratio:", ratioId);
    setAspectRatio(ratioId);
    setIsCropping(true);
    setActiveAdjustTool(subToolNames.CROP);
    setupCropByAspectRatio(ratioId);
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <h2 className="text-gray-200 font-medium mb-2 text-sm">Size & Orientation</h2>
      <div className="bg-gray-800 rounded-lg p-2 mb-3 shadow-md">
        <PanelSection 
          title="Crop" 
          isExpanded={activeAdjustTool === subToolNames.CROP} 
          onToggle={() => handleToolToggle(subToolNames.CROP)}
        >
          <ButtonGrid 
            items={aspectRatios} 
            activeId={aspectRatio} 
            onSelect={applyAspectRatio} 
            cols={3}
          />
          <div className="flex space-x-1 mb-2">
            <input
              type="text"
              value={width}
              onChange={(e) => {
                const newWidth = e.target.value;
                setWidth(newWidth);
                if (keepAspectRatio && cropArea && cropArea.width > 0) {
                  const ratio = cropArea.height / cropArea.width;
                  setHeight(Math.round(parseInt(newWidth) * ratio).toString());
                }
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded px-1 py-1 text-xs text-gray-300 focus:border-blue-500 focus:outline-none"
              placeholder="W"
            />
            <input
              type="text"
              value={height}
              onChange={(e) => {
                const newHeight = e.target.value;
                setHeight(newHeight);
                if (keepAspectRatio && cropArea && cropArea.width > 0) {
                  const ratio = cropArea.width / cropArea.height;
                  setWidth(Math.round(parseInt(newHeight) * ratio).toString());
                }
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded px-1 py-1 text-xs text-gray-300 focus:border-blue-500 focus:outline-none"
              placeholder="H"
            />
            <button
              onClick={() => {
                console.log("Apply dimensions button clicked");
                if (!imageRef.current) return;
                
                setActiveAdjustTool(subToolNames.CROP);
                setIsCropping(true);
                
                const img = imageRef.current;
                const imgWidth = img.naturalWidth;
                const imgHeight = img.naturalHeight;
                const newWidth = parseInt(width);
                const newHeight = parseInt(height);
                const newX = Math.max(0, (imgWidth - newWidth) / 2);
                const newY = Math.max(0, (imgHeight - newHeight) / 2);
                
                console.log("Setting crop area:", { newX, newY, newWidth, newHeight });
                setCropArea({ x: newX, y: newY, width: newWidth, height: newHeight });
              }}
              className="p-1 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              <ArrowRight size={14} className="text-white" />
            </button>
          </div>
          <div className="flex items-center mb-1">
            <input
              type="checkbox"
              id="keepAspect"
              checked={keepAspectRatio}
              onChange={() => setKeepAspectRatio(!keepAspectRatio)}
              className="mr-1 h-3 w-3 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="keepAspect" className="text-gray-300 text-xs select-none">
              Keep aspect ratio
            </label>
          </div>
          <ActionButton 
            onClick={() => {
              console.log("Apply crop button clicked");
              if (performCrop) {
                const croppedUrl = performCrop();
                console.log("Crop performed, result:", croppedUrl ? "Success" : "Failed");
                if (croppedUrl) {
                  // Successfully cropped, turn off crop mode
                  setIsCropping(false);
                }
              }
            }} 
            disabled={!cropArea || !performCrop}
          >
            Apply Crop
          </ActionButton>
        </PanelSection>

        <PanelSection 
          title="Flip" 
          isExpanded={activeAdjustTool === subToolNames.FLIP} 
          onToggle={() => handleToolToggle(subToolNames.FLIP)}
        >
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => {
                console.log("Flip horizontal clicked");
                performFlip('horizontal');
                // Ensure cropping is disabled when flipping
                if (setIsCropping) setIsCropping(false);
              }}
              className="flex flex-col items-center justify-center p-2 rounded border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-colors"
            >
              <FlipHorizontal size={16} className="text-gray-200 mb-1" />
              <span className="text-xs text-gray-300">Horizontal</span>
            </button>
            <button
              onClick={() => {
                console.log("Flip vertical clicked");
                performFlip('vertical');
                // Ensure cropping is disabled when flipping
                if (setIsCropping) setIsCropping(false);
              }}
              className="flex flex-col items-center justify-center p-2 rounded border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-colors"
            >
              <FlipVertical size={16} className="text-gray-200 mb-1" />
              <span className="text-xs text-gray-300">Vertical</span>
            </button>
          </div>
        </PanelSection>

        <PanelSection 
          title="Rotate" 
          isExpanded={activeAdjustTool === subToolNames.ROTATE} 
          onToggle={() => handleToolToggle(subToolNames.ROTATE)}
        >
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => {
                console.log("Rotate left clicked");
                performRotate('left');
                // Ensure cropping is disabled when rotating
                if (setIsCropping) setIsCropping(false);
              }}
              className="flex flex-col items-center justify-center p-2 rounded border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-colors"
            >
              <RotateCcw size={16} className="text-gray-200 mb-1" />
              <span className="text-xs text-gray-300">Left 90°</span>
            </button>
            <button
              onClick={() => {
                console.log("Rotate right clicked");
                performRotate('right');
                // Ensure cropping is disabled when rotating
                if (setIsCropping) setIsCropping(false);
              }}
              className="flex flex-col items-center justify-center p-2 rounded border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-colors"
            >
              <RotateCw size={16} className="text-gray-200 mb-1" />
              <span className="text-xs text-gray-300">Right 90°</span>
            </button>
          </div>
        </PanelSection>
      </div>
    </div>
  );
};

export default AdjustToolPanel;