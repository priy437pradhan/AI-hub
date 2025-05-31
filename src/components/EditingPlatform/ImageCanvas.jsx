'use client';
import { useEffect, useState, useRef } from 'react';

export default function ImageCanvas({
  imagePreview,
  handleUploadClick,
  imageRef,
  activeTool,
  activeAdjustTool,
  setImagePreview,
  // Text-related props
  textElements,
  updateTextElement
}) {
  const [draggedElement, setDraggedElement] = useState(null);
  const imageContainerRef = useRef(null);
  
  // Handle starting text element drag
  const handleTextDragStart = (e, element) => {
    // Allow dragging only when text tool is active
    if (activeTool !== 'text') return;
    
    e.stopPropagation();
    e.preventDefault(); // Prevent default browser drag behavior
    setDraggedElement(element);
  };
  
  // Handle touch start for mobile devices
  const handleTextTouchStart = (e, element) => {
    if (activeTool !== 'text') return;
    
    e.stopPropagation();
    const touch = e.touches[0];
    if (touch) {
      setDraggedElement(element);
    }
  };
  
  // Handle drag movement
  const handleMouseMove = (e) => {
    if (!draggedElement || !imageContainerRef.current) return;
    
    // Get image container bounds
    const rect = imageContainerRef.current.getBoundingClientRect();
    
    // Calculate percentage position relative to image container
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Constrain within image boundaries (0-100%)
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));
    
    // Update element position
    updateTextElement(draggedElement.id, {
      x: boundedX,
      y: boundedY
    });
  };
  
  // Handle touch move for mobile devices
  const handleTouchMove = (e) => {
    if (!draggedElement || !imageContainerRef.current) return;
    
    // Prevent scrolling while dragging
    e.preventDefault();
    
    const touch = e.touches[0];
    if (touch) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      
      // Calculate percentage position relative to image container
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      
      // Constrain within image boundaries (0-100%)
      const boundedX = Math.max(0, Math.min(100, x));
      const boundedY = Math.max(0, Math.min(100, y));
      
      // Update element position
      updateTextElement(draggedElement.id, {
        x: boundedX,
        y: boundedY
      });
    }
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setDraggedElement(null);
  };
  
  // Setup and cleanup event listeners
  useEffect(() => {
    if (draggedElement) {
      // Mouse events
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleDragEnd);
      
      // Touch events
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
      document.addEventListener('touchcancel', handleDragEnd);
    }
    
    return () => {
      // Clean up all event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleDragEnd);
      document.removeEventListener('touchcancel', handleDragEnd);
    };
  }, [draggedElement]);
  
  // Function to render text elements on the canvas for preview
  const renderTextOverlay = () => {
    if (!textElements || textElements.length === 0) return null;
    
    return textElements.map((element) => (
      <div
        key={element.id}
        className={`absolute ${activeTool === 'text' ? 'cursor-move' : ''} select-none`}
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
            'none',
          zIndex: draggedElement && draggedElement.id === element.id ? 10 : 1,
          // Only show handles for text editing mode
          pointerEvents: activeTool === 'text' ? 'auto' : 'none'
        }}
        onMouseDown={(e) => handleTextDragStart(e, element)}
        onTouchStart={(e) => handleTextTouchStart(e, element)}
      >
        {element.content}
      </div>
    ));
  };

  // Empty or upload view
  if (!imagePreview) {
    return (
      <div className="flex-1 flex items-center justify-center mx-28 my-40 dark:bg-gray-800">
        <div 
          onClick={handleUploadClick}
          className="w-full max-w-3xl aspect-auto border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex flex-col items-center justify-center p-8 cursor-pointer bg-white dark:bg-gray-700"
        >
          <div className="mb-4">
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-gray-400 text-3xl">+</span>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">Drag or upload your own images</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md flex items-center transition-colors">
            Open Image
          </button>
        </div>
      </div>
    );
  }

  // Image view with text overlay
  return (
    <div className="flex-1 flex items-center justify-center mx-20 my-28">
      <div 
        className="relative w-full max-w-full h-full flex items-center justify-center overflow-hidden"
      >  
        <div 
          ref={imageContainerRef}
          className="relative image-wrapper"
        >
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
          
          {/* Text overlay elements with drag functionality */}
          {renderTextOverlay()}
        </div>
      </div>
    </div>
  );
}