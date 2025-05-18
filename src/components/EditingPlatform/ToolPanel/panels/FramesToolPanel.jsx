import React from 'react';
import PanelSection from '../common/PanelSection';
import ButtonGrid from '../common/ButtonGrid';
import ActionButton from '../common/ActionButton';
import Slider from '../common/Slider';
import ColorPicker from '../common/ColorPicker';
import { frameStyles, subToolNames } from '../../data/constants';

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

  // Frame color options
  const frameColorOptions = [
    '#ffffff', '#000000', '#8B4513', '#D2691E', '#CD853F', '#A0522D',
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#FFA500', '#800080', '#008000', '#000080', '#800000', '#808080'
  ];

  return (
    <div className="rounded-lg overflow-hidden">
      <h2 className="text-gray-200 font-medium mb-2 text-sm">Frames & Borders</h2>
      
      <div className="bg-gray-800 rounded-lg p-2 mb-3 shadow-md">
        <PanelSection 
          title="Frame Styles" 
          isExpanded={activeFramesTool === subToolNames.FRAME_STYLES} 
          onToggle={() => handleToolToggle(subToolNames.FRAME_STYLES)}
        >
          <ButtonGrid 
            items={frameStyles} 
            activeId={frameSettings.style} 
            onSelect={handleFrameSelect} 
            cols={2}
          />
          
          {frameSettings.style && frameSettings.style !== 'none' && (
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-gray-300 text-xs mb-2">Frame Color</label>
                <ColorPicker 
                  colors={frameColorOptions} 
                  activeColor={frameSettings.color} 
                  onChange={handleFrameColorChange} 
                />
              </div>
              
              <Slider 
                label="Frame Width" 
                value={frameSettings.width} 
                min={1} 
                max={50} 
                onChange={handleFrameWidthChange} 
              />
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
        
        <PanelSection 
          title="Frame Effects" 
          isExpanded={activeFramesTool === subToolNames.FRAME_EFFECTS} 
          onToggle={() => handleToolToggle(subToolNames.FRAME_EFFECTS)}
        >
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
      </div>
    </div>
  );
};

export default FramesToolPanel;