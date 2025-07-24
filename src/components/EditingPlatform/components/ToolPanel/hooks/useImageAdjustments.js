'use client';
import { useState } from 'react';

// Basic Adjustments Hook
export function useBasicAdjust({ imageRef }) {
  const [basicAdjust, setBasicAdjust] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
  });

  const performBasicAdjust = async (adjustments = basicAdjust) => {
    if (!imageRef.current) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply adjustments to each pixel
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Apply brightness (-100 to +100)
      if (adjustments.brightness !== 0) {
        const brightnessFactor = adjustments.brightness * 2.55; 
        r = Math.max(0, Math.min(255, r + brightnessFactor));
        g = Math.max(0, Math.min(255, g + brightnessFactor));
        b = Math.max(0, Math.min(255, b + brightnessFactor));
      }

      // Apply contrast (-100 to +100)
      if (adjustments.contrast !== 0) {
        const contrastFactor = (259 * (adjustments.contrast + 255)) / (255 * (259 - adjustments.contrast));
        r = Math.max(0, Math.min(255, contrastFactor * (r - 128) + 128));
        g = Math.max(0, Math.min(255, contrastFactor * (g - 128) + 128));
        b = Math.max(0, Math.min(255, contrastFactor * (b - 128) + 128));
      }

      // Apply saturation (-100 to +100)
      if (adjustments.saturation !== 0) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const saturationFactor = (adjustments.saturation + 100) / 100;
        r = Math.max(0, Math.min(255, gray + saturationFactor * (r - gray)));
        g = Math.max(0, Math.min(255, gray + saturationFactor * (g - gray)));
        b = Math.max(0, Math.min(255, gray + saturationFactor * (b - gray)));
      }

    
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/jpeg');
  };

  const updateBasicAdjust = (property, value) => {
    setBasicAdjust(prev => ({ ...prev, [property]: value }));
  };

  const resetBasicAdjust = () => {
    setBasicAdjust({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpness: 0,
    
     
    });
  };

  return {
    basicAdjust,
    setBasicAdjust,
    updateBasicAdjust,
    resetBasicAdjust,
    performBasicAdjust
  };
}

// Color Adjustments Hook
export function useColorAdjust({ imageRef }) {
  const [colorAdjust, setColorAdjust] = useState({
    temperature: 0,
    tint: 0,
    invertcolors: 0,
    
  });

  const performColorAdjust = async (adjustments = colorAdjust) => {
    if (!imageRef.current) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Apply temperature (-100 to +100)
      if (adjustments.temperature !== 0) {
        const tempFactor = adjustments.temperature / 100;
        if (tempFactor > 0) {
          // Warmer - add red, reduce blue
          r = Math.min(255, r + tempFactor * 50);
          b = Math.max(0, b - tempFactor * 50);
        } else {
          // Cooler - add blue, reduce red
          r = Math.max(0, r + tempFactor * 50);
          b = Math.min(255, b - tempFactor * 50);
        }
      }
      if (adjustments.invertcolors !== 0) {
        const invertFactor = adjustments.invertcolors / 100;
        if (invertFactor > 0) {
          // Warmer - add red, reduce blue
          r = Math.min(255, r + invertFactor * 50);
          b = Math.max(0, b - invertFactor * 50);
        } else {
          // Cooler - add blue, reduce red
          r = Math.max(0, r + invertFactor * 50);
          b = Math.min(255, b - invertFactor * 50);
        }
      }

      // Apply tint (-100 to +100)
      if (adjustments.tint !== 0) {
        const tintFactor = adjustments.tint / 100;
        if (tintFactor > 0) {
          // Magenta tint
          r = Math.min(255, r + tintFactor * 30);
          b = Math.min(255, b + tintFactor * 30);
        } else {
          // Green tint
          g = Math.min(255, g - tintFactor * 30);
        }
      }

      // Apply hue shift (-100 to +100)
      if (adjustments.hue !== 0) {
        // Convert RGB to HSV, adjust hue, convert back
        const [h, s, v] = rgbToHsv(r, g, b);
        const newH = (h + (adjustments.hue * 3.6)) % 360; // 360 degrees for full range
        [r, g, b] = hsvToRgb(newH, s, v);
      }

      // Apply luminance (-100 to +100)
      // if (adjustments.luminance !== 0) {
      //   const luminanceFactor = (adjustments.luminance + 100) / 100;
      //   r = Math.max(0, Math.min(255, r * luminanceFactor));
      //   g = Math.max(0, Math.min(255, g * luminanceFactor));
      //   b = Math.max(0, Math.min(255, b * luminanceFactor));
      // }

      // data[i] = r;
      // data[i + 1] = g;
      // data[i + 2] = b;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/jpeg');
  };

  const updateColorAdjust = (property, value) => {
    setColorAdjust(prev => ({ ...prev, [property]: value }));
  };

  const resetColorAdjust = () => {
    setColorAdjust({
     temperature: 0,
    tint: 0,
    invertcolors: 0,
    
    });
  };

  return {
    colorAdjust,
    setColorAdjust,
    updateColorAdjust,
    resetColorAdjust,
    performColorAdjust
  };
}




