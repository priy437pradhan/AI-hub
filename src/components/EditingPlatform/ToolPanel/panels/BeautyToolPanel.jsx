import React, { useState, useEffect } from 'react';
import { Sliders, Sparkles, Smile, Eye, Droplet, Brush } from 'lucide-react';
import PanelSection from '../common/PanelSection';
import ButtonGrid from '../common/ButtonGrid';
import ActionButton from '../common/ActionButton';
import Slider from '../common/Slider';

// Beauty feature constants
const subToolNames = {
  SKIN: 'skin',
  EYES: 'eyes',
  LIPS: 'lips',
  FACE: 'face',
  MAKEUP: 'makeup'
};

// Skin smoothing presets
const skinPresets = [
  { id: 'light', label: 'Light', icon: '🌱' },
  { id: 'medium', label: 'Medium', icon: '🌿' },
  { id: 'strong', label: 'Strong', icon: '🌳' },
  { id: 'custom', label: 'Custom', icon: '⚙️' }
];

// Eye enhancement presets
const eyePresets = [
  { id: 'brighten', label: 'Brighten', icon: '✨' },
  { id: 'whiten', label: 'Whiten', icon: '⚪' },
  { id: 'sharpen', label: 'Sharpen', icon: '🔍' },
  { id: 'enlarge', label: 'Enlarge', icon: '👁️' }
];

// Lip color presets
const lipPresets = [
  { id: 'natural', label: 'Natural', icon: '🌸' },
  { id: 'red', label: 'Red', icon: '❤️' },
  { id: 'pink', label: 'Pink', icon: '💕' },
  { id: 'coral', label: 'Coral', icon: '🧡' },
  { id: 'custom', label: 'Custom', icon: '🎨' }
];

// Face shape adjustments
const facePresets = [
  { id: 'slim', label: 'Slim', icon: '↕️' },
  { id: 'jawline', label: 'Jawline', icon: '📐' },
  { id: 'chin', label: 'Chin', icon: '🔽' },
  { id: 'forehead', label: 'Forehead', icon: '🔼' }
];

// Makeup presets
const makeupPresets = [
  { id: 'natural', label: 'Natural', icon: '🍃' },
  { id: 'glam', label: 'Glam', icon: '💫' },
  { id: 'evening', label: 'Evening', icon: '🌙' },
  { id: 'artistic', label: 'Artistic', icon: '🎭' }
];

