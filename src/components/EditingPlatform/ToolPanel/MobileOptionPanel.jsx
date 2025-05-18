'use client'
import { useState, useEffect } from 'react';
import { ChevronLeft, Sliders, Crop, RotateCcw} from 'lucide-react';

// Sample option data structure - you'll need to expand this for all your tools
const toolOptions = {
  adjust: {
    label: 'Adjust',
    icon: <Sliders size={20} />,
    options: [
      { 
        id: 'crop', 
        label: 'Crop', 
        icon: <Crop size={20} />,
        controls: [
          // Controls for crop feature would go here
          { type: 'aspectRatio', label: 'Aspect Ratio' }
        ]
      },
      { 
        id: 'rotate', 
        label: 'Rotate', 
        icon: <RotateCcw size={20} />,
        controls: [
          // Controls for rotate feature
          { type: 'slider', label: 'Angle', min: -180, max: 180, step: 1 }
        ]
      }
    ]
  },
  // Add similar structures for other tools: ai, effects, beauty, frames, text, elements
};

const MobileOptionsPanel = ({ activeTool, onClose }) => {
  const [navigationStack, setNavigationStack] = useState(['main']);
  const [currentView, setCurrentView] = useState('main');
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentTool, setCurrentTool] = useState(activeTool || 'adjust');

  // Update the current view when navigation stack changes
  useEffect(() => {
    setCurrentView(navigationStack[navigationStack.length - 1]);
  }, [navigationStack]);

  // Reset state when active tool changes
  useEffect(() => {
    if (activeTool) {
      setCurrentTool(activeTool);
      setNavigationStack(['main']);
      setSelectedOption(null);
    }
  }, [activeTool]);

  const navigateTo = (view) => {
    setNavigationStack([...navigationStack, view]);
  };

  const navigateBack = () => {
    if (navigationStack.length > 1) {
      const newStack = [...navigationStack];
      newStack.pop();
      setNavigationStack(newStack);
      
      // Reset selected option if going back to options level
      if (newStack[newStack.length - 1] === 'options') {
        setSelectedOption(null);
      }
    }
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    navigateTo('controls');
  };

  // Render different views based on navigation state
  const renderContent = () => {
    switch (currentView) {
      case 'main':
        return renderMainView();
      case 'options':
        return renderOptionsView();
      case 'controls':
        return renderControlsView();
      default:
        return renderMainView();
    }
  };

  // Main view shows the current tool and its options
  const renderMainView = () => {
    const tool = toolOptions[currentTool];
    
    if (!tool) return <div className="p-4 text-center text-gray-400">Select a tool</div>;
    
    return (
      <div className="p-4">
        <h3 className="text-lg font-medium text-white mb-4">{tool.label}</h3>
        <div className="grid grid-cols-3 gap-2">
          {tool.options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setSelectedOption(option);
                navigateTo('options');
              }}
              className="flex flex-col items-center justify-center p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div className="text-gray-200 mb-2">{option.icon}</div>
              <span className="text-sm text-gray-300">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Options view shows the specific options for a selected tool feature
  const renderOptionsView = () => {
    if (!selectedOption) return null;
    
    return (
      <div className="p-4">
        <h3 className="text-lg font-medium text-white mb-4">{selectedOption.label}</h3>
        {/* Render specific UI controls for this option */}
        <div className="space-y-4">
          {selectedOption.controls?.map((control, index) => (
            <div key={index} className="bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">{control.label}</p>
              {/* Render appropriate control UI based on type */}
              {renderControl(control)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Controls view shows the specific controls for a selected option
  const renderControlsView = () => {
    if (!selectedOption) return null;
    
    return (
      <div className="p-4">
        <h3 className="text-lg font-medium text-white mb-4">{selectedOption.label} Controls</h3>
        {/* Render detailed controls for this option */}
        <div className="space-y-4">
          {selectedOption.controls?.map((control, index) => (
            <div key={index} className="bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">{control.label}</p>
              {renderControl(control)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Helper to render different types of controls
  const renderControl = (control) => {
    switch (control.type) {
      case 'slider':
        return (
          <input 
            type="range"
            min={control.min}
            max={control.max}
            step={control.step || 1}
            className="w-full"
            // Add your state management here
          />
        );
      case 'buttons':
        return (
          <div className="flex space-x-2">
            {control.options.map((option, idx) => (
              <button 
                key={idx}
                className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm"
              >
                {option}
              </button>
            ))}
          </div>
        );
      case 'aspectRatio':
        return (
          <div className="grid grid-cols-3 gap-2">
            {["Original", "1:1", "16:9", "4:3", "3:2", "Free"].map((ratio) => (
              <button 
                key={ratio}
                className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded-md text-sm"
              >
                {ratio}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 rounded-t-xl shadow-lg z-50">
      {/* Header */}
      <div className="sticky top-0 bg-gray-800 rounded-t-xl p-2 border-b border-gray-700">
        <div className="flex items-center justify-between px-2">
          {navigationStack.length > 1 ? (
            <button 
              onClick={navigateBack} 
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 flex items-center"
            >
              <ChevronLeft size={20} />
              <span className="text-sm ml-1">Back</span>
            </button>
          ) : (
            <div className="w-20"></div> 
          )}
          <h2 className="text-lg font-medium text-white text-center">
            {currentView === 'main' ? 'Tools' : 
             currentView === 'options' ? toolOptions[currentTool]?.label : 
             selectedOption?.label}
          </h2>
          <div className="w-20"></div> {/* Empty div for spacing */}
        </div>
      </div>
      
      {/* Content area */}
      <div className="overflow-y-auto" style={{ maxHeight: '40vh' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default MobileOptionsPanel;