export function useFineTune({ imageRef }) {
  const [fineTune, setFineTune] = useState({
    exposure: 0,
    highlights: 0,
    shadows: 0,
  });

  const performFineTune = async (adjustments = fineTune) => {
    if (!imageRef.current) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply adjustments to each pixel
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Calculate luminance for the pixel
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      const normalizedLuminance = luminance / 255;

      // Apply exposure (-100 to +100)
      if (adjustments.exposure !== 0) {
        const exposureFactor = Math.pow(2, adjustments.exposure / 50); // Exponential curve
        r = Math.max(0, Math.min(255, r * exposureFactor));
        g = Math.max(0, Math.min(255, g * exposureFactor));
        b = Math.max(0, Math.min(255, b * exposureFactor));
      }

      // Apply highlights (-100 to +100)
      if (adjustments.highlights !== 0) {
        // Affect brighter pixels more (luminance > 0.5)
        const highlightWeight = Math.max(0, (normalizedLuminance - 0.5) * 2);
        const highlightFactor = 1 + (adjustments.highlights / 100) * highlightWeight;
        
        if (normalizedLuminance > 0.5) {
          r = Math.max(0, Math.min(255, r * highlightFactor));
          g = Math.max(0, Math.min(255, g * highlightFactor));
          b = Math.max(0, Math.min(255, b * highlightFactor));
        }
      }

      // Apply shadows (-100 to +100)
      if (adjustments.shadows !== 0) {
        // Affect darker pixels more (luminance < 0.5)
        const shadowWeight = Math.max(0, (0.5 - normalizedLuminance) * 2);
        const shadowFactor = 1 + (adjustments.shadows / 100) * shadowWeight;
        
        if (normalizedLuminance < 0.5) {
          r = Math.max(0, Math.min(255, r * shadowFactor));
          g = Math.max(0, Math.min(255, g * shadowFactor));
          b = Math.max(0, Math.min(255, b * shadowFactor));
        }
      }

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/jpeg');
  };

  const updateFineTune = (property, value) => {
    setFineTune(prev => ({ ...prev, [property]: value }));
  };

  const resetFineTune = () => {
    setFineTune({
      exposure: 0,
      highlights: 0,
      shadows: 0,
    });
  };

  return {
    fineTune,
    setFineTune,
    updateFineTune,
    resetFineTune,
    performFineTune
  };
}
// Crop Hook
export function useCrop({ imageRef }) {
  const [cropSettings, setCropSettings] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    aspectRatio: 'freeform'
  });

  const performCrop = async (cropArea) => {
    if (!imageRef.current) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    const { x, y, width, height } = cropArea;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      x, y, width, height,
      0, 0, width, height  
    );

    return canvas.toDataURL('image/jpeg');
  };

  const updateCropSettings = (property, value) => {
    setCropSettings(prev => ({ ...prev, [property]: value }));
  };

  return {
    cropSettings,
    setCropSettings,
    updateCropSettings,
    performCrop
  };
}

// Helper functions for color conversion
function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  if (diff !== 0) {
    if (max === r) h = ((g - b) / diff) % 6;
    else if (max === g) h = (b - r) / diff + 2;
    else h = (r - g) / diff + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : diff / max;
  const v = max;

  return [h, s, v];
}

function hsvToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r, g, b;
  if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
  else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0];
  else if (h >= 120 && h < 180) [r, g, b] = [0, c, x];
  else if (h >= 180 && h < 240) [r, g, b] = [0, x, c];
  else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}