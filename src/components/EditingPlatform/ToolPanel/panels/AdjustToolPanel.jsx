import React from 'react';
import { ArrowRight, RotateCcw, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';
import PanelSection from '../common/PanelSection'
import ButtonGrid from '../common/ButtonGrid';
import ActionButton from '../common/ActionButton';

import { aspectRatios, subToolNames } from '../../data/constants';

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
  // Fixed handleToolToggle function
  const handleToolToggle = (tool) => {
    // Always ensure isCropping is false when not using the crop tool
    if (tool !== subToolNames.CROP && setIsCropping) {
      setIsCropping(false);
    }
    
    // Toggle the tool - if already active, deactivate it
    if (activeAdjustTool === tool) {
      setActiveAdjustTool(null);
      if (setIsCropping) setIsCropping(false);
    } else {
      // Switch to the new tool
      setActiveAdjustTool(tool);
      // Only set isCropping to true if specifically switching to crop tool
      if (tool === subToolNames.CROP && setIsCropping) {
        setIsCropping(true);
      }
    }
  };

  const applyAspectRatio = (ratioId) => {
    if (!imageRef.current) return;
    setAspectRatio(ratioId);
    setIsCropping(true);
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
                if (keepAspectRatio && cropArea) {
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
                if (keepAspectRatio && cropArea) {
                  const ratio = cropArea.width / cropArea.height;
                  setWidth(Math.round(parseInt(newHeight) * ratio).toString());
                }
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded px-1 py-1 text-xs text-gray-300 focus:border-blue-500 focus:outline-none"
              placeholder="H"
            />
            <button
              onClick={() => {
                if (!imageRef.current) return;
                const img = imageRef.current;
                const imgWidth = img.naturalWidth;
                const imgHeight = img.naturalHeight;
                const newWidth = parseInt(width);
                const newHeight = parseInt(height);
                const newX = Math.max(0, (imgWidth - newWidth) / 2);
                const newY = Math.max(0, (imgHeight - newHeight) / 2);
                setCropArea({ x: newX, y: newY, width: newWidth, height: newHeight });
                setIsCropping(true);
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
            onClick={() => performCrop && performCrop(cropArea)} 
            disabled={!cropArea || !setIsCropping}
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