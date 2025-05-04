'use client'

import { useState, useRef, useEffect } from 'react';

export function useFlipImage({ 
  imageRef,
  imagePreview,
  setImagePreview 
}) {
  // Flip state
  const [isFlippedHorizontal, setIsFlippedHorizontal] = useState(false);
  const [isFlippedVertical, setIsFlippedVertical] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  
  // Store the original image when imagePreview changes
  useEffect(() => {
    if (imagePreview && !originalImage) {
      setOriginalImage(imagePreview);
    }
  }, [imagePreview, originalImage]);

  // Function to flip the image horizontally
  const flipHorizontal = () => {
    if (!imageRef.current || !imagePreview) return;
    
    setIsFlipping(true);
    
    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Wait for image to load completely
    const performFlip = () => {
      // Set canvas dimensions to match image
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // Apply horizontal flip transformation
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      
      // Draw the image with the transformation applied
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const flippedImageUrl = canvas.toDataURL('image/png');
      
      // Update state
      setIsFlippedHorizontal(!isFlippedHorizontal);
      setImagePreview(flippedImageUrl);
      setIsFlipping(false);
    };
    
    // Check if image is already loaded
    if (img.complete) {
      performFlip();
    } else {
      img.onload = performFlip;
    }
  };
  
  // Function to flip the image vertically
  const flipVertical = () => {
    if (!imageRef.current || !imagePreview) return;
    
    setIsFlipping(true);
    
    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Wait for image to load completely
    const performFlip = () => {
      // Set canvas dimensions to match image
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // Apply vertical flip transformation
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
      
      // Draw the image with the transformation applied
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const flippedImageUrl = canvas.toDataURL('image/png');
      
      // Update state
      setIsFlippedVertical(!isFlippedVertical);
      setImagePreview(flippedImageUrl);
      setIsFlipping(false);
    };
    
    // Check if image is already loaded
    if (img.complete) {
      performFlip();
    } else {
      img.onload = performFlip;
    }
  };
  
  // Function to reset the image to its original state
  const resetFlip = () => {
    if (originalImage) {
      setImagePreview(originalImage);
      setIsFlippedHorizontal(false);
      setIsFlippedVertical(false);
    }
  };
  
  return {
    isFlippedHorizontal,
    isFlippedVertical,
    isFlipping,
    flipHorizontal,
    flipVertical,
    resetFlip
  };
}
