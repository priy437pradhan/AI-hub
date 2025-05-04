'use client'
import { 
  Sparkles, Sliders, Smile, Layers, Type, Square, Upload, Grid, MoreHorizontal
} from 'lucide-react';

export default function Sidebar({ activeTool, setActiveTool, isMobile, setSidebarOpen }) {
  const sidebarTools = [
    { id: 'ai', icon: <Sparkles size={20} />, label: 'AI Tools' },
    { id: 'adjust', icon: <Sliders size={20} />, label: 'Adjust' },
    { id: 'effects', icon: <Sparkles size={20} />, label: 'Effects' },
    { id: 'beauty', icon: <Smile size={20} />, label: 'Beauty' },
    { id: 'frames', icon: <Layers size={20} />, label: 'Frames' },
    { id: 'text', icon: <Type size={20} />, label: 'Text' },
    { id: 'elements', icon: <Square size={20} />, label: 'Elements' },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-16 bg-gray-800 dark:bg-dark-card flex-col items-center py-2 z-10">
        {sidebarTools.map((tool) => (
          <div 
            key={tool.id} 
            onClick={() => {
              setActiveTool(tool.id);
              setSidebarOpen(true);
            }}
            className={`w-full flex flex-col items-center py-3 cursor-pointer text-xs ${
              tool.id === activeTool 
                ? 'bg-gray-700 dark:bg-dark-bg' 
                : 'hover:bg-gray-700 dark:hover:bg-dark-bg'
            }`}
          >
            <div className={`p-1 rounded-md ${
              tool.id === activeTool ? 'text-primary-500' : 'text-gray-300'
            }`}>
              {tool.icon}
            </div>
            <span className={`mt-1 ${
              tool.id === activeTool ? 'text-primary-500' : 'text-gray-300'
            }`}>
              {tool.label}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 dark:bg-dark-card z-30 border-t border-gray-700">
        <div className="flex justify-around items-center h-16">
          {sidebarTools.map((tool) => (
            <div 
              key={tool.id} 
              onClick={() => {
                setActiveTool(tool.id);
                setSidebarOpen(true);
              }}
              className="flex flex-col items-center py-2"
            >
              <div className={`p-1 rounded-md ${
                tool.id === activeTool ? 'text-primary-500' : 'text-gray-300'
              }`}>
                {tool.icon}
              </div>
              <span className={`text-xs mt-1 ${
                tool.id === activeTool ? 'text-primary-500' : 'text-gray-300'
              }`}>
                {tool.label.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}