import { useState, useCallback } from 'react';

export const useBeautyFilters = ({ imageRef, setImagePreview }) => {
  const [beautySettings, setBeautySettings] = useState({});

  const applyBeautyFilter = useCallback(async (feature, settings) => {
    if (!imageRef.current) {
      console.error('No image reference available');
      return null;
    }

    try {
      // Create a canvas to apply the beauty filter
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      // Wait for image to load if needed
      await new Promise((resolve) => {
        if (img.complete && img.naturalHeight !== 0) {
          resolve();
        } else {
          img.onload = resolve;
        }
      });

      // Set canvas dimensions to match the image
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Clear the canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // Apply beauty filters based on feature and settings
      switch (feature) {
        case 'skin':
          applySkinFilters(ctx, canvas, settings);
          break;
        case 'eyes':
          applyEyeFilters(ctx, canvas, settings);
          break;
        case 'lips':
          applyLipFilters(ctx, canvas, settings);
          break;
        case 'face':
          applyFaceFilters(ctx, canvas, settings);
          break;
        case 'makeup':
          applyMakeupFilters(ctx, canvas, settings);
          break;
        default:
          console.warn(`Unknown beauty feature: ${feature}`);
          break;
      }

      // Convert canvas to blob and create URL
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, 'image/jpeg', 0.9);
      });

    } catch (error) {
      console.error('Error applying beauty filter:', error);
      return null;
    }
  }, [imageRef]);

  return {
    beautySettings,
    setBeautySettings,
    applyBeautyFilter
  };
};

// Helper functions for applying different beauty filters
const applySkinFilters = (ctx, canvas, settings) => {
  console.log('Applying skin filters with settings:', settings);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Apply skin smoothing (simplified blur effect)
  if (settings.smoothness > 0) {
    console.log('Applying smoothness:', settings.smoothness);
    const intensity = Math.max(0.5, settings.smoothness / 100 * 3);
    applySimpleBlur(imageData, intensity);
  }

  // Apply skin tone adjustment
  if (settings.tone !== 0) {
    console.log('Applying tone adjustment:', settings.tone);
    const toneAdjustment = settings.tone / 100;
    for (let i = 0; i < data.length; i += 4) {
      // Adjust warmth/coolness of skin tones
      data[i] = Math.min(255, Math.max(0, data[i] + toneAdjustment * 30)); // Red
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + toneAdjustment * 10)); // Green
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] - toneAdjustment * 20)); // Blue
    }
  }

  // Apply brightness for blemish removal effect
  if (settings.blemishRemoval > 0) {
    console.log('Applying blemish removal:', settings.blemishRemoval);
    const intensity = settings.blemishRemoval / 100;
    applyBrightnessAdjustment(imageData, intensity * 0.2);
  }

  ctx.putImageData(imageData, 0, 0);
};

const applyEyeFilters = (ctx, canvas, settings) => {
  console.log('Applying eye filters with settings:', settings);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Apply brightness for eye enhancement
  if (settings.brightness > 0) {
    const brightnessIncrease = (settings.brightness / 100) * 40;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] + brightnessIncrease);
      data[i + 1] = Math.min(255, data[i + 1] + brightnessIncrease);
      data[i + 2] = Math.min(255, data[i + 2] + brightnessIncrease);
    }
  }

  // Apply contrast for eye definition
  if (settings.whitening > 0) {
    const contrast = 1 + (settings.whitening / 100) * 0.3;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrast + 128));
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrast + 128));
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrast + 128));
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

const applyLipFilters = (ctx, canvas, settings) => {
  console.log('Applying lip filters with settings:', settings);
  
  if (settings.color && settings.color !== '#FF6B81') {
    // Apply color overlay effect
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Convert hex color to RGB
    const hex = settings.color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Apply color tint with low opacity
    const opacity = 0.3;
    for (let i = 0; i < data.length; i += 4) {
      // Detect reddish areas (simplified lip detection)
      const currentR = data[i];
      const currentG = data[i + 1];
      const currentB = data[i + 2];
      
      // Check if this pixel might be lip-like (reddish)
      if (currentR > currentG && currentR > currentB) {
        data[i] = Math.min(255, currentR + (r - currentR) * opacity);
        data[i + 1] = Math.min(255, currentG + (g - currentG) * opacity);
        data[i + 2] = Math.min(255, currentB + (b - currentB) * opacity);
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }

  // Apply gloss effect (increase brightness slightly)
  if (settings.gloss > 50) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const glossIntensity = (settings.gloss - 50) / 100;
    applyBrightnessAdjustment(imageData, glossIntensity * 0.2);
    ctx.putImageData(imageData, 0, 0);
  }
};

const applyFaceFilters = (ctx, canvas, settings) => {
  console.log('Applying face filters with settings:', settings);
  // Face contouring would require sophisticated algorithms
  // For now, apply basic adjustments
  
  if (settings.slimming > 0 || settings.jawline > 0) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Apply slight contrast adjustment for contouring effect
    const contrast = 1 + (Math.max(settings.slimming, settings.jawline) / 100) * 0.2;
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrast + 128));
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrast + 128));
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrast + 128));
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
};

const applyMakeupFilters = (ctx, canvas, settings) => {
  console.log('Applying makeup filters with settings:', settings);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const intensity = settings.intensity / 100;
  
  // Enhance contrast and saturation for makeup effect
  for (let i = 0; i < data.length; i += 4) {
    // Increase contrast
    const contrast = 1 + (intensity * 0.3);
    data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrast + 128));
    data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrast + 128));
    data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrast + 128));
    
    // Increase saturation slightly
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const saturation = 1 + (intensity * 0.2);
    data[i] = Math.min(255, Math.max(0, avg + (data[i] - avg) * saturation));
    data[i + 1] = Math.min(255, Math.max(0, avg + (data[i + 1] - avg) * saturation));
    data[i + 2] = Math.min(255, Math.max(0, avg + (data[i + 2] - avg) * saturation));
  }

  ctx.putImageData(imageData, 0, 0);
};

// Simple blur implementation
const applySimpleBlur = (imageData, radius) => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Create a copy of the original data
  const original = new Uint8ClampedArray(data);
  
  const kernelSize = Math.ceil(radius) | 1; // Ensure odd number
  const half = Math.floor(kernelSize / 2);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0;
      
      for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          const px = Math.min(width - 1, Math.max(0, x + kx));
          const py = Math.min(height - 1, Math.max(0, y + ky));
          const pi = (py * width + px) * 4;
          
          r += original[pi];
          g += original[pi + 1];
          b += original[pi + 2];
          count++;
        }
      }
      
      const i = (y * width + x) * 4;
      data[i] = r / count;
      data[i + 1] = g / count;
      data[i + 2] = b / count;
    }
  }
};

// Brightness adjustment helper
const applyBrightnessAdjustment = (imageData, intensity) => {
  const data = imageData.data;
  const brightness = intensity * 50;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] + brightness));     // Red
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightness)); // Green
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightness)); // Blue
  }
};