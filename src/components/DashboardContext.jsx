//component/DashboardContext
"use client"
import { useState } from 'react';
import Head from 'next/head';
import { 
  Search, Home, Camera, Wand2, Layout, Users, Image as ImageIcon, 
  Video, ShoppingBag, Grid, Star, Folder, Upload, MoreHorizontal,
  Sun, Moon, PlusCircle, ChevronDown, Edit3, Scissors, ArrowLeft,
  Crop, RotateCcw, Sliders,
  Component
} from 'lucide-react';

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('image');
  const [currentView, setCurrentView] = useState('home');
  const [selectedTool, setSelectedTool] = useState('crop'); 
  const [keepAspectRatio, setKeepAspectRatio] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 475, height: 475 });
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('freeform');
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleDimensionChange = (dimension, value) => {
    if (!value) return;
    
    const newValue = parseInt(value);
    
    if (dimension === 'width') {
      if (keepAspectRatio && dimensions.height) {
        const aspectRatio = dimensions.height / dimensions.width;
        setDimensions({ width: newValue, height: Math.floor(newValue * aspectRatio) });
      } else {
        setDimensions({ ...dimensions, width: newValue });
      }
    } else {
      if (keepAspectRatio && dimensions.width) {
        const aspectRatio = dimensions.width / dimensions.height;
        setDimensions({ height: newValue, width: Math.floor(newValue * aspectRatio) });
      } else {
        setDimensions({ ...dimensions, height: newValue });
      }
    }
  };

  const handleAspectRatioSelect = (ratioType) => {
    setSelectedAspectRatio(ratioType);
    
    // Set dimensions based on aspect ratio
    switch (ratioType) {
      case '1x1':
        setDimensions({ width: 475, height: 475 });
        break;
      case '3x2':
        setDimensions({ width: 600, height: 400 });
        break;
      case '2x3':
        setDimensions({ width: 400, height: 600 });
        break;
      case '4x3':
        setDimensions({ width: 600, height: 450 });
        break;
      case '3x4':
        setDimensions({ width: 450, height: 600 });
        break;
      case '16x9':
        setDimensions({ width: 640, height: 360 });
        break;
      case '9x16':
        setDimensions({ width: 360, height: 640 });
        break;
      case 'circle':
        setDimensions({ width: 500, height: 500 });
        break;
      default:
        // For freeform or original
        setDimensions({ width: 475, height: 475 });
    }
  };

  const sidebarItems = [
    { name: 'Home', icon: <Home size={18} /> },
    { name: 'AI Tools', icon: <Wand2 size={18} /> },
    { name: 'Graphic Designer', icon: <Layout size={18} /> },
    { name: 'E-commerce', icon: <ShoppingBag size={18} />, isNew: true },
  ];

  const imageTools = [
    { name: 'Photo Editing with AI', icon: <Edit3 size={18} />, action: () => setCurrentView('photoEditor') },
    { name: 'AI Image Generating', icon: <ImageIcon size={18} /> },
    { name: 'AI Effects & Filters', icon: <Wand2 size={18} /> },
    { name: 'Quick Design', icon: <Layout size={18} /> },
    { name: 'Simple Collage', icon: <Grid size={18} /> },
  ];

  const personalItems = [
    { name: 'My Projects', icon: <Folder size={18} /> },
    { name: 'My AI Creations', icon: <Wand2 size={18} /> },
    { name: 'My Favorites', icon: <Star size={18} /> },
    { name: 'Brand Kits', icon: <Scissors size={18} /> },
    { name: 'Uploads', icon: <Upload size={18} /> },
  ];

  const editorTools = [
    { name: 'Adjust', icon: <Sliders size={18} /> },
    { name: 'Crop', icon: <Crop size={18} />, active: selectedTool === 'crop' },
    { name: 'Effects', icon: <Wand2 size={18} /> },
    { name: 'Beauty', icon: <Users size={18} /> },
    { name: 'Frames', icon: <Grid size={18} /> },
    { name: 'Text', icon: <Edit3 size={18} /> },
    { name: 'Elements', icon: <ImageIcon size={18} /> },
    { name: 'Uploads', icon: <Upload size={18} /> },
  ];

  const suggestedTools = [
    { name: 'AI Photo Editor', icon: <Camera className="text-blue-500" /> },
    { name: 'AI Image Generator', icon: <Wand2 className="text-emerald-500" /> },
    { name: 'AI Headshot', icon: <Users className="text-purple-500" /> },
    { name: 'BG Remover', icon: <Scissors className="text-indigo-500" /> },
    { name: 'Graphic Designer', icon: <Layout className="text-red-400" /> },
    { name: 'Face Swap', icon: <ImageIcon className="text-pink-400" /> },
    { name: 'Collage Maker', icon: <Grid className="text-orange-400" /> },
    { name: 'Batch Editor', icon: <Edit3 className="text-cyan-400" /> },
    { name: 'AI Art Effects', icon: <Wand2 className="text-green-400" /> },
    { name: 'Face Mimic', icon: <Users className="text-purple-400" /> },
    { name: 'AI Hairstyle', icon: <Scissors className="text-pink-500" /> },
    { name: 'AI Slides', icon: <Layout className="text-blue-400" /> },
  ];

  const photoEditing = [
    { name: 'Edit a Photo', icon: 'placeholder' },
    { name: 'Action Figure', icon: 'placeholder', isNew: true },
    { name: 'Ghibli Style', icon: 'placeholder' },
    { name: 'AI Upscaler', icon: 'placeholder' },
    { name: 'Magic Eraser', icon: 'placeholder' },
    { name: 'Watermark Remover', icon: 'placeholder' },
  ];

  // Render the photo editor view
  const renderPhotoEditor = () => {
    return (
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-dark-bg">
        {/* Editor Top Bar */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setCurrentView('home')}
              className="mr-4 hover:bg-gray-800 p-2 rounded-md"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-300 to-primary-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <span className="ml-2 text-xl font-medium">AI hub</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600">
              Save
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded-lg font-medium hover:from-primary-500 hover:to-primary-600">
              Download
            </button>
          </div>
        </div>
        
        {/* Editor Content */}
        <div className="flex flex-1">
          {/* Tools Sidebar */}
          <div className="w-20 bg-gray-800 text-white flex flex-col">
            {editorTools.map((tool, index) => (
              <button
                key={index}
                onClick={() => setSelectedTool(tool.name.toLowerCase())}
                className={`flex flex-col items-center justify-center py-4 hover:bg-gray-700 ${
                  tool.active ? 'bg-gray-700' : ''
                }`}
              >
                {tool.icon}
                <span className="text-xs mt-1">{tool.name}</span>
              </button>
            ))}
          </div>
          
          {/* Tool Options */}
          <div className="w-72 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            {selectedTool === 'crop' && (
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Crop</h3>
                
                <div className="mb-6">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div 
                      className={`border rounded flex items-center justify-center p-4 cursor-pointer ${
                        selectedAspectRatio === 'freeform' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => handleAspectRatioSelect('freeform')}
                    >
                      <div className="w-full h-12 flex items-center justify-center">
                        <div className="border-2 w-12 h-8 flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Free</span>
                        </div>
                      </div>
                    </div>
                    <div 
                      className={`border rounded flex items-center justify-center p-4 cursor-pointer ${
                        selectedAspectRatio === '1x1' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => handleAspectRatioSelect('1x1')}
                    >
                      <div className="w-full h-12 flex items-center justify-center">
                        <div className="border-2 w-8 h-8 flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">1 x 1</span>
                        </div>
                      </div>
                    </div>
                    <div 
                      className={`border rounded flex items-center justify-center p-4 cursor-pointer ${
                        selectedAspectRatio === '3x2' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => handleAspectRatioSelect('3x2')}
                    >
                      <div className="w-full h-12 flex items-center justify-center">
                        <div className="border-2 w-12 h-8 flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">3 x 2</span>
                        </div>
                      </div>
                    </div>
                    <div 
                      className={`border rounded flex items-center justify-center p-4 cursor-pointer ${
                        selectedAspectRatio === '2x3' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => handleAspectRatioSelect('2x3')}
                    >
                      <div className="w-full h-12 flex items-center justify-center">
                        <div className="border-2 w-8 h-12 flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">2 x 3</span>
                        </div>
                      </div>
                    </div>
                    <div 
                      className={`border rounded flex items-center justify-center p-4 cursor-pointer ${
                        selectedAspectRatio === '4x3' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => handleAspectRatioSelect('4x3')}
                    >
                      <div className="w-full h-12 flex items-center justify-center">
                        <div className="border-2 w-12 h-9 flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">4 x 3</span>
                        </div>
                      </div>
                    </div>
                    <div 
                      className={`border rounded flex items-center justify-center p-4 cursor-pointer ${
                        selectedAspectRatio === '3x4' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => handleAspectRatioSelect('3x4')}
                    >
                      <div className="w-full h-12 flex items-center justify-center">
                        <div className="border-2 w-9 h-12 flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">3 x 4</span>
                        </div>
                      </div>
                    </div>
                    <div 
                      className={`border rounded flex items-center justify-center p-4 cursor-pointer ${
                        selectedAspectRatio === '16x9' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => handleAspectRatioSelect('16x9')}
                    >
                      <div className="w-full h-12 flex items-center justify-center">
                        <div className="border-2 w-16 h-9 flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">16 x 9</span>
                        </div>
                      </div>
                    </div>
                    <div 
                      className={`border rounded flex items-center justify-center p-4 cursor-pointer ${
                        selectedAspectRatio === '9x16' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => handleAspectRatioSelect('9x16')}
                    >
                      <div className="w-full h-12 flex items-center justify-center">
                        <div className="border-2 w-9 h-16 flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">9 x 16</span>
                        </div>
                      </div>
                    </div>
                    <div 
                      className={`border rounded flex items-center justify-center p-4 cursor-pointer ${
                        selectedAspectRatio === 'circle' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => handleAspectRatioSelect('circle')}
                    >
                      <div className="w-full h-12 flex items-center justify-center">
                        <div className="border-2 rounded-full w-10 h-10 flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Circle</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Size</h4>
                  <div className="flex items-center mb-4">
                    <div className="flex-1 mr-2">
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Width</label>
                      <input
                        type="number"
                        value={dimensions.width}
                        onChange={(e) => handleDimensionChange('width', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Height</label>
                      <input
                        type="number"
                        value={dimensions.height}
                        onChange={(e) => handleDimensionChange('height', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="keep-aspect-ratio"
                      checked={keepAspectRatio}
                      onChange={() => setKeepAspectRatio(!keepAspectRatio)}
                      className="mr-2"
                    />
                    <label htmlFor="keep-aspect-ratio" className="text-sm text-gray-600 dark:text-gray-300">
                      Keep Aspect Ratio
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Apply
                  </button>
                  <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center bg-gray-200 dark:bg-gray-900">
            <div className="relative" style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}>
              {/* Display upload area if no image */}
              <div className="absolute inset-0 border-2 border-dashed border-gray-400 dark:border-gray-600 flex flex-col items-center justify-center bg-white dark:bg-gray-800">
                <div className="p-6 flex flex-col items-center text-center">
                  <Upload size={32} className="text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">Drag or upload your own images</p>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4 hover:bg-blue-600">
                    Open Image
                  </button>
                </div>
              </div>
              
              {/* Crop handles would go here when an image is loaded */}
              {selectedAspectRatio === 'circle' && (
                <div className="absolute inset-0 rounded-full border-2 border-blue-500" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the main home view
  const renderHomeView = () => {
    return (
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-dark-bg overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border p-4 flex items-center justify-between">
          <div className="relative w-96">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search AI Hub tools"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-dark-card text-gray-800 dark:text-dark-text rounded-lg border-none focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded-lg font-medium hover:from-primary-500 hover:to-primary-600">
              Up to 30% Off
            </button>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-card rounded-lg">
                <Upload size={20} />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-card rounded-lg">
                <MoreHorizontal size={20} />
              </button>
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300">
                <span>S</span>
              </div>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-purple-900 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between w-full">
              <div className="ml-8 md:ml-16">
                <h1 className="text-4xl font-bold flex items-center">
                  <span className="text-red-500">🔥</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Ghibli</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Style</span>
                </h1>
              </div>
              <div className="hidden md:block relative w-1/3">
                <div className="w-64 h-64 absolute right-0 -bottom-16">
                  {/* Placeholder for character image */}
                  <div className="w-full h-full bg-gradient-to-b from-transparent to-blue-100 dark:to-blue-900 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="bg-white dark:bg-dark-card rounded-t-lg shadow-lg flex p-1">
              <button 
                onClick={() => setActiveTab('image')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                  activeTab === 'image' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <ImageIcon size={18} />
                <span>Image</span>
              </button>
              <button 
                onClick={() => setActiveTab('video')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                  activeTab === 'video' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Video size={18} />
                <span>Video</span>
              </button>
              <button 
                onClick={() => setActiveTab('commerce')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                  activeTab === 'commerce' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <ShoppingBag size={18} />
                <span>E-commerce</span>
                <span className="ml-1 px-1.5 py-0.5 text-xs font-medium rounded bg-primary-500 text-white">
                  NEW
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Suggestions Section */}
          <div className="mb-12">
            <h2 className="text-xl font-medium text-gray-800 dark:text-dark-text mb-6">You might want to try...</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {suggestedTools.map((tool, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-dark-card rounded-lg p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer border border-gray-100 dark:border-dark-border"
                >
                  <div className="w-12 h-12 flex items-center justify-center mb-3">
                    {tool.icon}
                  </div>
                  <span className="text-sm text-center text-gray-700 dark:text-dark-text">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Editing Section */}
          <div>
            <h2 className="text-xl font-medium text-gray-800 dark:text-dark-text mb-6">Photo Editing with AI</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {photoEditing.map((tool, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-dark-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 dark:border-dark-border"
                  onClick={() => setCurrentView('photoEditor')}
                >
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 relative">
                    {index === 0 && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg w-16 h-16 flex items-center justify-center">
                          <PlusCircle size={24} className="text-gray-400" />
                        </div>
                      </div>
                    )}
                    {tool.isNew && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded bg-primary-500 text-white">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-dark-text">{tool.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex h-screen w-full ${darkMode ? 'dark' : ''}`}>
      <Head>
        <title>AI hub </title>
        <meta name="description" content="Next.js and Tailwind CSS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sidebar - Only show on home view */}
      {currentView === 'home' && (
  <div className="w-64 border-r border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg flex flex-col overflow-y-auto">
    {/* Logo */}
    <div className="p-4 border-b border-gray-200 dark:border-dark-border">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-300 to-primary-500 rounded-md flex items-center justify-center">
          <span className="text-white font-bold">f</span>
        </div>
        <span className="ml-2 text-xl font-medium text-gray-800 dark:text-dark-text">AI Hub</span>
      </div>
    </div>

    {/* Main Navigation */}
    <div className="py-4 flex-1">
      <nav>
        <ul>
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-card"
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
                {item.isNew && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs font-medium rounded bg-primary-500 text-white">
                    NEW
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Image Tools Section */}
        <div className="mt-4">
          <div className="px-4 flex items-center justify-between">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">IMAGE TOOLS</h3>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
          <ul className="mt-1">
            {imageTools.map((tool, index) => (
              <li key={index}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (tool.action) tool.action();
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-card"
                >
                  <span className="mr-3">{tool.icon}</span>
                  {tool.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Personal Section */}
        <div className="mt-4">
          <div className="px-4 flex items-center justify-between">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">MY AI Hub CLOUD</h3>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
          <ul className="mt-1">
            {personalItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-card"
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>

    {/* Footer */}
    <div className="p-4 border-t border-gray-200 dark:border-dark-border">
      <button
        onClick={toggleDarkMode}
        className="flex items-center justify-center w-full p-2 text-sm text-gray-700 dark:text-dark-text bg-gray-100 dark:bg-dark-card rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {darkMode ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>
  </div>
)}


{currentView === 'home' ? renderHomeView() : renderPhotoEditor()}
</div>
);
}