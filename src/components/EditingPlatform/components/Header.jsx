// Fixed Header.jsx component
'use client'
import { ChevronDown, Upload, Search, Download, Grid, RotateCcw } from 'lucide-react';
// ADD THIS:
import { useImageProcessor } from '../../../components/EditingPlatform/components/ToolPanel/hooks/useImageProcessor';

export default function Header({ 
  isMobile, 
  sidebarOpen,
  setSidebarOpen,
  handleUploadClick, 
  downloadImage,
  resetToOriginal,
  imageRef,
  filters,
  currentBaseImage,
  imagePreview // Add this prop to get the current preview
}) {

  const downloadImageWithFilters = async () => {
    // Priority 1: Download what's currently being shown (imagePreview)
    if (imagePreview) {
      const link = document.createElement('a');
      link.download = 'edited-image.jpg';
      link.href = imagePreview;
      link.click();
      return;
    }

    // Fallback: If no preview, try with current base image
    if (!imageRef.current || !currentBaseImage) {
      alert("Please upload an image first.");
      return;
    }

    try {
      // Check if any filters are applied
      const hasFilterChanges = Object.values(filters).some(category => 
        Object.values(category).some(value => typeof value === 'number' && value !== 0)
      );

      // If no filters applied, download the current base image
      if (!hasFilterChanges) {
        const link = document.createElement('a');
        link.download = 'edited-image.jpg';
        link.href = currentBaseImage;
        link.click();
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Create a new image element to get the current base image
      const baseImg = new Image();
      baseImg.crossOrigin = "anonymous";
      
      const processedDataURL = await processImage(imageRef, canvas, ctx);

    
      const link = document.createElement('a');
      link.download = 'edited-image.jpg';
      link.href = processedDataURL;
      link.click();
      
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to original download method
      if (downloadImage) {
        downloadImage();
      } else {
        alert('Failed to download image. Please try again.');
      }
    }
  };
 const { processImage } = useImageProcessor();
  return (
    <header className="flex items-center justify-between bg-white dark:bg-dark-card px-4 py-3 border-b border-gray-200 dark:border-dark-border">
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          <span className="ml-2 font-bold text-xl dark:text-dark-text">AI Hub</span>
        </div>
        
        <button className="hidden md:flex items-center px-3 py-1 text-sm bg-transparent hover:bg-gray-100 dark:hover:bg-dark-border rounded">
          <span className="dark:text-dark-text">AI Photo Editor</span>
          <ChevronDown size={16} className="ml-1 text-gray-600 dark:text-gray-400" />
        </button>
        
        <button 
          onClick={handleUploadClick}
          className="flex items-center px-2 md:px-3 py-1 text-sm bg-transparent hover:bg-gray-100 dark:hover:bg-dark-border rounded"
        >
          <Upload size={16} className="mr-1 text-gray-600 dark:text-gray-400" />
          <span className="dark:text-dark-text">Open</span>
          {!isMobile && (
            <>
              <span className="dark:text-dark-text ml-1">Image</span>
              <ChevronDown size={16} className="ml-1 text-gray-600 dark:text-gray-400" />
            </>
          )}
        </button>

        {resetToOriginal && (
          <button 
            onClick={resetToOriginal}
            className="flex items-center px-2 md:px-3 py-1 text-sm bg-transparent hover:bg-gray-100 dark:hover:bg-dark-border rounded"
            title="Reset to Original"
          >
            <RotateCcw size={16} className="mr-1 text-gray-600 dark:text-gray-400" />
            {!isMobile && <span className="dark:text-dark-text">Reset</span>}
          </button>
        )}
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        <button className="hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-full">
          <Search size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        
        <button 
          onClick={downloadImageWithFilters}
          className="flex items-center px-2 md:px-4 py-1 md:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Download size={16} className="mr-1 md:mr-2" />
          <span>Download</span>
        </button>
        
        <button className="hidden md:flex items-center px-3 py-1 bg-transparent border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-border rounded-md">
          <span className="text-gray-700 dark:text-gray-300">Up to 30% Off</span>
        </button>
        
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    </header>
  );
}