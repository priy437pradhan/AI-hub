import React, { useState } from 'react';
import { ChevronDown, Type, Plus, X, Edit3, Bold, Italic, Underline, Image } from 'lucide-react';
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
  clearAllText
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
        console.log('Text applied successfully');
      }
    }
  };

  const toggleTextStyle = (styleName) => {
    if (setTextSettings) {
      setTextSettings(prev => ({
        ...prev,
        [styleName]: !prev[styleName]
      }));
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
    <div className="text-tool-panel">
      <h2 className="text-gray-200 font-medium mb-2 text-sm flex items-center">
        <Type size={16} className="mr-2" />
        Text Editor
      </h2>
      
      {/* Text Editor Main Section */}
      <div className="bg-gray-800 rounded-lg p-3 mb-3">
        <div className="mb-3">
          <label className="block text-gray-400 text-xs mb-1">Your Text</label>
          <textarea
            value={textSettings?.content || ''}
            onChange={(e) => {
              if (setTextSettings) {
                setTextSettings(prev => ({ ...prev, content: e.target.value }));
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
        
        {/* Text Style Options */}
        <div className="mb-3">
          <label className="block text-gray-400 text-xs mb-1">Text Style</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleTextStyle('bold')}
              className={`p-2 rounded ${textSettings?.bold ? 'bg-blue-600' : 'bg-gray-700'}`}
              title="Bold"
            >
              <Bold size={16} color={textSettings?.bold ? '#ffffff' : '#bbbbbb'} />
            </button>
            <button
              onClick={() => toggleTextStyle('italic')}
              className={`p-2 rounded ${textSettings?.italic ? 'bg-blue-600' : 'bg-gray-700'}`}
              title="Italic"
            >
              <Italic size={16} color={textSettings?.italic ? '#ffffff' : '#bbbbbb'} />
            </button>
            <button
              onClick={() => toggleTextStyle('underline')}
              className={`p-2 rounded ${textSettings?.underline ? 'bg-blue-600' : 'bg-gray-700'}`}
              title="Underline"
            >
              <Underline size={16} color={textSettings?.underline ? '#ffffff' : '#bbbbbb'} />
            </button>
          </div>
        </div>
        
        {/* Shadow Toggle */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <label className="text-gray-400 text-xs">Text Shadow</label>
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={textSettings?.shadow || false}
                onChange={() => toggleTextStyle('shadow')}
              />
              <div className="relative w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {textSettings?.shadow && (
            <div className="mt-2 p-2 bg-gray-700 rounded">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="text-gray-500 text-xs">Blur</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={textSettings?.shadowBlur || 2}
                    onChange={(e) => setTextSettings && setTextSettings(prev => ({ ...prev, shadowBlur: parseInt(e.target.value) }))}
                    className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-xs">Offset</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={textSettings?.shadowOffsetX || 1}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setTextSettings && setTextSettings(prev => ({ 
                        ...prev, 
                        shadowOffsetX: value,
                        shadowOffsetY: value 
                      }));
                    }}
                    className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              <ColorPicker
                colors={['#000000', '#ffffff', '#808080']}
                activeColor={textSettings?.shadowColor || '#000000'}
                onChange={(color) => setTextSettings && setTextSettings(prev => ({ ...prev, shadowColor: color }))}
              />
            </div>
          )}
        </div>
        
        {/* Outline Toggle */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <label className="text-gray-400 text-xs">Text Outline</label>
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={textSettings?.outline || false}
                onChange={() => toggleTextStyle('outline')}
              />
              <div className="relative w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {textSettings?.outline && (
            <div className="mt-2 p-2 bg-gray-700 rounded">
              <div className="mb-2">
                <label className="block text-gray-500 text-xs mb-1">Outline Width</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={textSettings?.outlineWidth || 1}
                  onChange={(e) => setTextSettings && setTextSettings(prev => ({ ...prev, outlineWidth: parseInt(e.target.value) }))}
                  className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <ColorPicker
                colors={commonColors}
                activeColor={textSettings?.outlineColor || '#000000'}
                onChange={(color) => setTextSettings && setTextSettings(prev => ({ ...prev, outlineColor: color }))}
              />
            </div>
          )}
        </div>
        
        {/* Add Text Button */}
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
        
        <div className="text-gray-400 text-xs mt-2 text-center">
          <Image size={12} className="inline mr-1" />
          Drag text to position after adding
        </div>
      </div>

      {/* Text Elements List */}
      {textElements && textElements.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-3">
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