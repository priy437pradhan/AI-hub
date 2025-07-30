// components/UndoRedoControls/UndoRedoControls.js
import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';

const UndoRedoControls = ({ 
  canUndo, 
  canRedo, 
  onUndo, 
  onRedo,
  className = "",
  showLabels = false,
  orientation = "horizontal"
}) => {
  const handleUndo = () => {
    if (canUndo) {
      onUndo();
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      onRedo();
    }
  };

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+Z or Cmd+Z for undo
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
      }
      
      // Ctrl+Y or Cmd+Shift+Z for redo
      if (
        ((event.ctrlKey || event.metaKey) && event.key === 'y') ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z')
      ) {
        event.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canUndo, canRedo]);

  const buttonBaseClasses = "flex items-center justify-center p-2 rounded-md transition-all duration-200 border";
  const horizontalClasses = orientation === "horizontal" ? "flex-row space-x-2" : "flex-col space-y-2";

  return (
    <div className={`flex ${horizontalClasses} ${className} md:p-0 sm:p-[15px]`}>
      <button
        onClick={handleUndo}
        disabled={!canUndo}
        className={`${buttonBaseClasses} ${
          canUndo
            ? "bg-blue-600 hover:bg-blue-700 border-blue-500 text-white shadow-md hover:shadow-lg"
            : "bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed"
        }`}
        title={`Undo${canUndo ? ' (Ctrl+Z)' : ''}`}
      >
        <Undo2 className="w-4 h-4" />
        {showLabels && <span className="ml-1 text-sm">Undo</span>}
      </button>

      <button
        onClick={handleRedo}
        disabled={!canRedo}
        className={`${buttonBaseClasses} ${
          canRedo
            ? "bg-blue-600 hover:bg-blue-700 border-blue-500 text-white shadow-md hover:shadow-lg"
            : "bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed"
        }`}
        title={`Redo${canRedo ? ' (Ctrl+Y)' : ''}`}
      >
        <Redo2 className="w-4 h-4" />
        {showLabels && <span className="ml-1 text-sm">Redo</span>}
      </button>
    </div>
  );
};

export default UndoRedoControls;