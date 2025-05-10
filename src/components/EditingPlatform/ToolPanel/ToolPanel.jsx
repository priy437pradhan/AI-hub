import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import BottomToolbar from './BottomToolbar';
import BottomSheet from './BottomSheet';
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
  activeBeautyFeature,
  setActiveBeautyFeature,
  beautyIntensity,
  setBeautyIntensity,
  applyBeautyFeature,
  // Frames Panel props
  activeFrame,
  setActiveFrame,
  frameColor,
  setFrameColor,
  frameWidth,
  setFrameWidth,
  applyFrame,
  // Text Panel props
  activeTextStyle,
  setActiveTextStyle,
  textColor,
  setTextColor,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  textInput,
  setTextInput,
  addTextElement,
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
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [activeAdjustTool, setActiveAdjustTool] = useState(null);
  const [activeAITool, setActiveAITool] = useState(null);
  const [activeEffectsTool, setActiveEffectsTool] = useState(null);
  const [activeBeautyTool, setActiveBeautyTool] = useState(null);
  const [activeFramesTool, setActiveFramesTool] = useState(null);
  const [activeTextTool, setActiveTextTool] = useState(null);
  const [activeElementTool, setActiveElementTool] = useState(null);

  const renderActiveToolPanel = () => {
    switch (activeTool) {
      case toolNames.ADJUST:
        return (
          <AdjustToolPanel
            activeAdjustTool={activeAdjustTool}
            setActiveAdjustTool={setActiveAdjustTool}
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
            setupCropByAspectRatio={setupCropByAspectRatio}
            performFlip={performFlip}
            performRotate={performRotate}
          />
        );
      case toolNames.AI:
        return (
          <AIToolPanel
            activeAITool={activeAITool}
            setActiveAITool={setActiveAITool}
            activeAIFeature={activeAIFeature}
            setActiveAIFeature={setActiveAIFeature}
            applyAIFeature={applyAIFeature}
          />
        );
      case toolNames.EFFECTS:
        return (
          <EffectsToolPanel
            activeEffectsTool={activeEffectsTool}
            setActiveEffectsTool={setActiveEffectsTool}
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
            activeBeautyFeature={activeBeautyFeature}
            setActiveBeautyFeature={setActiveBeautyFeature}
            beautyIntensity={beautyIntensity}
            setBeautyIntensity={setBeautyIntensity}
            applyBeautyFeature={applyBeautyFeature}
          />
        );
      case toolNames.FRAMES:
        return (
          <FramesToolPanel
            activeFramesTool={activeFramesTool}
            setActiveFramesTool={setActiveFramesTool}
            activeFrame={activeFrame}
            setActiveFrame={setActiveFrame}
            frameColor={frameColor}
            setFrameColor={setFrameColor}
            frameWidth={frameWidth}
            setFrameWidth={setFrameWidth}
            applyFrame={applyFrame}
          />
        );
      case toolNames.TEXT:
        return (
          <TextToolPanel
            activeTextTool={activeTextTool}
            setActiveTextTool={setActiveTextTool}
            activeTextStyle={activeTextStyle}
            setActiveTextStyle={setActiveTextStyle}
            textColor={textColor}
            setTextColor={setTextColor}
            fontSize={fontSize}
            setFontSize={setFontSize}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            textInput={textInput}
            setTextInput={setTextInput}
            addTextElement={addTextElement}
          />
        );
      case toolNames.ELEMENTS:
        return (
          <ElementToolPanel
            activeElementTool={activeElementTool}
            setActiveElementTool={setActiveElementTool}
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
            setupCropByAspectRatio={setupCropByAspectRatio}
            performFlip={performFlip}
            performRotate={performRotate}
          />
        );
    }
  };

  return (
    <>
      {isMobile ? (
        <>
          <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-900 border-t border-gray-800 z-30">
            <BottomToolbar 
              activeTool={activeTool} 
              setSidebarOpen={setSidebarOpen} 
              isMobile={isMobile}
              setIsBottomSheetOpen={setIsBottomSheetOpen} 
            />
          </div>
          <BottomSheet 
            isOpen={isBottomSheetOpen} 
            onClose={() => setIsBottomSheetOpen(false)}
          >
            {renderActiveToolPanel()}
          </BottomSheet>
        </>
      ) : (
        <div className="bg-gray-900 h-full overflow-y-auto text-white shadow-lg w-64">
          <div className="p-3">
            {renderActiveToolPanel()}
          </div>
        </div>
      )}
    </>
  );
};

export default ToolPanel;