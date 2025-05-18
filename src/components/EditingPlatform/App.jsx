'use client'
import { useState, useEffect } from 'react';
import BottomToolbar from './ToolPanel/BottomToolbar';
// We don't need to import BottomSheet anymore for mobile

const App = () => {
  const [activeTool, setActiveTool] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          Upload an image to edit
        </div>
      </div>
      
      {!isMobile && sidebarOpen && (
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gray-800 shadow-lg overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-medium">Tool Options</h2>
          </div>
        </div>
      )}
      
      <div className="h-16 bg-gray-800 border-t border-gray-700">
        <BottomToolbar 
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default App;