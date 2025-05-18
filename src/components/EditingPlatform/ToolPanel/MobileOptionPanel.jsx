'use client'
import { useState, useEffect } from 'react';
import { ChevronLeft, Sliders, Crop, RotateCcw, FlipHorizontal, FlipVertical,
  Wand2, Sparkles, Smile, SlidersHorizontal, Frame, Type, Shapes, Palette, 
  BoldIcon, ItalicIcon, AlignLeft, AlignCenter, AlignRight, Maximize2, X } from 'lucide-react';

const MobileOptionsPanel = ({ 
  activeTool, 
  onClose,
  performFlip = () => {},
  performRotate = () => {},
  applyBeautyFeature = () => {},
  beautySettings = {},
  frameSettings = {
    style: 'none',
    color: '#FFFFFF',
    width: 10,
    shadow: 0,
    spread: 0,
    shadowColor: '#000000'
  },
  setFrameSettings = () => {},
  applyFrame = () => {},
  applyFrameEffects = () => {},
  // Text editor props
  textElements = [],
  textSettings = { text: 'Add your text here', color: '#FFFFFF', fontSize: 24 },
  setTextSettings = () => {},
  addTextElement = () => {},
  removeTextElement = () => {},
  updateTextElement = () => {},
  // Text styles props
  styleSettings = { bold: false, italic: false, alignment: 'center' },
  setStyleSettings = () => {},
  applyTextStyle = () => {},
  toggleStyle = () => {},
  updateStyleSetting = () => {}
}) => {
  const [navigationStack, setNavigationStack] = useState(['main']);
  const [currentView, setCurrentView] = useState('main');
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentTool, setCurrentTool] = useState(activeTool || 'adjust');

  // Define color options
  const colorOptions = [
    '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
  ];

  // Tool definitions
  const toolOptions = {
    adjust: {
      label: 'Adjust',
      icon: <Sliders size={20} />,
      options: [
        { 
          id: 'flip', 
          label: 'Flip', 
          icon: <FlipHorizontal size={20} />,
          controls: [
            { 
              type: 'buttonGroup', 
              label: 'Flip Direction',
              options: [
                { 
                  label: 'Horizontal', 
                  icon: <FlipHorizontal size={20} />,
                  action: () => performFlip('horizontal')
                },
                { 
                  label: 'Vertical', 
                  icon: <FlipVertical size={20} />,
                  action: () => performFlip('vertical')
                }
              ]
            }
          ]
        },
        { 
          id: 'rotate', 
          label: 'Rotate', 
          icon: <RotateCcw size={20} />,
          controls: [
            { 
              type: 'buttonGroup', 
              label: 'Rotate Direction',
              options: [
                { 
                  label: 'Left', 
                  icon: <RotateCcw size={20} />,
                  action: () => performRotate('left')
                },
                { 
                  label: 'Right', 
                  icon: <RotateCcw size={20} className="transform rotate-90" />,
                  action: () => performRotate('right')
                }
              ]
            }
          ]
        }
      ]
    },
    ai: {
      label: 'AI Tools',
      icon: <Wand2 size={20} />,
      options: [
        { 
          id: 'enhance', 
          label: 'Enhance', 
          icon: <Sparkles size={20} />,
          controls: [
            { 
              type: 'slider', 
              label: 'Amount', 
              min: 0, 
              max: 100, 
              step: 1, 
              value: 50,
              onChange: (value) => console.log('Enhance amount:', value)
            }
          ]
        }
      ]
    },
    effects: {
      label: 'Effects',
      icon: <Sparkles size={20} />,
      options: [
        { 
          id: 'filters', 
          label: 'Filters', 
          icon: <Palette size={20} />,
          controls: [
            { 
              type: 'buttonGrid', 
              label: 'Filter Type',
              options: [
                'Vintage', 'Black & White', 'Sepia', 'Vivid', 
                'Cool', 'Warm', 'Dramatic', 'Film', 'Noir'
              ],
              action: (filter) => console.log('Applying filter:', filter)
            }
          ]
        }
      ]
    },
    beauty: {
      label: 'Beauty',
      icon: <Smile size={20} />,
      options: [
        { 
          id: 'skin', 
          label: 'Skin', 
          icon: <SlidersHorizontal size={20} />,
          controls: [
            { 
              type: 'slider', 
              label: 'Smoothness', 
              min: 0, 
              max: 100, 
              step: 1, 
              value: beautySettings?.skin?.smoothness || 0,
              onChange: (value) => applyBeautyFeature('skin', { smoothness: value })
            },
            { 
              type: 'slider', 
              label: 'Brightness', 
              min: -100, 
              max: 100, 
              step: 1, 
              value: beautySettings?.skin?.brightness || 0,
              onChange: (value) => applyBeautyFeature('skin', { brightness: value })
            }
          ]
        },
        { 
          id: 'face', 
          label: 'Face', 
          icon: <Smile size={20} />,
          controls: [
            { 
              type: 'slider', 
              label: 'Face Shape', 
              min: -100, 
              max: 100, 
              step: 1, 
              value: beautySettings?.face?.shape || 0,
              onChange: (value) => applyBeautyFeature('face', { shape: value })
            }
          ]
        }
      ]
    },
    frames: {
      label: 'Frames',
      icon: <Frame size={20} />,
      options: [
        { 
          id: 'frameStyle', 
          label: 'Frame Style', 
          icon: <Frame size={20} />,
          controls: [
            { 
              type: 'buttonGrid', 
              label: 'Style',
              options: ['Square', 'Rounded', 'Circle', 'Polaroid', 'None'],
              action: (style) => applyFrame(style.toLowerCase(), frameSettings.color, frameSettings.width)
            },
            { 
              type: 'colorPicker', 
              label: 'Frame Color',
              colors: colorOptions,
              current: frameSettings?.color || '#FFFFFF',
              action: (color) => {
                setFrameSettings(prev => ({...prev, color}));
                applyFrame(frameSettings?.style || 'none', color, frameSettings?.width || 10);
              }
            },
            { 
              type: 'slider', 
              label: 'Frame Width', 
              min: 0, 
              max: 50, 
              step: 1, 
              value: frameSettings?.width || 10,
              onChange: (width) => {
                setFrameSettings(prev => ({...prev, width}));
                applyFrame(frameSettings?.style || 'none', frameSettings?.color || '#FFFFFF', width);
              }
            }
          ]
        },
        { 
          id: 'frameEffects', 
          label: 'Frame Effects', 
          icon: <Sparkles size={20} />,
          controls: [
            { 
              type: 'slider', 
              label: 'Shadow', 
              min: 0, 
              max: 20, 
              step: 1, 
              value: frameSettings?.shadow || 0,
              onChange: (shadow) => {
                setFrameSettings(prev => ({...prev, shadow}));
                applyFrameEffects(shadow, frameSettings?.spread || 0, frameSettings?.shadowColor || '#000000');
              }
            },
            { 
              type: 'slider', 
              label: 'Spread', 
              min: 0, 
              max: 20, 
              step: 1, 
              value: frameSettings?.spread || 0,
              onChange: (spread) => {
                setFrameSettings(prev => ({...prev, spread}));
                applyFrameEffects(frameSettings?.shadow || 0, spread, frameSettings?.shadowColor || '#000000');
              }
            },
            { 
              type: 'colorPicker', 
              label: 'Shadow Color',
              colors: colorOptions,
              current: frameSettings?.shadowColor || '#000000',
              action: (shadowColor) => {
                setFrameSettings(prev => ({...prev, shadowColor}));
                applyFrameEffects(frameSettings?.shadow || 0, frameSettings?.spread || 0, shadowColor);
              }
            }
          ]
        }
      ]
    },
    text: {
      label: 'Text',
      icon: <Type size={20} />,
      options: [
        { 
          id: 'addText', 
          label: 'Add Text', 
          icon: <Type size={20} />,
          controls: [
            { 
              type: 'textInput', 
              label: 'Enter Text',
              value: textSettings?.text || 'Add your text here',
              onChange: (text) => {
                setTextSettings(prev => ({...prev, text}));
              },
              onSubmit: () => addTextElement(textSettings)
            },
            { 
              type: 'colorPicker', 
              label: 'Text Color',
              colors: colorOptions,
              current: textSettings?.color || '#FFFFFF',
              action: (color) => {
                setTextSettings(prev => ({...prev, color}));
              }
            },
            { 
              type: 'slider', 
              label: 'Font Size', 
              min: 12, 
              max: 72, 
              step: 1, 
              value: textSettings?.fontSize || 24,
              onChange: (fontSize) => {
                setTextSettings(prev => ({...prev, fontSize}));
              }
            }
          ]
        },
        { 
          id: 'textStyle', 
          label: 'Text Style', 
          icon: <BoldIcon size={20} />,
          controls: [
            { 
              type: 'buttonGroup', 
              label: 'Style',
              options: [
                { 
                  label: 'Bold', 
                  icon: <BoldIcon size={20} />,
                  isActive: styleSettings?.bold || false,
                  action: () => toggleStyle('bold')
                },
                { 
                  label: 'Italic', 
                  icon: <ItalicIcon size={20} />,
                  isActive: styleSettings?.italic || false,
                  action: () => toggleStyle('italic')
                }
              ]
            },
            { 
              type: 'buttonGroup', 
              label: 'Alignment',
              options: [
                { 
                  label: 'Left', 
                  icon: <AlignLeft size={20} />,
                  isActive: (styleSettings?.alignment || 'center') === 'left',
                  action: () => updateStyleSetting('alignment', 'left')
                },
                { 
                  label: 'Center', 
                  icon: <AlignCenter size={20} />,
                  isActive: (styleSettings?.alignment || 'center') === 'center',
                  action: () => updateStyleSetting('alignment', 'center')
                },
                { 
                  label: 'Right', 
                  icon: <AlignRight size={20} />,
                  isActive: (styleSettings?.alignment || 'center') === 'right',
                  action: () => updateStyleSetting('alignment', 'right')
                }
              ]
            }
          ]
        },
        { 
          id: 'textList', 
          label: 'Text Elements', 
          icon: <Maximize2 size={20} />,
          controls: [
            { 
              type: 'textList', 
              label: 'Manage Texts',
              items: textElements,
              onRemove: removeTextElement
            }
          ]
        }
      ]
    },
    elements: {
      label: 'Elements',
      icon: <Shapes size={20} />,
      options: [
        { 
          id: 'shapes', 
          label: 'Shapes', 
          icon: <Shapes size={20} />,
          controls: [
            { 
              type: 'buttonGrid', 
              label: 'Choose Shape',
              options: ['Circle', 'Square', 'Triangle', 'Star', 'Heart'],
              action: (shape) => console.log('Adding shape:', shape)
            },
            { 
              type: 'colorPicker', 
              label: 'Shape Color',
              colors: colorOptions,
              action: (color) => console.log('Shape color:', color)
            }
          ]
        }
      ]
    }
  };

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
      if (newStack[newStack.length - 1] === 'main') {
        setSelectedOption(null);
      }
    } else {
      onClose();
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
      case 'controls':
        return renderControlsView();
      default:
        return renderMainView();
    }
  };

  // Main view shows all options for the current tool
  const renderMainView = () => {
    const tool = toolOptions[currentTool];
    
    if (!tool) return <div className="p-4 text-center text-gray-400">Select a tool</div>;
    
    return (
      <div className="p-4">
        <h3 className="text-lg font-medium text-white mb-4">{tool.label}</h3>
        <div className="grid grid-cols-3 gap-4">
          {tool.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option)}
              className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div className="text-gray-200 mb-2">{option.icon}</div>
              <span className="text-sm text-gray-300">{option.label}</span>
            </button>
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
        <h3 className="text-lg font-medium text-white mb-4">{selectedOption.label}</h3>
        <div className="space-y-6">
          {selectedOption.controls?.map((control, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-300 mb-3">{control.label}</p>
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
          <div className="space-y-2">
            <input 
              type="range"
              min={control.min}
              max={control.max}
              step={control.step || 1}
              value={control.value}
              onChange={(e) => control.onChange(Number(e.target.value))}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{control.min}</span>
              <span>{control.value}</span>
              <span>{control.max}</span>
            </div>
          </div>
        );
      
      case 'buttonGroup':
        return (
          <div className="flex space-x-2">
            {control.options.map((option, idx) => (
              <button 
                key={idx}
                onClick={option.action}
                className={`flex items-center justify-center bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded-md text-sm flex-1 ${
                  option.isActive ? 'bg-primary-500 hover:bg-primary-600' : ''
                }`}
              >
                {option.icon && <span className="mr-2">{option.icon}</span>}
                <span className="text-white">{option.label}</span>
              </button>
            ))}
          </div>
        );
      
      case 'buttonGrid':
        return (
          <div className="grid grid-cols-3 gap-2">
            {control.options.map((option) => (
              <button 
                key={option}
                onClick={() => control.action(option)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-2 rounded-md text-sm"
              >
                {option}
              </button>
            ))}
          </div>
        );
      
      case 'colorPicker':
        return (
          <div className="grid grid-cols-5 gap-2">
            {control.colors.map((color) => (
              <button 
                key={color}
                onClick={() => control.action(color)}
                className={`w-12 h-12 rounded-full border-2 ${
                  color === control.current ? 'border-primary-500' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Color ${color}`}
              />
            ))}
          </div>
        );
      
      case 'textInput':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={control.value}
              onChange={(e) => control.onChange(e.target.value)}
              className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-white"
            />
            <button 
              onClick={control.onSubmit}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-md"
            >
              Add Text
            </button>
          </div>
        );
      
      case 'textList':
        return (
          <div className="space-y-2">
            {control.items && control.items.length > 0 ? (
              control.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-600 p-2 rounded-md">
                  <span className="text-white truncate max-w-xs">{item.text}</span>
                  <button 
                    onClick={() => control.onRemove(idx)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No text elements added</p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 z-10">
          <div className="flex items-center">
            <button 
              onClick={navigateBack} 
              className="text-gray-300 hover:text-white p-1 flex items-center"
            >
              <ChevronLeft size={24} />
              <span className="text-sm ml-1">Back</span>
            </button>
            <h2 className="text-lg font-medium text-white text-center flex-1 -ml-8">
              {currentView === 'main' ? toolOptions[currentTool]?.label : selectedOption?.label}
            </h2>
          </div>
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MobileOptionsPanel;