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

// Aspect ratios matching Fotor
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

const ImageEditor = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [activeTool, setActiveTool] = useState('adjust');
  const [textElements, setTextElements] = useState([]);
  
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  // Image upload handler
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Transform functions
  const performFlip = (direction) => {
    if (direction === 'horizontal') {
      setFlipHorizontal(!flipHorizontal);
    } else if (direction === 'vertical') {
      setFlipVertical(!flipVertical);
    }
  };

  const performRotate = (direction) => {
    if (direction === 'left') {
      setRotation(rotation - 90);
    } else if (direction === 'right') {
      setRotation(rotation + 90);
    }
  };

  // Text element functions
  const updateTextElement = (id, updates) => {
    setTextElements(prev => 
      prev.map(element => 
        element.id === id ? { ...element, ...updates } : element
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      
      {/* Main Canvas Area */}
      <div className="flex-1">
        <ImageCanvas
          imagePreview={imagePreview}
          handleUploadClick={handleUploadClick}
          imageRef={imageRef}
          activeTool={activeTool}
          rotation={rotation}
          flipHorizontal={flipHorizontal}
          flipVertical={flipVertical}
          textElements={textElements}
          updateTextElement={updateTextElement}
        />
      </div>
      
      {/* Adjustment Panel */}
      <div className="w-80 border-l border-gray-700">
        <AdjustToolPanel
          imageRef={imageRef}
          performFlip={performFlip}
          performRotate={performRotate}
        />
      </div>
    </div>
  );
};

const ImageCanvas = ({
  imagePreview,
  handleUploadClick,
  imageRef,
  activeTool,
  rotation,
  flipHorizontal,
  flipVertical,
  textElements,
  updateTextElement
}) => {
  const [draggedElement, setDraggedElement] = useState(null);
  const imageContainerRef = useRef(null);
  
  // Handle starting text element drag
  const handleTextDragStart = (e, element) => {
    if (activeTool !== 'text') return;
    e.stopPropagation();
    e.preventDefault();
    setDraggedElement(element);
  };
  
  // Handle touch start for mobile devices
  const handleTextTouchStart = (e, element) => {
    if (activeTool !== 'text') return;
    e.stopPropagation();
    const touch = e.touches[0];
    if (touch) {
      setDraggedElement(element);
    }
  };
  
  // Handle drag movement
  const handleMouseMove = (e) => {
    if (!draggedElement || !imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));
    
    updateTextElement(draggedElement.id, {
      x: boundedX,
      y: boundedY
    });
  };
  
  // Handle touch move for mobile devices
  const handleTouchMove = (e) => {
    if (!draggedElement || !imageContainerRef.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    if (touch) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      
      const boundedX = Math.max(0, Math.min(100, x));
      const boundedY = Math.max(0, Math.min(100, y));
      
      updateTextElement(draggedElement.id, {
        x: boundedX,
        y: boundedY
      });
    }
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setDraggedElement(null);
  };
  
  // Setup and cleanup event listeners
  useEffect(() => {
    if (draggedElement) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
      document.addEventListener('touchcancel', handleDragEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleDragEnd);
      document.removeEventListener('touchcancel', handleDragEnd);
    };
  }, [draggedElement]);
  
  // Function to render text elements on the canvas for preview
  const renderTextOverlay = () => {
    if (!textElements || textElements.length === 0) return null;
    
    return textElements.map((element) => (
      <div
        key={element.id}
        className={`absolute ${activeTool === 'text' ? 'cursor-move' : ''} select-none`}
        style={{
          left: `${element.x}%`,
          top: `${element.y}%`,
          transform: 'translate(-50%, -50%)',
          color: element.color || '#ffffff',
          fontFamily: element.fontFamily || 'Arial',
          fontSize: `${element.fontSize || 24}px`,
          fontWeight: element.bold ? 'bold' : 'normal',
          fontStyle: element.italic ? 'italic' : 'normal',
          textDecoration: element.underline ? 'underline' : 'none',
          textShadow: element.shadow ? 
            `${element.shadowOffsetX || 1}px ${element.shadowOffsetY || 1}px ${element.shadowBlur || 2}px ${element.shadowColor || '#000000'}` : 
            'none',
          WebkitTextStroke: element.outline ? 
            `${element.outlineWidth || 1}px ${element.outlineColor || '#000000'}` : 
            'none',
          zIndex: draggedElement && draggedElement.id === element.id ? 10 : 1,
          pointerEvents: activeTool === 'text' ? 'auto' : 'none'
        }}
        onMouseDown={(e) => handleTextDragStart(e, element)}
        onTouchStart={(e) => handleTextTouchStart(e, element)}
      >
        {element.content}
      </div>
    ));
  };

  // Empty or upload view
  if (!imagePreview) {
    return (
      <div className="flex-1 flex items-center justify-center mx-28 my-40 bg-gray-800">
        <div 
          onClick={handleUploadClick}
          className="w-full max-w-3xl aspect-auto border-2 border-dashed border-gray-600 rounded-md flex flex-col items-center justify-center p-8 cursor-pointer bg-gray-700 hover:bg-gray-650 transition-colors"
        >
          <div className="mb-4">
            <Upload className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-300 mb-4 text-lg">Drag or upload your own images</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md flex items-center transition-colors">
            Open Image
          </button>
        </div>
      </div>
    );
  }

  // Image view with text overlay
  return (
    <div className="flex-1 flex items-center justify-center mx-20 my-28">
      <div className="relative w-full max-w-full h-full flex items-center justify-center overflow-hidden">  
        <div 
          ref={imageContainerRef}
          className="relative image-wrapper"
        >
          <img 
            ref={imageRef}
            src={imagePreview}
            alt="Uploaded preview" 
            className="max-w-full max-h-full object-contain transition-all duration-300"
            style={{
              maxHeight: '70vh',
              width: 'auto',
              transform: `rotate(${rotation}deg) scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`
            }}
          />
          
          {/* Text overlay elements with drag functionality */}
          {renderTextOverlay()}
        </div>
      </div>
    </div>
  );
};

