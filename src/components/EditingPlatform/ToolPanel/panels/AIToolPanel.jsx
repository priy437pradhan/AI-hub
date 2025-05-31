import React, { useState } from 'react';
import { 
  Wand2, Sparkles, User, Scissors, Palette, Image, 
  Zap, Eye, Copy, Trash2, RotateCcw, Download,
  Smile, Camera, Star, Heart, CloudLightning, Sun
} from 'lucide-react';

// Common components (simplified for this example)
const PanelSection = ({ title, children, isExpanded, onToggle }) => (
  <div className="mb-1">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-2 bg-gray-700 hover:bg-gray-650 rounded-lg transition-colors"
    >
      <span className="text-gray-200 text-sm font-medium">{title}</span>
      <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>
    {isExpanded && (
      <div className="mt-2 px-2 pb-2">
        {children}
      </div>
    )}
  </div>
);

const ButtonGrid = ({ items, activeId, onSelect, cols = 3 }) => (
  <div className={`grid grid-cols-${cols} gap-2 mb-3`}>
    {items.map((item) => (
      <button
        key={item.id}
        onClick={() => onSelect(item.id)}
        className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${
          activeId === item.id 
            ? 'bg-blue-500 bg-opacity-30 border border-blue-400 text-blue-200' 
            : 'border border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300'
        }`}
      >
        <div className="mb-1">
          {typeof item.icon === 'string' ? (
            <span className="text-lg">{item.icon}</span>
          ) : (
            item.icon
          )}
        </div>
        <span className="text-xs text-center leading-tight">{item.label}</span>
      </button>
    ))}
  </div>
);

const Slider = ({ label, value, min, max, onChange, showValue = true }) => (
  <div className="mb-3">
    <div className="flex justify-between items-center mb-2">
      <span className="text-gray-300 text-xs">{label}</span>
      {showValue && <span className="text-gray-400 text-xs">{value}</span>}
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1.5 rounded-full appearance-none bg-gray-700 accent-blue-500"
    />
  </div>
);

const ActionButton = ({ onClick, disabled, children, variant = 'primary' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all ${
      variant === 'primary'
        ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white'
        : variant === 'secondary'
        ? 'bg-gray-700 hover:bg-gray-650 text-gray-200 border border-gray-600'
        : 'bg-red-600 hover:bg-red-700 text-white'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

// AI Features Data - Based on Fotor's actual features
const aiEnhanceFeatures = [
  { id: 'auto-enhance', label: 'Auto Enhance', icon: <Sparkles size={16} /> },
  { id: 'hdr', label: 'HDR', icon: <Sun size={16} /> },
  { id: 'deblur', label: 'Deblur', icon: <Eye size={16} /> },
  { id: 'denoise', label: 'Denoise', icon: <Zap size={16} /> },
  { id: 'upscale', label: 'AI Upscale', icon: <Image size={16} /> },
  { id: 'colorize', label: 'Colorize B&W', icon: <Palette size={16} /> }
];

const aiBackgroundFeatures = [
  { id: 'remove-bg', label: 'Remove BG', icon: <Scissors size={16} /> },
  { id: 'replace-bg', label: 'Replace BG', icon: <Copy size={16} /> },
  { id: 'blur-bg', label: 'Blur BG', icon: '🌫️' },
  { id: 'change-bg', label: 'Change BG', icon: <Image size={16} /> }
];

const aiPortraitFeatures = [
  { id: 'face-retouch', label: 'Face Retouch', icon: <Smile size={16} /> },
  { id: 'teeth-whiten', label: 'Whiten Teeth', icon: '🦷' },
  { id: 'eye-enhance', label: 'Eye Enhance', icon: <Eye size={16} /> },
  { id: 'skin-smooth', label: 'Skin Smooth', icon: '✨' },
  { id: 'blemish-remove', label: 'Remove Blemish', icon: '🎯' },
  { id: 'wrinkle-remove', label: 'Remove Wrinkles', icon: '👴' }
];

const aiObjectFeatures = [
  { id: 'object-remove', label: 'Remove Object', icon: <Trash2 size={16} /> },
  { id: 'unwanted-remove', label: 'Remove Unwanted', icon: '🚫' },
  { id: 'person-remove', label: 'Remove Person', icon: <User size={16} /> },
  { id: 'text-remove', label: 'Remove Text', icon: '📝' }
];

const aiStyleFeatures = [
  { id: 'cartoon', label: '3D Cartoon', icon: '🎭' },
  { id: 'anime', label: 'Anime Style', icon: '🌸' },
  { id: 'sketch', label: 'Sketch', icon: '✏️' },
  { id: 'oil-paint', label: 'Oil Painting', icon: '🎨' },
  { id: 'watercolor', label: 'Watercolor', icon: '💧' },
  { id: 'vintage', label: 'Vintage', icon: '📷' }
];

const subToolNames = {
  AI_ENHANCE: 'ai-enhance',
  AI_BACKGROUND: 'ai-background', 
  AI_PORTRAIT: 'ai-portrait',
  AI_OBJECT: 'ai-object',
  AI_STYLE: 'ai-style',
  AI_HISTORY: 'ai-history'
};

const AIToolPanel = ({
  activeAITool,
  setActiveAITool,
  activeAIFeature,
  setActiveAIFeature,
  applyAIFeature
}) => {
  const [enhanceIntensity, setEnhanceIntensity] = useState(75);
  const [backgroundBlur, setBackgroundBlur] = useState(50);
  const [retouchIntensity, setRetouchIntensity] = useState(60);
  const [styleStrength, setStyleStrength] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState([
    { id: 1, action: 'Auto Enhance', timestamp: '2 min ago', preview: '🖼️' },
    { id: 2, action: 'Remove Background', timestamp: '5 min ago', preview: '🖼️' },
    { id: 3, action: 'Face Retouch', timestamp: '8 min ago', preview: '🖼️' }
  ]);

  const handleToolToggle = (tool) => {
    if (activeAITool === tool) {
      setActiveAITool(null);
    } else {
      setActiveAITool(tool);
    }
  };

  const handleApplyFeature = async (feature) => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        action: feature,
        timestamp: 'Just now',
        preview: '🖼️'
      };
      setHistory(prev => [newHistoryItem, ...prev]);
      
      if (applyAIFeature) {
        applyAIFeature(feature);
      }
    }, 2000);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <h2 className="text-gray-200 font-medium mb-2 text-sm">AI Tools</h2>
      <div className="bg-gray-800 rounded-lg p-2 mb-3 shadow-md">
        
        {/* AI Enhance */}
        <PanelSection 
          title="AI Enhance" 
          isExpanded={activeAITool === subToolNames.AI_ENHANCE} 
          onToggle={() => handleToolToggle(subToolNames.AI_ENHANCE)}
        >
          <ButtonGrid 
            items={aiEnhanceFeatures} 
            activeId={activeAIFeature} 
            onSelect={setActiveAIFeature} 
            cols={2}
          />
          <Slider 
            label="Intensity" 
            value={enhanceIntensity} 
            min={0} 
            max={100} 
            onChange={setEnhanceIntensity} 
          />
          <ActionButton 
            onClick={() => handleApplyFeature(activeAIFeature)} 
            disabled={!activeAIFeature || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Apply Enhancement'}
          </ActionButton>
        </PanelSection>

        {/* AI Background */}
        <PanelSection 
          title="AI Background" 
          isExpanded={activeAITool === subToolNames.AI_BACKGROUND} 
          onToggle={() => handleToolToggle(subToolNames.AI_BACKGROUND)}
        >
          <ButtonGrid 
            items={aiBackgroundFeatures} 
            activeId={activeAIFeature} 
            onSelect={setActiveAIFeature} 
            cols={2}
          />
          {activeAIFeature === 'blur-bg' && (
            <Slider 
              label="Blur Amount" 
              value={backgroundBlur} 
              min={0} 
              max={100} 
              onChange={setBackgroundBlur} 
            />
          )}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <ActionButton 
              onClick={() => handleApplyFeature(activeAIFeature)} 
              disabled={!activeAIFeature || isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Apply'}
            </ActionButton>
            <ActionButton 
              onClick={() => {}} 
              variant="secondary"
              disabled={!activeAIFeature}
            >
              Preview
            </ActionButton>
          </div>
        </PanelSection>

        {/* AI Portrait */}
        <PanelSection 
          title="AI Portrait" 
          isExpanded={activeAITool === subToolNames.AI_PORTRAIT} 
          onToggle={() => handleToolToggle(subToolNames.AI_PORTRAIT)}
        >
          <ButtonGrid 
            items={aiPortraitFeatures} 
            activeId={activeAIFeature} 
            onSelect={setActiveAIFeature} 
            cols={2}
          />
          <Slider 
            label="Retouch Strength" 
            value={retouchIntensity} 
            min={0} 
            max={100} 
            onChange={setRetouchIntensity} 
          />
          <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-2 mb-3">
            <p className="text-blue-200 text-xs">
              💡 For best results, ensure the face is clearly visible and well-lit
            </p>
          </div>
          <ActionButton 
            onClick={() => handleApplyFeature(activeAIFeature)} 
            disabled={!activeAIFeature || isProcessing}
          >
            {isProcessing ? 'Retouching...' : 'Apply Retouch'}
          </ActionButton>
        </PanelSection>

        {/* AI Object Remove */}
        <PanelSection 
          title="AI Object Remove" 
          isExpanded={activeAITool === subToolNames.AI_OBJECT} 
          onToggle={() => handleToolToggle(subToolNames.AI_OBJECT)}
        >
          <ButtonGrid 
            items={aiObjectFeatures} 
            activeId={activeAIFeature} 
            onSelect={setActiveAIFeature} 
            cols={2}
          />
          <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg p-2 mb-3">
            <p className="text-yellow-200 text-xs">
              🎯 Click or brush over objects you want to remove
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <ActionButton 
              onClick={() => handleApplyFeature(activeAIFeature)} 
              disabled={!activeAIFeature || isProcessing}
            >
              {isProcessing ? 'Removing...' : 'Remove'}
            </ActionButton>
            <ActionButton 
              onClick={() => {}} 
              variant="secondary"
            >
              <RotateCcw size={14} className="mr-1" />
              Reset
            </ActionButton>
          </div>
        </PanelSection>

        {/* AI Style Transfer */}
        <PanelSection 
          title="AI Style Transfer" 
          isExpanded={activeAITool === subToolNames.AI_STYLE} 
          onToggle={() => handleToolToggle(subToolNames.AI_STYLE)}
        >
          <ButtonGrid 
            items={aiStyleFeatures} 
            activeId={activeAIFeature} 
            onSelect={setActiveAIFeature} 
            cols={2}
          />
          <Slider 
            label="Style Strength" 
            value={styleStrength} 
            min={0} 
            max={100} 
            onChange={setStyleStrength} 
          />
          <ActionButton 
            onClick={() => handleApplyFeature(activeAIFeature)} 
            disabled={!activeAIFeature || isProcessing}
          >
            {isProcessing ? 'Stylizing...' : 'Apply Style'}
          </ActionButton>
        </PanelSection>
        
        {/* AI History */}
        <PanelSection 
          title="AI History" 
          isExpanded={activeAITool === subToolNames.AI_HISTORY} 
          onToggle={() => handleToolToggle(subToolNames.AI_HISTORY)}
        >
          <div className="bg-gray-700 rounded-lg p-2 mb-2 max-h-40 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-gray-400 text-xs italic text-center py-4">No AI edits yet</p>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-gray-600 rounded-md hover:bg-gray-550 transition-colors">
                    <div className="flex items-center">
                      <span className="mr-2 text-sm">{item.preview}</span>
                      <div>
                        <p className="text-gray-200 text-xs font-medium">{item.action}</p>
                        <p className="text-gray-400 text-xs">{item.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors">
                        <Eye size={12} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-400 transition-colors">
                        <Download size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {history.length > 0 && (
            <ActionButton 
              onClick={clearHistory} 
              variant="danger"
            >
              Clear History
            </ActionButton>
          )}
        </PanelSection>
      </div>
    </div>
  );
};

export default AIToolPanel;