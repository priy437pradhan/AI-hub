import React from 'react';
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
  activeAdjustTool,
  setActiveAdjustTool,
  // AI Panel props
  activeAIFeature,
  setActiveAIFeature,
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
            imagePreview={imagePreview}
          />
        );
    }
  };

  // Return container with appropriate styling based on mobile/desktop
  return (
    <div className={`bg-gray-900 ${isMobile ? 'h-auto pb-6' : 'h-full w-80'} overflow-y-auto text-white shadow-lg`}>
      {/* Undo/Redo Header */}
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

      {/* Tool Panel Content */}
      <div className="p-3">
        {renderActiveToolPanel()}
      </div>
    </div>
  );
};

export default ToolPanel;