const BeautyToolPanel = ({
  activeBeautyTool,
  setActiveBeautyTool,
  applyBeautyFeature,  // Should match what's passed from parent
}) => {
  // Local states for different beauty parameters
  const [skinSmoothness, setSkinSmoothness] = useState(50);
  const [skinTone, setSkinTone] = useState(0);
  const [blemishRemoval, setBlemishRemoval] = useState(50);
  
  const [eyeBrightness, setEyeBrightness] = useState(50);
  const [eyeWhitening, setEyeWhitening] = useState(50);
  const [eyeEnlargement, setEyeEnlargement] = useState(0);
  
  const [lipColor, setLipColor] = useState('#FF6B81');
  const [lipGloss, setLipGloss] = useState(50);
  const [lipFullness, setLipFullness] = useState(0);
  
  const [faceSlimming, setFaceSlimming] = useState(0);
  const [jawlineDefinition, setJawlineDefinition] = useState(0);
  const [chinAdjustment, setChinAdjustment] = useState(0);
  
  const [makeupIntensity, setMakeupIntensity] = useState(50);
  const [selectedMakeupPreset, setSelectedMakeupPreset] = useState('natural');

  // Handler for tool toggling similar to AdjustToolPanel
  const handleToolToggle = (tool) => {
    // If clicking the same tool, toggle it off
    if (activeBeautyTool === tool) {
      setActiveBeautyTool(null);
    } else {
      // Switch to the new tool
      setActiveBeautyTool(tool);
    }
  };

  // Apply current beauty settings
  const applyBeautySettings = (feature) => {
    const settings = {};
    
    switch (feature) {
      case subToolNames.SKIN:
        settings.smoothness = skinSmoothness;
        settings.tone = skinTone;
        settings.blemishRemoval = blemishRemoval;
        break;
      case subToolNames.EYES:
        settings.brightness = eyeBrightness;
        settings.whitening = eyeWhitening;
        settings.enlargement = eyeEnlargement;
        break;
      case subToolNames.LIPS:
        settings.color = lipColor;
        settings.gloss = lipGloss;
        settings.fullness = lipFullness;
        break;
      case subToolNames.FACE:
        settings.slimming = faceSlimming;
        settings.jawline = jawlineDefinition;
        settings.chin = chinAdjustment;
        break;
      case subToolNames.MAKEUP:
        settings.intensity = makeupIntensity;
        settings.preset = selectedMakeupPreset;
        break;
      default:
        break;
    }
    
    // Call parent function to apply beauty effect
    applyBeautyFeature(feature, settings);
  };

  // Handle preset selection
  const handlePresetSelect = (tool, presetId) => {
    switch (tool) {
      case subToolNames.SKIN:
        if (presetId === 'light') {
          setSkinSmoothness(30);
          setBlemishRemoval(30);
        } else if (presetId === 'medium') {
          setSkinSmoothness(50);
          setBlemishRemoval(50);
        } else if (presetId === 'strong') {
          setSkinSmoothness(80);
          setBlemishRemoval(80);
        }
        break;
      case subToolNames.EYES:
        if (presetId === 'brighten') {
          setEyeBrightness(70);
          setEyeWhitening(40);
        } else if (presetId === 'whiten') {
          setEyeBrightness(40);
          setEyeWhitening(70);
        } else if (presetId === 'sharpen') {
          setEyeBrightness(60);
          setEyeWhitening(60);
        } else if (presetId === 'enlarge') {
          setEyeEnlargement(30);
        }
        break;
      case subToolNames.LIPS:
        if (presetId === 'natural') {
          setLipColor('#E17B77');
          setLipGloss(30);
          setLipFullness(10);
        } else if (presetId === 'red') {
          setLipColor('#D81E05');
          setLipGloss(50);
          setLipFullness(20);
        } else if (presetId === 'pink') {
          setLipColor('#FF6B81');
          setLipGloss(60);
          setLipFullness(15);
        } else if (presetId === 'coral') {
          setLipColor('#FF7F50');
          setLipGloss(40);
          setLipFullness(10);
        }
        break;
      case subToolNames.FACE:
        if (presetId === 'slim') {
          setFaceSlimming(30);
        } else if (presetId === 'jawline') {
          setJawlineDefinition(30);
        } else if (presetId === 'chin') {
          setChinAdjustment(20);
        } else if (presetId === 'forehead') {
          // Example of another facial adjustment
        }
        break;
      case subToolNames.MAKEUP:
        setSelectedMakeupPreset(presetId);
        if (presetId === 'natural') {
          setMakeupIntensity(30);
        } else if (presetId === 'glam') {
          setMakeupIntensity(70);
        } else if (presetId === 'evening') {
          setMakeupIntensity(60);
        } else if (presetId === 'artistic') {
          setMakeupIntensity(50);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <h2 className="text-gray-200 font-medium mb-2 text-sm">Beauty & Retouching</h2>
      <div className="bg-gray-800 rounded-lg p-2 mb-3 shadow-md">
        {/* Skin Section */}
        <PanelSection 
          title="Skin Enhancement" 
          isExpanded={activeBeautyTool === subToolNames.SKIN} 
          onToggle={() => handleToolToggle(subToolNames.SKIN)}
          icon={<Droplet size={14} className="mr-1" />}
        >
          <ButtonGrid 
            items={skinPresets} 
            activeId={skinSmoothness === 30 ? 'light' : skinSmoothness === 50 ? 'medium' : skinSmoothness === 80 ? 'strong' : 'custom'} 
            onSelect={(presetId) => handlePresetSelect(subToolNames.SKIN, presetId)} 
            cols={4}
          />
          
          <div className="mt-3">
            <div className="mb-2">
              <label className="text-xs text-gray-300 mb-1 block">Smoothness</label>
              <Slider 
                min={0} 
                max={100} 
                value={skinSmoothness} 
                onChange={setSkinSmoothness} 
              />
            </div>
            
            <div className="mb-2">
              <label className="text-xs text-gray-300 mb-1 block">Skin Tone</label>
              <Slider 
                min={-50} 
                max={50} 
                value={skinTone} 
                onChange={setSkinTone} 
              />
            </div>
            
            <div className="mb-2">
              <label className="text-xs text-gray-300 mb-1 block">Blemish Removal</label>
              <Slider 
                min={0} 
                max={100} 
                value={blemishRemoval} 
                onChange={setBlemishRemoval} 
              />
            </div>
          </div>
          
          <ActionButton 
            onClick={() => applyBeautySettings(subToolNames.SKIN)}
          >
            Apply Skin Enhancement
          </ActionButton>
        </PanelSection>

        {/* Eyes Section */}
        <PanelSection 
          title="Eye Enhancement" 
          isExpanded={activeBeautyTool === subToolNames.EYES} 
          onToggle={() => handleToolToggle(subToolNames.EYES)}
          icon={<Eye size={14} className="mr-1" />}
        >
          <ButtonGrid 
            items={eyePresets} 
            activeId={eyeBrightness === 70 ? 'brighten' : eyeWhitening === 70 ? 'whiten' : eyeEnlargement > 0 ? 'enlarge' : 'sharpen'} 
            onSelect={(presetId) => handlePresetSelect(subToolNames.EYES, presetId)} 
            cols={4}
          />
          
          <div className="mt-3">
            <div className="mb-2">
              <label className="text-xs text-gray-300 mb-1 block">Brightness</label>
              <Slider 
                min={0} 
                max={100} 
                value={eyeBrightness} 
                onChange={setEyeBrightness} 
              />
            </div>
            
            <div className="mb-2">
              <label className="text-xs text-gray-300 mb-1 block">Whitening</label>
              <Slider 
                min={0} 
                max={100} 
                value={eyeWhitening} 
                onChange={setEyeWhitening} 
              />
            </div>
            
            <div className="mb-2">
              <label className="text-xs text-gray-300 mb-1 block">Size Enhancement</label>
              <Slider 
                min={0} 
                max={50} 
                value={eyeEnlargement} 
                onChange={setEyeEnlargement} 
              />
            </div>
          </div>
          
          <ActionButton 
            onClick={() => applyBeautySettings(subToolNames.EYES)}
          >
            Apply Eye Enhancement
          </ActionButton>
        </PanelSection>

        {/* Lips Section */}
        <PanelSection 
          title="Lip Enhancement" 
          isExpanded={activeBeautyTool === subToolNames.LIPS} 
          onToggle={() => handleToolToggle(subToolNames.LIPS)}
          icon={<Smile size={14} className="mr-1" />}
        >
          <ButtonGrid 
            items={lipPresets} 
            activeId={lipColor === '#E17B77' ? 'natural' : lipColor === '#D81E05' ? 'red' : lipColor === '#FF6B81' ? 'pink' : lipColor === '#FF7F50' ? 'coral' : 'custom'} 
            onSelect={(presetId) => handlePresetSelect(subToolNames.LIPS, presetId)} 
            cols={4}
          />
          
          <div className="mt-3">
            <div className="mb-2">
              <label className="text-xs text-gray-300 mb-1 block">Lip Color</label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={lipColor}
                  onChange={(e) => setLipColor(e.target.value)}
                  className="w-8 h-8 rounded overflow-hidden cursor-pointer"
                />
                <span className="text-xs text-gray-300 mt-1">{lipColor}</span>
              </div>
            </div>
            
            <div className="mb-2">
              <label className="text-xs text-gray-300 mb-1 block">Glossiness</label>
              <Slider 
                min={0} 
                max={100} 
                value={lipGloss} 
                onChange={setLipGloss} 
              />
            </div>
            
            <div className="mb-2">
              <label className="text-xs text-gray-300 mb-1 block">Fullness</label>
              <Slider 
                min={0} 
                max={50} 
                value={lipFullness} 
                onChange={setLipFullness} 
              />
            </div>
          </div>
          
          <ActionButton 
            onClick={() => applyBeautySettings(subToolNames.LIPS)}
          >
            Apply Lip Enhancement
          </ActionButton>
        </PanelSection>

        {/* Face Shape Section */}
        <PanelSection 
          title="Face Contour" 
          isExpanded={activeBeautyTool === subToolNames.FACE} 
          onToggle={() => handleToolToggle(subToolNames.FACE)}
          icon={<Sliders size={14} className="mr-1" />}
        >
          <ButtonGrid 
            items={facePresets} 
            activeId={faceSlimming > 0 ? 'slim' : jawlineDefinition > 0 ? 'jawline' : chinAdjustment > 0 ? 'chin' : 'forehead'} 
            onSelect={(presetId) => handlePresetSelect(subToolNames.FACE, presetId)} 
            cols={4}
          />
          
          <div className="mt-3">
            <div className="mb-2">
              <label className="text-xs text-gray-300 mb-1 block">Face Slimming</label>
              <Slider 
                min={0} 
                max={50} 
                value={faceSlimming} 
                onChange={setFaceSlimming} 
              />
            </div>
            
            <div className="mb-2">
              <label className="text-xs text-gray-300 mb-1 block">Jawline Definition</label>
              <Slider 
                min={0} 
                max={50} 
                value={jawlineDefinition} 
                onChange={setJawlineDefinition} 
              />
            </div>
            
            <div className="mb-2">
              <label className="text-xs text-gray-300 mb-1 block">Chin Adjustment</label>
              <Slider 
                min={-25} 
                max={25} 
                value={chinAdjustment} 
                onChange={setChinAdjustment} 
              />
            </div>
          </div>
          
          <ActionButton 
            onClick={() => applyBeautySettings(subToolNames.FACE)}
          >
            Apply Face Contouring
          </ActionButton>
        </PanelSection>

        {/* Makeup Section */}
        <PanelSection 
          title="Makeup" 
          isExpanded={activeBeautyTool === subToolNames.MAKEUP} 
          onToggle={() => handleToolToggle(subToolNames.MAKEUP)}
          icon={<Brush size={14} className="mr-1" />}
        >
          <ButtonGrid 
            items={makeupPresets} 
            activeId={selectedMakeupPreset} 
            onSelect={(presetId) => handlePresetSelect(subToolNames.MAKEUP, presetId)} 
            cols={4}
          />
          
          <div className="mt-3">
            <div className="mb-2">
              <label className="text-xs text-gray-300 mb-1 block">Intensity</label>
              <Slider 
                min={0} 
                max={100} 
                value={makeupIntensity} 
                onChange={setMakeupIntensity} 
              />
            </div>
          </div>
          
          <ActionButton 
            onClick={() => applyBeautySettings(subToolNames.MAKEUP)}
          >
            Apply Makeup
          </ActionButton>
        </PanelSection>
      </div>
    </div>
  );
};

export default BeautyToolPanel;