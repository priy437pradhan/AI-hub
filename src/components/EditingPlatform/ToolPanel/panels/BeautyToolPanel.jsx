import React from 'react';
import PanelSection from '../common/PanelSection'
import ButtonGrid from '../common/ButtonGrid';
import ActionButton from '../common/ActionButton';
import Slider from '../common/Slider'
import { beautyFeatures, subToolNames } from '../../data/constants';
import { Wand2, Sparkles } from 'lucide-react';

const BeautyToolPanel = ({
  activeBeautyTool,
  setActiveBeautyTool,
  activeBeautyFeature,
  setActiveBeautyFeature,
  beautyIntensity,
  setBeautyIntensity,
  applyBeautyFeature
}) => {
  const handleToolToggle = (tool) => {
    if (activeBeautyTool === tool) {
      setActiveBeautyTool(null);
    } else {
      setActiveBeautyTool(tool);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <h2 className="text-gray-200 font-medium mb-2 text-sm">Beauty & Retouch</h2>
      <div className="bg-gray-800 rounded-lg p-2 mb-3 shadow-md">
        <PanelSection 
          title="Beauty Tools" 
          isExpanded={activeBeautyTool === subToolNames.BEAUTY_FEATURES} 
          onToggle={() => handleToolToggle(subToolNames.BEAUTY_FEATURES)}
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
          isExpanded={activeBeautyTool === subToolNames.QUICK_FIX} 
          onToggle={() => handleToolToggle(subToolNames.QUICK_FIX)}
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
};

export default BeautyToolPanel;