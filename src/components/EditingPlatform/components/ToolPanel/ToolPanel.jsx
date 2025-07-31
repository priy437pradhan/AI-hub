import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AdjustToolPanel from "./ToolTypes/AdjustToolPanel/AdjustToolPanel";
import AIToolPanel from "./ToolTypes/AiToolPanel/AIToolPanel";
import EffectsToolPanel from "./ToolTypes/Effect/EffectsToolPanel";
import BeautyToolPanel from "./ToolTypes/Beauty/BeautyToolPanel";
import FramesToolPanel from "./ToolTypes/Frame/FramesToolPanel";
import TextToolPanel from "./ToolTypes/Text/TextToolPanel";
import ElementToolPanel from "./ToolTypes/Elements/ElementToolPanel";
import UndoRedoControls from "../../../../app/store/UndoRedoControls";

// Redux hooks
import {
  useAppDispatch,
  useImageState,
  useToolsState,
  useFiltersState,
  useUIState,
  useCropState,
  useTextState,
  useFrameState,
  useBeautyState,
  useHistoryState,
} from '../../../../../src/app/store/hooks/redux';

import { toolNames } from '../../../../../src/app/store/slices/toolsSlice';
import { setActiveSubTool } from '../../../../../src/app/store/slices/toolsSlice';
import { updateFilter } from '../../../../../src/app/store/slices/filtersSlice';
import { useHistory } from '../../../../app/store/useHistory';

