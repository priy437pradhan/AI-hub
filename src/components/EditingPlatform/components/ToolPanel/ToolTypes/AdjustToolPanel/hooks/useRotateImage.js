'use client';
import { useState } from 'react';

export function useRotateImage({ imageRef }) {
  const [rotationDegrees, setRotationDegrees] = useState(0);

  const performRotateBase = async (direction) => {
    if (!imageRef.current) return null;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    // For 90-degree rotations, we need to swap width and height
    const swapDimensions = direction === 'left' || direction === 'right';
    canvas.width = swapDimensions ? img.naturalHeight : img.naturalWidth;
    canvas.height = swapDimensions ? img.naturalWidth : img.naturalHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Move to the center of the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Rotate based on direction
    if (direction === 'left') {
      setRotationDegrees((prev) => (prev - 90) % 360);
      ctx.rotate(-Math.PI / 2);
    } else if (direction === 'right') {
      setRotationDegrees((prev) => (prev + 90) % 360);
      ctx.rotate(Math.PI / 2);
    }
    
    // Draw the image centered
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    
    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    return canvas.toDataURL('image/jpeg');
  };

  return {
    rotationDegrees,
    setRotationDegrees,
    performRotateBase
  };
}