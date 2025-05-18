import { useState, useCallback } from 'react';

export const useFrames = ({ imageRef, setImagePreview }) => {
  const [frameSettings, setFrameSettings] = useState({
    style: 'none',
    color: '#ffffff',
    width: 10,
    shadow: 0,
    spread: 0,
    shadowColor: '#000000'
  });

  const applyFrame = useCallback(async (frameStyle, frameColor = '#ffffff', frameWidth = 10) => {
    if (!imageRef.current || !frameStyle || frameStyle === 'none') {
      console.log('No image or frame style to apply');
      return null;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      // Wait for image to load if needed
      if (!img.complete) {
        await new Promise(resolve => {
          img.onload = resolve;
        });
      }

      // Calculate frame dimensions
      const frameThickness = frameWidth;
      const totalFrameWidth = frameThickness * 2;

      // Set canvas size to include frame
      canvas.width = img.naturalWidth + totalFrameWidth;
      canvas.height = img.naturalHeight + totalFrameWidth;

      // Apply frame based on style
      switch (frameStyle) {
        case 'thin-border':
          // Simple solid border
          ctx.fillStyle = frameColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, frameThickness, frameThickness);
          break;

        case 'thick-border':
          // Thick solid border
          ctx.fillStyle = frameColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Add inner border effect
          const innerBorder = frameThickness * 0.2;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(innerBorder, innerBorder, 
                      canvas.width - innerBorder * 2, 
                      canvas.height - innerBorder * 2);
          
          ctx.fillStyle = frameColor;
          ctx.fillRect(innerBorder * 2, innerBorder * 2, 
                      canvas.width - innerBorder * 4, 
                      canvas.height - innerBorder * 4);
          
          ctx.drawImage(img, frameThickness, frameThickness);
          break;

        case 'polaroid':
          // Polaroid style frame (larger bottom margin)
          const topMargin = frameThickness;
          const sideMargin = frameThickness;
          const bottomMargin = frameThickness * 3; // Larger bottom for polaroid effect
          
          canvas.width = img.naturalWidth + sideMargin * 2;
          canvas.height = img.naturalHeight + topMargin + bottomMargin;
          
          // White background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw image
          ctx.drawImage(img, sideMargin, topMargin);
          
          // Add subtle shadow effect
          ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
          ctx.shadowBlur = 5;
          ctx.shadowOffsetY = 3;
          break;

        default:
          // No frame
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);
          break;
      }

      // Convert canvas to blob URL
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        }, 'image/jpeg', 0.9);
      });

    } catch (error) {
      console.error('Error applying frame:', error);
      return null;
    }
  }, [imageRef, setImagePreview]);

  const applyFrameEffects = useCallback(async (shadow = 0, spread = 0, shadowColor = '#000000') => {
    if (!imageRef.current) {
      console.log('No image to apply effects to');
      return null;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      // Wait for image to load if needed
      if (!img.complete) {
        await new Promise(resolve => {
          img.onload = resolve;
        });
      }

      // Calculate shadow dimensions
      const shadowBlur = shadow;
      const shadowSpread = spread;
      const padding = shadowBlur + shadowSpread + 10; // Extra padding for shadow

      // Set canvas size to include shadow
      canvas.width = img.naturalWidth + padding * 2;
      canvas.height = img.naturalHeight + padding * 2;

      // Apply shadow effects
      if (shadow > 0) {
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = shadowSpread;
        ctx.shadowOffsetY = shadowSpread;
      }

      // Draw image with shadow
      ctx.drawImage(img, padding, padding);

      // Convert canvas to blob URL
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        }, 'image/jpeg', 0.9);
      });

    } catch (error) {
      console.error('Error applying frame effects:', error);
      return null;
    }
  }, [imageRef]);

  return {
    frameSettings,
    setFrameSettings,
    applyFrame,
    applyFrameEffects
  };
};