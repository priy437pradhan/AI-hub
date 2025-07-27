import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronUp, Frame, Zap, Settings, Palette, 
  Plus, RotateCw, Layers, Target, Image, RefreshCw,
  CheckCircle, Circle, Square, Hexagon, Triangle, Star,
  ArrowLeft
} from 'lucide-react';

const FramesToolPanel = ({
  activeFramesTool,
  setActiveFramesTool,
  frameSettings = {
    style: 'none',
    color: '#ffffff',
    width: 10,
    shadow: 0,
    spread: 0,
    shadowColor: '#000000'
  },
  setFrameSettings = () => {},
  applyFrame = () => {},
  applyFrameEffects = () => {},
  onBack
}) => {
  const [activeSection, setActiveSection] = useState('frame-styles');
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const [showColorCategories, setShowColorCategories] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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

  // Mock data matching your structure
  const frameStyles = [
    { id: 'solid', name: 'Solid', icon: <Square size={16} /> },
    { id: 'dashed', name: 'Dashed', icon: <Circle size={16} /> },
    { id: 'dotted', name: 'Dotted', icon: <Circle size={16} /> },
    { id: 'double', name: 'Double', icon: <Square size={16} /> },
    { id: 'ridge', name: 'Ridge', icon: <Hexagon size={16} /> },
    { id: 'groove', name: 'Groove', icon: <Triangle size={16} /> },
    { id: 'inset', name: 'Inset', icon: <Star size={16} /> },
    { id: 'outset', name: 'Outset', icon: <CheckCircle size={16} /> }
  ];

  const frameCategories = {
    basic: { name: 'Basic', styles: ['solid', 'dashed', 'dotted', 'double'] },
    decorative: { name: 'Decorative', styles: ['ridge', 'groove', 'inset', 'outset'] }
  };

  const framePresets = [
    { id: 'thin', name: 'Thin Border', settings: { style: 'solid', color: '#ffffff', width: 2, shadow: 0, spread: 0, shadowColor: '#000000' } },
    { id: 'thick', name: 'Thick Border', settings: { style: 'solid', color: '#ffffff', width: 15, shadow: 0, spread: 0, shadowColor: '#000000' } },
    { id: 'shadow', name: 'Shadow Frame', settings: { style: 'solid', color: '#ffffff', width: 5, shadow: 10, spread: 2, shadowColor: '#000000' } },
    { id: 'glow', name: 'Glow Effect', settings: { style: 'solid', color: '#ffffff', width: 3, shadow: 15, spread: 5, shadowColor: '#4F46E5' } }
  ];

  const effectPresets = [
    { id: 'soft', name: 'Soft Shadow', shadow: 5, spread: 2, shadowColor: '#00000080' },
    { id: 'hard', name: 'Hard Shadow', shadow: 0, spread: 5, shadowColor: '#000000' },
    { id: 'glow', name: 'Blue Glow', shadow: 10, spread: 3, shadowColor: '#3B82F6' },
    { id: 'colorful', name: 'Color Glow', shadow: 15, spread: 2, shadowColor: '#EF4444' }
  ];

  const frameColorPresets = {
    basic: [
      { color: '#ffffff', name: 'White' },
      { color: '#000000', name: 'Black' },
      { color: '#808080', name: 'Gray' },
      { color: '#C0C0C0', name: 'Silver' }
    ],
    warm: [
      { color: '#FF6B6B', name: 'Red' },
      { color: '#FF9F43', name: 'Orange' },
      { color: '#FFA502', name: 'Yellow' },
      { color: '#FF7675', name: 'Pink' }
    ],
    cool: [
      { color: '#74B9FF', name: 'Blue' },
      { color: '#6C5CE7', name: 'Purple' },
      { color: '#00CEC9', name: 'Teal' },
      { color: '#55A3FF', name: 'Sky' }
    ],
    nature: [
      { color: '#00B894', name: 'Green' },
      { color: '#2D3436', name: 'Forest' },
      { color: '#8B4513', name: 'Brown' },
      { color: '#E17055', name: 'Earth' }
    ]
  };

  const sections = [
    {
      id: 'frame-styles',
      title: 'Frame Styles',
      mobileTitle: 'Styles',
      icon: <Frame size={16} />,
      mobileIcon: <Frame size={18} />,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'frame-effects',
      title: 'Frame Effects',
      mobileTitle: 'Effects',
      icon: <Zap size={16} />,
      mobileIcon: <Zap size={18} />,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'quick-presets',
      title: 'Quick Presets',
      mobileTitle: 'Presets',
      icon: <Settings size={16} />,
      mobileIcon: <Settings size={18} />,
      color: 'green',
      gradient: 'from-green-500 to-teal-500'
    }
  ];

  const handleApplyFrame = async () => {
    if (!frameSettings.style || frameSettings.style === 'none') return;
    
    setIsProcessing(true);
    
    setTimeout(async () => {
      if (applyFrame) {
        const result = await applyFrame(frameSettings.style, frameSettings.color, frameSettings.width);
        if (result) {
          console.log('Frame applied successfully');
        }
      }
      setIsProcessing(false);
      
      // On mobile, close the section after applying
      if (isMobile) {
        setActiveSection(null);
      }
    }, 1000);
  };

  const handleApplyEffects = async () => {
    setIsProcessing(true);
    
    setTimeout(async () => {
      if (applyFrameEffects) {
        const result = await applyFrameEffects(frameSettings.shadow, frameSettings.spread, frameSettings.shadowColor);
        if (result) {
          console.log('Effects applied successfully');
        }
      }
      setIsProcessing(false);
      
      // On mobile, close the section after applying
      if (isMobile) {
        setActiveSection(null);
      }
    }, 1000);
  };

  const handleSectionClick = (section) => {
    if (isMobile) {
      setActiveSection(section);
    } else {
      setActiveSection(activeSection === section ? '' : section);
    }
  };

  const handleBack = () => {
    if (activeSection) {
      setActiveSection(null);
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
    color = "blue",
    unit = "px"
  }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-gray-400">{icon}</div>}
          <span className="text-sm text-gray-300 font-medium">{label}</span>
        </div>
        <span className={`text-sm font-medium ${value !== (min) ? `text-${color}-400` : 'text-gray-400'}`}>
          {value}{unit}
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
            ${value !== min ? `bg-${color}-500 border-${color}-400` : 'bg-white border-gray-400'}`}
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
          <span className="text-xs text-center leading-tight font-medium">{item.name}</span>
        </button>
      ))}
    </div>
  );

  const ColorPicker = ({ colors, activeColor, onChange }) => (
    <div className="grid grid-cols-6 gap-2 mb-3">
      {colors.map((colorItem) => {
        const color = typeof colorItem === 'string' ? colorItem : colorItem.color;
        return (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 
              ${activeColor === color 
                ? 'border-blue-400 scale-110' 
                : 'border-gray-600 hover:border-gray-500 hover:scale-105'
              }`}
            style={{ backgroundColor: color }}
            title={typeof colorItem === 'object' ? colorItem.name : color}
          />
        );
      })}
    </div>
  );

  const SectionHeader = ({ title, isActive, onClick, icon }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 mb-2
        ${isActive 
          ? 'bg-gray-700 text-white' 
          : 'bg-gray-800 hover:bg-gray-750 text-gray-300 hover:text-white'
        }`}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span className="font-medium">{title}</span>
      </div>
      {isActive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  );

  const getCategoryFrames = (categoryKey) => {
    const category = frameCategories[categoryKey];
    return frameStyles.filter(frame => category.styles.includes(frame.id));
  };

  const renderFrameStyles = () => (
    <div className="space-y-4">
      {/* Category Selector */}
      <div>
        <label className="block text-gray-400 text-sm mb-2">Frame Category</label>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 focus:border-blue-500 focus:outline-none"
        >
          {Object.entries(frameCategories).map(([key, category]) => (
            <option key={key} value={key}>{category.name}</option>
          ))}
        </select>
      </div>

      {/* Frame Grid */}
      <div>
        <label className="block text-gray-400 text-sm mb-3">Choose Frame Style</label>
        <ButtonGrid 
          items={getCategoryFrames(selectedCategory)} 
          activeId={frameSettings.style} 
          onSelect={(style) => setFrameSettings(prev => ({ ...prev, style }))} 
          cols={2}
        />
      </div>

      {frameSettings.style && frameSettings.style !== 'none' && (
        <div className="space-y-4">
          {/* Color Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-400 text-sm">Frame Color</label>
              <button
                onClick={() => setShowColorCategories(!showColorCategories)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {showColorCategories ? 'Hide' : 'More'} Colors
              </button>
            </div>
            
            {showColorCategories ? (
              <div className="space-y-3">
                {Object.entries(frameColorPresets).map(([categoryKey, colors]) => (
                  <div key={categoryKey}>
                    <label className="text-xs text-gray-500 capitalize mb-2 block">
                      {categoryKey} Colors
                    </label>
                    <ColorPicker 
                      colors={colors} 
                      activeColor={frameSettings.color} 
                      onChange={(color) => setFrameSettings(prev => ({ ...prev, color }))} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <ColorPicker 
                colors={frameColorPresets.basic} 
                activeColor={frameSettings.color} 
                onChange={(color) => setFrameSettings(prev => ({ ...prev, color }))} 
              />
            )}
          </div>
          
          {/* Frame Width */}
          <SliderControl 
            label="Frame Width" 
            value={frameSettings.width} 
            min={1} 
            max={50} 
            onChange={(width) => setFrameSettings(prev => ({ ...prev, width }))}
            icon={<Frame size={14} />}
            color="blue"
            unit="px"
          />

          {/* Quick Width Presets */}
          <div className="flex gap-2">
            {[2, 5, 10, 15, 25].map(width => (
              <button
                key={width}
                onClick={() => setFrameSettings(prev => ({ ...prev, width }))}
                className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
                  frameSettings.width === width 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {width}px
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleApplyFrame}
        disabled={!frameSettings.style || frameSettings.style === 'none' || isProcessing}
        className={`w-full py-3 rounded-lg font-medium transition-all duration-200 
          ${(!frameSettings.style || frameSettings.style === 'none' || isProcessing) 
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
          }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <Plus size={16} />
          <span>{isProcessing ? 'Applying Frame...' : 'Apply Frame'}</span>
        </div>
      </button>
      
      <div className="text-gray-400 text-sm text-center flex items-center justify-center space-x-2">
        <Target size={14} />
        <span>Frame will be applied to your image</span>
      </div>
    </div>
  );

  const renderFrameEffects = () => (
    <div className="space-y-4">
      {/* Effect Presets */}
      <div>
        <label className="block text-gray-400 text-sm mb-3">Effect Presets</label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {effectPresets.map(preset => (
            <button
              key={preset.id}
              onClick={() => setFrameSettings(prev => ({
                ...prev,
                shadow: preset.shadow,
                spread: preset.spread,
                shadowColor: preset.shadowColor
              }))}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs text-gray-200 transition-all duration-200"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <SliderControl 
        label="Shadow Blur" 
        value={frameSettings.shadow} 
        min={0} 
        max={50} 
        onChange={(shadow) => setFrameSettings(prev => ({ ...prev, shadow }))}
        icon={<Zap size={14} />}
        color="purple"
        unit="px"
      />
      
      <SliderControl 
        label="Shadow Spread" 
        value={frameSettings.spread} 
        min={0} 
        max={20} 
        onChange={(spread) => setFrameSettings(prev => ({ ...prev, spread }))}
        icon={<RotateCw size={14} />}
        color="green"
        unit="px"
      />
      
      <div>
        <label className="block text-gray-400 text-sm mb-2">Shadow Color</label>
        <div className="flex items-center space-x-3">
          <input 
            type="color" 
            value={frameSettings.shadowColor} 
            onChange={(e) => setFrameSettings(prev => ({ ...prev, shadowColor: e.target.value }))}
            className="w-10 h-10 rounded-lg border-2 border-gray-600 cursor-pointer"
          />
          <div className="flex-1">
            <span className="text-xs text-gray-300 font-medium">{frameSettings.shadowColor}</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleApplyEffects}
        disabled={isProcessing}
        className={`w-full py-3 rounded-lg font-medium transition-all duration-200 
          ${isProcessing 
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
          }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <Zap size={16} />
          <span>{isProcessing ? 'Applying Effects...' : 'Apply Effects'}</span>
        </div>
      </button>

      <div className="text-gray-400 text-sm text-center flex items-center justify-center space-x-2">
        <Image size={14} />
        <span>Effects enhance your frame appearance</span>
      </div>
    </div>
  );

  const renderQuickPresets = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-400 text-sm mb-3">Frame Presets</label>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {framePresets.map(preset => (
            <button
              key={preset.id}
              onClick={() => setFrameSettings(preset.settings)}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-200 transition-all duration-200 text-left"
            >
              <div className="font-medium">{preset.name}</div>
              <div className="text-xs text-gray-400 mt-1">
                {preset.settings.width}px {preset.settings.style} • {preset.settings.shadow > 0 ? 'With Shadow' : 'No Shadow'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Settings Display */}
      <div className="p-3 bg-gray-700 rounded-lg">
        <div className="text-gray-300 text-sm font-medium mb-2">Current Settings</div>
        <div className="text-gray-400 text-xs space-y-1">
          <div>Style: {frameStyles.find(f => f.id === frameSettings.style)?.name || 'None'}</div>
          <div>Color: {frameSettings.color}</div>
          <div>Width: {frameSettings.width}px</div>
          <div>Shadow: {frameSettings.shadow}px</div>
          <div>Spread: {frameSettings.spread}px</div>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={async () => {
            await handleApplyFrame();
            await handleApplyEffects();
          }}
          disabled={frameSettings.style === 'none' || isProcessing}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-200 
            ${(frameSettings.style === 'none' || isProcessing) 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
            }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle size={16} />
            <span>{isProcessing ? 'Applying All...' : 'Apply Frame + Effects'}</span>
          </div>
        </button>

        <button
          onClick={() => setFrameSettings({
            style: 'none',
            color: '#ffffff',
            width: 10,
            shadow: 0,
            spread: 0,
            shadowColor: '#000000'
          })}
          className="w-full py-3 rounded-lg font-medium transition-all duration-200 bg-red-600 hover:bg-red-700 text-white"
        >
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw size={16} />
            <span>Reset All Settings</span>
          </div>
        </button>
      </div>
    </div>
  );

  const currentSection = sections.find(s => s.id === activeSection);

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-20">
        <div className="flex items-center justify-between px-0 py-2" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
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
                  <span className="text-xs">{section.mobileTitle}</span>
                </button>
              ))
            ) : (
              // Content view for selected section
              <>
                {/* Section indicator */}
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-b ${currentSection.gradient} text-white mr-2`}>
                  {currentSection.mobileIcon}
                  <span className="text-xs font-medium">{currentSection.mobileTitle}</span>
                </div>

                {/* Section-specific content */}
                {activeSection === 'frame-styles' && (
                  <>
                    {/* Frame styles */}
                    {getCategoryFrames(selectedCategory).map((frame) => (
                      <button
                        key={frame.id}
                        onClick={() => setFrameSettings(prev => ({ ...prev, style: frame.id }))}
                        className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                          frameSettings.style === frame.id
                            ? `bg-gradient-to-b ${currentSection.gradient} shadow-lg text-white`
                            : 'hover:bg-gray-800 text-gray-300'
                        }`}
                      >
                        {frame.icon}
                        <span className="text-xs">{frame.name}</span>
                      </button>
                    ))}

                    {/* Width Control */}
                    {frameSettings.style && frameSettings.style !== 'none' && (
                      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg ml-2">
                        <span className="text-xs text-gray-300">Width</span>
                        <div className="relative w-16 h-1 bg-gray-700 rounded-full">
                          <div 
                            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${currentSection.gradient} rounded-full transition-all duration-300`}
                            style={{ width: `${(frameSettings.width / 50) * 100}%` }}
                          />
                          <input
                            type="range"
                            min="1"
                            max="50"
                            value={frameSettings.width}
                            onChange={(e) => setFrameSettings(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                        <span className="text-xs text-white font-medium">{frameSettings.width}px</span>
                      </div>
                    )}

                    {/* Apply Button */}
                    {frameSettings.style && frameSettings.style !== 'none' && (
                      <button
                        onClick={handleApplyFrame}
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
                            <span className="text-xs">Applying...</span>
                          </div>
                        ) : (
                          <span className="text-xs">Apply</span>
                        )}
                      </button>
                    )}
                  </>
                )}

               {activeSection === 'frame-effects' && (
  <>
    {/* Effect presets */}
    {effectPresets.map((preset) => (
      <button
        key={preset.id}
        onClick={() =>
          setFrameSettings((prev) => ({
            ...prev,
            shadow: preset.shadow,
            spread: preset.spread,
            shadowColor: preset.shadowColor,
          }))
        }
        className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap hover:bg-gray-800 text-gray-300"
      >
        <Zap size={16} />
        <span className="text-xs">{preset.name}</span>
      </button>
    ))}

    {/* Shadow Control */}
    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg ml-2">
      <span className="text-xs text-gray-300">Shadow</span>
      <div className="relative w-16 h-1 bg-gray-700 rounded-full">
        <div
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${currentSection.gradient} rounded-full transition-all duration-300`}
          style={{ width: `${(frameSettings.shadow / 50) * 100}%` }}
        />
        <input
          type="range"
          min="0"
          max="50"
          value={frameSettings.shadow}
          onChange={(e) =>
            setFrameSettings((prev) => ({
              ...prev,
              shadow: parseInt(e.target.value),
            }))
          }
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <span className="text-xs text-white font-medium">{frameSettings.shadow}px</span>
    </div>

    {/* Apply Button */}
    <button
      onClick={handleApplyEffects}
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
          <span className="text-xs">Applying...</span>
        </div>
      ) : (
        <span className="text-xs">Apply</span>
      )}
    </button>
  </>
)} {/* ✅ This closing parenthesis fixes the error */}


                {activeSection === 'quick-presets' && (
                  <>
                    {/* Frame presets */}
                    {framePresets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setFrameSettings(preset.settings)}
                        className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap hover:bg-gray-800 text-gray-300"
                      >
                        <Settings size={16} />
                        <span className="text-xs">{preset.name}</span>
                      </button>
                    ))}

                    {/* Apply All Button */}
                    <button
                      onClick={async () => {
                        await handleApplyFrame();
                        await handleApplyEffects();
                      }}
                      disabled={frameSettings.style === 'none' || isProcessing}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                        (frameSettings.style === 'none' || isProcessing)
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : `bg-gradient-to-r ${currentSection.gradient} hover:shadow-lg text-white`
                      }`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs">Applying...</span>
                        </div>
                      ) : (
                        <span className="text-xs">Apply All</span>
                      )}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="bg-gray-900 text-white h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6 text-gray-100">Frames & Borders</h2>
        
        <div className="space-y-2">
          {sections.map((section) => (
            <div key={section.id}>
              <SectionHeader
                title={section.title}
                icon={section.icon}
                onClick={() => setActiveSection(activeSection === section.id ? '' : section.id)}
                isActive={activeSection === section.id}
              />
              
              {activeSection === section.id && (
                <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                  {section.id === 'frame-styles' && renderFrameStyles()}
                  {section.id === 'frame-effects' && renderFrameEffects()}
                  {section.id === 'quick-presets' && renderQuickPresets()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FramesToolPanel;