'use client'
import { 
  Sparkles, Sliders, Smile, Layers, Type, Square, Palette, Camera, 
  Zap, Wand2, Settings, HelpCircle
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar({ activeTool, setActiveTool, isMobile, setSidebarOpen }) {
  const [hoveredTool, setHoveredTool] = useState(null);

  const sidebarTools = [
    { 
      id: 'ai', 
      icon: <Wand2 size={20} />, 
      label: 'AI Tools',
      description: 'AI-powered enhancements',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'adjust', 
      icon: <Sliders size={20} />, 
      label: 'Adjust',
      description: 'Basic adjustments',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'effects', 
      icon: <Zap size={20} />, 
      label: 'Effects',
      description: 'Creative effects',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      id: 'beauty', 
      icon: <Smile size={20} />, 
      label: 'Beauty',
      description: 'Portrait retouching',
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      id: 'frames', 
      icon: <Layers size={20} />, 
      label: 'Frames',
      description: 'Borders & frames',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'text', 
      icon: <Type size={20} />, 
      label: 'Text',
      description: 'Add text & typography',
      gradient: 'from-indigo-500 to-purple-500'
    },
    { 
      id: 'elements', 
      icon: <Square size={20} />, 
      label: 'Elements',
      description: 'Shapes & graphics',
      gradient: 'from-teal-500 to-cyan-500'
    },
  ];

  const bottomTools = [
    { id: 'settings', icon: <Settings size={18} />, label: 'Settings' },
    { id: 'help', icon: <HelpCircle size={18} />, label: 'Help' },
  ];

  const handleToolClick = (toolId) => {
    setActiveTool(toolId);
    setSidebarOpen(true);
  };

  // This is for desktop sidebar only - mobile navigation is handled by BottomToolbar
  return (
    <div className="hidden md:flex w-16 bg-gray-800 dark:bg-dark-card flex-col items-center py-2 z-10 relative shadow-lg">
      {/* Main Tools */}
      <div className="flex flex-col items-center space-y-1 flex-1">
        {sidebarTools.map((tool) => (
          <div 
            key={tool.id}
            className="relative group"
            onMouseEnter={() => setHoveredTool(tool.id)}
            onMouseLeave={() => setHoveredTool(null)}
          >
            <div 
              onClick={() => handleToolClick(tool.id)}
              className={`w-12 h-12 flex flex-col items-center justify-center cursor-pointer rounded-xl transition-all duration-200 ease-out transform ${
                tool.id === activeTool 
                  ? `bg-gradient-to-br ${tool.gradient} shadow-lg scale-105` 
                  : 'hover:bg-gray-700 dark:hover:bg-dark-bg hover:scale-105'
              } ${hoveredTool === tool.id ? 'shadow-xl' : ''}`}
            >
              <div className={`transition-all duration-200 ${
                tool.id === activeTool ? 'text-white' : 'text-gray-300 group-hover:text-white'
              }`}>
                {tool.icon}
              </div>
            </div>
            
            {/* Label below icon */}
            <div className={`mt-1 text-center transition-all duration-200 ${
              tool.id === activeTool ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
            }`}>
              <span className="text-xs font-medium leading-tight block">
                {tool.label}
              </span>
            </div>

            {/* Tooltip on hover */}
            {hoveredTool === tool.id && (
              <div className="absolute left-16 top-1/2 -translate-y-1/2 ml-2 z-50 animate-in slide-in-from-left-2 duration-200">
                <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl border border-gray-700 whitespace-nowrap">
                  <div className="font-medium text-sm">{tool.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{tool.description}</div>
                  {/* Tooltip arrow */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 border-l border-b border-gray-700 rotate-45"></div>
                </div>
              </div>
            )}

            {/* Active indicator */}
            {tool.id === activeTool && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-white/80 to-white/40 rounded-r-full shadow-lg"></div>
            )}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-gray-700 my-4"></div>

      {/* Bottom Tools */}
      <div className="flex flex-col items-center space-y-2">
        {bottomTools.map((tool) => (
          <div 
            key={tool.id}
            className="relative group"
            onMouseEnter={() => setHoveredTool(tool.id)}
            onMouseLeave={() => setHoveredTool(null)}
          >
            <div 
              onClick={() => handleToolClick(tool.id)}
              className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-lg transition-all duration-200 hover:bg-gray-700 dark:hover:bg-dark-bg hover:scale-105"
            >
              <div className="text-gray-400 group-hover:text-gray-200 transition-colors duration-200">
                {tool.icon}
              </div>
            </div>

            {/* Tooltip for bottom tools */}
            {hoveredTool === tool.id && (
              <div className="absolute left-12 top-1/2 -translate-y-1/2 ml-2 z-50 animate-in slide-in-from-left-2 duration-200">
                <div className="bg-gray-900 text-white px-2 py-1 rounded-md shadow-lg border border-gray-700 whitespace-nowrap">
                  <div className="text-xs font-medium">{tool.label}</div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 border-l border-b border-gray-700 rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Background glow effect for active tool */}
      {activeTool && (
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br ${
            sidebarTools.find(t => t.id === activeTool)?.gradient || 'from-blue-500 to-purple-500'
          } opacity-10 blur-xl rounded-full transition-all duration-500`}
            style={{
              top: `${(sidebarTools.findIndex(t => t.id === activeTool) * 60) + 40}px`
            }}
          />
        </div>
      )}
    </div>
  );
}