const AdjustToolPanel = ({ imageRef, performFlip, performRotate }) => {
  // Crop & Resize states
  const [activeSection, setActiveSection] = useState('basic');
  const [aspectRatio, setAspectRatio] = useState('freeform');
  const [cropWidth, setCropWidth] = useState('');
  const [cropHeight, setCropHeight] = useState('');
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);

  // Basic Adjust states (now functional with CSS filters)
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

  // Color Adjust states
  const [colorAdjust, setColorAdjust] = useState({
    temperature: 0,
    tint: 0,
    hue: 0,
    luminance: 0
  });

  // Vignette states
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

  // Apply CSS filters to the image based on current adjustments
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
        filters.push(`hue-rotate(${colorAdjust.hue * 3.6}deg)`); // Convert to degrees
      }
      if (colorAdjust.temperature !== 0) {
        // Simulate temperature with hue-rotate and sepia
        const tempEffect = colorAdjust.temperature > 0 ? 
          `sepia(${Math.abs(colorAdjust.temperature) * 0.3}%) hue-rotate(${colorAdjust.temperature * 0.5}deg)` :
          `sepia(${Math.abs(colorAdjust.temperature) * 0.3}%) hue-rotate(${colorAdjust.temperature * 0.8}deg)`;
        filters.push(tempEffect);
      }
      
      // Apply blur for sharpness (inverted - negative sharpness = blur)
      if (basicAdjust.sharpness < 0) {
        filters.push(`blur(${Math.abs(basicAdjust.sharpness) * 0.05}px)`);
      }
      
      // Apply the combined filter
      imageRef.current.style.filter = filters.length > 0 ? filters.join(' ') : 'none';
    }
  }, [basicAdjust, colorAdjust, imageRef]);

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

  // One-tap enhance function
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

  // Functional handlers for flip and rotate using the passed props
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
          onClick={() => setAspectRatio(ratio.id)}
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

      <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-colors">
        Apply Crop
      </button>
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

      {/* Custom slider styles */}
      <style jsx>{`
        .slider-blue::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
        
        .slider-orange::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid #ea580c;
        }
        
        .slider-pink::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ec4899;
          cursor: pointer;
          border: 2px solid #db2777;
        }
        
        .slider-purple::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid #7c3aed;
        }
        
        .slider-yellow::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #eab308;
          cursor: pointer;
          border: 2px solid #ca8a04;
        }
      `}</style>
    </div>
  );
};

export default AdjustToolPanel;