import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AdjustToolPanel from './panels/AdjustToolPanel';
import AIToolPanel from './panels/AIToolPanel';
import EffectsToolPanel from './panels/EffectsToolPanel';
import BeautyToolPanel from './panels/BeautyToolPanel';
import FramesToolPanel from './panels/FramesToolPanel';
import TextToolPanel from './panels/TextToolPanel';
import ElementToolPanel from './panels/ElementToolPanel';
import { toolNames } from '../data/constants';

const ToolPanel = ({
  activeTool,
  isMobile,
  setSidebarOpen,
  imagePreview,
  // ✅ Undo/Redo props
  canUndo,
  canRedo,
  performUndo,
  performRedo,
  // ✅ Crop props
  cropSettings,
  setCropSettings,
  performCrop,
  setCropWithAspectRatio,
  toggleCropMode,
  cancelCrop,
  updateCropPosition,
  updateCropDimensions,
  resetCrop,
  // Adjust panel props
  imageRef,
  performFlip,
  performRotate,
  performResize,
  activeAdjustTool,
  setActiveAdjustTool,
  // AI Panel props
  activeAIFeature,
  setActiveAIFeature,
  performBackgroundRemoval,
  applyAIFeature,
  // Effects Panel props
  activeEffect,
  setActiveEffect,
  effectIntensity,
  setEffectIntensity,
  applyEffect,
  // Beauty Panel props
  activeBeautyTool,
  setActiveBeautyTool,
  applyBeautyFeature,
  beautySettings,
  // Frames Panel props
  activeFramesTool,
  setActiveFramesTool,
  frameSettings,
  setFrameSettings,
  applyFrame,
  applyFrameEffects,
  // Text tool selection props
  activeTextTool,
  setActiveTextTool,
  // Text editing props
  textElements,
  textSettings,
  setTextSettings,
  addTextElement,
  removeTextElement,
  updateTextElement,
  applyTextToImage,
  clearAllText,
  // Text styles props
  styleSettings,
  setStyleSettings,
  applyTextStyle,
  toggleStyle,
  updateStyleSetting,
  // Element Panel props
  activeElementType,
  setActiveElementType,
  selectedElement,
  setSelectedElement,
  elementColor,
  setElementColor,
  elementSize,
  setElementSize,
  addElement
}) => {
  // Add expand/collapse state - default expanded
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Determine which panel to render based on active tool
  const renderActiveToolPanel = () => {
    switch (activeTool) {
      case toolNames.ADJUST:
        return (
          <AdjustToolPanel
            activeAdjustTool={activeAdjustTool}
            setActiveAdjustTool={setActiveAdjustTool}
            imageRef={imageRef}
            performFlip={performFlip}
            performRotate={performRotate}
            performResize={performResize}
            cropSettings={cropSettings}
            setCropSettings={setCropSettings}
            performCrop={performCrop}
            setCropWithAspectRatio={setCropWithAspectRatio}
            toggleCropMode={toggleCropMode}
            cancelCrop={cancelCrop}
            updateCropPosition={updateCropPosition}
            updateCropDimensions={updateCropDimensions}
            resetCrop={resetCrop}
            imagePreview={imagePreview}
            performBackgroundRemoval={performBackgroundRemoval}
            
          />
        );
      case toolNames.AI:
        return (
          <AIToolPanel
            activeAIFeature={activeAIFeature}
            setActiveAIFeature={setActiveAIFeature}
            applyAIFeature={applyAIFeature}
          />
        );
      case toolNames.EFFECTS:
        return (
          <EffectsToolPanel
            activeEffect={activeEffect}
            setActiveEffect={setActiveEffect}
            effectIntensity={effectIntensity}
            setEffectIntensity={setEffectIntensity}
            applyEffect={applyEffect}
          />
        );
      case toolNames.BEAUTY:
        return (
          <BeautyToolPanel
            activeBeautyTool={activeBeautyTool}
            setActiveBeautyTool={setActiveBeautyTool}
            applyBeautyFeature={applyBeautyFeature}
            beautySettings={beautySettings}
          />
        );
      case toolNames.FRAMES:
        return (
          <FramesToolPanel
            activeFramesTool={activeFramesTool}
            setActiveFramesTool={setActiveFramesTool}
            frameSettings={frameSettings}
            setFrameSettings={setFrameSettings}
            applyFrame={applyFrame}
            applyFrameEffects={applyFrameEffects}
          />
        );
      case toolNames.TEXT:
        return (
          <TextToolPanel
            activeTextTool={activeTextTool}
            setActiveTextTool={setActiveTextTool}
            // Text Editor props
            textElements={textElements}
            textSettings={textSettings}
            setTextSettings={setTextSettings}
            addTextElement={addTextElement}
            removeTextElement={removeTextElement}
            updateTextElement={updateTextElement}
            applyTextToImage={applyTextToImage}
            clearAllText={clearAllText}
            // Text Styles props
            styleSettings={styleSettings}
            setStyleSettings={setStyleSettings}
            applyTextStyle={applyTextStyle}
            toggleStyle={toggleStyle}
            updateStyleSetting={updateStyleSetting}
          />
        );
      case toolNames.ELEMENTS:
        return (
          <ElementToolPanel
            activeElementType={activeElementType}
            setActiveElementType={setActiveElementType}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            elementColor={elementColor}
            setElementColor={setElementColor}
            elementSize={elementSize}
            setElementSize={setElementSize}
            addElement={addElement}
          />
        );
      default:
        return (
          <AdjustToolPanel
             activeAdjustTool={activeAdjustTool}
            setActiveAdjustTool={setActiveAdjustTool}
            imageRef={imageRef}
            performFlip={performFlip}
            performRotate={performRotate}
            performResize={performResize}
            cropSettings={cropSettings}
            setCropSettings={setCropSettings}
            performCrop={performCrop}
            setCropWithAspectRatio={setCropWithAspectRatio}
            toggleCropMode={toggleCropMode}
            cancelCrop={cancelCrop}
            updateCropPosition={updateCropPosition}
            updateCropDimensions={updateCropDimensions}
            resetCrop={resetCrop}
            imagePreview={imagePreview}
          />
        );
    }
  };

  // Return container with appropriate styling based on mobile/desktop and expanded state
  return (
    <div className="relative flex">
      <div className={`bg-gray-900 ${isExpanded ? (isMobile ? 'w-full' : 'w-80') : 'w-12'} ${isMobile ? 'h-auto pb-6' : 'h-full'} overflow-y-auto text-white shadow-lg transition-all duration-300 ease-in-out`}>
        {/* Undo/Redo Header - Only show when expanded */}
        {isExpanded && (
          <div className="flex items-center justify-between p-3 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <button
                onClick={performUndo}
                disabled={!canUndo}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  canUndo 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
                title="Undo (Ctrl+Z)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button
                onClick={performRedo}
                disabled={!canRedo}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  canRedo 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
                title="Redo (Ctrl+Y)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                </svg>
              </button>
            </div>
            <div className="text-sm text-gray-400">
              {activeTool}
            </div>
          </div>
        )}

        {/* Tool Panel Content - Only show when expanded */}
        {isExpanded && (
          <div className="p-3">
            {renderActiveToolPanel()}
          </div>
        )}

        {/* Collapsed state - show minimal indicator */}
        {!isExpanded && (
          <div className="flex flex-col items-center justify-center h-full py-4">
            <div className="transform rotate-90 text-xs text-gray-400 whitespace-nowrap">
              Tools
            </div>
          </div>
        )}
      </div>

      {/* Expand/Collapse Toggle Button */}
      <button
        onClick={toggleExpanded}
        className="absolute top-1/2 -translate-y-1/2 right-2 z-10 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full p-2 shadow-lg transition-all duration-200 hover:shadow-xl"
        title={isExpanded ? 'Collapse panel' : 'Expand panel'}
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4 text-gray-300" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-300" />
        )}
      </button>
    </div>
  );
};

export default ToolPanel;