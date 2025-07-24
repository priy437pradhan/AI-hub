import React, { useState, useCallback, useEffect } from 'react';
import { 
  ChevronDown, ChevronUp, Sparkles, Sliders, Target, Palette, 
  Sun, Contrast, Droplets, RotateCw, Zap, ImageIcon,
  Circle, CircleDot, Layers, ArrowLeft
} from 'lucide-react';

// Custom hook for slider drag functionality
const useSliderDrag = ({
  value,
  onChange,
  min,
  max,
  step,
  disabled,
  onDragStart,
  onDragEnd
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [sliderRef, setSliderRef] = useState(null);

  const calculateValue = useCallback((clientX, rect) => {
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = Math.round((min + percentage * (max - min)) / step) * step;
    return Math.max(min, Math.min(max, newValue));
  }, [min, max, step]);

  const handleMouseDown = useCallback((e) => {
    if (disabled) return;
    
    setIsDragging(true);
    if (onDragStart) onDragStart();
    
    const rect = sliderRef.getBoundingClientRect();
    const newValue = calculateValue(e.clientX, rect);
    onChange(newValue);
  }, [disabled, onDragStart, sliderRef, calculateValue, onChange]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || disabled) return;
    
    const rect = sliderRef.getBoundingClientRect();
    const newValue = calculateValue(e.clientX, rect);
    onChange(newValue);
  }, [isDragging, disabled, sliderRef, calculateValue, onChange]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (onDragEnd) onDragEnd();
    }
  }, [isDragging, onDragEnd]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const percentage = ((value - min) / (max - min)) * 100;

  const handlers = {
    onMouseDown: handleMouseDown,
  };

  return {
    sliderRef: setSliderRef,
    isDragging,
    percentage,
    handlers
  };
};

