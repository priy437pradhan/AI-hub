'use client';
import { useState } from 'react';

export function useFlipImage({ imageRef }) {
  const [isFlippedHorizontally, setIsFlippedHorizontally] = useState(false);
  const [isFlippedVertically, setIsFlippedVertically] = useState(false);

  const performFlipBase = async (direction) => {
    if (!imageRef.current) return null;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    // Set canvas dimensions to match the image
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    // Save the current context state
    ctx.save();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply transformations based on direction
    if (direction === 'horizontal') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      setIsFlippedHorizontally(!isFlippedHorizontally);
    } else if (direction === 'vertical') {
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
      setIsFlippedVertically(!isFlippedVertically);
    }
    
    // Draw the image with the applied transformation
    ctx.drawImage(img, 0, 0);
    
    // Restore the context to its original state
    ctx.restore();
    
    // Convert canvas to data URL and return
    return canvas.toDataURL('image/jpeg');
  };

  return {
    isFlippedHorizontally,
    isFlippedVertically,
    performFlipBase
  };
}