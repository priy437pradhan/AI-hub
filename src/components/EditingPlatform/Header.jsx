'use client'
import { ChevronDown, Upload, Search, Download, Grid } from 'lucide-react';

export default function Header({ 
  isMobile, 
  sidebarOpen, 
  setSidebarOpen, 
  handleUploadClick, 
  downloadImage 
}) {
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
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <button className="hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-full">
          <Search size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <button 
          onClick={downloadImage}
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