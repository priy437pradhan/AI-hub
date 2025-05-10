import React from 'react';
import PanelSection from '../common/PanelSection'
import ButtonGrid from '../common/ButtonGrid';
import ActionButton from '../common/ActionButton';
import Slider from '../common/Slider'
import { filterEffects, subToolNames } from '../../data/constants';

const EffectsToolPanel = ({
  activeEffectsTool,
  setActiveEffectsTool,
  activeEffect,
  setActiveEffect,
  effectIntensity,
  setEffectIntensity,
  applyEffect
}) => {
  const handleToolToggle = (tool) => {
    if (activeEffectsTool === tool) {
      setActiveEffectsTool(null);
    } else {
      setActiveEffectsTool(tool);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <h2 className="text-gray-200 font-medium mb-2 text-sm">Effects & Filters</h2>
      <div className="bg-gray-800 rounded-lg p-2 mb-3 shadow-md">
        <PanelSection 
          title="Filters" 
          isExpanded={activeEffectsTool === subToolNames.FILTERS} 
          onToggle={() => handleToolToggle(subToolNames.FILTERS)}
        >
          <ButtonGrid 
            items={filterEffects} 
            activeId={activeEffect} 
            onSelect={setActiveEffect} 
            cols={3}
          />
          <Slider 
            label="Intensity" 
            value={effectIntensity || 50} 
            min={0} 
            max={100} 
            onChange={setEffectIntensity} 
          />
          <ActionButton 
            onClick={() => applyEffect && applyEffect(activeEffect, effectIntensity)} 
            disabled={!activeEffect || activeEffect === 'none'}
          >
            Apply Filter
          </ActionButton>
        </PanelSection>
        
        <PanelSection 
          title="Adjustments" 
          isExpanded={activeEffectsTool === subToolNames.ADJUSTMENTS} 
          onToggle={() => handleToolToggle(subToolNames.ADJUSTMENTS)}
        >
          <Slider label="Brightness" value={50} min={0} max={100} onChange={() => {}} />
          <Slider label="Contrast" value={50} min={0} max={100} onChange={() => {}} />
          <Slider label="Saturation" value={50} min={0} max={100} onChange={() => {}} />
          <Slider label="Hue" value={0} min={0} max={360} onChange={() => {}} />
          <ActionButton onClick={() => {}}>
            Apply Adjustments
          </ActionButton>
        </PanelSection>
      </div>
    </div>
  );
};

export default EffectsToolPanel;