import { useState ,useEffect } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ArrowRight,
  FlipHorizontal,
  FlipVertical,
  Wand2,
  Sparkles,
  Smile,
  Square,
  Type,
  Image,
  Sliders,
  Paintbrush,
  Sun,
  Contrast,
  CircleDot,
  Palette,
  Layers,
  PenTool,
  ImagePlus,
  Sticker,
  ShapesIcon,
  Frame,
  SquareCode,
  Circle,
  BadgePlus,
  Shapes,
  Repeat,
  RotateCcw,
  RotateCw,
  ListFilter
} from 'lucide-react';

const Icons = {
  ChevronUp,
  ChevronDown,
  ArrowRight,
  FlipHorizontal,
  FlipVertical,
  Wand2,
  Sparkles,
  Smile,
  Square,
  Type,
  Image,
  Sliders,
  Paintbrush,
  Sun,
  Contrast,
  CircleDot,
  Palette,
  Layers,
  PenTool,
  ImagePlus,
  Sticker,
  ShapesIcon,
  Frame,
  SquareCode,
  Circle,
  BadgePlus,
  Shapes,
  Repeat,
  RotateCcw,
  RotateCw,
  ListFilter
};

export const aspectRatios = [
  { id: 'freeform', label: 'Free', icon: '⊞', dimensions: null },
  { id: '1x1', label: '1:1', icon: '□', dimensions: { width: 1, height: 1 } },
  { id: '3x2', label: '3:2', icon: '▭', dimensions: { width: 3, height: 2 } },
  { id: '2x3', label: '2:3', icon: '▯', dimensions: { width: 2, height: 3 } },
  { id: '4x3', label: '4:3', icon: '▭', dimensions: { width: 4, height: 3 } },
  { id: '3x4', label: '3:4', icon: '▯', dimensions: { width: 3, height: 4 } },
  { id: '16x9', label: '16:9', icon: '▭', dimensions: { width: 16, height: 9 } },
  { id: '9x16', label: '9:16', icon: '▯', dimensions: { width: 9, height: 16 } },
  { id: 'original', label: 'Orig', icon: '▣', dimensions: null },
];

export const filterEffects = [
  { id: 'none', label: 'None', icon: <Circle size={16} /> },
  { id: 'grayscale', label: 'Gray', icon: <Contrast size={16} /> },
  { id: 'sepia', label: 'Sepia', icon: <Palette size={16} /> },
  { id: 'vintage', label: 'Vintage', icon: <Layers size={16} /> },
  { id: 'blur', label: 'Blur', icon: <CircleDot size={16} /> },
  { id: 'sharpen', label: 'Sharp', icon: <Sliders size={16} /> },
];

export const aiFeatures = [
  { id: 'remove-bg', label: 'Remove BG', icon: <Sparkles size={16} /> },
  { id: 'enhance', label: 'Enhance', icon: <Wand2 size={16} /> },
  { id: 'restore', label: 'Restore', icon: <RotateCcw size={16} /> },
  { id: 'smart-crop', label: 'Smart Crop', icon: <ListFilter size={16} /> },
];

export const beautyFeatures = [
  { id: 'smooth', label: 'Smooth', icon: <PenTool size={16} /> },
  { id: 'whiten', label: 'Whiten', icon: <Sun size={16} /> },
  { id: 'eyes', label: 'Eyes', icon: <Smile size={16} /> },
  { id: 'face-shape', label: 'Face', icon: <ShapesIcon size={16} /> },
];

export const frameStyles = [
  { id: 'none', label: 'None', icon: <Square size={16} /> },
  { id: 'thin-border', label: 'Thin', icon: <SquareCode size={16} /> },
  { id: 'thick-border', label: 'Thick', icon: <Frame size={16} /> },
  { id: 'polaroid', label: 'Polaroid', icon: <Image size={16} /> },
];