const SliderControl = ({
  label,
  value,
  onChange,
  min = -100,
  max = 100,
  step = 1,
  icon,
  color = "blue",
  disabled = false,
  onDragStart,
  onDragEnd,
  className = "",
  unit = "%",
  defaultValue = 0,
  ...props
}) => {
  const { sliderRef, isDragging, percentage, handlers } = useSliderDrag({
    value,
    onChange,
    min,
    max,
    step,
    disabled,
    onDragStart,
    onDragEnd
  });

  return (
    <div className={`mb-4 ${className}`} {...props}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-gray-400">{icon}</div>}
          <span className="text-sm text-gray-300 font-medium">{label}</span>
        </div>
        <span className={`text-sm font-medium ${value !== defaultValue ? `text-${color}-400` : 'text-gray-400'}`}>
          {value > 0 ? `+${value}${unit}` : `${value}${unit}`}
        </span>
      </div>
      
      <div 
        ref={sliderRef}
        className={`relative w-full h-2 bg-gray-700 rounded-lg cursor-pointer ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...handlers}
      >
        {/* Track fill */}
        <div 
          className={`absolute h-full bg-${color}-500 rounded-lg transition-all duration-75`}
          style={{
            width: `${percentage}%`
          }}
        />
        
        {/* Thumb */}
        <div 
          className={`
            absolute top-1/2 w-5 h-5 bg-${color}-500 border-2 border-${color}-400 
            rounded-full transform -translate-y-1/2 -translate-x-1/2 cursor-grab
            transition-all duration-75 hover:scale-110
            ${isDragging ? 'scale-125 cursor-grabbing' : ''}
            ${disabled ? 'opacity-50' : ''}
          `}
          style={{
            left: `${percentage}%`
          }}
        />
      </div>
      
      {/* Hidden input for accessibility */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        disabled={disabled}
        className="sr-only"
        aria-label={label}
      />
    </div>
  );
};

const filterEffects = [
  { id: 'none', label: 'None', mobileLabel: 'None', icon: <Circle size={16} />, gradient: 'from-gray-500 to-gray-600' },
  { id: 'grayscale', label: 'Gray', mobileLabel: 'Gray', icon: <Contrast size={16} />, gradient: 'from-gray-500 to-slate-500' },
  { id: 'sepia', label: 'Sepia', mobileLabel: 'Sepia', icon: <Palette size={16} />, gradient: 'from-amber-500 to-orange-500' },
  { id: 'vintage', label: 'Vintage', mobileLabel: 'Vintage', icon: <Layers size={16} />, gradient: 'from-yellow-600 to-amber-600' },
  { id: 'blur', label: 'Blur', mobileLabel: 'Blur', icon: <CircleDot size={16} />, gradient: 'from-blue-500 to-indigo-500' },
  { id: 'sharpen', label: 'Sharp', mobileLabel: 'Sharp', icon: <Sliders size={16} />, gradient: 'from-green-500 to-teal-500' },
];

const adjustmentSettings = [
  {
    label: 'Brightness',
    mobileLabel: 'Bright',
    icon: <Sun size={14} />,
    mobileIcon: <Sun size={16} />,
    color: 'yellow',
    key: 'brightness',
    min: 0,
    max: 100,
    defaultValue: 50,
    unit: '%',
    gradient: 'from-yellow-500 to-amber-500'
  },
  {
    label: 'Contrast',
    mobileLabel: 'Contrast',
    icon: <Contrast size={14} />,
    mobileIcon: <Contrast size={16} />,
    color: 'blue',
    key: 'contrast',
    min: 0,
    max: 100,
    defaultValue: 50,
    unit: '%',
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    label: 'Saturation',
    mobileLabel: 'Sat',
    icon: <Droplets size={14} />,
    mobileIcon: <Droplets size={16} />,
    color: 'green',
    key: 'saturation',
    min: 0,
    max: 100,
    defaultValue: 50,
    unit: '%',
    gradient: 'from-green-500 to-teal-500'
  },
  {
    label: 'Hue',
    mobileLabel: 'Hue',
    icon: <RotateCw size={14} />,
    mobileIcon: <RotateCw size={16} />,
    color: 'red',
    key: 'hue',
    min: 0,
    max: 360,
    defaultValue: 0,
    unit: '°',
    gradient: 'from-red-500 to-pink-500'
  },
];

const EffectsToolPanel = ({
  onEffectChange,
  onAdjustmentChange,
  onApplyEffect,
  onApplyAdjustments,
  onBack,
  initialValues = {}
}) => {
  // Mobile detection
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

  // Internal state management
  const [activeSection, setActiveSection] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAdjustment, setActiveAdjustment] = useState(null);
  
  // Filter state
  const [activeEffect, setActiveEffect] = useState(initialValues.activeEffect || 'none');
  const [effectIntensity, setEffectIntensity] = useState(initialValues.effectIntensity || 50);
  
  // Adjustment state
  const [adjustments, setAdjustments] = useState({
    brightness: initialValues.brightness || 50,
    contrast: initialValues.contrast || 50,
    saturation: initialValues.saturation || 50,
    hue: initialValues.hue || 0,
  });

  // Handle effect changes
  const handleEffectChange = useCallback((effectId) => {
    setActiveEffect(effectId);
    if (onEffectChange) {
      onEffectChange(effectId, effectIntensity);
    }
  }, [effectIntensity, onEffectChange]);

  const handleEffectIntensityChange = useCallback((intensity) => {
    setEffectIntensity(intensity);
    if (onEffectChange) {
      onEffectChange(activeEffect, intensity);
    }
  }, [activeEffect, onEffectChange]);

  // Handle adjustment changes
  const handleAdjustmentChange = useCallback((key, value) => {
    const newAdjustments = { ...adjustments, [key]: value };
    setAdjustments(newAdjustments);
    if (onAdjustmentChange) {
      onAdjustmentChange(newAdjustments);
    }
  }, [adjustments, onAdjustmentChange]);

  // Apply functions
  const handleApplyEffect = async (effectId = activeEffect) => {
    if (!effectId || effectId === 'none') return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      if (onApplyEffect) {
        onApplyEffect(effectId, effectIntensity);
      }
      
      // On mobile, close the section after applying
      if (isMobile) {
        setActiveSection(null);
        setActiveEffect('none');
      }
    }, 2000);
  };

  const handleApplyAdjustments = async () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      if (onApplyAdjustments) {
        onApplyAdjustments(adjustments);
      }
      
      // On mobile, close the section after applying
      if (isMobile) {
        setActiveSection(null);
        setActiveAdjustment(null);
      }
    }, 2000);
  };

  const handleSectionClick = (section) => {
    if (isMobile) {
      setActiveSection(section);
      setActiveEffect('none');
      setActiveAdjustment(null);
    } else {
      setActiveSection(activeSection === section ? '' : section);
    }
  };

  const handleBack = () => {
    if (activeSection) {
      setActiveSection(null);
      setActiveEffect('none');
      setActiveAdjustment(null);
    } else {
      onBack?.();
    }
  };

  // Reset functions
  const resetFilters = useCallback(() => {
    setActiveEffect('none');
    setEffectIntensity(50);
    if (onEffectChange) {
      onEffectChange('none', 50);
    }
  }, [onEffectChange]);

  const resetAdjustments = useCallback(() => {
    const defaultAdjustments = {
      brightness: 50,
      contrast: 50,
      saturation: 50,
      hue: 0,
    };
    setAdjustments(defaultAdjustments);
    if (onAdjustmentChange) {
      onAdjustmentChange(defaultAdjustments);
    }
  }, [onAdjustmentChange]);

  const sections = [
    {
      id: 'filters',
      label: 'Filters',
      mobileLabel: 'Filters',
      icon: <Sparkles size={16} />,
      mobileIcon: <Sparkles size={18} />,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'adjustments',
      label: 'Adjustments',
      mobileLabel: 'Adjust',
      icon: <Sliders size={16} />,
      mobileIcon: <Sliders size={18} />,
      gradient: 'from-blue-500 to-cyan-500'
    }
  ];

  // Desktop Components
  const ButtonGrid = ({ items, activeId, onSelect, cols = 3 }) => (
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

  const renderDesktopFilters = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-gray-400 text-sm">Choose Filter</label>
        <button 
          onClick={resetFilters}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>
      
      <ButtonGrid 
        items={filterEffects} 
        activeId={activeEffect} 
        onSelect={handleEffectChange} 
        cols={3}
      />

      <div className="space-y-2">
        <SliderControl 
          label="Filter Intensity" 
          value={effectIntensity} 
          min={0} 
          max={100} 
          onChange={handleEffectIntensityChange}
          icon={<Target size={14} />}
          color="purple"
          defaultValue={50}
          unit="%"
        />

        <div className="flex justify-between items-center px-2">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Zap size={14} />
            <span>
              {activeEffect === 'none'
                ? 'No filter selected'
                : isProcessing
                  ? 'Applying...'
                  : 'Ready to apply'}
            </span>
          </div>
        </div>
      </div>

      <div className="text-gray-400 text-sm text-center flex items-center justify-center space-x-2">
        <ImageIcon size={14} />
        <span>Preview changes before applying</span>
      </div>
    </div>
  );

  const renderDesktopAdjustments = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-gray-400 text-sm">Image Adjustments</label>
        <button 
          onClick={resetAdjustments}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>

      {adjustmentSettings.map((setting) => (
        <SliderControl
          key={setting.key}
          label={setting.label}
          value={adjustments[setting.key]}
          onChange={(value) => handleAdjustmentChange(setting.key, value)}
          min={setting.min}
          max={setting.max}
          icon={setting.icon}
          color={setting.color}
          defaultValue={setting.defaultValue}
          unit={setting.unit}
        />
      ))}

      <button
        onClick={handleApplyAdjustments}
        disabled={isProcessing}
        className={`w-full py-3 rounded-lg font-medium transition-all duration-200 
          ${isProcessing 
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white'
          }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <Sliders size={16} />
          <span>{isProcessing ? 'Applying Adjustments...' : 'Apply Adjustments'}</span>
        </div>
      </button>

      <div className="text-gray-400 text-sm text-center flex items-center justify-center space-x-2">
        <Palette size={14} />
        <span>Adjust image color properties</span>
      </div>
    </div>
  );

  const currentSection = sections.find(s => s.id === activeSection);
  const currentFilter = filterEffects.find(f => f.id === activeEffect);
  const currentAdjustment = adjustmentSettings.find(a => a.key === activeAdjustment);

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
            ) : activeSection === 'filters' ? (
              // Filters view
              <>
                {/* Section indicator */}
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-b ${currentSection.gradient} text-white mr-2`}>
                  {currentSection.mobileIcon}
                  <span className="text-xs font-medium">{currentSection.mobileLabel}</span>
                </div>

                {/* Filter options */}
                {filterEffects.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveEffect(filter.id)}
                    className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                      activeEffect === filter.id
                        ? `bg-gradient-to-b ${filter.gradient} shadow-lg text-white`
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    {filter.icon}
                    <span className="text-xs">{filter.mobileLabel}</span>
                  </button>
                ))}

                {/* Intensity Control */}
                {activeEffect && activeEffect !== 'none' && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg ml-2">
                    <span className="text-xs text-gray-300">Intensity</span>
                    <div className="relative w-16 h-1 bg-gray-700 rounded-full">
                      <div 
                        className={`absolute top-0 left-0 h-full ${currentFilter ? `bg-gradient-to-r ${currentFilter.gradient}` : 'bg-purple-500'} rounded-full transition-all duration-300`}
                        style={{ width: `${effectIntensity}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effectIntensity}
                        onChange={(e) => setEffectIntensity(parseInt(e.target.value))}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <span className="text-xs text-white font-medium">{effectIntensity}%</span>
                  </div>
                )}

                {/* Apply Button */}
                {activeEffect && activeEffect !== 'none' && (
                  <button
                    onClick={() => handleApplyEffect(activeEffect)}
                    disabled={isProcessing}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                      isProcessing
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : `bg-gradient-to-r ${currentFilter ? currentFilter.gradient : 'from-purple-500 to-pink-500'} hover:shadow-lg text-white`
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
            ) : (
              // Adjustments view
              <>
                {/* Section indicator */}
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-b ${currentSection.gradient} text-white mr-2`}>
                  {currentSection.mobileIcon}
                  <span className="text-xs font-medium">{currentSection.mobileLabel}</span>
                </div>

                {/* Adjustment options */}
                {adjustmentSettings.map((adjustment) => (
                  <button
                    key={adjustment.key}
                    onClick={() => setActiveAdjustment(adjustment.key)}
                    className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                      activeAdjustment === adjustment.key
                        ? `bg-gradient-to-b ${adjustment.gradient} shadow-lg text-white`
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    {adjustment.mobileIcon}
                    <span className="text-xs">{adjustment.mobileLabel}</span>
                  </button>
                ))}

                {/* Value Control */}
                {activeAdjustment && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg ml-2">
                    <span className="text-xs text-gray-300">Value</span>
                    <div className="relative w-16 h-1 bg-gray-700 rounded-full">
                      <div 
                        className={`absolute top-0 left-0 h-full ${currentAdjustment ? `bg-gradient-to-r ${currentAdjustment.gradient}` : 'bg-blue-500'} rounded-full transition-all duration-300`}
                        style={{ width: `${((adjustments[activeAdjustment] - (currentAdjustment?.min || 0)) / ((currentAdjustment?.max || 100) - (currentAdjustment?.min || 0))) * 100}%` }}
                      />
                      <input
                        type="range"
                        min={currentAdjustment?.min || 0}
                        max={currentAdjustment?.max || 100}
                        value={adjustments[activeAdjustment]}
                        onChange={(e) => handleAdjustmentChange(activeAdjustment, parseInt(e.target.value))}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <span className="text-xs text-white font-medium">
                      {adjustments[activeAdjustment]}{currentAdjustment?.unit || '%'}
                    </span>
                  </div>
                )}

                {/* Apply Button */}
                <button
                  onClick={handleApplyAdjustments}
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
        <h2 className="text-xl font-semibold mb-6 text-gray-100">Effects & Filters</h2>
        
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
                  {section.id === 'filters' && renderDesktopFilters()}
                  {section.id === 'adjustments' && renderDesktopAdjustments()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EffectsToolPanel;