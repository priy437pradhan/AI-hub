import React from 'react';

import PanelSection from '../common/PanelSection'
import ButtonGrid from '../common/ButtonGrid';
import ActionButton from '../common/ActionButton';
import Slider from '../common/Slider'
import { aiFeatures, subToolNames } from '../../data/constants';

const AIToolPanel = ({
  activeAITool,
  setActiveAITool,
  activeAIFeature,
  setActiveAIFeature,
  applyAIFeature
}) => {
  const handleToolToggle = (tool) => {
    if (activeAITool === tool) {
      setActiveAITool(null);
    } else {
      setActiveAITool(tool);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <h2 className="text-gray-200 font-medium mb-2 text-sm">AI Features</h2>
      <div className="bg-gray-800 rounded-lg p-2 mb-3 shadow-md">
        <PanelSection 
          title="AI Features" 
          isExpanded={activeAITool === subToolNames.AI_FEATURES} 
          onToggle={() => handleToolToggle(subToolNames.AI_FEATURES)}
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
          isExpanded={activeAITool === subToolNames.AI_HISTORY} 
          onToggle={() => handleToolToggle(subToolNames.AI_HISTORY)}
        >
          <div className="bg-gray-700 rounded-md p-2 h-32 overflow-y-auto">
            <p className="text-gray-400 text-xs italic text-center mt-10">No history yet</p>
          </div>
        </PanelSection>
      </div>
    </div>
  );
};

export default AIToolPanel;