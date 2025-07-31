"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  RotateCw,
  FlipHorizontal,
  Sun,
  Circle,
  Palette,
  ChevronDown,
  Grid3X3,
  Droplets,
  ChevronUp,
  Crop,
  Zap,
  Focus,
  Maximize2,
  Scissors,
  User,
  TrendingUp,
  CircleDot,
  Download,
  Undo2,
  Save,
  Eye,
  EyeOff
} from "lucide-react";

import { useCropOperations } from "./hooks/useCropOperations";
import {
  useAppDispatch,
  useToolsState,
  useFiltersState,
  useUIState,
  useCropState,
  useImageState,
} from '../../../../../../app/store/hooks/redux';
import {
  setActiveSubTool,
} from '../../../../../../app/store/slices/toolsSlice';

import {
  setCropActive,
  setCropSettings,
  // setImagePreview,
} from '../../../../../../app/store/slices/cropSlice';
import {
  updateFilter,
  resetFilters,
  resetFilterCategory,
} from '../../../../../../app/store/slices/filtersSlice';

import {
  toggleSliderExpansion,
} from '../../../../../../app/store/slices/uiSlice';

// Component imports
import BlurComponent from "./components/BlurComponent";
import MosaicComponent from "./components/MosaicComponent";
import VignetteComponent from "./components/VignetteComponent";
import DenoiseComponent from "./components/DenoiseComponent";
import StructureComponent from "./components/StructureComponent";
import ResizeComponent from "./components/ResizeComponent";
import CropComponent from "./components/CropComponent";
import FlipComponent from "./components/FlipComponent";
import RotateComponent from "./components/RotateComponent";
import BasicAdjustComponent from "./components/BasicAdjustComponent";
import ColorAdjustComponent from "./components/ColorAdjustComponent";
import FineTuneComponent from "./components/FineTuneComponent";

export const categoryOrder = [
  "smarttool",
  "size",
  "color",
  "advancededits",
  "specializededits",
];

export const categoryLabels = {
  smarttool: "Smart Tool",
  size: "Size",
  color: "Color",
  advancededits: "Advanced Edits",
  specializededits: "Specialized Edits",
};

const sections = [
  {
    id: "crop",
    label: "Crop",
    mobileLabel: "Crop",
    category: "size",
    icon: <Crop size={16} />,
    mobileIcon: <Crop size={18} />,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    description: "Adjust image dimensions and composition"
  },
  {
    id: "basic",
    label: "Basic Adjust",
    mobileLabel: "Basic",
    category: "color",
    icon: <Sun size={16} />,
    mobileIcon: <Sun size={18} />,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    description: "Brightness, contrast, saturation adjustments"
  },
  {
    id: "color",
    label: "Color Adjust",
    mobileLabel: "Color",
    category: "color",
    icon: <Palette size={16} />,
    mobileIcon: <Palette size={18} />,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    description: "Temperature, tint, and color balance"
  },
  {
    id: "fineTune",
    label: "Fine Tune",
    mobileLabel: "FineTune",
    category: "color",
    icon: <Circle size={16} />,
    mobileIcon: <Circle size={18} />,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    description: "Exposure, highlights, shadows"
  },
  {
    id: "flip",
    label: "Flip",
    mobileLabel: "Flip",
    category: "size",
    icon: <FlipHorizontal size={16} />,
    mobileIcon: <FlipHorizontal size={18} />,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    description: "Flip image horizontally or vertically"
  },
  {
    id: "rotate",
    label: "Rotate",
    mobileLabel: "Rotate",
    category: "size",
    icon: <RotateCw size={16} />,
    mobileIcon: <RotateCw size={18} />,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    description: "Rotate image in 90° increments"
  },
  {
    id: "aiupscaler",
    label: "AI Upscaler",
    mobileLabel: "Upscale",
    category: "smarttool",
    icon: <TrendingUp size={16} />,
    mobileIcon: <TrendingUp size={18} />,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    description: "Enhance image resolution with AI"
  },
  {
    id: "faceunblur",
    label: "Face Unblur",
    mobileLabel: "Face Fix",
    category: "smarttool",
    icon: <User size={16} />,
    mobileIcon: <User size={18} />,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    description: "AI-powered face enhancement"
  },
  {
    id: "backgroundremove",
    label: "Background Remove",
    mobileLabel: "BG Remove",
    category: "smarttool",
    icon: <Scissors size={16} />,
    mobileIcon: <Scissors size={18} />,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    description: "Automatically remove background"
  },
  {
    id: "resize",
    label: "Resize",
    mobileLabel: "Resize",
    category: "size",
    icon: <Maximize2 size={16} />,
    mobileIcon: <Maximize2 size={18} />,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    description: "Change image dimensions"
  },
  {
    id: "structure",
    label: "Structure",
    mobileLabel: "Structure",
    category: "advancededits",
    icon: <Zap size={16} />,
    mobileIcon: <Zap size={18} />,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    description: "Enhance details and texture"
  },
  {
    id: "denoise",
    label: "Denoise",
    mobileLabel: "Denoise",
    category: "advancededits",
    icon: <Focus size={16} />,
    mobileIcon: <Focus size={18} />,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    description: "Reduce image noise and grain"
  },
  {
    id: "vignette",
    label: "Vignette",
    mobileLabel: "Vignette",
    category: "advancededits",
    icon: <CircleDot size={16} />,
    mobileIcon: <CircleDot size={18} />,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    description: "Add darkened edges effect"
  },
  {
    id: "mosaic",
    label: "Mosaic",
    mobileLabel: "Mosaic",
    category: "advancededits",
    icon: <Grid3X3 size={16} />,
    mobileIcon: <Grid3X3 size={18} />,
    color: "blue",
    gradient:"from-blue-500 to-cyan-500",
    description: "Apply pixelation effects"
  },
  {
    id: "blur",
    label: "Blur",
    mobileLabel: "Blur",
    category: "advancededits",
    icon: <Droplets size={16} />,
    mobileIcon: <Droplets size={18} />,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    description: "Apply various blur effects"
  },
];

