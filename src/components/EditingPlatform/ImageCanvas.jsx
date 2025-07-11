'use client';
import React, { useRef, useEffect, useState } from 'react';

export default function ImageCanvas({
  imagePreview,
  handleUploadClick,
  imageRef,
  activeTool,
  activeAdjustTool,
  setImagePreview,
  textElements,
  cropSettings = { x: 10, y: 10, width: 50, height: 50, isActive: false },
  updateTextElement,
  updateCropPosition = (x, y) => console.log('updateCropPosition not implemented:', x, y),
  updateCropDimensions = (width, height) => console.log('updateCropDimensions not implemented:', width, height),
  performCrop = (settings, src) => console.log('performCrop not implemented:', settings, src)
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoverHandle, setHoverHandle] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getCropStyle = () => ({
    left: `${cropSettings.x}%`,
    top: `${cropSettings.y}%`,
    width: `${cropSettings.width}%`,
    height: `${cropSettings.height}%`
  });

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('resize-handle')) return;
    e.preventDefault();
    setIsDragging(true);
    
    const bounds = containerRef.current.getBoundingClientRect();
    const startDragX = (e.clientX - bounds.left) * 100 / bounds.width - cropSettings.x;
    const startDragY = (e.clientY - bounds.top) * 100 / bounds.height - cropSettings.y;
    
    setDragStart({
      x: startDragX,
      y: startDragY
    });

    const handleGlobalMouseMove = (moveEvent) => {
      const currentBounds = containerRef.current?.getBoundingClientRect();
      if (!currentBounds) return;
      
      const x = Math.max(0, Math.min(100 - cropSettings.width, 
        ((moveEvent.clientX - currentBounds.left) * 100 / currentBounds.width) - startDragX));
      const y = Math.max(0, Math.min(100 - cropSettings.height, 
        ((moveEvent.clientY - currentBounds.top) * 100 / currentBounds.height) - startDragY));
      
      if (typeof updateCropPosition === 'function') {
        updateCropPosition(x, y);
      } else {
        console.warn('updateCropPosition is not a function');
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
  };

  const handleResize = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);

    const bounds = containerRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialSettings = { ...cropSettings };

    const onMouseMove = (moveEvent) => {
      const dx = ((moveEvent.clientX - startX) * 100) / bounds.width;
      const dy = ((moveEvent.clientY - startY) * 100) / bounds.height;

      let newX = initialSettings.x;
      let newY = initialSettings.y;
      let newWidth = initialSettings.width;
      let newHeight = initialSettings.height;

      if (direction.includes('right')) {
        newWidth = Math.min(100 - newX, Math.max(5, initialSettings.width + dx));
      }
      if (direction.includes('bottom')) {
        newHeight = Math.min(100 - newY, Math.max(5, initialSettings.height + dy));
      }
      if (direction.includes('left')) {
        const maxDx = initialSettings.width - 5;
        const constrainedDx = Math.min(maxDx, Math.max(-initialSettings.x, dx));
        newX = initialSettings.x + constrainedDx;
        newWidth = initialSettings.width - constrainedDx;
      }
      if (direction.includes('top')) {
        const maxDy = initialSettings.height - 5;
        const constrainedDy = Math.min(maxDy, Math.max(-initialSettings.y, dy));
        newY = initialSettings.y + constrainedDy;
        newHeight = initialSettings.height - constrainedDy;
      }

      if (typeof updateCropDimensions === 'function') {
        updateCropDimensions(newWidth, newHeight);
      }
      if (typeof updateCropPosition === 'function') {
        updateCropPosition(newX, newY);
      }
    };

    const onMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && cropSettings.isActive) {
        const imgSrc = imageRef.current?.src || '';
        performCrop(cropSettings, imgSrc);
      }
      if (e.key === 'Escape' && cropSettings.isActive) {
        // Cancel crop functionality could be added here
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cropSettings, imageRef, performCrop]);

  useEffect(() => {
    return () => {
      setIsDragging(false);
      setIsResizing(false);
    };
  }, []);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col relative overflow-hidden">
      {/* Animated background elements - hidden on mobile for performance */}
      <div className="absolute inset-0 opacity-30 hidden sm:block">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-green-200 to-teal-200 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col lg:flex-row flex-1 relative z-10">
        {/* Main Image Area */}
        <div className="flex-1 flex flex-col">
          <div
            className="flex-1 flex justify-center items-center bg-white/80 backdrop-blur-sm border border-dotted border-gray-300 shadow-lg relative overflow-hidden min-h-[60vh] lg:min-h-[calc(100vh-12rem)]"
            ref={containerRef}
          >
            {/* Subtle grid pattern - simplified on mobile */}
            <div className={`absolute inset-0 opacity-5 ${isMobile ? 'hidden' : ''}`} style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #6b7280 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}></div>
            
            {imagePreview ? (
              <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
                <div className="relative overflow-hidden shadow-2xl border border-white/20 rounded-lg max-w-full max-h-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    ref={imageRef}
                    onLoad={handleImageLoad}
                    className={`w-full h-auto max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain transition-all duration-700 ${
                      isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                    draggable={false}
                  />
                  
                  {/* Image overlay effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/5 pointer-events-none"></div>
                </div>
                
                {cropSettings?.isActive && (
                  <div
                    className={`absolute border-2 border-blue-500 bg-blue-500/10 backdrop-blur-sm${
                      isDragging ? 'cursor-grabbing shadow-2xl scale-105' : 'cursor-grab shadow-xl'
                    } ${isResizing ? 'shadow-2xl' : ''}`}
                    style={getCropStyle()}
                    onMouseDown={handleMouseDown}
                  >
                    {/* Enhanced crop overlay with animated grid */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="border border-blue-400/40 animate-pulse" />
                        ))}
                      </div>
                    </div>

                    {/* Resize handles - larger on mobile */}
                    <div
                      className={`resize-handle absolute -top-2 -left-2 ${isMobile ? 'w-8 h-8' : 'w-5 h-5'} bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white rounded-full cursor-nwse-resize shadow-lg hover:shadow-xl hover:scale-125 transition-all duration-200 animate-pulse`}
                      onMouseDown={(e) => handleResize(e, 'top-left')}
                      onMouseEnter={() => setHoverHandle('top-left')}
                      onMouseLeave={() => setHoverHandle(null)}
                      style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
                    />
                    <div
                      className={`resize-handle absolute -top-2 -right-2 ${isMobile ? 'w-8 h-8' : 'w-5 h-5'} bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white rounded-full cursor-nesw-resize shadow-lg hover:shadow-xl hover:scale-125 transition-all duration-200 animate-pulse`}
                      onMouseDown={(e) => handleResize(e, 'top-right')}
                      onMouseEnter={() => setHoverHandle('top-right')}
                      onMouseLeave={() => setHoverHandle(null)}
                      style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
                    />
                    <div
                      className={`resize-handle absolute -bottom-2 -left-2 ${isMobile ? 'w-8 h-8' : 'w-5 h-5'} bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white rounded-full cursor-nesw-resize shadow-lg hover:shadow-xl hover:scale-125 transition-all duration-200 animate-pulse`}
                      onMouseDown={(e) => handleResize(e, 'bottom-left')}
                      onMouseEnter={() => setHoverHandle('bottom-left')}
                      onMouseLeave={() => setHoverHandle(null)}
                      style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
                    />
                    <div
                      className={`resize-handle absolute -bottom-2 -right-2 ${isMobile ? 'w-8 h-8' : 'w-5 h-5'} bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white rounded-full cursor-nwse-resize shadow-lg hover:shadow-xl hover:scale-125 transition-all duration-200 animate-pulse`}
                      onMouseDown={(e) => handleResize(e, 'bottom-right')}
                      onMouseEnter={() => setHoverHandle('bottom-right')}
                      onMouseLeave={() => setHoverHandle(null)}
                      style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
                    />

                    {/* Edge handles - hidden on mobile for simplicity */}
                    {!isMobile && (
                      <>
                        <div
                          className="resize-handle absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-gradient-to-b from-blue-400 to-blue-600 border-2 border-white rounded-full cursor-n-resize shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
                          onMouseDown={(e) => handleResize(e, 'top')}
                          style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}
                        />
                        <div
                          className="resize-handle absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-gradient-to-t from-blue-400 to-blue-600 border-2 border-white rounded-full cursor-s-resize shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
                          onMouseDown={(e) => handleResize(e, 'bottom')}
                          style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}
                        />
                        <div
                          className="resize-handle absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-6 bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-white rounded-full cursor-w-resize shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
                          onMouseDown={(e) => handleResize(e, 'left')}
                          style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}
                        />
                        <div
                          className="resize-handle absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-6 bg-gradient-to-l from-blue-400 to-blue-600 border-2 border-white rounded-full cursor-e-resize shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
                          onMouseDown={(e) => handleResize(e, 'right')}
                          style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}
                        />
                      </>
                    )}

                    {/* Crop info tooltip - responsive positioning */}
                    <div className={`absolute ${isMobile ? '-top-16 left-1/2 transform -translate-x-1/2' : '-top-12 left-0'} bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-2xl border border-gray-700 backdrop-blur-sm z-10`}>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="font-semibold text-xs sm:text-sm">{Math.round(cropSettings.width)}% × {Math.round(cropSettings.height)}%</span>
                      </div>
                      <div className={`absolute -bottom-1 ${isMobile ? 'left-1/2 transform -translate-x-1/2' : 'left-4'} w-2 h-2 bg-gray-800 rotate-45`}></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-600 max-w-md mx-auto p-4 sm:p-8">
                <div className="mb-6 sm:mb-8 relative">
                  <div className="relative">
                    <svg className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-gray-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-100 to-transparent rounded-full blur-xl"></div>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Ready to Create
                </h3>
                <p className="text-gray-500 mb-2 text-base sm:text-lg">Upload an image to begin editing</p>
                <p className="text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8">Support for JPG, PNG, GIF, and WebP formats</p>
                <button 
                  onClick={handleUploadClick} 
                  className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 overflow-hidden transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Choose Image</span>
                  </div>
                </button>
                <div className="mt-4 sm:mt-6 text-xs text-gray-400">
                  Or drag and drop your image anywhere on this area
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Ad Section - Hidden on mobile, shown as sidebar on desktop */}
        <div className="hidden lg:flex lg:w-[200px] xl:w-[250px] bg-gradient-to-br from-white/80 via-gray-50/80 to-blue-50/80 backdrop-blur-sm border-l border-gray-200/50 items-center justify-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          <div className="relative text-center p-4 xl:p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 hover:bg-white/80 transition-all duration-300 group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <div className="w-12 h-12 xl:w-16 xl:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl mx-auto flex items-center justify-center shadow-lg">
                <span className="text-xl xl:text-2xl">📱</span>
              </div>
            </div>
            <div className="text-gray-700 text-xs xl:text-sm font-semibold mb-1">Premium Ad Space</div>
            <div className="text-gray-500 text-xs">200×400 pixels</div>
            <div className="mt-3 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Bottom Ad Section - Responsive height and layout */}
      <div className="w-full h-32 sm:h-40 lg:h-48 bg-gradient-to-r from-white/80 via-gray-50/80 to-purple-50/80 backdrop-blur-sm border-t border-gray-200/50 flex items-center justify-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="relative text-center p-4 sm:p-6 lg:p-8 bg-white/60 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-xl border border-white/30 hover:bg-white/80 transition-all duration-300 group">
          <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
            <div className="w-12 h-8 sm:w-16 sm:h-10 lg:w-20 lg:h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl lg:rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <span className="text-lg sm:text-xl lg:text-2xl">🖥️</span>
            </div>
          </div>
          <div className="text-gray-700 text-xs sm:text-sm font-semibold mb-1">Banner Advertisement</div>
          <div className="text-gray-500 text-xs">Responsive Banner</div>
          <div className="mt-2 sm:mt-3 lg:mt-4 w-full h-1 bg-gradient-to-r from-red-400 to-pink-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}