'use client'

import { useState, useRef } from 'react';

export function useImageTransform(imageRef) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [flipped, setFlipped] = useState({ horizontal: false, vertical: false });
  const [activeTransformTool, setActiveTransformTool] = useState(null);

  // Function to perform image rotation
  const performRotate = (angle) => {
    if (!imageRef.current) {
      return null;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    // Determine if we need to swap dimensions based on angle
    const absAngle = Math.abs(angle % 360);
    const swapDimensions = absAngle === 90 || absAngle === 270;
    
    // Set canvas dimensions
    canvas.width = swapDimensions ? img.naturalHeight : img.naturalWidth;
    canvas.height = swapDimensions ? img.naturalWidth : img.naturalHeight;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Move to the center of the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Rotate the canvas
    ctx.rotate((angle * Math.PI) / 180);
    
    // Apply any existing flips
    ctx.scale(
      flipped.horizontal ? -1 : 1,
      flipped.vertical ? -1 : 1
    );

    // Draw the image, centered
    ctx.drawImage(
      img,
      -img.naturalWidth / 2,
      -img.naturalHeight / 2,
      img.naturalWidth,
      img.naturalHeight
    );

    // Convert to data URL and set as new image source
    const dataUrl = canvas.toDataURL('image/png');
    
    // Update the rotation state
    setRotationAngle((prevAngle) => (prevAngle + angle) % 360);
    
    return dataUrl;
  };

  // Function to perform image flipping
  const performFlip = (direction) => {
    if (!imageRef.current) {
      return null;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update flip state based on direction
    const newFlipped = { ...flipped };
    if (direction === 'horizontal') {
      newFlipped.horizontal = !newFlipped.horizontal;
    } else if (direction === 'vertical') {
      newFlipped.vertical = !newFlipped.vertical;
    }

    // Set transformation origin to center
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Apply rotation if any
    if (rotationAngle !== 0) {
      ctx.rotate((rotationAngle * Math.PI) / 180);
    }
    
    // Apply flips
    ctx.scale(
      newFlipped.horizontal ? -1 : 1,
      newFlipped.vertical ? -1 : 1
    );

    // Draw the image centered
    ctx.drawImage(
      img,
      -img.naturalWidth / 2,
      -img.naturalHeight / 2,
      img.naturalWidth,
      img.naturalHeight
    );

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');
    
    // Update the flip state
    setFlipped(newFlipped);
    
    return dataUrl;
  };

  return {
    rotationAngle,
    setRotationAngle,
    flipped,
    setFlipped,
    performRotate,
    performFlip,
    activeTransformTool,
    setActiveTransformTool
  };
}