'use client';
import { useState } from 'react';

// Basic Adjustments Hook
export function useBasicAdjust({ imageRef }) {
  const [basicAdjust, setBasicAdjust] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
    exposure: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    vibrance: 0,
    clarity: 0,
    dehaze: 0
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
        const brightnessFactor = adjustments.brightness * 2.55; // Convert to 0-255 range
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

      // Apply exposure (-100 to +100)
      if (adjustments.exposure !== 0) {
        const exposureFactor = Math.pow(2, adjustments.exposure / 25);
        r = Math.max(0, Math.min(255, r * exposureFactor));
        g = Math.max(0, Math.min(255, g * exposureFactor));
        b = Math.max(0, Math.min(255, b * exposureFactor));
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
      exposure: 0,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      vibrance: 0,
      clarity: 0,
      dehaze: 0
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
    hue: 0,
    luminance: 0
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
      if (adjustments.luminance !== 0) {
        const luminanceFactor = (adjustments.luminance + 100) / 100;
        r = Math.max(0, Math.min(255, r * luminanceFactor));
        g = Math.max(0, Math.min(255, g * luminanceFactor));
        b = Math.max(0, Math.min(255, b * luminanceFactor));
      }

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
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
      hue: 0,
      luminance: 0
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

// Vignette Hook
export function useVignette({ imageRef }) {
  const [vignette, setVignette] = useState({
    amount: 0,
    midpoint: 50,
    roundness: 0,
    feather: 50
  });

  const performVignette = async (vignetteSettings = vignette) => {
    if (!imageRef.current || vignetteSettings.amount === 0) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

    const amount = vignetteSettings.amount / 100;
    const midpoint = vignetteSettings.midpoint / 100;
    const feather = Math.max(0.1, vignetteSettings.feather / 100);

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        
        // Calculate distance from center
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy) / maxDistance;

        // Calculate vignette factor
        let vignetteFactor = 1;
        if (distance > midpoint) {
          const fadeDistance = (distance - midpoint) / (1 - midpoint);
          vignetteFactor = 1 - (amount * Math.pow(fadeDistance / feather, 2));
          vignetteFactor = Math.max(0, Math.min(1, vignetteFactor));
        }

        // Apply vignette
        data[index] *= vignetteFactor;     // Red
        data[index + 1] *= vignetteFactor; // Green
        data[index + 2] *= vignetteFactor; // Blue
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/jpeg');
  };

  const updateVignette = (property, value) => {
    setVignette(prev => ({ ...prev, [property]: value }));
  };

  const resetVignette = () => {
    setVignette({
      amount: 0,
      midpoint: 50,
      roundness: 0,
      feather: 50
    });
  };

  return {
    vignette,
    setVignette,
    updateVignette,
    resetVignette,
    performVignette
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
      x, y, width, height, // Source rectangle
      0, 0, width, height  // Destination rectangle
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