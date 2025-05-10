import React from 'react';
import { ChevronDown } from 'lucide-react';
import ColorPicker from '../common/ColorPicker';
import { subToolNames } from '../../data/constants';

const TextToolPanel = ({
  activeTextTool,
  setActiveTextTool,
  textInput,
  setTextInput,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  textColor,
  setTextColor,
  addTextElement
}) => {
  const handleToolToggle = (tool) => {
    if (activeTextTool === tool) {
      setActiveTextTool(null);
    } else {
      setActiveTextTool(tool);
    }
  };

  return (
    <div>
      <h2 className="text-gray-200 font-medium mb-2 text-sm">Text & Typography</h2>
      <div className="bg-gray-800 rounded-lg p-2 mb-3">
        <div className="flex items-center justify-between mb-2 cursor-pointer">
          <div onClick={() => handleToolToggle(subToolNames.TEXT_EDITOR)} className="flex items-center justify-between w-full">
            <span className="text-gray-300 text-sm">Text Editor</span>
            <ChevronDown size={14} className={`text-gray-400 transform ${activeTextTool === subToolNames.TEXT_EDITOR ? 'rotate-180' : ''}`} />
          </div>
        </div>
        
        {activeTextTool === subToolNames.TEXT_EDITOR && (
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
          <div onClick={() => handleToolToggle(subToolNames.TEXT_STYLES)} className="flex items-center justify-between w-full">
            <span className="text-gray-300 text-sm">Text Styles</span>
            <ChevronDown size={14} className={`text-gray-400 transform ${activeTextTool === subToolNames.TEXT_STYLES ? 'rotate-180' : ''}`} />
          </div>
        </div>
        
        {activeTextTool === subToolNames.TEXT_STYLES && (
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
};

export default TextToolPanel;