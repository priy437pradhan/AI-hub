import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Eye, Smile, Heart, Palette, 
  ChevronDown, ChevronUp, Zap, ArrowLeft,
  User, Target, Filter, Circle
} from 'lucide-react';

const subToolNames = {
  SKIN_SMOOTH: 'skin_smooth',
  EYE_BRIGHTEN: 'eye_brighten',
  FACE_SLIM: 'face_slim',
  TEETH_WHITEN: 'teeth_whiten',
  LIP_COLOR: 'lip_color'
};

// Simplified lip color presets
const lipColors = [
  { id: 'natural', label: 'Natural', color: '#E6A4A4' },
  { id: 'pink', label: 'Pink', color: '#FF6B9D' },
  { id: 'red', label: 'Red', color: '#DC2626' },
  { id: 'coral', label: 'Coral', color: '#FF7F50' }
];

const BeautyToolPanel = ({
  activeBeautyTool,
  setActiveBeautyTool,
  applyBeautyFeature,
  onBack
}) => {
  const [skinSmoothIntensity, setSkinSmoothIntensity] = useState(50);
  const [eyeBrightenIntensity, setEyeBrightenIntensity] = useState(50);
  const [faceSlimIntensity, setFaceSlimIntensity] = useState(30);
  const [teethWhitenIntensity, setTeethWhitenIntensity] = useState(50);
  const [lipColorIntensity, setLipColorIntensity] = useState(50);
  
  const [selectedLipColor, setSelectedLipColor] = useState('natural');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [activeFeature, setActiveFeature] = useState(null);
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

  const handleApply = async (feature, intensity, color = null) => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      
      const settings = {
        intensity,
        color
      };
      
      if (applyBeautyFeature) {
        applyBeautyFeature(feature, settings);
      }

      // On mobile, close the section after applying
      if (isMobile) {
        setActiveSection(null);
        setActiveFeature(null);
      }
    }, 1000);
  };

  const handleSectionClick = (section) => {
    if (isMobile) {
      setActiveSection(section);
      setActiveFeature(null);
    } else {
      setActiveSection(activeSection === section ? '' : section);
    }
  };

  const handleBack = () => {
    if (activeSection) {
      setActiveSection(null);
      setActiveFeature(null);
    } else {
      onBack?.();
    }
  };

  const SliderControl = ({ 
    label, 
    value, 
    onChange, 
    min = 0, 
    max = 100, 
    icon,
    color = "pink"
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

  const ColorPicker = ({ colors, activeColor, onChange }) => (
    <div className="grid grid-cols-4 gap-2 mb-3">
      {colors.map((color) => (
        <button
          key={color.id}
          onClick={() => onChange(color.id)}
          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
            activeColor === color.id 
              ? 'border-pink-400 scale-110' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          style={{ backgroundColor: color.color }}
          title={color.label}
        />
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

  // Sections with mobile-friendly structure
  const sections = [
    { 
      id: 'enhance', 
      label: 'Face Enhancement', 
      mobileLabel: 'Enhance',
      icon: <Sparkles size={16} />,
      mobileIcon: <Sparkles size={18} />,
      color: 'pink',
      gradient: 'from-pink-500 to-purple-500',
      features: [
        { id: 'skin_smooth', label: 'Skin Smooth', icon: <Sparkles size={16} />, getValue: () => skinSmoothIntensity, setValue: setSkinSmoothIntensity },
        { id: 'eye_brighten', label: 'Eye Brighten', icon: <Eye size={16} />, getValue: () => eyeBrightenIntensity, setValue: setEyeBrightenIntensity },
        { id: 'teeth_whiten', label: 'Teeth Whiten', icon: <Smile size={16} />, getValue: () => teethWhitenIntensity, setValue: setTeethWhitenIntensity },
      ]
    },
    { 
      id: 'shape', 
      label: 'Face Shape', 
      mobileLabel: 'Shape',
      icon: <Heart size={16} />,
      mobileIcon: <Heart size={18} />,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      features: [
        { id: 'face_slim', label: 'Face Slim', icon: <Heart size={16} />, getValue: () => faceSlimIntensity, setValue: setFaceSlimIntensity, max: 60 },
      ]
    },
    { 
      id: 'makeup', 
      label: 'Makeup', 
      mobileLabel: 'Makeup',
      icon: <Palette size={16} />,
      mobileIcon: <Palette size={18} />,
      color: 'rose',
      gradient: 'from-rose-500 to-pink-500',
      features: [
        { id: 'lip_color', label: 'Lip Color', icon: <Palette size={16} />, getValue: () => lipColorIntensity, setValue: setLipColorIntensity, hasColors: true },
      ]
    }
  ];

  const getCurrentIntensity = () => {
    if (!activeFeature) return 50;
    const currentSection = sections.find(s => s.id === activeSection);
    const feature = currentSection?.features.find(f => f.id === activeFeature);
    return feature?.getValue() || 50;
  };

  const setCurrentIntensity = (value) => {
    if (!activeFeature) return;
    const currentSection = sections.find(s => s.id === activeSection);
    const feature = currentSection?.features.find(f => f.id === activeFeature);
    feature?.setValue(value);
  };

  const renderDesktopSectionContent = (section) => {
    switch (section.id) {
      case 'enhance':
        return (
          <div className="space-y-4">
            <SliderControl 
              label="Skin Smooth" 
              value={skinSmoothIntensity} 
              onChange={setSkinSmoothIntensity}
              icon={<Sparkles size={14} />}
              color="pink"
            />
            
            <SliderControl 
              label="Eye Brighten" 
              value={eyeBrightenIntensity} 
              onChange={setEyeBrightenIntensity}
              icon={<Eye size={14} />}
              color="blue"
            />

            <SliderControl 
              label="Teeth Whiten" 
              value={teethWhitenIntensity} 
              onChange={setTeethWhitenIntensity}
              icon={<Smile size={14} />}
              color="green"
            />

            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => handleApply(subToolNames.SKIN_SMOOTH, skinSmoothIntensity)}
                disabled={isProcessing}
                className={`py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 
                  ${isProcessing 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white'
                  }`}
              >
                {isProcessing ? 'Processing...' : 'Apply All Enhancements'}
              </button>
            </div>
          </div>
        );

      case 'shape':
        return (
          <div className="space-y-4">
            <SliderControl 
              label="Face Slim" 
              value={faceSlimIntensity} 
              min={0}
              max={60}
              onChange={setFaceSlimIntensity}
              icon={<Heart size={14} />}
              color="purple"
            />

            <button 
              onClick={() => handleApply(subToolNames.FACE_SLIM, faceSlimIntensity)}
              disabled={isProcessing}
              className={`w-full py-2 rounded-lg font-medium text-sm transition-all duration-200 
                ${isProcessing 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                }`}
            >
              {isProcessing ? 'Processing...' : 'Apply Face Shape'}
            </button>
          </div>
        );

      case 'makeup':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <Palette size={14} className="mr-2" />
                Lip Color
              </h4>
              <ColorPicker 
                colors={lipColors} 
                activeColor={selectedLipColor} 
                onChange={setSelectedLipColor}
              />
              <SliderControl 
                label="Lip Color Intensity" 
                value={lipColorIntensity} 
                onChange={setLipColorIntensity}
                color="rose"
              />
              <button 
                onClick={() => handleApply(subToolNames.LIP_COLOR, lipColorIntensity, selectedLipColor)}
                disabled={isProcessing}
                className={`w-full py-2 rounded-lg font-medium text-sm transition-all duration-200 
                  ${isProcessing 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white'
                  }`}
              >
                {isProcessing ? 'Processing...' : 'Apply Lip Color'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentSection = sections.find(s => s.id === activeSection);
  const currentFeature = currentSection?.features.find(f => f.id === activeFeature);

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
              // Features view for selected section
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
                    onClick={() => setActiveFeature(feature.id)}
                    className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                      activeFeature === feature.id
                        ? `bg-gradient-to-b ${currentSection.gradient} shadow-lg text-white`
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    {feature.icon}
                    <span className="text-xs">{feature.label}</span>
                  </button>
                ))}

                {/* Color Picker for Lip Color */}
                {activeFeature === 'lip_color' && (
                  <div className="flex items-center space-x-1 px-2 py-2 bg-gray-800 rounded-lg">
                    {lipColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedLipColor(color.id)}
                        className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                          selectedLipColor === color.id 
                            ? 'border-pink-400 scale-110' 
                            : 'border-gray-600'
                        }`}
                        style={{ backgroundColor: color.color }}
                        title={color.label}
                      />
                    ))}
                  </div>
                )}

                {/* Intensity Control */}
                {activeFeature && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg ml-2">
                    <span className="text-xs text-gray-300">Intensity</span>
                    <div className="relative w-16 h-1 bg-gray-700 rounded-full">
                      <div 
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${currentSection.gradient} rounded-full transition-all duration-300`}
                        style={{ width: `${getCurrentIntensity()}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max={currentFeature?.max || 100}
                        value={getCurrentIntensity()}
                        onChange={(e) => setCurrentIntensity(parseInt(e.target.value))}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <span className="text-xs text-white font-medium">{getCurrentIntensity()}%</span>
                  </div>
                )}

                {/* Apply Button */}
                {activeFeature && (
                  <button
                    onClick={() => {
                      const featureMap = {
                        'skin_smooth': subToolNames.SKIN_SMOOTH,
                        'eye_brighten': subToolNames.EYE_BRIGHTEN,
                        'face_slim': subToolNames.FACE_SLIM,
                        'teeth_whiten': subToolNames.TEETH_WHITEN,
                        'lip_color': subToolNames.LIP_COLOR
                      };
                      
                      const intensity = getCurrentIntensity();
                      const color = activeFeature === 'lip_color' ? selectedLipColor : null;
                      
                      handleApply(featureMap[activeFeature], intensity, color);
                    }}
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
        <h2 className="text-xl font-semibold mb-6 text-gray-100">Beauty Tools</h2>
        
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

        {/* Quick Apply All Button */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <button 
            onClick={() => {
              handleApply(subToolNames.SKIN_SMOOTH, skinSmoothIntensity);
              setTimeout(() => handleApply(subToolNames.EYE_BRIGHTEN, eyeBrightenIntensity), 500);
              setTimeout(() => handleApply(subToolNames.TEETH_WHITEN, teethWhitenIntensity), 1000);
            }}
            disabled={isProcessing}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 
              ${isProcessing 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 text-white'
              }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Zap size={16} />
              <span>{isProcessing ? 'Processing...' : 'Apply All Beauty Filters'}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeautyToolPanel;