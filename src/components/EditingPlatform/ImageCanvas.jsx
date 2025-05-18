'use client';
import { useEffect, useState } from 'react';

export default function ImageCanvas({
  imagePreview,
  handleUploadClick,
  imageRef,
  activeTool,
  activeAdjustTool,
  setImagePreview,
  // Add text-related props
  textElements
}) {
  const [canvasEl, setCanvasEl] = useState(null);
  
  // Function to render text elements on the canvas for preview
  const renderTextOverlay = () => {
    if (!textElements || textElements.length === 0) return null;
    
    return textElements.map((element) => (
      <div
        key={element.id}
        className="absolute pointer-events-none select-none"
        style={{
          left: `${element.x}%`,
          top: `${element.y}%`,
          transform: 'translate(-50%, -50%)',
          color: element.color || '#ffffff',
          fontFamily: element.fontFamily || 'Arial',
          fontSize: `${element.fontSize || 24}px`,
          fontWeight: element.bold ? 'bold' : 'normal',
          fontStyle: element.italic ? 'italic' : 'normal',
          textDecoration: element.underline ? 'underline' : 'none',
          textShadow: element.shadow ? 
            `${element.shadowOffsetX || 1}px ${element.shadowOffsetY || 1}px ${element.shadowBlur || 2}px ${element.shadowColor || '#000000'}` : 
            'none',
          WebkitTextStroke: element.outline ? 
            `${element.outlineWidth || 1}px ${element.outlineColor || '#000000'}` : 
            'none'
        }}
      >
        {element.content}
      </div>
    ));
  };

  return (
    <div 
      className="flex-1 flex items-center justify-center dark:bg-dark-bg mx-20 my-28"
    >
      {!imagePreview ? (
        <div 
          onClick={handleUploadClick}
          className="w-full max-w-3xl aspect-auto border-2 border-dashed border-gray-300 dark:border-dark-border rounded-md flex flex-col items-center justify-center p-8 cursor-pointer"
        >
          <div className="mb-4">
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-gray-400 text-3xl">+</span>
            </div>
          </div>
          <p className="text-gray-700 dark:text-dark-text mb-4">Drag or upload your own images</p>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-md flex items-center">
            Open Image
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-full h-full flex items-center justify-center overflow-hidden">
          <div className="relative image-wrapper">
            <img 
              ref={imageRef}
              src={imagePreview}
              alt="Uploaded preview" 
              className="max-w-full max-h-full object-contain"
              style={{
                maxHeight: '70vh',
                width: 'auto'
              }}
            />
            
            {/* Text overlay elements */}
            {renderTextOverlay()}
            
            {/* Show text position indicator when text tool is active */}
            {activeTool === 'text' && (
              <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}