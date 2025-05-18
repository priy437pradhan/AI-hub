import React, { useState } from 'react';
import { ChevronDown, Type, Plus, X, Edit3 } from 'lucide-react';
import ColorPicker from '../common/ColorPicker';
import { subToolNames } from '../../data/constants';

const TextToolPanel = ({
  activeTextTool,
  setActiveTextTool,
  // Text Editor props
  textElements,
  textSettings,
  setTextSettings,
  addTextElement,
  removeTextElement,
  updateTextElement,
  applyTextToImage,
  clearAllText,
  // Text Styles props
  styleSettings,
  setStyleSettings,
  applyTextStyle,
  toggleStyle,
  updateStyleSetting
}) => {
  const [selectedElement, setSelectedElement] = useState(null);

  const handleToolToggle = (tool) => {
    if (activeTextTool === tool) {
      setActiveTextTool(null);
    } else {
      setActiveTextTool(tool);
    }
  };

  const handleAddText = async () => {
    const newElement = addTextElement();
    if (newElement) {
      // Apply text to image after adding
      const result = await applyTextToImage();
      if (result) {
        // This would be handled by the parent component
        console.log('Text applied successfully');
      }
    }
  };

  const handleStyleApply = async (element) => {
    if (element) {
      const result = await applyTextStyle(element, styleSettings);
      if (result) {
        console.log('Style applied successfully');
      }
    }
  };

  const fontFamilies = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Comic Sans MS',
    'Impact',
    'Arial Black'
  ];

  const commonColors = [
    '#ffffff', // White
    '#000000', // Black
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#808080', // Gray
    '#ffa500'  // Orange
  ];

  return (
    <div>
      <h2 className="text-gray-200 font-medium mb-2 text-sm flex items-center">
        <Type size={16} className="mr-2" />
        Text & Typography
      </h2>
      
      {/* Text Editor Section */}
      <div className="bg-gray-800 rounded-lg p-2 mb-3">
        <div className="flex items-center justify-between mb-2 cursor-pointer">
          <div onClick={() => handleToolToggle(subToolNames.TEXT_EDITOR)} className="flex items-center justify-between w-full">
            <span className="text-gray-300 text-sm flex items-center">
              <Edit3 size={14} className="mr-2" />
              Text Editor
            </span>
            <ChevronDown size={14} className={`text-gray-400 transform ${activeTextTool === subToolNames.TEXT_EDITOR ? 'rotate-180' : ''}`} />
          </div>
        </div>
        
        {activeTextTool === subToolNames.TEXT_EDITOR && (
          <>
           <div className="mb-3">
  <label className="block text-gray-400 text-xs mb-1">Text Content</label>
  <textarea
    value={textSettings?.content || ''}
    onChange={(e) => {
      // Make sure we're properly setting the content
      if (setTextSettings) {
        setTextSettings(prev => ({ ...prev, content: e.target.value }));
        console.log("Text content updated:", e.target.value);
      } else {
        console.error("setTextSettings function is undefined");
      }
    }}
    className="w-full h-16 bg-gray-700 border border-gray-600 rounded p-2 text-xs text-gray-300 resize-none"
    placeholder="Enter your text here..."
  />
</div>
            
            <div className="mb-3">
              <label className="block text-gray-400 text-xs mb-1">Font Family</label>
              <select
                value={textSettings?.fontFamily || 'Arial'}
                onChange={(e) => setTextSettings && setTextSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-xs text-gray-300"
              >
                {fontFamilies.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-3">
              <label className="block text-gray-400 text-xs mb-1">Font Size</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="8"
                  max="72"
                  value={textSettings?.fontSize || 24}
                  onChange={(e) => setTextSettings && setTextSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                  className="flex-1 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-400 text-xs w-8 text-center">{textSettings?.fontSize || 24}</span>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-gray-400 text-xs mb-1">Text Color</label>
              <ColorPicker
                colors={commonColors}
                activeColor={textSettings?.color || '#ffffff'}
                onChange={(color) => setTextSettings && setTextSettings(prev => ({ ...prev, color }))}
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-gray-400 text-xs mb-1">Position</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-500 text-xs">X (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={textSettings?.x || 50}
                    onChange={(e) => setTextSettings && setTextSettings(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-1 text-xs text-gray-300"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-xs">Y (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={textSettings?.y || 50}
                    onChange={(e) => setTextSettings && setTextSettings(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-1 text-xs text-gray-300"
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={handleAddText}
              disabled={!textSettings?.content?.trim()}
              className={`w-full py-2 rounded text-sm flex items-center justify-center ${
                !textSettings?.content?.trim() 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white transition-colors'
              }`}
            >
              <Plus size={14} className="mr-1" />
              Add Text
            </button>
          </>
        )}
      </div>

      {/* Text Styles Section */}
      <div className="bg-gray-800 rounded-lg p-2 mb-3">
        <div className="flex items-center justify-between cursor-pointer">
          <div onClick={() => handleToolToggle(subToolNames.TEXT_STYLES)} className="flex items-center justify-between w-full">
            <span className="text-gray-300 text-sm">Text Styles</span>
            <ChevronDown size={14} className={`text-gray-400 transform ${activeTextTool === subToolNames.TEXT_STYLES ? 'rotate-180' : ''}`} />
          </div>
        </div>
        
        {activeTextTool === subToolNames.TEXT_STYLES && (
          <>
            <div className="grid grid-cols-2 gap-2 mt-3 mb-3">
              <button 
                onClick={() => toggleStyle('bold')}
                className={`py-2 rounded text-xs border transition-colors ${
                  styleSettings?.bold 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-blue-500'
                }`}
              >
                <span className="font-bold">Bold</span>
              </button>
              <button 
                onClick={() => toggleStyle('italic')}
                className={`py-2 rounded text-xs border transition-colors ${
                  styleSettings?.italic 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-blue-500'
                }`}
              >
                <span className="italic">Italic</span>
              </button>
              <button 
                onClick={() => toggleStyle('underline')}
                className={`py-2 rounded text-xs border transition-colors ${
                  styleSettings?.underline 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-blue-500'
                }`}
              >
                <span className="underline">Underline</span>
              </button>
              <button 
                onClick={() => toggleStyle('shadow')}
                className={`py-2 rounded text-xs border transition-colors ${
                  styleSettings?.shadow 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-blue-500'
                }`}
              >
                Shadow
              </button>
            </div>

            {styleSettings?.shadow && (
              <div className="mb-3 p-2 bg-gray-700 rounded">
                <label className="block text-gray-400 text-xs mb-1">Shadow Settings</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-gray-500 text-xs">Blur</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={styleSettings?.shadowBlur || 2}
                      onChange={(e) => updateStyleSetting('shadowBlur', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs">Offset</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={styleSettings?.shadowOffsetX || 1}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        updateStyleSetting('shadowOffsetX', value);
                        updateStyleSetting('shadowOffsetY', value);
                      }}
                      className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                <ColorPicker
                  colors={['#000000', '#ffffff', '#808080']}
                  activeColor={styleSettings?.shadowColor || '#000000'}
                  onChange={(color) => updateStyleSetting('shadowColor', color)}
                />
              </div>
            )}

            <div className="mb-3">
              <button 
                onClick={() => toggleStyle('outline')}
                className={`w-full py-2 rounded text-xs border transition-colors ${
                  styleSettings?.outline 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-blue-500'
                }`}
              >
                Text Outline
              </button>
              
              {styleSettings?.outline && (
                <div className="mt-2 p-2 bg-gray-700 rounded">
                  <div className="mb-2">
                    <label className="block text-gray-500 text-xs mb-1">Outline Width</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={styleSettings?.outlineWidth || 1}
                      onChange={(e) => updateStyleSetting('outlineWidth', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <ColorPicker
                    colors={commonColors}
                    activeColor={styleSettings?.outlineColor || '#000000'}
                    onChange={(color) => updateStyleSetting('outlineColor', color)}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Text Elements List */}
      {textElements && textElements.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Text Elements ({textElements.length})</span>
            <button
              onClick={clearAllText}
              className="text-red-400 hover:text-red-300 text-xs"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {textElements.map((element, index) => (
              <div key={element.id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-xs truncate">
                    {element.content}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {element.fontFamily} {element.fontSize}px
                  </p>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={() => handleStyleApply(element)}
                    className="text-blue-400 hover:text-blue-300 p-1"
                    title="Apply current styles"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    onClick={() => removeTextElement(element.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Remove text"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToolPanel;