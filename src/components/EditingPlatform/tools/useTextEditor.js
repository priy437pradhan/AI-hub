// This is a very basic implementation of the useTextEditor hook
// We'll focus on the most important functionality

import { useState, useRef } from 'react';

export const useTextEditor = ({ imageRef, setImagePreview }) => {
  const [textElements, setTextElements] = useState([]);
  const [textSettings, setTextSettings] = useState({
    content: 'Sample Text',
    fontFamily: 'Arial',
    fontSize: 24,
    color: '#ffffff',
    x: 50, // percentage
    y: 50, // percentage
    bold: false,
    italic: false,
    underline: false,
    shadow: false,
    shadowBlur: 2,
    shadowOffsetX: 1,
    shadowOffsetY: 1,
    shadowColor: '#000000',
    outline: false,
    outlineWidth: 1,
    outlineColor: '#000000',
  });
  
  // Counter for unique IDs
  const idCounter = useRef(0);

  // Add text element with current settings
  const addTextElement = () => {
    if (!textSettings.content?.trim()) return null;
    
    const newElement = {
      id: `text-${idCounter.current++}`,
      ...textSettings
    };
    
    setTextElements(prev => [...prev, newElement]);
    return newElement;
  };

  // Remove text element by ID
  const removeTextElement = (id) => {
    setTextElements(prev => prev.filter(element => element.id !== id));
  };

  // Update a specific text element
  const updateTextElement = (id, updates) => {
    setTextElements(prev => 
      prev.map(element => 
        element.id === id ? { ...element, ...updates } : element
      )
    );
  };

  // Apply text to image using canvas
  const applyTextToImage = async () => {
    if (!imageRef.current || textElements.length === 0) return null;
    
    const img = imageRef.current;
    
    // Create a canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to image dimensions
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Apply text elements
    textElements.forEach(element => {
      // Calculate positions based on percentages
      const x = (element.x / 100) * canvas.width;
      const y = (element.y / 100) * canvas.height;
      
      // Apply text styling
      ctx.font = `${element.italic ? 'italic ' : ''}${element.bold ? 'bold ' : ''}${element.fontSize}px ${element.fontFamily}`;
      ctx.fillStyle = element.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Handle shadow
      if (element.shadow) {
        ctx.shadowColor = element.shadowColor || '#000000';
        ctx.shadowBlur = element.shadowBlur || 2;
        ctx.shadowOffsetX = element.shadowOffsetX || 1;
        ctx.shadowOffsetY = element.shadowOffsetY || 1;
      } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
      
      // Handle outline/stroke
      if (element.outline) {
        ctx.lineWidth = element.outlineWidth || 1;
        ctx.strokeStyle = element.outlineColor || '#000000';
        ctx.strokeText(element.content, x, y);
      }
      
      // Fill the text
      ctx.fillText(element.content, x, y);
    });
    
    // Convert canvas to image URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    
    // Update the image preview
    setImagePreview(dataUrl);
    
    return dataUrl;
  };

  // Clear all text elements
  const clearAllText = () => {
    setTextElements([]);
  };

  return {
    textElements,
    textSettings,
    setTextSettings,
    addTextElement,
    removeTextElement,
    updateTextElement,
    applyTextToImage,
    clearAllText
  };
};