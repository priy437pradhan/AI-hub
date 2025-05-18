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
          />
        );
    }
  };

  // Return container with appropriate styling based on mobile/desktop
  return (
    <div className={`bg-gray-900 ${isMobile ? 'h-auto pb-6' : 'h-full w-64'} overflow-y-auto text-white shadow-lg`}>
      <div className="p-3">
        {renderActiveToolPanel()}
      </div>
    </div>
  );
};

export default ToolPanel;