const ToolPanel = ({
  imageRef,
  performFlip,
  performRotate,
  performCrop,
  performResize,
  applyBeautyFeature,
  applyFrame,
  applyFrameEffects,
  addTextElement,
  removeTextElement,
  applyTextToImage,
  clearAllText,
  applyTextStyle,
  toggleStyle,
  updateStyleSetting,
  addElement,
  // AI and Effects props that might not be in Redux yet
  activeAIFeature,
  setActiveAIFeature,
  performBackgroundRemoval,
  applyAIFeature,
  activeEffect,
  setActiveEffect,
  effectIntensity,
  setEffectIntensity,
  applyEffect,
  // Elements props that might not be in Redux yet
  activeElementType,
  setActiveElementType,
  selectedElement,
  setSelectedElement,
  elementColor,
  setElementColor,
  elementSize,
  setElementSize,
  // ✅ CRITICAL CROP PROPS
  setCropWithAspectRatio,
  cancelCrop,
  ...otherProps // Catch all remaining props
}) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  
  // Redux state
  const imageState = useImageState();
  const toolsState = useToolsState();
  const filtersState = useFiltersState();
  const uiState = useUIState();
  const cropState = useCropState();
  const textState = useTextState();
  const frameState = useFrameState();
  const beautyState = useBeautyState();
  const historyState = useHistoryState();

  // Local state
  const [isExpanded, setIsExpanded] = useState(true);

  // Extract values from Redux state
  const activeTool = toolsState.activeTool;
  const activeAdjustTool = toolsState.activeTools.adjust;
  const activeBeautyTool = toolsState.activeTools.beauty;
  const activeFramesTool = toolsState.activeTools.frames;
  const activeTextTool = toolsState.activeTools.text;
  const isMobile = uiState.isMobile;
  const imagePreview = imageState.imagePreview;

  // ✅ ADD DEBUG LOG TO VERIFY PROPS ARE RECEIVED
  console.log('ToolPanel received crop props:', {
    setCropWithAspectRatio: !!setCropWithAspectRatio,
    cancelCrop: !!cancelCrop,
    performCrop: !!performCrop
  });

  // Initialize history when component mounts or when image changes
  useEffect(() => {
    if (imagePreview && !historyState.present) {
      const currentState = history.createStateSnapshot(
        imagePreview,
        filtersState,
        textState.textElements,
        frameState.frameSettings,
        beautyState.beautySettings
      );
      history.initHistory(currentState);
    }
  }, [imagePreview, historyState.present]);

  useEffect(() => {
    if (!imagePreview) return;

    const currentState = history.createStateSnapshot(
      imagePreview,
      filtersState,
      textState.textElements,
      frameState.frameSettings,
      beautyState.beautySettings
    );

    history.saveCurrentState(currentState);
  }, [filtersState, textState.textElements, frameState.frameSettings, beautyState.beautySettings]);

  // Handle undo
  const handleUndo = () => {
    history.undo(historyState);
  };

  // Handle redo
  const handleRedo = () => {
    history.redo(historyState);
  };

  // Wrap major operations to save to history immediately
  const wrapWithHistorySave = (operation) => {
    return async (...args) => {
      const result = await operation(...args);
      
      if (result && imagePreview) {
        const currentState = history.createStateSnapshot(
          result,
          filtersState,
          textState.textElements,
          frameState.frameSettings,
          beautyState.beautySettings
        );
        history.saveCurrentStateImmediate(currentState);
      }
      
      return result;
    };
  };

  // Wrap operations that should save to history
  const wrappedPerformCrop = wrapWithHistorySave(performCrop);
  const wrappedPerformFlip = wrapWithHistorySave(performFlip);
  const wrappedPerformRotate = wrapWithHistorySave(performRotate);
  const wrappedApplyFrame = wrapWithHistorySave(applyFrame);
  const wrappedApplyFrameEffects = wrapWithHistorySave(applyFrameEffects);

  // Redux dispatch functions for tool setting
  const setActiveAdjustTool = (tool) => {
    dispatch(setActiveSubTool({ toolType: 'adjust', subTool: tool }));
  };

  const setActiveBeautyTool = (tool) => {
    dispatch(setActiveSubTool({ toolType: 'beauty', subTool: tool }));
  };

  const setActiveFramesTool = (tool) => {
    dispatch(setActiveSubTool({ toolType: 'frames', subTool: tool }));
  };

  const setActiveTextTool = (tool) => {
    dispatch(setActiveSubTool({ toolType: 'text', subTool: tool }));
  };

  // Filter setter functions using Redux
  const createFilterSetter = (category) => (values) => {
    if (typeof values === "function") {
      const currentCategoryState = filtersState[category];
      const newValues = values(currentCategoryState);
      dispatch(updateFilter({ category, values: newValues }));
    } else {
      dispatch(updateFilter({ category, values }));
    }
  };

  // Text functions from Redux state
  const {
    textElements,
    textSettings,
    styleSettings,
  } = textState;

  // Redux text update functions (you'll need to implement these in your text hooks)
  const setTextSettings = (settings) => {
    console.log('setTextSettings should be implemented with Redux dispatch', settings);
  };

  const setStyleSettings = (settings) => {
    console.log('setStyleSettings should be implemented with Redux dispatch', settings);
  };

  const updateTextElement = (id, updates) => {
    console.log('updateTextElement should be implemented with Redux dispatch', id, updates);
  };

  // Frame settings from Redux
  const { frameSettings } = frameState;
  const setFrameSettings = (settings) => {
    console.log('setFrameSettings should be implemented with Redux dispatch', settings);
  };

  // Beauty settings from Redux
  const { beautySettings } = beautyState;

  const adjustToolPanelProps = {
    activeAdjustTool,
    setActiveAdjustTool,
    imageRef,
    performFlip: wrappedPerformFlip,
    performRotate: wrappedPerformRotate,
    performResize,
    cropSettings: cropState, 
    performCrop: wrappedPerformCrop,
    // ✅ CRITICAL: Pass through crop functions from props
    setCropWithAspectRatio,
    cancelCrop,
    imagePreview,
    performBackgroundRemoval,
    // Filter states and setters from Redux
    basicAdjust: filtersState.basicAdjust || { brightness: 0, contrast: 0, saturation: 0, sharpness: 0 },
    setBasicAdjust: createFilterSetter("basicAdjust"),
    colorAdjust: filtersState.colorAdjust || { temperature: 0, tint: 0, invertcolors: 0 },
    setColorAdjust: createFilterSetter("colorAdjust"),
    fineTuneAdjust: filtersState.fineTuneAdjust || { exposure: 0, highlights: 0, shadows: 0 },
    setfineTuneAdjust: createFilterSetter("fineTuneAdjust"),
    structureAdjust: filtersState.structureAdjust || { details: 0, gradient: 0 },
    setStructureAdjust: createFilterSetter("structureAdjust"),
    denoiseAdjust: filtersState.denoiseAdjust || { colornoise: 0, luminancenoise: 0 },
    setDenoiseAdjust: createFilterSetter("denoiseAdjust"),
    vignetteAdjust: filtersState.vignetteAdjust || { intensity: 0, size: 50, feather: 50 },
    setVignetteAdjust: createFilterSetter("vignetteAdjust"),
    mosaicAdjust: filtersState.mosaicAdjust || { type: "square", size: 0, pixelSize: 1 },
    setMosaicAdjust: createFilterSetter("mosaicAdjust"),
    blurAdjust: filtersState.blurAdjust || {
      type: "circular",
      intensity: 0,
      applied: false,
      preview: false,
    },
    setBlurAdjust: createFilterSetter("blurAdjust"),
  };

  const toolPanels = {
    [toolNames.ADJUST]: <AdjustToolPanel {...adjustToolPanelProps} />,
    [toolNames.AI]: (
      <AIToolPanel
        activeAIFeature={activeAIFeature}
        setActiveAIFeature={setActiveAIFeature}
        applyAIFeature={applyAIFeature}
      />
    ),
    [toolNames.EFFECTS]: (
      <EffectsToolPanel
        activeEffect={activeEffect}
        setActiveEffect={setActiveEffect}
        effectIntensity={effectIntensity}
        setEffectIntensity={setEffectIntensity}
        applyEffect={applyEffect}
      />
    ),
    [toolNames.BEAUTY]: (
      <BeautyToolPanel
        activeBeautyTool={activeBeautyTool}
        setActiveBeautyTool={setActiveBeautyTool}
        applyBeautyFeature={applyBeautyFeature}
        beautySettings={beautySettings}
      />
    ),
    [toolNames.FRAMES]: (
      <FramesToolPanel
        activeFramesTool={activeFramesTool}
        setActiveFramesTool={setActiveFramesTool}
        frameSettings={frameSettings}
        setFrameSettings={setFrameSettings}
        applyFrame={wrappedApplyFrame}
        applyFrameEffects={wrappedApplyFrameEffects}
      />
    ),
    [toolNames.TEXT]: (
      <TextToolPanel
        activeTextTool={activeTextTool}
        setActiveTextTool={setActiveTextTool}
        textElements={textElements}
        textSettings={textSettings}
        setTextSettings={setTextSettings}
        addTextElement={addTextElement}
        removeTextElement={removeTextElement}
        updateTextElement={updateTextElement}
        applyTextToImage={applyTextToImage}
        clearAllText={clearAllText}
        styleSettings={styleSettings}
        setStyleSettings={setStyleSettings}
        applyTextStyle={applyTextStyle}
        toggleStyle={toggleStyle}
        updateStyleSetting={updateStyleSetting}
      />
    ),
    [toolNames.ELEMENTS]: (
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
    ),
  };

  return (
    <div className="relative flex">
      <div
        className={`bg-gray-900 ${isExpanded ? (isMobile ? "w-full" : "w-80") : "w-12"} ${isMobile ? "h-auto pb-6" : "h-full"} overflow-y-auto text-white shadow-lg transition-all duration-300 ease-in-out scrollbar-hide`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none', 
        }}
      >
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none; /* Safari and Chrome */
          }
        `}</style>
        
        {isExpanded && (
          <>
          <div className="p-3 hidden md:block">
           
            <div className="pb-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-2">
              </div>
              <UndoRedoControls
                canUndo={historyState.canUndo}
                canRedo={historyState.canRedo}
                onUndo={handleUndo}
                onRedo={handleRedo}
                className="w-full"
                showLabels={!isMobile}
                orientation="horizontal"
              />
            </div>
          </div>
           {toolPanels[activeTool] || toolPanels[toolNames.ADJUST]}
           </>
        )}
        {!isExpanded && (
          <div className="flex flex-col items-center justify-center h-full py-4">
            <div className="transform rotate-90 text-xs text-gray-400 whitespace-nowrap">
              Tools
            </div>
          </div>
        )}
      </div>
   <button
  onClick={() => setIsExpanded(!isExpanded)}
  className="hidden md:block absolute top-1/2 -translate-y-1/2 right-2 z-10 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full p-2 shadow-lg transition-all duration-200 hover:shadow-xl"
  title={isExpanded ? "Collapse panel" : "Expand panel"}
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