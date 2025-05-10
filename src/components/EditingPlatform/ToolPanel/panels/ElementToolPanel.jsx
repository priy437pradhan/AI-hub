import React from 'react';
import PanelSection from '../common/PanelSection';
import ButtonGrid from '../common/ButtonGrid';
import ActionButton from '../common/ActionButton';
import Slider from '../common/Slider';
import ColorPicker from '../common/ColorPicker';
import { elementTypes, subToolNames } from '../../data/constants';
import { BadgePlus } from 'lucide-react';

const ElementToolPanel = ({
  activeElementTool,
  setActiveElementTool,
  activeElementType,
  setActiveElementType,
  selectedElement,
  setSelectedElement,
  elementColor,
  setElementColor,
  elementSize,
  setElementSize,
  addElement
}) => {
  const handleToolToggle = (tool) => {
    if (activeElementTool === tool) {
      setActiveElementTool(null);
    } else {
      setActiveElementTool(tool);
    }
  };

  return (
    <div>
      <h2 className="text-gray-200 font-medium mb-2 text-sm">Elements & Shapes</h2>
      <div className="bg-gray-800 rounded-lg p-2 mb-3">
        <PanelSection 
          title="Element Types" 
          isExpanded={activeElementTool === subToolNames.ELEMENT_TYPES} 
          onToggle={() => handleToolToggle(subToolNames.ELEMENT_TYPES)}
        >
          <ButtonGrid 
            items={elementTypes} 
            activeId={activeElementType} 
            onSelect={setActiveElementType} 
            cols={2}
          />
          {activeElementType && (
            <div className="bg-gray-700 rounded p-1 mt-2 h-36 overflow-y-auto grid grid-cols-3 gap-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div 
                  key={i}
                  className="aspect-square bg-gray-600 rounded flex items-center justify-center hover:bg-gray-500 cursor-pointer"
                  onClick={() => setSelectedElement && setSelectedElement(`element-${i}`)}
                >
                  <BadgePlus size={16} className="text-gray-300" />
                </div>
              ))}
            </div>
          )}
        </PanelSection>
        
        {selectedElement && (
          <PanelSection 
            title="Element Options" 
            isExpanded={activeElementTool === subToolNames.ELEMENT_OPTIONS} 
            onToggle={() => handleToolToggle(subToolNames.ELEMENT_OPTIONS)}
          >
            <div className="mb-2">
              <label className="block text-gray-400 text-xs mb-1">Element Color</label>
              <ColorPicker 
                colors={['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00']} 
                activeColor={elementColor || '#ffffff'} 
                onChange={setElementColor} 
              />
            </div>
            <Slider 
              label="Size" 
              value={elementSize || 50} 
              min={10} 
              max={100} 
              onChange={setElementSize} 
            />
            <ActionButton 
              onClick={() => addElement && addElement(selectedElement, elementColor, elementSize)} 
              disabled={!selectedElement}
            >
              Add Element
            </ActionButton>
          </PanelSection>
        )}
      </div>
    </div>
  );
};

export default ElementToolPanel;