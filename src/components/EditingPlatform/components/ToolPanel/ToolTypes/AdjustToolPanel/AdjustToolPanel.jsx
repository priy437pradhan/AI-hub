"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft, RotateCw, FlipHorizontal, Sun, Circle, Palette, ChevronDown, ChevronUp, Crop, Maximize2,
} from "lucide-react";

// Import the new component-based sections
import ResizeComponent from "./components/ResizeComponent";
import CropComponent from "./components/CropComponent";
import FlipComponent from "./components/FlipComponent";
import RotateComponent from "./components/RotateComponent";
import BasicAdjustComponent from "./components/BasicAdjustComponent";
import ColorAdjustComponent from "./components/ColorAdjustComponent";
import FineTuneComponent from "./components/FineTuneComponent";

import { categoryOrder, categoryLabels } from "./constants/aspectRatios";

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
  // ADD these props for filter states
  basicAdjust,
  setBasicAdjust,
  colorAdjust,
  setColorAdjust,
  finetuneAdjust,
  setFinetuneAdjust,
}) => {
  const [activeSection, setActiveSection] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("freeform");
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
      id: "finetune",
      label: "Finetune",
      mobileLabel: "Finetune",
      category: "color",
      icon: <Circle size={16} />,
      mobileIcon: <Circle size={18} />,
      color: "indigo",
      gradient: "from-indigo-500 to-purple-500",
    },
   
  ];

  const sectionCategories = {
    size: sections.filter((section) => section.category === "size"),
    color: sections.filter((section) => section.category === "color"),
    tool: sections.filter((section) => section.category === "tool"),
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Apply filters to image
  useEffect(() => {
    if (imageRef.current) {
      const filters = [];
      
      // Basic adjustments
      if (basicAdjust.brightness !== 0) {
        filters.push(`brightness(${100 + basicAdjust.brightness}%)`);
      }
      if (basicAdjust.contrast !== 0) {
        filters.push(`contrast(${100 + basicAdjust.contrast}%)`);
      }
      if (basicAdjust.saturation !== 0) {
        filters.push(`saturate(${100 + basicAdjust.saturation}%)`);
      }
      if (basicAdjust.sharpness !== 0) {
        filters.push(`sharpness(${100 + basicAdjust.sharpness}%)`);
      }
      
      // Color adjustments
      if (colorAdjust.temperature !== 0) {
        filters.push(`hue-rotate(${colorAdjust.temperature * 3.6}deg)`);
      }
      if (colorAdjust.tint !== 0) {
        filters.push(`hue-rotate(${colorAdjust.tint * 1.8}deg)`);
      }
      
      // FIXED: Proper invert filter - convert range to percentage
      if (colorAdjust.invertcolors !== 0) {
        const invertPercent = Math.abs(colorAdjust.invertcolors);
        filters.push(`invert(${invertPercent}%)`);
      }

      // Apply the combined filter
      imageRef.current.style.filter = filters.length > 0 ? filters.join(" ") : "none";


      if (finetuneAdjust.shadows !== 0) {
        filters.push(`brightness(${100 + finetuneAdjust.shadows}%)`);
      }
      if (finetuneAdjust.highlights!== 0) {
        filters.push(`contrast(${100 + finetuneAdjust.highlights}%)`);
      }
      if (finetuneAdjust.exposure !== 0) {
        filters.push(`saturate(${100 + finetuneAdjust.exposure}%)`);
      }
     
       else {
        imageRef.current.style.boxShadow = "none";
        imageRef.current.style.borderRadius = "0";
      }
    }
  }, [basicAdjust, colorAdjust, finetuneAdjust, imageRef]);

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
      case "finetune":
        return (
          <FineTuneComponent
            finetuneAdjust={finetuneAdjust} // Now using props
            setFinetuneAdjust={setFinetuneAdjust} // Now using props
            isMobile={isMobile}
            expandedSliders={expandedSliders}
            onToggleSlider={toggleSliderExpansion}
          />
        );
      case "flip":
        return <FlipComponent performFlip={performFlip}  isMobile={isMobile}/>;
      case "rotate":
        return <RotateComponent performRotate={performRotate} isMobile={isMobile}  />;
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
  
  // Mobile Layout
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-20">
        <div
          className="flex items-center justify-between px-0 py-0"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-all duration-200"
          >
            <ArrowLeft size={18} className="text-white" />
            <span className="text-sm text-white"></span>
          </button>
          {/* Main Content */}
          <div
            className="flex items-center space-x-2 overflow-x-auto flex-1 mx-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {!activeSection ? (
              // Main sections view
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
              // Section content view
              <div className="w-full max-h-80 overflow-y-auto">
                {/* Section indicator */}
                <div
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-b ${currentSection.gradient} text-white mb-3 sticky hidden top-0 z-10`}
                >
                  {currentSection.mobileIcon}
                  <span className="text-xs font-medium">
                    {currentSection.mobileLabel}
                  </span>
                </div>
                {/* Section content */}
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

  // Desktop Layout
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