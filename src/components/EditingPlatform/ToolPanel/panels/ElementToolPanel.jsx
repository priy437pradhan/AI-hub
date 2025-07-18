import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronUp, Shapes, Settings, Plus, X, Palette, 
  Move, RotateCw, Layers, Target, Zap, ImageIcon, Sticker, Image as IconImage,
  ArrowLeft, Check
} from 'lucide-react';
import ColorPicker from '../common/ColorPicker';
import * as Icons from 'lucide-react';

export const elementTypes = [
  { id: 'stickers', label: 'Stickers', icon: <Icons.Sticker size={16} />, mobileIcon: <Icons.Sticker size={18} /> },
  { id: 'shapes', label: 'Shapes', icon: <Icons.Shapes size={16} />, mobileIcon: <Icons.Shapes size={18} /> },
  { id: 'icons', label: 'Icons', icon: <Icons.Image size={16} />, mobileIcon: <Icons.Image size={18} /> },
  { id: 'overlays', label: 'Overlays', icon: <Icons.Layers size={16} />, mobileIcon: <Icons.Layers size={18} /> },
];

const ElementToolPanel = ({
  activeElementTool,
  setActiveElementTool,
  activeElementType,
  setActiveElementType,
  selectedElement,
  setSelectedElement,
  elementColor,
  setElementColor,
  elementSize,
  setElementSize,
  elementOpacity,
  setElementOpacity,
  elementRotation,
  setElementRotation,
  addElement,
  elements,
  removeElement,
  clearAllElements,
  onBack
}) => {
  const [activeSection, setActiveSection] = useState('element-types');
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

  const handleToolToggle = (tool) => {
    if (activeElementTool === tool) {
      setActiveElementTool(null);
    } else {
      setActiveElementTool(tool);
    }
  };

  const handleAddElement = async () => {
    if (!selectedElement || !activeElementType) return;
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(async () => {
      if (addElement) {
        const result = await addElement(
          selectedElement, 
          elementColor || '#ffffff', 
          elementSize || 50,
          elementOpacity || 100,
          elementRotation || 0
        );
        if (result) {
          console.log('Element added successfully');
        }
      }
      setIsProcessing(false);
      
      // On mobile, go back to main sections after adding
      if (isMobile) {
        setActiveSection('');
      }
    }, 1000);
  };

  const handleSectionClick = (sectionId) => {
    if (isMobile) {
      setActiveSection(sectionId);
    } else {
      setActiveSection(activeSection === sectionId ? '' : sectionId);
    }
  };

  const handleBack = () => {
    if (activeSection) {
      setActiveSection('');
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
    unit = "%"
  }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-gray-400">{icon}</div>}
          <span className="text-sm text-gray-300 font-medium">{label}</span>
        </div>
        <span className={`text-sm font-medium ${value !== (label === 'Rotation' ? 0 : 50) ? `text-${color}-400` : 'text-gray-400'}`}>
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
            ${value !== (label === 'Rotation' ? 0 : 50) ? `bg-${color}-500 border-${color}-400` : 'bg-white border-gray-400'}`}
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

  const sections = [
    {
      id: 'element-types',
      title: 'Element Types',
      mobileTitle: 'Types',
      icon: <Shapes size={16} />,
      mobileIcon: <Shapes size={18} />
    },
    {
      id: 'element-options',
      title: 'Element Options',
      mobileTitle: 'Options',
      icon: <Settings size={16} />,
      mobileIcon: <Settings size={18} />
    },
    {
      id: 'element-list',
      title: 'Active Elements',
      mobileTitle: 'Elements',
      icon: <Layers size={16} />,
      mobileIcon: <Layers size={18} />
    }
  ];

  const commonColors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
    '#ff00ff', '#00ffff', '#808080', '#ffa500', '#800080', '#008000'
  ];

  const renderElementTypes = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-400 text-sm mb-3">Choose Element Type</label>
        <ButtonGrid 
          items={elementTypes} 
          activeId={activeElementType} 
          onSelect={setActiveElementType} 
          cols={2}
        />
      </div>
      
      {activeElementType && (
        <div>
          <label className="block text-gray-400 text-sm mb-2">Select Element</label>
          <div className="bg-gray-700 rounded-lg p-3 h-36 overflow-y-auto">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedElement && setSelectedElement(`${activeElementType}-${i}`)}
                  className={`aspect-square rounded-lg flex items-center justify-center transition-all duration-200 
                    ${selectedElement === `${activeElementType}-${i}` 
                      ? 'bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400' 
                      : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                    }`}
                >
                  <div className="text-center">
                    <div className="mb-1">{elementTypes.find(t => t.id === activeElementType)?.icon}</div>
                    <span className="text-xs">{i + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="text-gray-400 text-sm text-center flex items-center justify-center space-x-2">
        <Target size={14} />
        <span>Select type and element to continue</span>
      </div>
    </div>
  );

  const renderElementOptions = () => (
    <div className="space-y-4">
      {selectedElement ? (
        <>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Element Color</label>
            <ColorPicker 
              colors={commonColors} 
              activeColor={elementColor || '#ffffff'} 
              onChange={setElementColor} 
            />
          </div>
          
          <SliderControl 
            label="Element Size" 
            value={elementSize || 50} 
            min={10} 
            max={100} 
            onChange={setElementSize}
            icon={<Move size={14} />}
            color="blue"
          />
          
          <SliderControl 
            label="Opacity" 
            value={elementOpacity || 100} 
            min={0} 
            max={100} 
            onChange={setElementOpacity}
            icon={<Palette size={14} />}
            color="purple"
          />
          
          <SliderControl 
            label="Rotation" 
            value={elementRotation || 0} 
            min={0} 
            max={360} 
            onChange={setElementRotation}
            icon={<RotateCw size={14} />}
            color="green"
            unit="°"
          />
          
          <button
            onClick={handleAddElement}
            disabled={!selectedElement || !activeElementType || isProcessing}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 
              ${(!selectedElement || !activeElementType || isProcessing) 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
              }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Plus size={16} />
              <span>{isProcessing ? 'Adding Element...' : 'Add Element to Image'}</span>
            </div>
          </button>
          
          <div className="text-gray-400 text-sm text-center flex items-center justify-center space-x-2">
            <ImageIcon size={14} />
            <span>Drag element to position after adding</span>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Shapes size={32} className="text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No element selected</p>
          <p className="text-gray-500 text-xs mt-1">Choose an element type and select an element first</p>
        </div>
      )}
    </div>
  );

  const renderElementList = () => (
    <div className="space-y-4">
      {elements && elements.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm font-medium">
              Active Elements ({elements.length})
            </span>
            <button
              onClick={clearAllElements}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {elements.map((element, index) => (
              <div key={element.id} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-sm font-medium">
                      {element.type} Element
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Size: {element.size}px • Opacity: {element.opacity}%
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div 
                        className="w-4 h-4 rounded border border-gray-500" 
                        style={{ backgroundColor: element.color }}
                      />
                      <span className="text-gray-400 text-xs">
                        {element.color.toUpperCase()}
                      </span>
                      {element.rotation !== 0 && (
                        <span className="text-gray-400 text-xs">
                          • {element.rotation}°
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeElement && removeElement(element.id)}
                    className="text-red-400 hover:text-red-300 p-1 transition-colors"
                    title="Remove element"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Layers size={32} className="text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No elements added yet</p>
          <p className="text-gray-500 text-xs mt-1">Add elements from the options above</p>
        </div>
      )}
    </div>
  );

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
            <span className="text-sm text-white">Back</span>
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
              // Section content view
              <>
                {/* Section indicator */}
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white mr-2">
                  {currentSection.mobileIcon}
                  <span className="text-xs font-medium">{currentSection.mobileTitle}</span>
                </div>

                {/* Section specific content */}
                {activeSection === 'element-types' && (
                  <>
                    {/* Element Types */}
                    {elementTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setActiveElementType(type.id)}
                        className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                          activeElementType === type.id
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg text-white'
                            : 'hover:bg-gray-800 text-gray-300'
                        }`}
                      >
                        {type.mobileIcon}
                        <span className="text-xs">{type.label}</span>
                      </button>
                    ))}

                    {/* Element Selection */}
                    {activeElementType && (
                      <>
                        <div className="w-px h-6 bg-gray-600 mx-2" />
                        {Array.from({ length: 6 }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedElement(`${activeElementType}-${i}`)}
                            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                              selectedElement === `${activeElementType}-${i}`
                                ? 'bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400'
                                : 'hover:bg-gray-800 text-gray-300'
                            }`}
                          >
                            {elementTypes.find(t => t.id === activeElementType)?.mobileIcon}
                            <span className="text-xs">{i + 1}</span>
                          </button>
                        ))}
                      </>
                    )}
                  </>
                )}

                {activeSection === 'element-options' && selectedElement && (
                  <>
                    {/* Color Picker */}
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg">
                      <Palette size={16} className="text-gray-400" />
                      <div className="flex items-center space-x-1">
                        {commonColors.slice(0, 6).map((color) => (
                          <button
                            key={color}
                            onClick={() => setElementColor(color)}
                            className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                              elementColor === color ? 'border-white scale-110' : 'border-gray-600'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Size Control */}
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg">
                      <Move size={16} className="text-gray-400" />
                      <span className="text-xs text-gray-300">Size</span>
                      <div className="relative w-16 h-1 bg-gray-700 rounded-full">
                        <div 
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300"
                          style={{ width: `${elementSize || 50}%` }}
                        />
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={elementSize || 50}
                          onChange={(e) => setElementSize(parseInt(e.target.value))}
                          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <span className="text-xs text-white font-medium">{elementSize || 50}%</span>
                    </div>

                    {/* Opacity Control */}
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg">
                      <Palette size={16} className="text-gray-400" />
                      <span className="text-xs text-gray-300">Opacity</span>
                      <div className="relative w-16 h-1 bg-gray-700 rounded-full">
                        <div 
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300"
                          style={{ width: `${elementOpacity || 100}%` }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={elementOpacity || 100}
                          onChange={(e) => setElementOpacity(parseInt(e.target.value))}
                          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <span className="text-xs text-white font-medium">{elementOpacity || 100}%</span>
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={handleAddElement}
                      disabled={!selectedElement || !activeElementType || isProcessing}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                        isProcessing || !selectedElement || !activeElementType
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg text-white'
                      }`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs">Adding...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Plus size={16} />
                          <span className="text-xs">Add</span>
                        </div>
                      )}
                    </button>
                  </>
                )}

                {activeSection === 'element-list' && (
                  <>
                    {elements && elements.length > 0 ? (
                      <>
                        <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg">
                          <Layers size={16} className="text-gray-400" />
                          <span className="text-xs text-gray-300">Elements: {elements.length}</span>
                        </div>
                        <button
                          onClick={clearAllElements}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 whitespace-nowrap"
                        >
                          <div className="flex items-center space-x-2">
                            <X size={16} />
                            <span className="text-xs">Clear All</span>
                          </div>
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg">
                        <Layers size={16} className="text-gray-400" />
                        <span className="text-xs text-gray-400">No elements added</span>
                      </div>
                    )}
                  </>
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
        <h2 className="text-xl font-semibold mb-6 text-gray-100">Elements & Shapes</h2>
        
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
                  {section.id === 'element-types' && renderElementTypes()}
                  {section.id === 'element-options' && renderElementOptions()}
                  {section.id === 'element-list' && renderElementList()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElementToolPanel;