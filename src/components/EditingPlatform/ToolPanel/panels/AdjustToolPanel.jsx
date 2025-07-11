'use client'
import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRight, 
  RotateCcw, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical,
  Zap,
  Sun,
  Circle,
  Contrast,
  Droplets,
  Focus,
  Eye,
  Palette,
  Thermometer,
  Lightbulb,
  Camera,
  Square,
  ChevronDown,
  ChevronUp,
  Move,
  Crop,
  Upload
} from 'lucide-react';

// Mock aspect ratios (you should import this from your constants file)
const aspectRatios = [
  { id: 'freeform', label: 'Freeform', icon: '⊞', dimensions: null },
  { id: '1x1', label: '1:1', icon: '□', dimensions: { width: 1, height: 1 } },
  { id: '4x5', label: '4:5', icon: '▯', dimensions: { width: 4, height: 5 } },
  { id: '5x4', label: '5:4', icon: '▭', dimensions: { width: 5, height: 4 } },
  { id: '3x4', label: '3:4', icon: '▯', dimensions: { width: 3, height: 4 } },
  { id: '4x3', label: '4:3', icon: '▭', dimensions: { width: 4, height: 3 } },
  { id: '2x3', label: '2:3', icon: '▯', dimensions: { width: 2, height: 3 } },
  { id: '3x2', label: '3:2', icon: '▭', dimensions: { width: 3, height: 2 } },
  { id: '9x16', label: '9:16', icon: '▯', dimensions: { width: 9, height: 16 } },
  { id: '16x9', label: '16:9', icon: '▭', dimensions: { width: 16, height: 9 } },
  { id: 'original', label: 'Original', icon: '▣', dimensions: null },
  { id: 'circle', label: 'Circle', icon: '○', dimensions: null },
];

