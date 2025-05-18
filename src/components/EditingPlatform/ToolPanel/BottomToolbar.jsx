'use client'
import { useState, useEffect } from 'react';
import { Sliders, Wand2, Paintbrush, Smile, Frame, Type, Shapes } from 'lucide-react';
import MobileOptionsPanel from '../../EditingPlatform/ToolPanel/MobileOptionPanel';

const ToolbarButton = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center ${
        isActive ? 'text-primary-500' : 'text-gray-300'
      }`}
    >
      <div className={`p-1 rounded-md ${isActive ? 'text-primary-500' : ''}`}>
        {icon}
      </div>
      <span className={`text-xs mt-1 ${isActive ? 'text-primary-500' : ''}`}>
        {label}
      </span>
    </button>
  );
};

const BottomToolbar = ({ activeTool, setActiveTool, setSidebarOpen, isMobile }) => {
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  
  // Define tool constants
  const toolNames = {
    ADJUST: 'adjust',
    AI: 'ai',
    EFFECTS: 'effects',
    BEAUTY: 'beauty',
    FRAMES: 'frames',
    TEXT: 'text',
    ELEMENTS: 'elements'
  };

  // Close mobile panel when activeTool changes to null
  useEffect(() => {
    if (activeTool === null) {
      setShowMobilePanel(false);
    }
  }, [activeTool]);

  const handleToolClick = (tool) => {
    // Set the active tool
    setActiveTool(tool);
    
    // For mobile, show the sliding panel instead of opening the sidebar
    if (isMobile) {
      setShowMobilePanel(true);
    } else {
      // For desktop, open the sidebar
      setSidebarOpen(true);
    }
  };
  
  // Handle closing the mobile panel
  const handleClosePanel = () => {
    setShowMobilePanel(false);
  };

  return (
    <>
      <div className="flex justify-around items-center h-full px-2">
        <ToolbarButton  
          icon={<Sliders size={20} />} 
          label="Adjust"  
          isActive={activeTool === toolNames.ADJUST} 
          onClick={() => handleToolClick(toolNames.ADJUST)} 
        />
        <ToolbarButton 
          icon={<Wand2 size={20} />}  
          label="AI" 
          isActive={activeTool === toolNames.AI} 
          onClick={() => handleToolClick(toolNames.AI)}
        />
        <ToolbarButton  
          icon={<Paintbrush size={20} />} 
          label="Effects" 
          isActive={activeTool === toolNames.EFFECTS} 
          onClick={() => handleToolClick(toolNames.EFFECTS)} 
        />
        <ToolbarButton  
          icon={<Smile size={20} />} 
          label="Beauty" 
          isActive={activeTool === toolNames.BEAUTY} 
          onClick={() => handleToolClick(toolNames.BEAUTY)} 
        />
        <ToolbarButton 
          icon={<Frame size={20} />} 
          label="Frames" 
          isActive={activeTool === toolNames.FRAMES} 
          onClick={() => handleToolClick(toolNames.FRAMES)} 
        />
        <ToolbarButton 
          icon={<Type size={20} />} 
          label="Text" 
          isActive={activeTool === toolNames.TEXT} 
          onClick={() => handleToolClick(toolNames.TEXT)} 
        />
        <ToolbarButton 
          icon={<Shapes size={20} />} 
          label="Elements" 
          isActive={activeTool === toolNames.ELEMENTS} 
          onClick={() => handleToolClick(toolNames.ELEMENTS)} 
        />
      </div>
      
      {/* Mobile Sliding Panel */}
      {isMobile && showMobilePanel && (
        <MobileOptionsPanel 
          activeTool={activeTool} 
          onClose={handleClosePanel} 
        />
      )}
    </>
  );
};

export default BottomToolbar;