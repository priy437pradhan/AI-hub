"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft, RotateCw, FlipHorizontal, Sun, Circle, Palette, ChevronDown, Grid3X3, Droplets, ChevronUp, Crop, Zap ,Focus , Maximize2,Scissors,User,TrendingUp,CircleDot
} from "lucide-react";

import BlurComponent from "./components/BlurComponent";
import MosaicComponent from "./components/MosaicComponent";
import VignetteComponent from "./components/VignetteComponent";
import DenoiseComponent from "./components/DenoiseComponent"
import StructureComponent from "./components/StructureComponent";
import ResizeComponent from "./components/ResizeComponent";
import CropComponent from "./components/CropComponent";
import FlipComponent from "./components/FlipComponent";
import RotateComponent from "./components/RotateComponent";
import BasicAdjustComponent from "./components/BasicAdjustComponent";
import ColorAdjustComponent from "./components/ColorAdjustComponent";
import FineTuneComponent from "./components/FineTuneComponent";


export const categoryOrder = ["smarttool","size", "color", "advancededits" , "specializededits"];

export const categoryLabels = {
  smarttool :"Smart Tool",
  size: "Size",
  color: "Color",
  advancededits: "Advanced Edits",
  specializededits : "Specialized Edits"
};

const AdjustToolPanel = ({
  imageRef,
  performFlip,
  performRotate,
  performResize,
  // Crop-related props
  cropSettings,
  setCropSettings,
  performCrop,
  setCropWithAspectRatio,
  toggleCropMode,
  cancelCrop,
  updateCropPosition,
  updateCropDimensions,
  resetCrop,
  imagePreview,
  onBack,
  // Filter states (managed by parent)
  basicAdjust,
  setBasicAdjust,
  colorAdjust,
  setColorAdjust,
  fineTuneAdjust,
  setfineTuneAdjust,
  structureAdjust,
  setStructureAdjust,
  denoiseAdjust,
  setDenoiseAdjust,
vignetteAdjust,
setVignetteAdjust,
mosaicAdjust,
setMosaicAdjust,
blurAdjust,
setBlurAdjust


}) => {
  const [activeSection, setActiveSection] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(" ");
  const [expandedSliders, setExpandedSliders] = useState(new Set());

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
    },
    {
      id: "basic",
      label: "Basic Adjust",
      mobileLabel: "Basic",
      category: "color",
      icon: <Sun size={16} />,
      mobileIcon: <Sun size={18} />,
      color: "yellow",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      id: "color",
      label: "Color Adjust",
      mobileLabel: "Color",
      category: "color",
      icon: <Palette size={16} />,
      mobileIcon: <Palette size={18} />,
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "fineTune",
      label: "FineTune",
      mobileLabel: "FineTune",
      category: "color",
      icon: <Circle size={16} />,
      mobileIcon: <Circle size={18} />,
      color: "indigo",
      gradient: "from-indigo-500 to-purple-500",
    },
     {
      id: "flip",
      label: "Flip",
      mobileLabel: "Flip",
      category: "size",
      icon: <FlipHorizontal size={16} />,
      mobileIcon: <FlipHorizontal size={18} />,
      color: "green",
      gradient: "from-green-500 to-teal-500",
    },
    {
      id: "rotate",
      label: "Rotate",
      mobileLabel: "Rotate",
      category: "size",
      icon: <RotateCw size={16} />,
      mobileIcon: <RotateCw size={18} />,
      color: "red",
      gradient: "from-red-500 to-pink-500",
    },
     {
      id: "aiupscaler",
      label: "AI Upscaler",
      mobileLabel: "Upscale",
      category: "smarttool",
      icon: <TrendingUp size={16} />,
      mobileIcon: <TrendingUp size={18} />,
      color: "violet",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      id: "faceunblur",
      label: "Face Unblur",
      mobileLabel: "Face Fix",
      category: "smarttool",
      icon: <User size={16} />,
      mobileIcon: <User size={18} />,
      color: "lime",
      gradient: "from-lime-500 to-green-500",
    },
    {
      id: "backgroundremove",
      label: "Background Remove",
      mobileLabel: "Face Fix",
      category: "smarttool",
      icon: <User size={16} />,
      mobileIcon: <User size={18} />,
      color: "lime",
      gradient: "from-lime-500 to-green-500",
    },
   
    {
      id: "resize",
      label: "Resize",
      mobileLabel: "Resize",
      category: "size",
      icon: <Maximize2 size={16} />,
      mobileIcon: <Maximize2 size={18} />,
      color: "orange",
      gradient: "from-orange-500 to-red-500",
    },
    
    
     {
      id: "structure",
      label: "Structure",
      mobileLabel: "Structure",
      category: "advancededits",
      icon: <Zap size={16} />,
      mobileIcon: <Zap size={18} />,
      color: "teal",
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      id: "denoise",
      label: "Denoise",
      mobileLabel: "Denoise",
      category: "advancededits",
      icon: <Zap size={16} />,
      mobileIcon: <Zap size={18} />,
      color: "teal",
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      id: "vignette",
      label: "Vignette",
      mobileLabel: "Vignette",
      category: "advancededits",
      icon: <Focus size={16} />,
      mobileIcon: <Focus size={18} />,
      color: "slate",
      gradient: "from-slate-500 to-gray-500",
    },
    {
      id: "mosaic",
      label: "Mosaic",
      mobileLabel: "Mosaic",
      category: "advancededits",
      icon: <Grid3X3 size={16} />,
      mobileIcon: <Grid3X3 size={18} />,
      color: "emerald",
      gradient: "from-emerald-500 to-green-500",
    },
    {
      id: "blur",
      label: "Blur",
      mobileLabel: "Blur",
      category: "advancededits",
      icon: <Droplets size={16} />,
      mobileIcon: <Droplets size={18} />,
      color: "sky",
      gradient: "from-sky-500 to-blue-500",
    },
    {
      id: "backgroundblur",
      label: "Background Blur",
      mobileLabel: "Blur",
      category: "advancededits",
      icon: <Droplets size={16} />,
      mobileIcon: <Droplets size={18} />,
      color: "sky",
      gradient: "from-sky-500 to-blue-500",
    },
   
    {
      id: "curves",
      label: "Curves",
      mobileLabel: "Curves",
      category: "specializededits",
      icon: <TrendingUp size={16} />,
      mobileIcon: <TrendingUp size={18} />,
      color: "fuchsia",
      gradient: "from-fuchsia-500 to-purple-500",
    },
    {
      id: "hsl",
      label: "HSL",
      mobileLabel: "HSL",
      category: "specializededits",
      icon: <CircleDot size={16} />,
      mobileIcon: <CircleDot size={18} />,
      color: "pink",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: "imagecutout",
      label: "Image Cutout",
      mobileLabel: "Cutout",
      category: "specializededits",
      icon: <Scissors size={16} />,
      mobileIcon: <Scissors size={18} />,
      color: "stone",
      gradient: "from-stone-500 to-gray-500",
    },
  ];

  const sectionCategories = {
     smarttool: sections.filter((section) => section.category === "smarttool"),
    size: sections.filter((section) => section.category === "size"),
    color: sections.filter((section) => section.category === "color"),
    advancededits: sections.filter((section) => section.category === "advancededits"),
    specializededits : sections.filter((section) => section.category === "specializededits"),
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);



  const toggleSliderExpansion = (sliderKey) => {
    setExpandedSliders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sliderKey)) {
        newSet.delete(sliderKey);
      } else {
        newSet.add(sliderKey);
      }
      return newSet;
    });
  };

  const handleSectionClick = (sectionId) => {
    if (isMobile) {
      setActiveSection(sectionId);
    } else {
      setActiveSection(activeSection === sectionId ? "" : sectionId);
    }
  };

  const handleBack = () => {
    if (activeSection) {
      setActiveSection("");
    } else {
      onBack?.();
    }
  };
