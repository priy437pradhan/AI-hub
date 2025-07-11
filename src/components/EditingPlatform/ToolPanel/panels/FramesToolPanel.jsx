import React, { useState } from 'react';
import PanelSection from '../common/PanelSection';
import ButtonGrid from '../common/ButtonGrid';
import ActionButton from '../common/ActionButton';
import Slider from '../common/Slider';
import ColorPicker from '../common/ColorPicker';
import { 
  frameStyles, 
  frameCategories, 
  frameColorPresets, 
  framePresets, 
  effectPresets,
  subToolNames 
} from '../../data/constants';

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
  applyFrameEffects = () => {}
}) => {
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const [showColorCategories, setShowColorCategories] = useState(false);

  const handleToolToggle = (tool) => {
    if (activeFramesTool === tool) {
      setActiveFramesTool(null);
    } else {
      setActiveFramesTool(tool);
    }
  };

  const handleFrameSelect = (frameStyle) => {
    setFrameSettings(prev => ({ ...prev, style: frameStyle }));
  };

  const handleFrameColorChange = (color) => {
    setFrameSettings(prev => ({ ...prev, color }));
  };

  const handleFrameWidthChange = (width) => {
    setFrameSettings(prev => ({ ...prev, width }));
  };

  const handleShadowChange = (shadow) => {
    setFrameSettings(prev => ({ ...prev, shadow }));
  };

  const handleSpreadChange = (spread) => {
    setFrameSettings(prev => ({ ...prev, spread }));
  };

  const handleShadowColorChange = (event) => {
    setFrameSettings(prev => ({ ...prev, shadowColor: event.target.value }));
  };

  const handleApplyFrame = async () => {
    if (applyFrame && frameSettings.style) {
      await applyFrame(frameSettings.style, frameSettings.color, frameSettings.width);
    }
  };

  const handleApplyEffects = async () => {
    if (applyFrameEffects) {
      await applyFrameEffects(frameSettings.shadow, frameSettings.spread, frameSettings.shadowColor);
    }
  };

  const handlePresetApply = (preset) => {
    setFrameSettings(preset.settings);
  };

  const handleEffectPresetApply = (preset) => {
    setFrameSettings(prev => ({
      ...prev,
      shadow: preset.shadow,
      spread: preset.spread,
      shadowColor: preset.shadowColor
    }));
  };

  // Get frames for selected category
  const getCategoryFrames = (categoryKey) => {
    const category = frameCategories[categoryKey];
    return frameStyles.filter(frame => category.styles.includes(frame.id));
  };

  // Get all colors from a category
  const getCategoryColors = (categoryKey) => {
    return frameColorPresets[categoryKey] || [];
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <h2 className="text-gray-200 font-medium mb-2 text-sm">Frames & Borders</h2>
      
      <div className="bg-gray-800 rounded-lg p-2 mb-3 shadow-md">
        
        {/* Frame Presets Section */}
        <PanelSection 
          title="Quick Presets" 
          isExpanded={activeFramesTool === 'presets'} 
          onToggle={() => handleToolToggle('presets')}
        >
          <div className="grid grid-cols-2 gap-2 mb-3">
            {framePresets.map(preset => (
              <button
                key={preset.id}
                onClick={() => handlePresetApply(preset)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-200 transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
          <ActionButton 
            onClick={handleApplyFrame} 
            disabled={!frameSettings.style || frameSettings.style === 'none'}
            className="w-full"
          >
            Apply Preset Frame
          </ActionButton>
        </PanelSection>

        {/* Frame Styles Section */}
        <PanelSection 
          title="Frame Styles" 
          isExpanded={activeFramesTool === subToolNames.FRAME_STYLES} 
          onToggle={() => handleToolToggle(subToolNames.FRAME_STYLES)}
        >
          {/* Category Selector */}
          <div className="mb-3">
            <label className="block text-gray-300 text-xs mb-2">Category</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200"
            >
              {Object.entries(frameCategories).map(([key, category]) => (
                <option key={key} value={key}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* Frame Grid */}
          <ButtonGrid 
            items={getCategoryFrames(selectedCategory)} 
            activeId={frameSettings.style} 
            onSelect={handleFrameSelect} 
            cols={2}
          />
          
          {frameSettings.style && frameSettings.style !== 'none' && (
            <div className="mt-3 space-y-3">
              {/* Color Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-300 text-xs">Frame Color</label>
                  <button
                    onClick={() => setShowColorCategories(!showColorCategories)}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    {showColorCategories ? 'Hide' : 'More'} Colors
                  </button>
                </div>
                
                {showColorCategories ? (
                  <div className="space-y-2">
                    {Object.entries(frameColorPresets).map(([categoryKey, colors]) => (
                      <div key={categoryKey}>
                        <label className="text-xs text-gray-400 capitalize mb-1 block">
                          {categoryKey}
                        </label>
                        <ColorPicker 
                          colors={colors.map(c => c.color)} 
                          activeColor={frameSettings.color} 
                          onChange={handleFrameColorChange} 
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ColorPicker 
                    colors={frameColorPresets.basic.map(c => c.color)} 
                    activeColor={frameSettings.color} 
                    onChange={handleFrameColorChange} 
                  />
                )}
              </div>
              
              {/* Frame Width */}
              <Slider 
                label="Frame Width" 
                value={frameSettings.width} 
                min={1} 
                max={50} 
                onChange={handleFrameWidthChange} 
              />

              {/* Quick Width Presets */}
              <div className="flex gap-2">
                {[5, 10, 15, 25].map(width => (
                  <button
                    key={width}
                    onClick={() => handleFrameWidthChange(width)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      frameSettings.width === width 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {width}px
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-3">
            <ActionButton 
              onClick={handleApplyFrame} 
              disabled={!frameSettings.style || frameSettings.style === 'none'}
              className="w-full"
            >
              Apply Frame
            </ActionButton>
          </div>
        </PanelSection>
        
        {/* Frame Effects Section */}
        <PanelSection 
          title="Frame Effects" 
          isExpanded={activeFramesTool === subToolNames.FRAME_EFFECTS} 
          onToggle={() => handleToolToggle(subToolNames.FRAME_EFFECTS)}
        >
          {/* Effect Presets */}
          <div className="mb-3">
            <label className="block text-gray-300 text-xs mb-2">Effect Presets</label>
            <div className="grid grid-cols-2 gap-1">
              {effectPresets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handleEffectPresetApply(preset)}
                  className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-200 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Slider 
              label="Shadow Blur" 
              value={frameSettings.shadow} 
              min={0} 
              max={50} 
              onChange={handleShadowChange} 
            />
            
            <Slider 
              label="Shadow Spread" 
              value={frameSettings.spread} 
              min={0} 
              max={20} 
              onChange={handleSpreadChange} 
            />
            
            <div>
              <label className="block text-gray-300 text-xs mb-2">Shadow Color</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  value={frameSettings.shadowColor} 
                  onChange={handleShadowColorChange}
                  className="w-8 h-8 rounded border border-gray-600 cursor-pointer"
                />
                <span className="text-xs text-gray-400">{frameSettings.shadowColor}</span>
              </div>
            </div>
            
            <ActionButton 
              onClick={handleApplyEffects}
              className="w-full"
              disabled={frameSettings.shadow === 0}
            >
              Apply Effects
            </ActionButton>
          </div>
        </PanelSection>

        {/* Advanced Settings */}
        <PanelSection 
          title="Advanced" 
          isExpanded={activeFramesTool === 'advanced'} 
          onToggle={() => handleToolToggle('advanced')}
        >
          <div className="space-y-3">
            {/* Reset Button */}
            <ActionButton 
              onClick={() => setFrameSettings({
                style: 'none',
                color: '#ffffff',
                width: 10,
                shadow: 0,
                spread: 0,
                shadowColor: '#000000'
              })}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Reset All Settings
            </ActionButton>

            {/* Current Settings Display */}
            <div className="p-2 bg-gray-700 rounded text-xs">
              <div className="text-gray-300 mb-1">Current Settings:</div>
              <div className="text-gray-400 space-y-1">
                <div>Style: {frameStyles.find(f => f.id === frameSettings.style)?.name || 'None'}</div>
                <div>Color: {frameSettings.color}</div>
                <div>Width: {frameSettings.width}px</div>
                <div>Shadow: {frameSettings.shadow}px</div>
                <div>Spread: {frameSettings.spread}px</div>
              </div>
            </div>

            {/* Apply All Button */}
            <ActionButton 
              onClick={async () => {
                await handleApplyFrame();
                await handleApplyEffects();
              }}
              disabled={frameSettings.style === 'none'}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Apply Frame + Effects
            </ActionButton>
          </div>
        </PanelSection>
      </div>
    </div>
  );
};

export default FramesToolPanel;