const AdjustToolPanel = ({
  imageRef,
  performFlip,
  performRotate,
  performResize,
  performCrop,
  performBackgroundRemoval,
  setCropWithAspectRatio, // ✅ CRITICAL: Receive this prop
  cancelCrop, // ✅ CRITICAL: Receive this prop
  onBack,
}) => {
  const dispatch = useAppDispatch();
  
  // Redux state
  const toolsState = useToolsState();
  const filtersState = useFiltersState();
  const uiState = useUIState();
  const cropState = useCropState();
  const imageState = useImageState();

  // Local state
  const [activeSection, setActiveSection] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(" ");

  // ✅ ADD DEBUG LOG
  console.log('AdjustToolPanel received crop props:', {
    setCropWithAspectRatio: !!setCropWithAspectRatio,
    cancelCrop: !!cancelCrop,
    performCrop: !!performCrop
  });

  // Memoized values
  const isMobile = uiState.isMobile;
  const expandedSliders = new Set(uiState.expandedSliders);
  
  const sectionCategories = useMemo(
    () => categoryOrder.reduce(
      (acc, cat) => ({
        ...acc,
        [cat]: sections.filter((s) => s.category === cat),
      }),
      {},
    ),
    []
  );

  const cropOperations = useCropOperations(
    imageRef,
    (preview) => dispatch(setImagePreview(preview))
  );

  const hasFilterChanges = useMemo(
    () => Object.values(filtersState).some((category) =>
      Object.values(category).some(
        (value) => typeof value === "number" && value !== 0,
      ),
    ),
    [filtersState],
  );

  // Filter update functions
  const createFilterSetter = (category) => (values) => {
    if (typeof values === "function") {
      const currentCategoryState = filtersState[category];
      const newValues = values(currentCategoryState);
      dispatch(updateFilter({ category, values: newValues }));
    } else {
      dispatch(updateFilter({ category, values }));
    }
  };

  const toggleSliderExpansionHandler = (sliderKey) => {
    dispatch(toggleSliderExpansion(sliderKey));
  };

  const handleSectionClick = (sectionId) => {
    setActiveSection(
      isMobile ? sectionId : activeSection === sectionId ? "" : sectionId,
    );
    // CRITICAL FIX: Update the activeAdjustTool when crop is selected
    if (sectionId === 'crop') {
      dispatch(setActiveSubTool({ toolType: 'adjust', subTool: 'crop' }));
      // Also activate crop mode immediately
      dispatch(setCropActive(true));
      dispatch(setCropSettings({ 
      x: 10, 
      y: 10, 
      width: 80, 
      height: 80, 
      isActive: true 
    }));
  }
  };

  const handleBack = () => {
    if (activeSection) {
      setActiveSection("");
    } else if (onBack) {
      onBack();
    }
  };

  const handleResetCategory = (category) => {
    dispatch(resetFilterCategory(category));
  };

  const handleResetAll = () => {
    dispatch(resetFilters());
  };

  const handleSavePreset = () => {
    // Implementation for saving current settings as preset
    const presetData = {
      name: `Preset ${Date.now()}`,
      filters: filtersState,
      timestamp: new Date().toISOString(),
    };
    console.log('Saving preset:', presetData);
    // You would save this to localStorage or send to backend
  };

  // Component props factory
  const createComponentProps = (additionalProps = {}) => ({
    isMobile,
    expandedSliders,
    onToggleSlider: toggleSliderExpansionHandler,
    previewMode,
    ...additionalProps,
  });

  // Section header component
  const SectionHeader = ({ section, onClick, isActive }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 mb-2 group ${
        isActive 
          ? "bg-gradient-to-r " + section.gradient + " text-white shadow-md" 
          : "bg-gray-800 hover:bg-gray-750 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-1 rounded ${isActive ? 'bg-white/20' : 'bg-gray-700 group-hover:bg-gray-600'}`}>
          {section.icon}
        </div>
        <div className="text-left">
          <div className="font-medium">{section.label}</div>
          {!isMobile && (
            <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
              {section.description}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
   
        {isActive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
    </button>
  );

  // Section content renderer
  const renderSectionContent = () => {
    const components = {
    crop: (
      <CropComponent
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        performCrop={performCrop}
        setCropWithAspectRatio={setCropWithAspectRatio} // ADD THIS LINE
      cancelCrop={cancelCrop}
        cropSettings={cropState.cropSettings}
        imagePreview={imageState.imagePreview}
        imageRef={imageRef}
        {...createComponentProps()}
      />
    ),
      resize: (
        <ResizeComponent
          performResize={performResize}
          imageRef={imageRef}
          {...createComponentProps()}
        />
      ),
      basic: (
        <BasicAdjustComponent
          basicAdjust={filtersState.basicAdjust}
          setBasicAdjust={createFilterSetter("basicAdjust")}
          onReset={() => handleResetCategory("basicAdjust")}
          {...createComponentProps()}
        />
      ),
      color: (
        <ColorAdjustComponent
          colorAdjust={filtersState.colorAdjust}
          setColorAdjust={createFilterSetter("colorAdjust")}
          onReset={() => handleResetCategory("colorAdjust")}
          {...createComponentProps()}
        />
      ),
      fineTune: (
        <FineTuneComponent
          fineTune={filtersState.fineTuneAdjust}
          setfineTune={createFilterSetter("fineTuneAdjust")}
          onReset={() => handleResetCategory("fineTuneAdjust")}
          {...createComponentProps()}
        />
      ),
      flip: (
        <FlipComponent 
          performFlip={performFlip} 
          {...createComponentProps()} 
        />
      ),
      rotate: (
        <RotateComponent 
          performRotate={performRotate} 
          {...createComponentProps()} 
        />
      ),
      structure: (
        <StructureComponent
          structureAdjust={filtersState.structureAdjust}
          setStructureAdjust={createFilterSetter("structureAdjust")}
          onReset={() => handleResetCategory("structureAdjust")}
          {...createComponentProps()}
        />
      ),
      denoise: (
        <DenoiseComponent
          denoiseAdjust={filtersState.denoiseAdjust}
          setDenoiseAdjust={createFilterSetter("denoiseAdjust")}
          onReset={() => handleResetCategory("denoiseAdjust")}
          {...createComponentProps()}
        />
      ),
      vignette: (
        <VignetteComponent
          vignetteAdjust={filtersState.vignetteAdjust}
          setVignetteAdjust={createFilterSetter("vignetteAdjust")}
          onReset={() => handleResetCategory("vignetteAdjust")}
          {...createComponentProps()}
        />
      ),
      mosaic: (
        <MosaicComponent
          mosaicAdjust={filtersState.mosaicAdjust}
          setMosaicAdjust={createFilterSetter("mosaicAdjust")}
          onReset={() => handleResetCategory("mosaicAdjust")}
          {...createComponentProps()}
        />
      ),
      blur: (
        <BlurComponent
          blurAdjust={filtersState.blurAdjust}
          setBlurAdjust={createFilterSetter("blurAdjust")}
          onReset={() => handleResetCategory("blurAdjust")}
          {...createComponentProps()}
        />
      ),
      backgroundremove: (
        <div className="space-y-4">
          <button
            onClick={performBackgroundRemoval}
            className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium"
          >
            Remove Background
          </button>
          <p className="text-xs text-gray-400 text-center">
            AI will automatically detect and remove the background
          </p>
        </div>
      ),
    };
    
    return components[activeSection] || components.basic;
  };

  const currentSection = sections.find((s) => s.id === activeSection);

  // Mobile rendering
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 md:border-t md:border-gray-700 z-20">
        <div
          className="flex items-center justify-between px-0 py-2"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-all duration-200"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          
        
          
          <div
            className="flex items-center space-x-2 overflow-x-auto flex-1 mx-4 scrollbar-hide"
            style={{ 
              scrollbarWidth: "none", 
              msOverflowStyle: "none" 
            }}
          >
            {!activeSection ? (
              sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className="flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap hover:bg-gray-800 text-gray-300 relative"
                >
                  {section.mobileIcon}
                  <span className="text-xs">{section.mobileLabel}</span>
                 
                </button>
              ))
            ) : (
              <div className="w-full max-h-80 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              
                <div className="px-2 pb-0">{renderSectionContent()}</div>
              </div>
            )}
          </div>
        </div>
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    );
  }

  // Desktop rendering
  return (
    <div className="bg-gray-900 text-white h-full overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
      <div className="p-4">
       
        
        {/* Category sections */}
        <div className="space-y-4">
          {categoryOrder.map((categoryKey) => (
            <div key={categoryKey} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {categoryLabels[categoryKey]}
                </h3>
                <div className="text-xs text-gray-400">
                  {sectionCategories[categoryKey].length} tools
                </div>
              </div>
              
              {sectionCategories[categoryKey].map((section) => (
                <div key={section.id}>
                  <SectionHeader
                    section={section}
                    onClick={() => handleSectionClick(section.id)}
                    isActive={activeSection === section.id}
                  />
                  {activeSection === section.id && (
                    <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                      {renderSectionContent()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AdjustToolPanel;