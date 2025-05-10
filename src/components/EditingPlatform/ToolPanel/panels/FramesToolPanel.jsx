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
  activeFrame,
  setActiveFrame,
  frameColor,
  setFrameColor,
  frameWidth,
  setFrameWidth,
  applyFrame
}) => {
  const handleToolToggle = (tool) => {
    if (activeFramesTool === tool) {
      setActiveFramesTool(null);
    } else {
      setActiveFramesTool(tool);
    }
  };

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
          isExpanded={activeFramesTool === subToolNames.FRAME_EFFECTS} 
          onToggle={() => handleToolToggle(subToolNames.FRAME_EFFECTS)}
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
};

export default FramesToolPanel;