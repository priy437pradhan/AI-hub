import React, { useState, useEffect } from 'react';
import { 
  Wand2, Sparkles, User, Scissors, Palette, Image, 
  Zap, Eye, Copy, Trash2, RotateCcw, Download,
  Smile, Camera, Star, Heart, CloudLightning, Sun,
  Filter, ChevronDown, ChevronUp, Target, Layers,
  Focus, Contrast, Droplets, Move, Circle, Play,
  ArrowLeft, Check, X, MoreHorizontal, Share2,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const AIToolPanel = ({
  activeAITool,
  setActiveAITool,
  activeAIFeature,
  setActiveAIFeature,
  applyAIFeature,
  onBack
}) => {
  const [enhanceIntensity, setEnhanceIntensity] = useState(75);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sections = [
    {
      id: 'ai-enhance',
      label: 'AI Enhance',
      mobileLabel: 'Enhance',
      icon: <Wand2 size={16} />,
      mobileIcon: <Wand2 size={18} />,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      features: [
        { id: 'sharpen', label: 'Sharpen', icon: <Zap size={16} /> },
        { id: 'brighten', label: 'Brighten', icon: <Sun size={16} /> },
        { id: 'denoise', label: 'Denoise', icon: <Sparkles size={16} /> },
        { id: 'upscale', label: 'Upscale', icon: <Image size={16} /> },
        { id: 'enhance-colors', label: 'Colors', icon: <Palette size={16} /> },
        { id: 'auto-fix', label: 'Auto Fix', icon: <Wand2 size={16} /> },
      ]
    },
    {
      id: 'ai-remove',
      label: 'AI Remove',
      mobileLabel: 'Remove',
      icon: <Scissors size={16} />,
      mobileIcon: <Scissors size={18} />,
      color: 'red',
      gradient: 'from-red-500 to-pink-500',
      features: [
        { id: 'remove-bg', label: 'Remove BG', mobileLabel: 'Background', icon: <Scissors size={16} /> },
        { id: 'remove-object', label: 'Remove Object', mobileLabel: 'Object', icon: <Target size={16} /> },
        { id: 'remove-text', label: 'Remove Text', mobileLabel: 'Text', icon: <Eye size={16} /> },
        { id: 'remove-person', label: 'Remove Person', mobileLabel: 'Person', icon: <User size={16} /> },
      ]
    },
    {
      id: 'ai-restore',
      label: 'AI Restore',
      mobileLabel: 'Restore',
      icon: <RotateCcw size={16} />,
      mobileIcon: <RotateCcw size={18} />,
      color: 'green',
      gradient: 'from-green-500 to-teal-500',
      features: [
        { id: 'restore-old', label: 'Restore Old', mobileLabel: 'Old Photo', icon: <RotateCcw size={16} /> },
        { id: 'fix-blur', label: 'Fix Blur', icon: <Focus size={16} /> },
        { id: 'enhance-faces', label: 'Enhance Faces', mobileLabel: 'Faces', icon: <Smile size={16} /> },
        { id: 'color-restore', label: 'Color Restore', mobileLabel: 'Colorize', icon: <Palette size={16} /> },
      ]
    },
    {
      id: 'ai-crop',
      label: 'AI Crop',
      mobileLabel: 'Crop',
      icon: <Filter size={16} />,
      mobileIcon: <Filter size={18} />,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        { id: 'smart-crop', label: 'Smart Crop', mobileLabel: 'Smart', icon: <Filter size={16} /> },
        { id: 'face-crop', label: 'Face Crop', mobileLabel: 'Face', icon: <User size={16} /> },
        { id: 'object-crop', label: 'Object Crop', mobileLabel: 'Object', icon: <Target size={16} /> },
        { id: 'square-crop', label: 'Square Crop', mobileLabel: 'Square', icon: <Circle size={16} /> },
      ]
    }
  ];

  const handleApplyFeature = async (feature) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      const newHistoryItem = {
        id: Date.now(),
        action: feature,
        timestamp: 'Just now',
        preview: '🖼️'
      };
      setHistory(prev => [newHistoryItem, ...prev]);
      
      if (applyAIFeature) {
        applyAIFeature(feature);
      }
      
      // On mobile, close the section after applying
      if (isMobile) {
        setActiveSection(null);
        setActiveAIFeature(null);
      }
    }, 2000);
  };

  const handleSectionClick = (section) => {
    if (isMobile) {
      setActiveSection(section);
      setActiveAIFeature(null);
    } else {
      setActiveSection(activeSection === section ? '' : section);
    }
  };

  const handleBack = () => {
    if (activeSection) {
      setActiveSection(null);
      setActiveAIFeature(null);
    } else {
      onBack?.();
    }
  };

  // Desktop Components
  const SliderControl = ({ 
    label, 
    value, 
    onChange, 
    min = 0, 
    max = 100, 
    icon,
    color = "blue"
  }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-gray-400">{icon}</div>}
          <span className="text-sm text-gray-300 font-medium">{label}</span>
        </div>
        <span className={`text-sm font-medium ${value !== 0 ? `text-${color}-400` : 'text-gray-400'}`}>
          {value}%
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
        />
        <div 
          className={`absolute top-1/2 w-4 h-4 rounded-full border-2 transform -translate-y-1/2 cursor-pointer transition-all
            ${value !== 0 ? `bg-${color}-500 border-${color}-400` : 'bg-white border-gray-400'}`}
          style={{ 
            left: `calc(${((value - min) / (max - min)) * 100}% - 8px)` 
          }}
        />
      </div>
    </div>
  );

  const ButtonGrid = ({ items, activeId, onSelect, cols = 2 }) => (
    <div className={`grid grid-cols-${cols} gap-2 mb-4`}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 
            ${activeId === item.id 
              ? 'bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400' 
              : 'border border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300'
            }`}
        >
          <div className="mb-1">{item.icon}</div>
          <span className="text-xs text-center leading-tight font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );

  const SectionHeader = ({ section, onClick, isActive }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 mb-2
        ${isActive 
          ? 'bg-gray-700 text-white' 
          : 'bg-gray-800 hover:bg-gray-750 text-gray-300 hover:text-white'
        }`}
    >
      <div className="flex items-center space-x-3">
        {section.icon}
        <span className="font-medium">{section.label}</span>
      </div>
      {isActive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  );

  const renderDesktopSectionContent = (section) => {
    const getSliderProps = () => {
      switch (section.id) {
        case 'ai-enhance':
          return { label: "Enhancement Intensity", icon: <Sparkles size={14} />, color: "purple" };
        case 'ai-remove':
          return { label: "Removal Precision", icon: <Target size={14} />, color: "red" };
        case 'ai-restore':
          return { label: "Restoration Strength", icon: <RotateCcw size={14} />, color: "green" };
        case 'ai-crop':
          return { label: "Crop Sensitivity", icon: <Filter size={14} />, color: "cyan" };
        default:
          return { label: "Intensity", icon: <Sparkles size={14} />, color: "blue" };
      }
    };

    const sliderProps = getSliderProps();
    const gradientClass = `bg-gradient-to-r ${section.gradient.replace('from-', 'from-').replace('to-', 'to-')}`;

    return (
      <div className="space-y-4">
        <ButtonGrid 
          items={section.features} 
          activeId={activeAIFeature} 
          onSelect={setActiveAIFeature} 
          cols={2}
        />
        
        <SliderControl 
          label={sliderProps.label} 
          value={enhanceIntensity} 
          min={0} 
          max={100} 
          onChange={setEnhanceIntensity}
          icon={sliderProps.icon}
          color={sliderProps.color}
        />

        <div className="space-y-2">
          <button 
            onClick={() => handleApplyFeature(activeAIFeature)} 
            disabled={!activeAIFeature || isProcessing}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 
              ${(!activeAIFeature || isProcessing) 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : `${gradientClass} hover:shadow-lg text-white`
              }`}
          >
            {isProcessing ? 'Processing...' : `Apply ${section.mobileLabel}`}
          </button>
          
          {section.id === 'ai-enhance' && (
            <button 
              onClick={() => handleApplyFeature('auto-enhance')}
              disabled={isProcessing}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 
                ${isProcessing 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Zap size={16} />
                <span>Auto Enhance</span>
              </div>
            </button>
          )}
        </div>
      </div>
    );
  };

  const currentSection = sections.find(s => s.id === activeSection);

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-20">
        <div className="flex items-center justify-between px-4 py-2" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {/* Back Button */}
          <button 
            onClick={handleBack}
            className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-all duration-200"
          >
            <ArrowLeft size={18} className="text-white" />
            <span className="text-sm text-white"></span>
          </button>

          {/* Main Content */}
          <div className="flex items-center space-x-2 overflow-x-auto flex-1 mx-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
             
              <>
                {/* Section indicator */}
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-b ${currentSection.gradient} text-white mr-2`}>
                  {currentSection.mobileIcon}
                  <span className="text-xs font-medium">{currentSection.mobileLabel}</span>
                </div>

                {/* Features */}
                {currentSection.features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveAIFeature(feature.id)}
                    className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                      activeAIFeature === feature.id
                        ? `bg-gradient-to-b ${currentSection.gradient} shadow-lg text-white`
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    {feature.icon}
                    <span className="text-xs">{feature.mobileLabel || feature.label}</span>
                  </button>
                ))}

                {/* Intensity Control */}
                {activeAIFeature && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg ml-2">
                    <span className="text-xs text-gray-300">Intensity</span>
                    <div className="relative w-16 h-1 bg-gray-700 rounded-full">
                      <div 
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${currentSection.gradient} rounded-full transition-all duration-300`}
                        style={{ width: `${enhanceIntensity}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={enhanceIntensity}
                        onChange={(e) => setEnhanceIntensity(parseInt(e.target.value))}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <span className="text-xs text-white font-medium">{enhanceIntensity}%</span>
                  </div>
                )}

                {/* Apply Button */}
                {activeAIFeature && (
                  <button
                    onClick={() => handleApplyFeature(activeAIFeature)}
                    disabled={isProcessing}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                      isProcessing
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : `bg-gradient-to-r ${currentSection.gradient} hover:shadow-lg text-white`
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs">Processing...</span>
                      </div>
                    ) : (
                      <span className="text-xs">Apply</span>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="bg-gray-900 text-white h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6 text-gray-100">AI Tools</h2>
        
        <div className="space-y-2">
          {sections.map((section) => (
            <div key={section.id}>
              <SectionHeader
                section={section}
                onClick={() => setActiveSection(activeSection === section.id ? '' : section.id)}
                isActive={activeSection === section.id}
              />
              
              {activeSection === section.id && (
                <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                  {renderDesktopSectionContent(section)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Processing History */}
        {history.length > 0 && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
              <Layers size={14} className="mr-2" />
              Recent AI Operations
            </h3>
            <div className="space-y-2">
              {history.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{item.preview}</span>
                    <span className="text-xs text-gray-300">{item.action}</span>
                  </div>
                  <span className="text-xs text-gray-400">{item.timestamp}</span>
                </div>
              ))}
            </div>
            
            {history.length > 3 && (
              <button className="w-full mt-2 py-2 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                View all {history.length} operations
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIToolPanel;