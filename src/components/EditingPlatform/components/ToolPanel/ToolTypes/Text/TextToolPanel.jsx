import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronUp, Type, Plus, X, Edit3, Bold, Italic, Underline, 
  Image, Sparkles, Target, Layers, AlignLeft, AlignCenter, AlignRight,
  ArrowLeft, Palette, Settings, Eye
} from 'lucide-react';

// Mock ColorPicker component since it's not available
const ColorPicker = ({ colors, activeColor, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {colors.map(color => (
      <button
        key={color}
        onClick={() => onChange(color)}
        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
          activeColor === color ? 'border-white scale-110' : 'border-gray-600 hover:border-gray-400'
        }`}
        style={{ backgroundColor: color }}
      />
    ))}
  </div>
);

const TextToolPanel = ({
  activeTextTool,
  setActiveTextTool,
  // Text Editor props
  textElements = [],
  textSettings = {
    content: '',
    fontFamily: 'Arial',
    fontSize: 24,
    color: '#ffffff',
    align: 'left',
    bold: false,
    italic: false,
    underline: false,
    shadow: false,
    shadowBlur: 2,
    shadowOffsetX: 1,
    shadowOffsetY: 1,
    shadowColor: '#000000',
    outline: false,
    outlineWidth: 1,
    outlineColor: '#000000'
  },
  setTextSettings,
  addTextElement,
  removeTextElement,
  updateTextElement,
  applyTextToImage,
  clearAllText,
  onBack
}) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeSection, setActiveSection] = useState('text-editor');
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

  const sections = [
    {
      id: 'text-editor',
      title: 'Text Editor',
      mobileTitle: 'Editor',
      icon: <Type size={16} />,
      mobileIcon: <Type size={18} />,
      color: 'blue',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      id: 'text-elements',
      title: 'Text Elements',
      mobileTitle: 'Elements',
      icon: <Layers size={16} />,
      mobileIcon: <Layers size={18} />,
      color: 'green',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      id: 'text-styles',
      title: 'Text Styles',
      mobileTitle: 'Styles',
      icon: <Palette size={16} />,
      mobileIcon: <Palette size={18} />,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const handleToolToggle = (tool) => {
    if (activeTextTool === tool) {
      setActiveTextTool(null);
    } else {
      setActiveTextTool(tool);
    }
  };

  const handleAddText = async () => {
    if (!textSettings?.content?.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(async () => {
      if (addTextElement) {
        const newElement = addTextElement();
        if (newElement && applyTextToImage) {
          const result = await applyTextToImage();
          if (result) {
            console.log('Text applied successfully');
          }
        }
      }
      setIsProcessing(false);
      
      // On mobile, close the section after applying
      if (isMobile) {
        setActiveSection(null);
      }
    }, 1000);
  };

  const toggleTextStyle = (styleName) => {
    if (setTextSettings) {
      setTextSettings(prev => ({
        ...prev,
        [styleName]: !prev[styleName]
      }));
    }
  };

  const handleSectionClick = (section) => {
    if (isMobile) {
      setActiveSection(section);
    } else {
      setActiveSection(activeSection === section ? '' : section);
    }
  };

  const handleBack = () => {
    if (activeSection && isMobile) {
      setActiveSection(null);
    } else {
      onBack?.();
    }
  };

  const fontFamilies = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 
    'Verdana', 'Comic Sans MS', 'Impact', 'Arial Black', 'Roboto', 'Open Sans'
  ];

  const commonColors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
    '#ff00ff', '#00ffff', '#808080', '#ffa500', '#800080', '#008000'
  ];

  const textAlignments = [
    { id: 'left', label: 'Left', icon: <AlignLeft size={14} /> },
    { id: 'center', label: 'Center', icon: <AlignCenter size={14} /> },
    { id: 'right', label: 'Right', icon: <AlignRight size={14} /> }
  ];

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
          {value}{label === 'Font Size' ? 'px' : '%'}
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

  const renderTextEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-400 text-sm mb-2">Your Text</label>
        <textarea
          value={textSettings?.content || ''}
          onChange={(e) => {
            if (setTextSettings) {
              setTextSettings(prev => ({ ...prev, content: e.target.value }));
            }
          }}
          className="w-full h-20 bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm text-gray-300 resize-none focus:outline-none focus:border-blue-500"
          placeholder="Enter your text here..."
        />
      </div>
      
      <div>
        <label className="block text-gray-400 text-sm mb-2">Font Family</label>
        <select
          value={textSettings?.fontFamily || 'Arial'}
          onChange={(e) => setTextSettings && setTextSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
        >
          {fontFamilies.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>
      
      <SliderControl 
        label="Font Size" 
        value={textSettings?.fontSize || 24} 
        min={8} 
        max={72} 
        onChange={(value) => setTextSettings && setTextSettings(prev => ({ ...prev, fontSize: value }))}
        icon={<Type size={14} />}
        color="blue"
      />
      
      <div>
        <label className="block text-gray-400 text-sm mb-2">Text Color</label>
        <ColorPicker
          colors={commonColors}
          activeColor={textSettings?.color || '#ffffff'}
          onChange={(color) => setTextSettings && setTextSettings(prev => ({ ...prev, color }))}
        />
      </div>
      
      <div>
        <label className="block text-gray-400 text-sm mb-2">Text Alignment</label>
        <ButtonGrid 
          items={textAlignments} 
          activeId={textSettings?.align || 'left'} 
          onSelect={(align) => setTextSettings && setTextSettings(prev => ({ ...prev, align }))} 
          cols={3}
        />
      </div>
      
      <button
        onClick={handleAddText}
        disabled={!textSettings?.content?.trim() || isProcessing}
        className={`w-full py-3 rounded-lg font-medium transition-all duration-200 
          ${(!textSettings?.content?.trim() || isProcessing) 
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
          }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <Plus size={16} />
          <span>{isProcessing ? 'Adding Text...' : 'Add Text to Image'}</span>
        </div>
      </button>
    </div>
  );

  const renderTextStyles = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-400 text-sm mb-2">Text Style</label>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleTextStyle('bold')}
            className={`p-3 rounded-lg transition-all duration-200 ${
              textSettings?.bold 
                ? 'bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400' 
                : 'border border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300'
            }`}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => toggleTextStyle('italic')}
            className={`p-3 rounded-lg transition-all duration-200 ${
              textSettings?.italic 
                ? 'bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400' 
                : 'border border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300'
            }`}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => toggleTextStyle('underline')}
            className={`p-3 rounded-lg transition-all duration-200 ${
              textSettings?.underline 
                ? 'bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400' 
                : 'border border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300'
            }`}
            title="Underline"
          >
            <Underline size={16} />
          </button>
        </div>
      </div>
      
      {/* Shadow Toggle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-gray-400 text-sm">Text Shadow</label>
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={textSettings?.shadow || false}
              onChange={() => toggleTextStyle('shadow')}
            />
            <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {textSettings?.shadow && (
          <div className="p-3 bg-gray-700 rounded-lg">
            <SliderControl 
              label="Shadow Blur" 
              value={textSettings?.shadowBlur || 2} 
              min={0} 
              max={10} 
              onChange={(value) => setTextSettings && setTextSettings(prev => ({ ...prev, shadowBlur: value }))}
              icon={<Sparkles size={14} />}
              color="purple"
            />
            <SliderControl 
              label="Shadow Offset" 
              value={textSettings?.shadowOffsetX || 1} 
              min={0} 
              max={10} 
              onChange={(value) => setTextSettings && setTextSettings(prev => ({ 
                ...prev, 
                shadowOffsetX: value,
                shadowOffsetY: value 
              }))}
              icon={<Target size={14} />}
              color="purple"
            />
            <div className="mb-2">
              <label className="block text-gray-400 text-sm mb-2">Shadow Color</label>
              <ColorPicker
                colors={['#000000', '#ffffff', '#808080', '#333333']}
                activeColor={textSettings?.shadowColor || '#000000'}
                onChange={(color) => setTextSettings && setTextSettings(prev => ({ ...prev, shadowColor: color }))}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Outline Toggle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-gray-400 text-sm">Text Outline</label>
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={textSettings?.outline || false}
              onChange={() => toggleTextStyle('outline')}
            />
            <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {textSettings?.outline && (
          <div className="p-3 bg-gray-700 rounded-lg">
            <SliderControl 
              label="Outline Width" 
              value={textSettings?.outlineWidth || 1} 
              min={1} 
              max={5} 
              onChange={(value) => setTextSettings && setTextSettings(prev => ({ ...prev, outlineWidth: value }))}
              icon={<Edit3 size={14} />}
              color="green"
            />
            <div className="mb-2">
              <label className="block text-gray-400 text-sm mb-2">Outline Color</label>
              <ColorPicker
                colors={commonColors}
                activeColor={textSettings?.outlineColor || '#000000'}
                onChange={(color) => setTextSettings && setTextSettings(prev => ({ ...prev, outlineColor: color }))}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTextElements = () => (
    <div className="space-y-4">
      {textElements && textElements.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm font-medium">
              Active Elements ({textElements.length})
            </span>
            <button
              onClick={clearAllText}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {textElements.map((element, index) => (
              <div key={element.id} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-sm truncate font-medium">
                      {element.content}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {element.fontFamily} • {element.fontSize}px
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div 
                        className="w-4 h-4 rounded border border-gray-500" 
                        style={{ backgroundColor: element.color }}
                      />
                      <span className="text-gray-400 text-xs">
                        {element.color?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTextElement && removeTextElement(element.id)}
                    className="text-red-400 hover:text-red-300 p-1 transition-colors"
                    title="Remove text"
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
          <Type size={32} className="text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No text elements added yet</p>
          <p className="text-gray-500 text-xs mt-1">Add text from the editor above</p>
        </div>
      )}
    </div>
  );

  const renderMobileFeatures = () => {
    const currentSection = sections.find(s => s.id === activeSection);
    if (!currentSection) return null;

    return (
      <>
        {/* Section indicator */}
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-b ${currentSection.gradient} text-white mr-2`}>
          {currentSection.mobileIcon}
          <span className="text-xs font-medium">{currentSection.mobileTitle}</span>
        </div>

        {/* Quick actions based on section */}
        {activeSection === 'text-editor' && (
          <>
            <button
              onClick={() => setActiveSection('text-styles')}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap hover:bg-gray-800 text-gray-300"
            >
              <Palette size={16} />
              <span className="text-xs">Styles</span>
            </button>
            <button
              onClick={handleAddText}
              disabled={!textSettings?.content?.trim() || isProcessing}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                isProcessing || !textSettings?.content?.trim()
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : `bg-gradient-to-r ${currentSection.gradient} hover:shadow-lg text-white`
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Adding...</span>
                </div>
              ) : (
                <span className="text-xs">Add Text</span>
              )}
            </button>
          </>
        )}

        {activeSection === 'text-styles' && (
          <>
            <button
              onClick={() => toggleTextStyle('bold')}
              className={`p-3 rounded-lg transition-all duration-200 ${
                textSettings?.bold 
                  ? `bg-gradient-to-b ${currentSection.gradient} text-white` 
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => toggleTextStyle('italic')}
              className={`p-3 rounded-lg transition-all duration-200 ${
                textSettings?.italic 
                  ? `bg-gradient-to-b ${currentSection.gradient} text-white` 
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <Italic size={16} />
            </button>
            <button
              onClick={() => toggleTextStyle('underline')}
              className={`p-3 rounded-lg transition-all duration-200 ${
                textSettings?.underline 
                  ? `bg-gradient-to-b ${currentSection.gradient} text-white` 
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <Underline size={16} />
            </button>
            <button
              onClick={() => toggleTextStyle('shadow')}
              className={`p-3 rounded-lg transition-all duration-200 ${
                textSettings?.shadow 
                  ? `bg-gradient-to-b ${currentSection.gradient} text-white` 
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <Sparkles size={16} />
            </button>
          </>
        )}

        {activeSection === 'text-elements' && textElements.length > 0 && (
          <>
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg">
              <span className="text-xs text-gray-300">{textElements.length} elements</span>
            </div>
            <button
              onClick={clearAllText}
              className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
            >
              <span className="text-xs">Clear All</span>
            </button>
          </>
        )}
      </>
    );
  };

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
              // Features view for selected section
              renderMobileFeatures()
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
        <h2 className="text-xl font-semibold mb-6 text-gray-100">Text Editor</h2>
        
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
                  {section.id === 'text-editor' && renderTextEditor()}
                  {section.id === 'text-styles' && renderTextStyles()}
                  {section.id === 'text-elements' && renderTextElements()}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 text-gray-400 text-sm text-center flex items-center justify-center space-x-2">
          <Image size={14} />
          <span>Drag text to position after adding</span>
        </div>
      </div>
    </div>
  );
};

export default TextToolPanel;