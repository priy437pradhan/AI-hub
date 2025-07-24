import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Undo, Redo } from 'lucide-react';
import AdjustToolPanel from './ToolTypes/AdjustToolPanel/AdjustToolPanel';
import AIToolPanel from './ToolTypes/AiToolPanel/AIToolPanel';
import EffectsToolPanel from './ToolTypes/Effect/EffectsToolPanel';
import BeautyToolPanel from './ToolTypes/Beauty/BeautyToolPanel';
import FramesToolPanel from './ToolTypes/Frame/FramesToolPanel';
import TextToolPanel from './ToolTypes/Text/TextToolPanel';
import ElementToolPanel from './ToolTypes/Elements/ElementToolPanel';

export const toolNames = {
  ADJUST: 'adjust', 
  AI: 'ai',
  EFFECTS: 'effects',
  BEAUTY: 'beauty',
  FRAMES: 'frames',
  TEXT: 'text',
  ELEMENTS: 'elements'
};

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
  // ✅ ADD these filter state props
  basicAdjust,
  setBasicAdjust,
  colorAdjust,
  setColorAdjust,
  finetuneAdjust,
  setFinetuneAdjust,
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
            // ✅ PASS the filter state props to AdjustToolPanel
            basicAdjust={basicAdjust}
            setBasicAdjust={setBasicAdjust}
            colorAdjust={colorAdjust}
            setColorAdjust={setColorAdjust}
            finetuneAdjust={finetuneAdjust}
            setFinetuneAdjust={setFinetuneAdjust}
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
            // ✅ ALSO pass filter state props to default case
            basicAdjust={basicAdjust}
            setBasicAdjust={setBasicAdjust}
            colorAdjust={colorAdjust}
            setColorAdjust={setColorAdjust}
            finetuneAdjust={finetuneAdjust}
            setFinetuneAdjust={setFinetuneAdjust}
          />
        );
    }
  };

  return (
    <div className="relative flex">
      <div className={`bg-gray-900 ${isExpanded ? (isMobile ? 'w-full' : 'w-80') : 'w-12'} ${isMobile ? 'h-auto pb-6' : 'h-full'} overflow-y-auto text-white shadow-lg transition-all duration-300 ease-in-out`}>
        
        {/* Undo/Redo Controls - Always visible when expanded */}
        {isExpanded && (
          <div style={{ display:"none" }} className="sticky  top-0 z-10 bg-gray-900 border-b border-gray-700 p-3 flex gap-2">
            <button
              onClick={performUndo}
              disabled={!canUndo}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                canUndo 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              title="Undo last action (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
              {!isMobile && 'Undo'}
            </button>
            
            <button
              onClick={performRedo}
              disabled={!canRedo}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                canRedo 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              title="Redo last action (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
              {!isMobile && 'Redo'}
            </button>
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