const handleApplyBlur = () => {
  // Trigger re-render of canvas with blur applied
  // This should trigger your filter application useEffect
  setBlurAdjust(prev => ({ ...prev, applied: true }));
};
  const SectionHeader = ({ section, onClick, isActive }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 mb-2
        ${
          isActive
            ? "bg-gray-700 text-white"
            : "bg-gray-800 hover:bg-gray-750 text-gray-300 hover:text-white"
        }`}
    >
      <div className="flex items-center space-x-3">
        {section.icon}
        <span className="font-medium">{section.label}</span>
      </div>
      {isActive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "crop":
        return (
          <CropComponent
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            setCropWithAspectRatio={setCropWithAspectRatio}
            performCrop={performCrop}
            cancelCrop={cancelCrop}
            cropSettings={cropSettings}
            imagePreview={imagePreview}
            imageRef={imageRef}
            isMobile={isMobile}
          />
        );
      case "resize":
        return (
          <ResizeComponent
            performResize={performResize}
            imageRef={imageRef}
            isMobile={isMobile}
          />
        );
      case "basic":
        return (
          <BasicAdjustComponent
            basicAdjust={basicAdjust} 
            setBasicAdjust={setBasicAdjust}
            isMobile={isMobile}
            expandedSliders={expandedSliders}
            onToggleSlider={toggleSliderExpansion}
          />
        );
      case "color":
        return (
          <ColorAdjustComponent
            colorAdjust={colorAdjust} 
            setColorAdjust={setColorAdjust} 
            isMobile={isMobile}
            expandedSliders={expandedSliders}
            onToggleSlider={toggleSliderExpansion}
          />
        );
      case "fineTune":
        return (
          <FineTuneComponent
            fineTune={fineTuneAdjust} setfineTune={setfineTuneAdjust} 
            isMobile={isMobile}
            expandedSliders={expandedSliders}
            onToggleSlider={toggleSliderExpansion}
          />
        );
      case "flip":
        return <FlipComponent performFlip={performFlip} isMobile={isMobile}/>;
      case "rotate":
        return <RotateComponent performRotate={performRotate} isMobile={isMobile} />;

   case "structure":
        return (
          <StructureComponent
          structureAdjust={structureAdjust}  
          setStructureAdjust={setStructureAdjust} 
           isMobile={isMobile}
            expandedSliders={expandedSliders}
            onToggleSlider={toggleSliderExpansion}
          />
        );

   case "denoise":
        return (
          <DenoiseComponent
          denoiseAdjust={denoiseAdjust}  
         setDenoiseAdjust={setDenoiseAdjust} 
           isMobile={isMobile}
            expandedSliders={expandedSliders}
            onToggleSlider={toggleSliderExpansion}
          />
        );
        case "vignette":
  return (
    <VignetteComponent
      vignetteAdjust={vignetteAdjust}  
      setVignetteAdjust={setVignetteAdjust} 
      isMobile={isMobile}
      expandedSliders={expandedSliders}
      onToggleSlider={toggleSliderExpansion}
    />
  );
case "mosaic":
  return (
    <MosaicComponent
      mosaicAdjust={mosaicAdjust}  
      setMosaicAdjust={setMosaicAdjust} 
      isMobile={isMobile}
      expandedSliders={expandedSliders}
      onToggleSlider={toggleSliderExpansion}
    />
  );
case "blur":
  return (
    <BlurComponent
      blurAdjust={blurAdjust}  
      setBlurAdjust={setBlurAdjust} 
      isMobile={isMobile}
      expandedSliders={expandedSliders}
      onToggleSlider={toggleSliderExpansion}
      onApplyBlur={handleApplyBlur}
    />
  );

      default:
        return (
          <BasicAdjustComponent
            basicAdjust={basicAdjust} 
            setBasicAdjust={setBasicAdjust} 

            isMobile={isMobile}
            expandedSliders={expandedSliders}
            onToggleSlider={toggleSliderExpansion}
          />
        );
    }
  };

  const currentSection = sections.find((s) => s.id === activeSection);
  
 
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-20">
        <div
          className="flex items-center justify-between px-0 py-2"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-all duration-200"
          >
            <ArrowLeft size={18} className="text-white" />
            <span className="text-sm text-white"></span>
          </button>
          <div
            className="flex items-center space-x-2 overflow-x-auto flex-1 mx-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {!activeSection ? (
              sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className="flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap hover:bg-gray-800 text-gray-300"
                >
                  {section.mobileIcon}
                  <span className="text-xs">{section.mobileLabel}</span>
                </button>
              ))
            ) : (
              <div className="w-full max-h-80 overflow-y-auto">
                <div
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-b ${currentSection.gradient} text-white mb-3 sticky hidden top-0 z-10`}
                >
                  {currentSection.mobileIcon}
                  <span className="text-xs font-medium">
                    {currentSection.mobileLabel}
                  </span>
                </div>
                <div className="px-2 pb-0">{renderSectionContent()}</div>
              </div>
            )}
          </div>
        </div>
        <style jsx>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
      </div>
    );
  }


  return (
    <div className="bg-gray-900 text-white h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6 text-gray-100">Adjust</h2>
        <div className="space-y-2">
          {categoryOrder.map((categoryKey) => (
            <div key={categoryKey} className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                {categoryLabels[categoryKey]}
              </h3>
              {sectionCategories[categoryKey].map((section) => (
                <div key={section.id}>
                  <SectionHeader
                    section={section}
                    onClick={() =>
                      setActiveSection(
                        activeSection === section.id ? "" : section.id
                      )
                    }
                    isActive={activeSection === section.id}
                  />
                  {activeSection === section.id && (
                    <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                      {renderSectionContent()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdjustToolPanel;