import React, { useState } from 'react';
import { Sparkles, Eye, Smile, User, Heart, Palette } from 'lucide-react';
import PanelSection from '../common/PanelSection';
import ButtonGrid from '../common/ButtonGrid';
import ActionButton from '../common/ActionButton';
import Slider from '../common/Slider';

const subToolNames = {
  SKIN_SMOOTH: 'skin_smooth',
  WRINKLE_REMOVAL: 'wrinkle_removal', 
  EYE_BRIGHTEN: 'eye_brighten',
  TEETH_WHITEN: 'teeth_whiten',
  FACE_SLIM: 'face_slim',
  EYE_ENLARGE: 'eye_enlarge',
  NOSE_SLIM: 'nose_slim',
  LIP_COLOR: 'lip_color',
  BLUSH: 'blush',
  FOUNDATION: 'foundation'
};

// Exact Fotor beauty tools
const skinTools = [
  { id: 'skin_smooth', label: 'Skin Smooth', icon: '✨', description: 'Smooth skin texture' },
  { id: 'wrinkle_removal', label: 'Wrinkle Removal', icon: '🔄', description: 'Remove wrinkles and fine lines' }
];

const eyeTools = [
  { id: 'eye_brighten', label: 'Eye Brighten', icon: '👁️', description: 'Brighten and enhance eyes' },
  { id: 'eye_enlarge', label: 'Eye Enlarge', icon: '🔍', description: 'Make eyes appear larger' }
];

const faceTools = [
  { id: 'face_slim', label: 'Face Slim', icon: '⚡', description: 'Slim face shape' },
  { id: 'nose_slim', label: 'Nose Slim', icon: '📐', description: 'Refine nose shape' }
];

const teethTools = [
  { id: 'teeth_whiten', label: 'Teeth Whiten', icon: '🦷', description: 'Whiten teeth naturally' }
];

const makeupTools = [
  { id: 'lip_color', label: 'Lip Color', icon: '💋', description: 'Add natural lip color' },
  { id: 'blush', label: 'Blush', icon: '🌸', description: 'Add healthy blush' },
  { id: 'foundation', label: 'Foundation', icon: '🎨', description: 'Even skin tone' }
];

// Lip color presets like Fotor
const lipColors = [
  { id: 'natural', label: 'Natural', color: '#E6A4A4' },
  { id: 'pink', label: 'Pink', color: '#FF6B9D' },
  { id: 'red', label: 'Red', color: '#DC2626' },
  { id: 'coral', label: 'Coral', color: '#FF7F50' },
  { id: 'berry', label: 'Berry', color: '#8B2635' },
  { id: 'nude', label: 'Nude', color: '#D4A574' }
];

// Blush color presets
const blushColors = [
  { id: 'natural', label: 'Natural', color: '#FFB3BA' },
  { id: 'peach', label: 'Peach', color: '#FFDFBA' },
  { id: 'rose', label: 'Rose', color: '#FF9AA2' },
  { id: 'coral', label: 'Coral', color: '#FF8A80' }
];

const BeautyToolPanel = ({
  activeBeautyTool,
  setActiveBeautyTool,
  applyBeautyFeature
}) => {
  const [skinSmoothIntensity, setSkinSmoothIntensity] = useState(50);
  const [wrinkleIntensity, setWrinkleIntensity] = useState(50);
  const [eyeBrightenIntensity, setEyeBrightenIntensity] = useState(50);
  const [eyeEnlargeIntensity, setEyeEnlargeIntensity] = useState(30);
  const [faceSlimIntensity, setFaceSlimIntensity] = useState(30);
  const [noseSlimIntensity, setNoseSlimIntensity] = useState(30);
  const [teethWhitenIntensity, setTeethWhitenIntensity] = useState(50);
  const [lipColorIntensity, setLipColorIntensity] = useState(50);
  const [blushIntensity, setBlushIntensity] = useState(40);
  const [foundationIntensity, setFoundationIntensity] = useState(50);
  
  const [selectedLipColor, setSelectedLipColor] = useState('natural');
  const [selectedBlushColor, setSelectedBlushColor] = useState('natural');

  const handleToolToggle = (tool) => {
    setActiveBeautyTool(activeBeautyTool === tool ? null : tool);
  };

  const handleApply = (feature, intensity, color = null) => {
    const settings = {
      intensity,
      color
    };
    applyBeautyFeature(feature, settings);
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <h2 className="text-gray-200 font-medium mb-2 text-sm">Beauty</h2>
      <div className="bg-gray-800 rounded-lg p-2 mb-3 shadow-md">
        
        {/* Skin Enhancement */}
        <PanelSection 
          title="Skin" 
          isExpanded={activeBeautyTool === 'skin'} 
          onToggle={() => handleToolToggle('skin')}
          icon={<User size={14} className="mr-1" />}
        >
          {/* Skin Smooth */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-300">Skin Smooth</span>
              <span className="text-xs text-blue-400">{skinSmoothIntensity}%</span>
            </div>
            <Slider 
              value={skinSmoothIntensity} 
              min={0} 
              max={100} 
              onChange={setSkinSmoothIntensity} 
            />
            <ActionButton 
              onClick={() => handleApply(subToolNames.SKIN_SMOOTH, skinSmoothIntensity)}
              className="mt-2 w-full text-xs"
            >
              Apply Skin Smooth
            </ActionButton>
          </div>

          {/* Wrinkle Removal */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-300">Wrinkle Removal</span>
              <span className="text-xs text-blue-400">{wrinkleIntensity}%</span>
            </div>
            <Slider 
              value={wrinkleIntensity} 
              min={0} 
              max={100} 
              onChange={setWrinkleIntensity} 
            />
            <ActionButton 
              onClick={() => handleApply(subToolNames.WRINKLE_REMOVAL, wrinkleIntensity)}
              className="mt-2 w-full text-xs"
            >
              Apply Wrinkle Removal
            </ActionButton>
          </div>
        </PanelSection>

        {/* Eye Enhancement */}
        <PanelSection 
          title="Eyes" 
          isExpanded={activeBeautyTool === 'eyes'} 
          onToggle={() => handleToolToggle('eyes')}
          icon={<Eye size={14} className="mr-1" />}
        >
          {/* Eye Brighten */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-300">Eye Brighten</span>
              <span className="text-xs text-blue-400">{eyeBrightenIntensity}%</span>
            </div>
            <Slider 
              value={eyeBrightenIntensity} 
              min={0} 
              max={100} 
              onChange={setEyeBrightenIntensity} 
            />
            <ActionButton 
              onClick={() => handleApply(subToolNames.EYE_BRIGHTEN, eyeBrightenIntensity)}
              className="mt-2 w-full text-xs"
            >
              Apply Eye Brighten
            </ActionButton>
          </div>

          {/* Eye Enlarge */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-300">Eye Enlarge</span>
              <span className="text-xs text-blue-400">{eyeEnlargeIntensity}%</span>
            </div>
            <Slider 
              value={eyeEnlargeIntensity} 
              min={0} 
              max={60} 
              onChange={setEyeEnlargeIntensity} 
            />
            <ActionButton 
              onClick={() => handleApply(subToolNames.EYE_ENLARGE, eyeEnlargeIntensity)}
              className="mt-2 w-full text-xs"
            >
              Apply Eye Enlarge
            </ActionButton>
          </div>
        </PanelSection>

        {/* Face Shape */}
        <PanelSection 
          title="Face Shape" 
          isExpanded={activeBeautyTool === 'face'} 
          onToggle={() => handleToolToggle('face')}
          icon={<Heart size={14} className="mr-1" />}
        >
          {/* Face Slim */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-300">Face Slim</span>
              <span className="text-xs text-blue-400">{faceSlimIntensity}%</span>
            </div>
            <Slider 
              value={faceSlimIntensity} 
              min={0} 
              max={60} 
              onChange={setFaceSlimIntensity} 
            />
            <ActionButton 
              onClick={() => handleApply(subToolNames.FACE_SLIM, faceSlimIntensity)}
              className="mt-2 w-full text-xs"
            >
              Apply Face Slim
            </ActionButton>
          </div>

          {/* Nose Slim */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-300">Nose Slim</span>
              <span className="text-xs text-blue-400">{noseSlimIntensity}%</span>
            </div>
            <Slider 
              value={noseSlimIntensity} 
              min={0} 
              max={60} 
              onChange={setNoseSlimIntensity} 
            />
            <ActionButton 
              onClick={() => handleApply(subToolNames.NOSE_SLIM, noseSlimIntensity)}
              className="mt-2 w-full text-xs"
            >
              Apply Nose Slim
            </ActionButton>
          </div>
        </PanelSection>

        {/* Teeth Whitening */}
        <PanelSection 
          title="Teeth" 
          isExpanded={activeBeautyTool === 'teeth'} 
          onToggle={() => handleToolToggle('teeth')}
          icon={<Smile size={14} className="mr-1" />}
        >
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-300">Teeth Whiten</span>
              <span className="text-xs text-blue-400">{teethWhitenIntensity}%</span>
            </div>
            <Slider 
              value={teethWhitenIntensity} 
              min={0} 
              max={100} 
              onChange={setTeethWhitenIntensity} 
            />
            <ActionButton 
              onClick={() => handleApply(subToolNames.TEETH_WHITEN, teethWhitenIntensity)}
              className="mt-2 w-full text-xs"
            >
              Apply Teeth Whiten
            </ActionButton>
          </div>
        </PanelSection>

        {/* Makeup */}
        <PanelSection 
          title="Makeup" 
          isExpanded={activeBeautyTool === 'makeup'} 
          onToggle={() => handleToolToggle('makeup')}
          icon={<Palette size={14} className="mr-1" />}
        >
          {/* Lip Color */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-300">Lip Color</span>
              <span className="text-xs text-blue-400">{lipColorIntensity}%</span>
            </div>
            
            {/* Color Selection */}
            <div className="grid grid-cols-6 gap-1 mb-2">
              {lipColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedLipColor(color.id)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedLipColor === color.id ? 'border-blue-400' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.label}
                />
              ))}
            </div>
            
            <Slider 
              value={lipColorIntensity} 
              min={0} 
              max={100} 
              onChange={setLipColorIntensity} 
            />
            <ActionButton 
              onClick={() => handleApply(subToolNames.LIP_COLOR, lipColorIntensity, selectedLipColor)}
              className="mt-2 w-full text-xs"
            >
              Apply Lip Color
            </ActionButton>
          </div>

          {/* Blush */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-300">Blush</span>
              <span className="text-xs text-blue-400">{blushIntensity}%</span>
            </div>
            
            {/* Blush Color Selection */}
            <div className="grid grid-cols-4 gap-1 mb-2">
              {blushColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedBlushColor(color.id)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedBlushColor === color.id ? 'border-blue-400' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.label}
                />
              ))}
            </div>
            
            <Slider 
              value={blushIntensity} 
              min={0} 
              max={80} 
              onChange={setBlushIntensity} 
            />
            <ActionButton 
              onClick={() => handleApply(subToolNames.BLUSH, blushIntensity, selectedBlushColor)}
              className="mt-2 w-full text-xs"
            >
              Apply Blush
            </ActionButton>
          </div>

          {/* Foundation */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-300">Foundation</span>
              <span className="text-xs text-blue-400">{foundationIntensity}%</span>
            </div>
            <Slider 
              value={foundationIntensity} 
              min={0} 
              max={100} 
              onChange={setFoundationIntensity} 
            />
            <ActionButton 
              onClick={() => handleApply(subToolNames.FOUNDATION, foundationIntensity)}
              className="mt-2 w-full text-xs"
            >
              Apply Foundation
            </ActionButton>
          </div>
        </PanelSection>
      </div>
    </div>
  );
};

export default BeautyToolPanel;