export const elementTypes = [
  { id: 'stickers', label: 'Stickers', icon: <Sticker size={16} /> },
  { id: 'shapes', label: 'Shapes', icon: <Shapes size={16} /> },
  { id: 'icons', label: 'Icons', icon: <Icons.Image size={16} /> },
  { id: 'overlays', label: 'Overlays', icon: <Layers size={16} /> },
];

export default function ToolPanel({
  activeTool,
  isMobile,
  setSidebarOpen,
  aspectRatio,
  setAspectRatio,
  width,
  setWidth,
  height,
  setHeight,
  keepAspectRatio,
  setKeepAspectRatio,
  performCrop,
  setIsCropping,
  cropArea,
  setCropArea,
  imageRef,
  setupCropByAspectRatio,
  performFlip,
  performRotate,
  // AI Panel props
  activeAIFeature,
  setActiveAIFeature,
  applyAIFeature,
  // Effects Panel props
  activeEffect,
  setActiveEffect,
  effectIntensity,
  setEffectIntensity,
  applyEffect,
  // Beauty Panel props
  activeBeautyFeature,
  setActiveBeautyFeature,
  beautyIntensity,
  setBeautyIntensity,
  applyBeautyFeature,
  // Frames Panel props
  activeFrame,
  setActiveFrame,
  frameColor,
  setFrameColor,
  frameWidth,
  setFrameWidth,
  applyFrame,
  // Text Panel props
  activeTextStyle,
  setActiveTextStyle,
  textColor,
  setTextColor,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  textInput,
  setTextInput,
  addTextElement,
  // Element Panel props
  activeElementType,
  setActiveElementType,
  selectedElement,
  setSelectedElement,
  elementColor,
  setElementColor,
  elementSize,
  setElementSize,
  addElement
}) {
  const [activeAdjustTool, setActiveAdjustTool] = useState(null);
  const [activeAITool, setActiveAITool] = useState(null);
  const [activeEffectsTool, setActiveEffectsTool] = useState(null);
  const [activeBeautyTool, setActiveBeautyTool] = useState(null);
  const [activeFramesTool, setActiveFramesTool] = useState(null);
  const [activeTextTool, setActiveTextTool] = useState(null);
  const [activeElementTool, setActiveElementTool] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const applyAspectRatio = (ratioId) => {
    if (!imageRef.current) return;
    setAspectRatio(ratioId);
    setIsCropping(true);
    setupCropByAspectRatio(ratioId);
  };

  const handleToolToggle = (tool, setActiveToolFunc, currentActiveTool) => {
    if (currentActiveTool === tool) {
      setActiveToolFunc(null);
      if (tool === 'crop' && setIsCropping) setIsCropping(false);
    } else {
      if (currentActiveTool === 'crop' && setIsCropping) setIsCropping(false);
      setActiveToolFunc(tool);
      if (tool === 'crop' && setIsCropping) setIsCropping(true);
    }
  };

 
  const SectionHeader = ({ title, onClick, isActive }) => (
    <div 
      onClick={onClick} 
      className="flex items-center justify-between w-full p-2 rounded hover:bg-gray-700 cursor-pointer"
    >
      <span className="text-gray-200 font-medium text-sm">{title}</span>
      <ChevronUp size={14} className={`text-gray-400 transform transition-transform ${isActive ? 'rotate-180' : ''}`} />
    </div>
  );
  

  const PanelSection = ({ title, children, isExpanded, onToggle }) => (
    <div className="mb-3">
      <SectionHeader 
        title={title} 
        onClick={onToggle} 
        isActive={isExpanded} 
      />
      {isExpanded && (
        <div className="pl-1 pt-1 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  const ButtonGrid = ({ items, activeId, onSelect, cols = 3 }) => (
    <div className={`grid grid-cols-${cols} gap-1 mb-2`}>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`flex flex-col items-center justify-center p-1 rounded cursor-pointer transition-colors ${
            activeId === item.id 
              ? 'bg-blue-500 bg-opacity-20 border border-blue-500' 
              : 'border border-gray-600 hover:border-gray-500 hover:bg-gray-700'
          }`}
        >
          <div className="text-gray-200 mb-1">{typeof item.icon === 'string' ? item.icon : item.icon}</div>
          <span className="text-xs text-gray-300 truncate w-full text-center">{item.label}</span>
        </div>
      ))}
    </div>
  );

  const ColorPicker = ({ colors, activeColor, onChange }) => (
    <div className="flex flex-wrap gap-1 mb-2">
      {colors.map((color) => (
        <div
          key={color}
          onClick={() => onChange(color)}
          className={`w-5 h-5 rounded-full cursor-pointer transition-all ${
            activeColor === color ? 'ring-1 ring-blue-500 ring-offset-1 ring-offset-gray-800' : ''
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
      <div className="relative w-5 h-5 overflow-hidden rounded-full">
        <input
          type="color"
          value={activeColor || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="absolute top-0 left-0 w-6 h-6 cursor-pointer opacity-0"
        />
        <div className="w-5 h-5 bg-gradient-to-br from-red-500 via-green-500 to-blue-500 rounded-full" />
      </div>
    </div>
  );

  const Slider = ({ label, value, min, max, onChange, showValue = true }) => (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <label className="text-gray-300 text-xs">{label}</label>
        {showValue && <span className="text-gray-400 text-xs">{value}</span>}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-gray-700 accent-blue-500"
      />
    </div>
  );

  const ActionButton = ({ onClick, disabled, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-1.5 px-2 rounded font-medium text-sm transition-colors ${
        disabled 
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
      }`}
    >
      {children}
    </button>
  );

 
  
const renderAdjustToolPanel = () => (
  <div className="rounded-lg overflow-hidden">
    <h2 className="text-gray-200 font-medium mb-2 text-sm">Size & Orientation</h2>
    <div className="bg-gray-800 rounded-lg p-2 mb-3 shadow-md">
      <PanelSection 
        title="Crop" 
        isExpanded={activeAdjustTool === 'crop'} 
        onToggle={() => handleToolToggle('crop', setActiveAdjustTool, activeAdjustTool)}
      >
        <ButtonGrid 
          items={aspectRatios} 
          activeId={aspectRatio} 
          onSelect={applyAspectRatio} 
          cols={3}
        />
        
        <div className="flex space-x-1 mb-2">
          <input
            type="text"
            value={width}
            onChange={(e) => {
              const newWidth = e.target.value;
              setWidth(newWidth);
              if (keepAspectRatio && cropArea) {
                const ratio = cropArea.height / cropArea.width;
                setHeight(Math.round(parseInt(newWidth) * ratio).toString());
              }
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded px-1 py-1 text-xs text-gray-300 focus:border-blue-500 focus:outline-none"
            placeholder="W"
          />
          <input
            type="text"
            value={height}
            onChange={(e) => {
              const newHeight = e.target.value;
              setHeight(newHeight);
              if (keepAspectRatio && cropArea) {
                const ratio = cropArea.width / cropArea.height;
                setWidth(Math.round(parseInt(newHeight) * ratio).toString());
              }
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded px-1 py-1 text-xs text-gray-300 focus:border-blue-500 focus:outline-none"
            placeholder="H"
          />
          <button
            onClick={() => {
              if (!imageRef.current) return;
              const img = imageRef.current;
              const imgWidth = img.naturalWidth;
              const imgHeight = img.naturalHeight;
              const newWidth = parseInt(width);
              const newHeight = parseInt(height);
              const newX = Math.max(0, (imgWidth - newWidth) / 2);
              const newY = Math.max(0, (imgHeight - newHeight) / 2);
              setCropArea({ x: newX, y: newY, width: newWidth, height: newHeight });
              setIsCropping(true);
            }}
            className="p-1 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            <ArrowRight size={14} className="text-white" />
          </button>
        </div>

        <div className="flex items-center mb-1">
          <input
            type="checkbox"
            id="keepAspect"
            checked={keepAspectRatio}
            onChange={() => setKeepAspectRatio(!keepAspectRatio)}
            className="mr-1 h-3 w-3 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="keepAspect" className="text-gray-300 text-xs select-none">Keep aspect ratio</label>
        </div>
        
        <ActionButton 
          onClick={() => performCrop && performCrop(cropArea)} 
          disabled={!cropArea || !setIsCropping}
        >
          Apply Crop
        </ActionButton>
      </PanelSection>

      <PanelSection 
        title="Flip" 
        isExpanded={activeAdjustTool === 'flip'} 
        onToggle={() => handleToolToggle('flip', setActiveAdjustTool, activeAdjustTool)}
      >
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => performFlip('horizontal')}
            className="flex flex-col items-center justify-center p-2 rounded border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-colors"
          >
            <FlipHorizontal size={16} className="text-gray-200 mb-1" />
            <span className="text-xs text-gray-300">Horizontal</span>
          </button>
          <button
            onClick={() => performFlip('vertical')}
            className="flex flex-col items-center justify-center p-2 rounded border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-colors"
          >
            <FlipVertical size={16} className="text-gray-200 mb-1" />
            <span className="text-xs text-gray-300">Vertical</span>
          </button>
        </div>
      </PanelSection>

      <PanelSection 
        title="Rotate" 
        isExpanded={activeAdjustTool === 'rotate'} 
        onToggle={() => handleToolToggle('rotate', setActiveAdjustTool, activeAdjustTool)}
      >
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => performRotate('left')}
            className="flex flex-col items-center justify-center p-2 rounded border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-colors"
          >
            <RotateCcw size={16} className="text-gray-200 mb-1" />
            <span className="text-xs text-gray-300">Left 90°</span>
          </button>
          <button
            onClick={() => performRotate('right')}
            className="flex flex-col items-center justify-center p-2 rounded border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-colors"
          >
            <RotateCw size={16} className="text-gray-200 mb-1" />
            <span className="text-xs text-gray-300">Right 90°</span>
          </button>
        </div>
      </PanelSection>
    </div>
  </div>
);

  const renderAIToolPanel = () => (
    <div className="rounded-lg overflow-hidden">
      <h2 className="text-gray-200 font-medium mb-2 text-sm">AI Features</h2>
      <div className="bg-gray-800 rounded-lg p-2 mb-3 shadow-md">
        <PanelSection 
          title="AI Features" 
          isExpanded={activeAITool === 'ai-features'} 
          onToggle={() => handleToolToggle('ai-features', setActiveAITool, activeAITool)}
        >
          <ButtonGrid 
            items={aiFeatures} 
            activeId={activeAIFeature} 
            onSelect={setActiveAIFeature} 
            cols={2}
          />
          
          <Slider 
            label="Intensity" 
            value={50} 
            min={0} 
            max={100} 
            onChange={() => {}} 
          />
          
          <ActionButton 
            onClick={() => applyAIFeature && applyAIFeature(activeAIFeature)} 
            disabled={!activeAIFeature}
          >
            Apply
          </ActionButton>
        </PanelSection>

        <PanelSection 
          title="AI History" 
          isExpanded={activeAITool === 'ai-history'} 
          onToggle={() => handleToolToggle('ai-history', setActiveAITool, activeAITool)}
        >
          <div className="bg-gray-700 rounded-md p-2 h-32 overflow-y-auto">
            <p className="text-gray-400 text-xs italic text-center mt-10">No history yet</p>
          </div>
        </PanelSection>
      </div>
    </div>
  );

  const renderEffectsToolPanel = () => (
    <div className="rounded-lg overflow-hidden">
      <h2 className="text-gray-200 font-medium mb-2 text-sm">Effects & Filters</h2>
      <div className="bg-gray-800 rounded-lg p-2 mb-3 shadow-md">
        <PanelSection 
          title="Filters" 
          isExpanded={activeEffectsTool === 'filters'} 
          onToggle={() => handleToolToggle('filters', setActiveEffectsTool, activeEffectsTool)}
        >
          <ButtonGrid 
            items={filterEffects} 
            activeId={activeEffect} 
            onSelect={setActiveEffect} 
            cols={3}
          />
          
          <Slider 
            label="Intensity" 
            value={effectIntensity || 50} 
            min={0} 
            max={100} 
            onChange={setEffectIntensity} 
          />
          
          <ActionButton 
            onClick={() => applyEffect && applyEffect(activeEffect, effectIntensity)} 
            disabled={!activeEffect || activeEffect === 'none'}
          >
            Apply Filter
          </ActionButton>
        </PanelSection>

        <PanelSection 
          title="Adjustments" 
          isExpanded={activeEffectsTool === 'adjustments'} 
          onToggle={() => handleToolToggle('adjustments', setActiveEffectsTool, activeEffectsTool)}
        >
          <Slider label="Brightness" value={50} min={0} max={100} onChange={() => {}} />
          <Slider label="Contrast" value={50} min={0} max={100} onChange={() => {}} />
          <Slider label="Saturation" value={50} min={0} max={100} onChange={() => {}} />
          <Slider label="Hue" value={0} min={0} max={360} onChange={() => {}} />
          
          <ActionButton onClick={() => {}}>
            Apply Adjustments
          </ActionButton>
        </PanelSection>
      </div>
    </div>
  );

  const renderBeautyToolPanel = () => (
    <div className="rounded-lg overflow-hidden">
      <h2 className="text-gray-200 font-medium mb-2 text-sm">Beauty & Retouch</h2>
      <div className="bg-gray-800 rounded-lg p-2 mb-3 shadow-md">
        <PanelSection 
          title="Beauty Tools" 
          isExpanded={activeBeautyTool === 'beauty-features'} 
          onToggle={() => handleToolToggle('beauty-features', setActiveBeautyTool, activeBeautyTool)}
        >
          <ButtonGrid 
            items={beautyFeatures} 
            activeId={activeBeautyFeature} 
            onSelect={setActiveBeautyFeature} 
            cols={2}
          />
          
          <Slider 
            label="Intensity" 
            value={beautyIntensity || 50} 
            min={0} 
            max={100} 
            onChange={setBeautyIntensity} 
          />
          
          <ActionButton 
            onClick={() => applyBeautyFeature && applyBeautyFeature(activeBeautyFeature, beautyIntensity)} 
            disabled={!activeBeautyFeature}
          >
            Apply
          </ActionButton>
        </PanelSection>

        <PanelSection 
          title="Quick Fix" 
          isExpanded={activeBeautyTool === 'quick-fix'} 
          onToggle={() => handleToolToggle('quick-fix', setActiveBeautyTool, activeBeautyTool)}
        >
          <div className="space-y-1">
            <button className="w-full py-1.5 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors">
              <Wand2 size={14} className="mr-1" />
              <span>Auto Enhance</span>
            </button>
            <button className="w-full py-1.5 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors">
              <Sparkles size={14} className="mr-1" />
              <span>Perfect Skin</span>
            </button>
          </div>
        </PanelSection>
      </div>
    </div>
  );

  const renderFramesToolPanel = () => (
    <div className="rounded-lg overflow-hidden">
      <h2 className="text-gray-200 font-medium mb-2 text-sm">Frames & Borders</h2>
      <div className="bg-gray-800 rounded-lg p-2 mb-3 shadow-md">
        <PanelSection 
          title="Frame Styles" 
          isExpanded={activeFramesTool === 'frame-styles'} 
          onToggle={() => handleToolToggle('frame-styles', setActiveFramesTool, activeFramesTool)}
        >
          <ButtonGrid 
            items={frameStyles} 
            activeId={activeFrame} 
            onSelect={setActiveFrame} 
            cols={2}
          />
          
          {activeFrame && activeFrame !== 'none' && (
            <>
              <div className="mb-2">
                <label className="block text-gray-300 text-xs mb-1">Frame Color</label>
                <ColorPicker 
                  colors={['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00']} 
                  activeColor={frameColor || '#ffffff'} 
                  onChange={setFrameColor} 
                />
              </div>
              
              <Slider 
                label="Frame Width" 
                value={frameWidth || 10} 
                min={1} 
                max={50} 
                onChange={setFrameWidth} 
              />
            </>
          )}
          
          <ActionButton 
            onClick={() => applyFrame && applyFrame(activeFrame, frameColor, frameWidth)} 
            disabled={!activeFrame}
          >
            Apply Frame
          </ActionButton>
        </PanelSection>

        <PanelSection 
          title="Frame Effects" 
          isExpanded={activeFramesTool === 'frame-effects'} 
          onToggle={() => handleToolToggle('frame-effects', setActiveFramesTool, activeFramesTool)}
        >
          <Slider label="Shadow" value={50} min={0} max={100} onChange={() => {}} />
          <Slider label="Spread" value={50} min={0} max={100} onChange={() => {}} />
          
          <div className="mb-2">
            <label className="block text-gray-300 text-xs mb-1">Shadow Color</label>
            <input type="color" defaultValue="#000000" className="w-full h-6 rounded" />
          </div>
          
          <ActionButton onClick={() => {}}>
            Apply Effects
          </ActionButton>
        </PanelSection>
      </div>
    </div>
  );

  const renderTextToolPanel = () => (
    <div>
      <h2 className="text-gray-200 font-medium mb-2 text-sm">Text & Typography</h2>
      <div className="bg-gray-800 rounded-lg p-2 mb-3">
        <div className="flex items-center justify-between mb-2 cursor-pointer">
          <div onClick={() => handleToolToggle('text-editor', setActiveTextTool, activeTextTool)} className="flex items-center justify-between w-full">
            <span className="text-gray-300 text-sm">Text Editor</span>
            <ChevronDown size={14} className={`text-gray-400 transform ${activeTextTool === 'text-editor' ? 'rotate-180' : ''}`} />
          </div>
        </div>
        
        {activeTextTool === 'text-editor' && (
          <>
            <div className="mb-2">
              <label className="block text-gray-400 text-xs mb-1">Text Content</label>
              <textarea
                value={textInput || ''}
                onChange={(e) => setTextInput && setTextInput(e.target.value)}
                className="w-full h-16 bg-gray-700 border border-gray-600 rounded p-1 text-xs text-gray-300"
                placeholder="Enter your text here..."
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-gray-400 text-xs mb-1">Font Family</label>
              <select
                value={fontFamily || 'Arial'}
                onChange={(e) => setFontFamily && setFontFamily(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded p-1 text-xs text-gray-300"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
              </select>
            </div>
            
            <div className="mb-2">
              <label className="block text-gray-400 text-xs mb-1">Font Size</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="8"
                  max="72"
                  value={fontSize || 24}
                  onChange={(e) => setFontSize && setFontSize(parseInt(e.target.value))}
                  className="w-full h-1.5"
                />
                <span className="text-gray-400 text-xs">{fontSize || 24}</span>
              </div>
            </div>
            
            <div className="mb-2">
              <label className="block text-gray-400 text-xs mb-1">Text Color</label>
              <ColorPicker
                colors={['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00']}
                activeColor={textColor || '#ffffff'}
                onChange={setTextColor}
              />
            </div>
            
            <button
              onClick={() => addTextElement && addTextElement()}
              disabled={!textInput}
              className={`w-full py-1.5 rounded text-sm ${
                !textInput 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Add Text
            </button>
          </>
        )}

        <div className="mt-3 flex items-center justify-between cursor-pointer">
          <div onClick={() => handleToolToggle('text-styles', setActiveTextTool, activeTextTool)} className="flex items-center justify-between w-full">
            <span className="text-gray-300 text-sm">Text Styles</span>
            <ChevronDown size={14} className={`text-gray-400 transform ${activeTextTool === 'text-styles' ? 'rotate-180' : ''}`} />
          </div>
        </div>
        
        {activeTextTool === 'text-styles' && (
          <div className="grid grid-cols-2 gap-1 mt-2">
            <button className="bg-gray-700 border border-gray-600 rounded p-1 hover:border-blue-500">
              <span className="block text-center text-xs font-bold">Bold</span>
            </button>
            <button className="bg-gray-700 border border-gray-600 rounded p-1 hover:border-blue-500">
              <span className="block text-center text-xs italic">Italic</span>
            </button>
            <button className="bg-gray-700 border border-gray-600 rounded p-1 hover:border-blue-500">
              <span className="block text-center text-xs underline">Underline</span>
            </button>
            <button className="bg-gray-700 border border-gray-600 rounded p-1 hover:border-blue-500">
              <span className="block text-center text-xs">Shadow</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderElementToolPanel = () => (
    <div>
      <h2 className="text-gray-200 font-medium mb-2 text-sm">Elements & Shapes</h2>
      <div className="bg-gray-800 rounded-lg p-2 mb-3">
        <PanelSection 
          title="Element Types" 
          isExpanded={activeElementTool === 'element-types'} 
          onToggle={() => handleToolToggle('element-types', setActiveElementTool, activeElementTool)}
        >
          <ButtonGrid 
            items={elementTypes} 
            activeId={activeElementType} 
            onSelect={setActiveElementType} 
            cols={2}
          />
          
          {activeElementType && (
            <div className="bg-gray-700 rounded p-1 mt-2 h-36 overflow-y-auto grid grid-cols-3 gap-1">
              {/* Placeholder for element library */}
              {Array.from({ length: 9 }).map((_, i) => (
                <div 
                  key={i}
                  className="aspect-square bg-gray-600 rounded flex items-center justify-center hover:bg-gray-500 cursor-pointer"
                  onClick={() => setSelectedElement && setSelectedElement(`element-${i}`)}
                >
                  <BadgePlus size={16} className="text-gray-300" />
                </div>
              ))}
            </div>
          )}
        </PanelSection>

        {selectedElement && (
          <PanelSection 
            title="Element Options" 
            isExpanded={activeElementTool === 'element-options'} 
            onToggle={() => handleToolToggle('element-options', setActiveElementTool, activeElementTool)}
          >
            <div className="mb-2">
              <label className="block text-gray-400 text-xs mb-1">Element Color</label>
              <ColorPicker 
                colors={['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00']} 
                activeColor={elementColor || '#ffffff'} 
                onChange={setElementColor} 
              />
            </div>
            
            <Slider 
              label="Size" 
              value={elementSize || 50} 
              min={10} 
              max={100} 
              onChange={setElementSize} 
            />
            
            <ActionButton 
              onClick={() => addElement && addElement(selectedElement, elementColor, elementSize)} 
              disabled={!selectedElement}
            >
              Add Element
            </ActionButton>
          </PanelSection>
        )}
      </div>
    </div>
  );

  const renderActiveToolPanel = () => {
    switch (activeTool) {
      case 'adjust':
        return renderAdjustToolPanel();
      case 'ai':
        return renderAIToolPanel();
      case 'effects':
        return renderEffectsToolPanel();
      case 'beauty':
        return renderBeautyToolPanel();
      case 'frames':
        return renderFramesToolPanel();
      case 'text':
        return renderTextToolPanel();
      case 'elements':
        return renderElementToolPanel();
      default:
        return renderAdjustToolPanel();
    }
  };

    // New component for the bottom toolbar
    const BottomToolbar = () => (
      <div className="flex justify-around items-center h-full px-2">
        <ToolbarButton 
          icon={<Sliders size={20} />} 
          label="Adjust" 
          isActive={activeTool === 'adjust'} 
          onClick={() => {
            setSidebarOpen(true);
            handleToolToggle('adjust', () => {}, activeTool);
          }} 
        />
        <ToolbarButton 
          icon={<Wand2 size={20} />} 
          label="AI" 
          isActive={activeTool === 'ai'} 
          onClick={() => {
            setSidebarOpen(true);
            handleToolToggle('ai', () => {}, activeTool);
          }} 
        />
        <ToolbarButton 
          icon={<Paintbrush size={20} />} 
          label="Effects" 
          isActive={activeTool === 'effects'} 
          onClick={() => {
            setSidebarOpen(true);
            handleToolToggle('effects', () => {}, activeTool);
          }} 
        />
        <ToolbarButton 
          icon={<Smile size={20} />} 
          label="Beauty" 
          isActive={activeTool === 'beauty'} 
          onClick={() => {
            setSidebarOpen(true);
            handleToolToggle('beauty', () => {}, activeTool);
          }} 
        />
        <ToolbarButton 
          icon={<Frame size={20} />} 
          label="Frames" 
          isActive={activeTool === 'frames'} 
          onClick={() => {
            setSidebarOpen(true);
            handleToolToggle('frames', () => {}, activeTool);
          }} 
        />
        <ToolbarButton 
          icon={<Type size={20} />} 
          label="Text" 
          isActive={activeTool === 'text'} 
          onClick={() => {
            setSidebarOpen(true);
            handleToolToggle('text', () => {}, activeTool);
          }} 
        />
        <ToolbarButton 
          icon={<Shapes size={20} />} 
          label="Elements" 
          isActive={activeTool === 'elements'} 
          onClick={() => {
            setSidebarOpen(true);
            handleToolToggle('elements', () => {}, activeTool);
          }} 
        />
      </div>
    );
  
    // Helper component for toolbar buttons
    const ToolbarButton = ({ icon, label, isActive, onClick }) => (
      <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-1 ${
          isActive ? 'text-blue-400' : 'text-gray-300'
        }`}
      >
        <div className={`p-1 rounded-full ${isActive ? 'bg-blue-500 bg-opacity-20' : ''}`}>
          {icon}
        </div>
        <span className="text-xs mt-1">{label}</span>
      </button>
    );
  
    // Bottom sheet component for mobile expanded view
    const BottomSheet = ({ isOpen, onClose, children }) => {
      // Lock body scroll when sheet is open
      useEffect(() => {
        if (isOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'auto';
        }
        return () => {
          document.body.style.overflow = 'auto';
        };
      }, [isOpen]);
  
      if (!isOpen) return null;
  
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div 
            className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-lg z-50 max-h-[80vh] overflow-y-auto"
            style={{ height: 'auto', maxHeight: '80vh' }}
          >
            <div className="sticky top-0 bg-gray-800 p-2 flex justify-between items-center border-b border-gray-700">
              <div className="w-8"></div> {/* Empty div for flex spacing */}
              <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto"></div>
              <button onClick={onClose} className="p-1">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-3 pb-16">
              {children}
            </div>
          </div>
        </div>
      );
    };

    return (
      <>
        {/* Conditionally render based on mobile or desktop */}
        {isMobile ? (
          <>
            {/* Fixed bottom toolbar */}
            <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-900 border-t border-gray-800 z-30">
              <BottomToolbar />
            </div>
            
            {/* Bottom sheet for expanded tool options */}
            <BottomSheet 
              isOpen={isBottomSheetOpen} 
              onClose={() => setIsBottomSheetOpen(false)}
            >
              {renderActiveToolPanel()}
            </BottomSheet>
          </>
        ) : (
          // Original sidebar layout for desktop
          <div className="bg-gray-900 h-full overflow-y-auto text-white shadow-lg w-64">
            <div className="p-3">
              {renderActiveToolPanel()}
            </div>
          </div>
        )}
      </>
    );
}


