'use client'
import { useState, useEffect } from 'react';
import { Sliders, Wand2, Paintbrush, Smile, Frame, Type, Shapes } from 'lucide-react';
import UndoRedoControls from "../../../../app/store/UndoRedoControls";

import {
  useHistoryState,
} from '../../../../../src/app/store/hooks/redux';

// Import the useHistory hook that you're using in ToolPanel
import { useHistory } from '../../../../app/store/useHistory';

  
const BottomToolbar = ({ 
  activeTool, 
  setActiveTool, 
  setSidebarOpen, 
  isMobile, 
  setIsBottomSheetOpen,
}) => {
  // Add the missing history hook
  const history = useHistory();
  
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

  const handleToolClick = (tool) => {
    // Set the active tool
    setActiveTool(tool);
    
    // For mobile, don't open bottom sheet, just show inline
    if (!isMobile) {
      // For desktop, open the sidebar
      setSidebarOpen(true);
    }
  };

  const ToolbarButton = ({ icon, label, isActive, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`flex-shrink-0 flex flex-col items-center justify-center min-w-16 px-3 py-2 transition-colors duration-200 ${
          isActive 
            ? 'text-blue-400 bg-blue-500/10' 
            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
        }`}
      >
        <div className={`p-1 rounded-md transition-colors duration-200 ${
          isActive ? 'text-blue-400' : ''
        }`}>
          {icon}
        </div>
        <span className={`text-xs mt-1 font-medium transition-colors duration-200 ${
          isActive ? 'text-blue-400' : ''
        }`}>
          {label}
        </span>
      </button>
    );
  };

  const historyState = useHistoryState();
  
  const handleUndo = () => {
    history.undo(historyState);
  };

  const handleRedo = () => {
    history.redo(historyState);
  };

  return (
    <>
      <UndoRedoControls
        canUndo={historyState.canUndo}
        canRedo={historyState.canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        className="w-full"
        showLabels={!isMobile}
        orientation="horizontal"
      />
      <div className="bg-gray-900  border-gray-700 shadow-lg h-[110px] md:h-auto">
        {/* Horizontal scrollable navigation */}
        <div className="flex overflow-x-auto scrollbar-hide h-[68px] md:h-auto">
          <div className="flex min-w-full h-[64px] md:h-auto">
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
        </div>
    
        {/* Active tool indicator line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
      </div>
    </>
  );
};

export default BottomToolbar;