const AdjustToolPanel = ({ 
  imageRef, 
  performFlip, 
  performRotate,
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
  imagePreview
}) => {
  const [activeSection, setActiveSection] = useState('basic');
  
  // Add missing state for crop functionality
  const [keepAspectRatio, setKeepAspectRatio] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('freeform');

  const [basicAdjust, setBasicAdjust] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
    exposure: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    vibrance: 0,
    clarity: 0,
    dehaze: 0
  });

  const [colorAdjust, setColorAdjust] = useState({
    temperature: 0,
    tint: 0,
    hue: 0,
    luminance: 0
  });

  const [vignette, setVignette] = useState({
    amount: 0,
    midpoint: 50,
    roundness: 0,
    feather: 50
  });

  const sections = [
    { id: 'crop', label: 'Crop & Resize', icon: <Crop size={16} /> },
    { id: 'basic', label: 'Basic Adjust', icon: <Sun size={16} /> },
    { id: 'color', label: 'Color Adjust', icon: <Palette size={16} /> },
    { id: 'vignette', label: 'Vignette', icon: <Circle size={16} /> },
    { id: 'flip', label: 'Flip', icon: <FlipHorizontal size={16} /> },
    { id: 'rotate', label: 'Rotate', icon: <RotateCw size={16} /> }
  ];

  // Apply filters effect
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
      if (basicAdjust.exposure !== 0) {
        filters.push(`brightness(${100 + basicAdjust.exposure}%)`);
      }
      if (basicAdjust.vibrance !== 0) {
        filters.push(`saturate(${100 + basicAdjust.vibrance}%)`);
      }
      
      // Color adjustments
      if (colorAdjust.hue !== 0) {
        filters.push(`hue-rotate(${colorAdjust.hue * 3.6}deg)`);
      }
      if (colorAdjust.temperature !== 0) {
        const tempEffect = colorAdjust.temperature > 0 ? 
          `sepia(${Math.abs(colorAdjust.temperature) * 0.3}%) hue-rotate(${colorAdjust.temperature * 0.5}deg)` :
          `sepia(${Math.abs(colorAdjust.temperature) * 0.3}%) hue-rotate(${colorAdjust.temperature * 0.8}deg)`;
        filters.push(tempEffect);
      }
      
      if (basicAdjust.sharpness < 0) {
        filters.push(`blur(${Math.abs(basicAdjust.sharpness) * 0.05}px)`);
      }
      
      // Apply the combined filter
      imageRef.current.style.filter = filters.length > 0 ? filters.join(' ') : 'none';
      
      // Apply vignette using box-shadow
      if (vignette.amount !== 0) {
        const vignetteSize = Math.abs(vignette.amount) * 2;
        const vignetteBlur = vignette.feather;
        const vignetteColor = vignette.amount > 0 ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
        
        imageRef.current.style.boxShadow = `inset 0 0 ${vignetteSize}px ${vignetteBlur}px ${vignetteColor}`;
        
        if (vignette.roundness > 0) {
          imageRef.current.style.borderRadius = `${vignette.roundness}%`;
        }
      } else {
        imageRef.current.style.boxShadow = 'none';
        imageRef.current.style.borderRadius = '0';
      }
    }
  }, [basicAdjust, colorAdjust, vignette, imageRef]);

  const handleBasicAdjustChange = (property, value) => {
    setBasicAdjust(prev => ({ ...prev, [property]: parseInt(value) }));
  };

  const handleColorAdjustChange = (property, value) => {
    setColorAdjust(prev => ({ ...prev, [property]: parseInt(value) }));
  };

  const handleVignetteChange = (property, value) => {
    setVignette(prev => ({ ...prev, [property]: parseInt(value) }));
  };

  const resetBasicAdjust = () => {
    setBasicAdjust({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpness: 0,
      exposure: 0,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      vibrance: 0,
      clarity: 0,
      dehaze: 0
    });
  };

  const resetColorAdjust = () => {
    setColorAdjust({
      temperature: 0,
      tint: 0,
      hue: 0,
      luminance: 0
    });
  };

  const resetVignette = () => {
    setVignette({
      amount: 0,
      midpoint: 50,
      roundness: 0,
      feather: 50
    });
  };

  const handleOneTagEnhance = () => {
    setBasicAdjust({
      brightness: 10,
      contrast: 15,
      saturation: 20,
      sharpness: 10,
      exposure: 5,
      highlights: -10,
      shadows: 15,
      whites: 5,
      blacks: -5,
      vibrance: 25,
      clarity: 15,
      dehaze: 10
    });
  };

  const handleFlip = (direction) => {
    if (performFlip) {
      performFlip(direction);
    }
  };

  const handleRotate = (direction) => {
    if (performRotate) {
      performRotate(direction);
    }
  };

  // Handle aspect ratio selection
  const handleAspectRatioChange = (ratioId) => {
    setAspectRatio(ratioId);
    if (setCropWithAspectRatio) {
      setCropWithAspectRatio(ratioId, aspectRatios, (newSettings) => {
        console.log('Crop settings updated:', newSettings);
      });
    }
  };

  // Handle crop apply
  const handleCropApply = () => {
    if (performCrop && cropSettings && imagePreview) {
      performCrop(cropSettings, imagePreview);
    }
  };

  const SliderControl = ({ 
    label, 
    value, 
    onChange, 
    min = -100, 
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
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700`}
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

  const AspectRatioGrid = () => (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {aspectRatios.map((ratio) => (
        <button
          key={ratio.id}
          onClick={() => handleAspectRatioChange(ratio.id)}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 
            ${aspectRatio === ratio.id 
              ? 'bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400' 
              : 'border border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300'
            }`}
        >
          <span className="text-lg mb-1">{ratio.icon}</span>
          <span className="text-xs font-medium">{ratio.label}</span>
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

  const renderCropSection = () => (
    <div className="space-y-4">
      <AspectRatioGrid />
      
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          id="keepAspect"
          checked={keepAspectRatio}
          onChange={() => setKeepAspectRatio(!keepAspectRatio)}
          className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="keepAspect" className="text-sm text-gray-300">
          Lock aspect ratio
        </label>
      </div>

      <div className="flex space-x-2">
        <button 
          onClick={handleCropApply}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-colors"
        >
          Apply Crop
        </button>
        <button 
          onClick={cancelCrop}
          className="px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderBasicAdjustSection = () => (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={handleOneTagEnhance}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <Zap size={16} />
          <span>1-Tap Enhance</span>
        </button>
        <button 
          onClick={resetBasicAdjust}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>

      <SliderControl
        label="Brightness"
        value={basicAdjust.brightness}
        onChange={(value) => handleBasicAdjustChange('brightness', value)}
        icon={<Sun size={14} />}
      />
      <SliderControl
        label="Contrast"
        value={basicAdjust.contrast}
        onChange={(value) => handleBasicAdjustChange('contrast', value)}
        icon={<Contrast size={14} />}
      />
      <SliderControl
        label="Saturation"
        value={basicAdjust.saturation}
        onChange={(value) => handleBasicAdjustChange('saturation', value)}
        icon={<Droplets size={14} />}
      />
      <SliderControl
        label="Sharpness"
        value={basicAdjust.sharpness}
        onChange={(value) => handleBasicAdjustChange('sharpness', value)}
        icon={<Focus size={14} />}
      />
      <SliderControl
        label="Exposure"
        value={basicAdjust.exposure}
        onChange={(value) => handleBasicAdjustChange('exposure', value)}
        icon={<Camera size={14} />}
      />
      <SliderControl
        label="Highlights"
        value={basicAdjust.highlights}
        onChange={(value) => handleBasicAdjustChange('highlights', value)}
        icon={<Lightbulb size={14} />}
      />
      <SliderControl
        label="Shadows"
        value={basicAdjust.shadows}
        onChange={(value) => handleBasicAdjustChange('shadows', value)}
        icon={<Square size={14} />}
      />
      <SliderControl
        label="Whites"
        value={basicAdjust.whites}
        onChange={(value) => handleBasicAdjustChange('whites', value)}
        icon={<Circle size={14} />}
      />
      <SliderControl
        label="Blacks"
        value={basicAdjust.blacks}
        onChange={(value) => handleBasicAdjustChange('blacks', value)}
        icon={<Square size={14} />}
      />
      <SliderControl
        label="Vibrance"
        value={basicAdjust.vibrance}
        onChange={(value) => handleBasicAdjustChange('vibrance', value)}
        icon={<Eye size={14} />}
      />
      <SliderControl
        label="Clarity"
        value={basicAdjust.clarity}
        onChange={(value) => handleBasicAdjustChange('clarity', value)}
        icon={<Focus size={14} />}
      />
      <SliderControl
        label="Dehaze"
        value={basicAdjust.dehaze}
        onChange={(value) => handleBasicAdjustChange('dehaze', value)}
        icon={<Eye size={14} />}
      />
    </div>
  );

  const renderColorAdjustSection = () => (
    <div className="space-y-1">
      <div className="flex justify-end mb-4">
        <button 
          onClick={resetColorAdjust}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>

      <SliderControl
        label="Temperature"
        value={colorAdjust.temperature}
        onChange={(value) => handleColorAdjustChange('temperature', value)}
        icon={<Thermometer size={14} />}
        color="orange"
      />
      <SliderControl
        label="Tint"
        value={colorAdjust.tint}
        onChange={(value) => handleColorAdjustChange('tint', value)}
        icon={<Palette size={14} />}
        color="pink"
      />
      <SliderControl
        label="Hue"
        value={colorAdjust.hue}
        onChange={(value) => handleColorAdjustChange('hue', value)}
        icon={<Circle size={14} />}
        color="purple"
      />
      <SliderControl
        label="Luminance"
        value={colorAdjust.luminance}
        onChange={(value) => handleColorAdjustChange('luminance', value)}
        icon={<Sun size={14} />}
        color="yellow"
      />
    </div>
  );

  const renderVignetteSection = () => (
    <div className="space-y-1">
      <div className="flex justify-end mb-4">
        <button 
          onClick={resetVignette}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>

      <SliderControl
        label="Amount"
        value={vignette.amount}
        onChange={(value) => handleVignetteChange('amount', value)}
        icon={<Circle size={14} />}
        min={-100}
        max={100}
      />
      <SliderControl
        label="Midpoint"
        value={vignette.midpoint}
        onChange={(value) => handleVignetteChange('midpoint', value)}
        icon={<Move size={14} />}
        min={0}
        max={100}
      />
      <SliderControl
        label="Roundness"
        value={vignette.roundness}
        onChange={(value) => handleVignetteChange('roundness', value)}
        icon={<Circle size={14} />}
        min={-100}
        max={100}
      />
      <SliderControl
        label="Feather"
        value={vignette.feather}
        onChange={(value) => handleVignetteChange('feather', value)}
        icon={<Droplets size={14} />}
        min={0}
        max={100}
      />
    </div>
  );

  const renderFlipSection = () => (
    <div className="grid grid-cols-2 gap-3">
      <button 
        onClick={() => handleFlip('horizontal')}
        className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-all"
      >
        <FlipHorizontal size={24} className="text-gray-200 mb-2" />
        <span className="text-sm text-gray-300 font-medium">Horizontal</span>
      </button>
      <button 
        onClick={() => handleFlip('vertical')}
        className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-all"
      >
        <FlipVertical size={24} className="text-gray-200 mb-2" />
        <span className="text-sm text-gray-300 font-medium">Vertical</span>
      </button>
    </div>
  );

  const renderRotateSection = () => (
    <div className="grid grid-cols-2 gap-3">
      <button 
        onClick={() => handleRotate('left')}
        className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-all"
      >
        <RotateCcw size={24} className="text-gray-200 mb-2" />
        <span className="text-sm text-gray-300 font-medium">Rotate Left</span>
      </button>
      <button 
        onClick={() => handleRotate('right')}
        className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-all"
      >
        <RotateCw size={24} className="text-gray-200 mb-2" />
        <span className="text-sm text-gray-300 font-medium">Rotate Right</span>
      </button>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'crop':
        return renderCropSection();
      case 'basic':
        return renderBasicAdjustSection();
      case 'color':
        return renderColorAdjustSection();
      case 'vignette':
        return renderVignetteSection();
      case 'flip':
        return renderFlipSection();
      case 'rotate':
        return renderRotateSection();
      default:
        return renderBasicAdjustSection();
    }
  };

  return (
    <div className="bg-gray-900 text-white h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6 text-gray-100">Adjust</h2>
        
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
                  {renderSectionContent()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdjustToolPanel;