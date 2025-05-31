'use client';
import { useState, useCallback } from 'react';

// Improved useTextEditor hook
export const useTextEditor = ({ imageRef, setImagePreview }) => {
  const [textElements, setTextElements] = useState([]);
  const [textSettings, setTextSettings] = useState({
    content: '',
    fontFamily: 'Arial',
    fontSize: 24,
    color: '#ffffff',
    // Default position in the center
    x: 50, 
    y: 50,
    bold: false,
    italic: false,
    underline: false,
    shadow: false,
    shadowColor: '#000000',
    shadowBlur: 2,
    shadowOffsetX: 1,
    shadowOffsetY: 1,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 1
  });

  const addTextElement = useCallback(() => {
    if (!textSettings.content.trim()) return null;

    const newElement = {
      id: Date.now() + Math.random(),
      ...textSettings,
      // Add some offset if multiple texts to avoid perfect overlap
      x: textSettings.x + (textElements.length * 2 % 30),
      y: textSettings.y + (textElements.length * 2 % 20),
    };

    setTextElements(prev => [...prev, newElement]);
    
    // Reset content after adding but keep the style settings
    setTextSettings(prev => ({ ...prev, content: '' }));
    
    return newElement;
  }, [textSettings, textElements.length]);

  const removeTextElement = useCallback((elementId) => {
    setTextElements(prev => prev.filter(el => el.id !== elementId));
  }, []);

  const updateTextElement = useCallback((elementId, updates) => {
    setTextElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
  }, []);

  const applyTextToImage = useCallback(async () => {
    if (!imageRef.current || textElements.length === 0) {
      return null;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      // Wait for image to load if needed
      await new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
        }
      });

      // Set canvas dimensions to match the image
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // Apply each text element
      textElements.forEach(element => {
        // Calculate actual pixel positions from percentages
        const actualX = (element.x / 100) * canvas.width;
        const actualY = (element.y / 100) * canvas.height;
        
        // Set up font style
        let fontStyle = '';
        if (element.bold) fontStyle += 'bold ';
        if (element.italic) fontStyle += 'italic ';
        
        ctx.font = `${fontStyle}${element.fontSize}px ${element.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Handle outline first if enabled (drawn behind the text)
        if (element.outline) {
          ctx.strokeStyle = element.outlineColor;
          ctx.lineWidth = element.outlineWidth;
          ctx.strokeText(element.content, actualX, actualY);
        }

        // Apply shadow if enabled
        if (element.shadow) {
          ctx.shadowColor = element.shadowColor;
          ctx.shadowBlur = element.shadowBlur;
          ctx.shadowOffsetX = element.shadowOffsetX;
          ctx.shadowOffsetY = element.shadowOffsetY;
        } else {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }

        // Draw the text
        ctx.fillStyle = element.color;
        ctx.fillText(element.content, actualX, actualY);

        // Apply underline if needed
        if (element.underline) {
          const textMetrics = ctx.measureText(element.content);
          const underlineY = actualY + element.fontSize * 0.1;
          const underlineStart = actualX - textMetrics.width / 2;
          const underlineEnd = actualX + textMetrics.width / 2;
          
          ctx.beginPath();
          ctx.moveTo(underlineStart, underlineY);
          ctx.lineTo(underlineEnd, underlineY);
          ctx.strokeStyle = element.color;
          ctx.lineWidth = Math.max(1, element.fontSize * 0.05);
          ctx.stroke();
        }

        // Reset shadow for next element
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });

      // Convert canvas to blob URL
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        }, 'image/jpeg', 0.95); // Higher quality
      });

    } catch (error) {
      console.error('Error applying text to image:', error);
      return null;
    }
  }, [textElements, imageRef]);

  const clearAllText = useCallback(() => {
    setTextElements([]);
  }, []);

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