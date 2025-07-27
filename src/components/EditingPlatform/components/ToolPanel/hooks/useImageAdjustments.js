
// // useImageAdjustments.js file name
// 'use client';
// import { useState } from 'react';
// import { applyAllFiltersToCanvas } from '../../ToolPanel/utils/imageFilters';
// export function useBasicAdjust({ imageRef }) {
//   const [basicAdjust, setBasicAdjust] = useState({
//     brightness: 0,
//     contrast: 0,
//     saturation: 0,
//     sharpness: 0,
//   });

//   const performBasicAdjust = async (adjustments = basicAdjust) => {
//     if (!imageRef.current) return null;

//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     const img = imageRef.current;

//     canvas.width = img.naturalWidth;
//     canvas.height = img.naturalHeight;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.drawImage(img, 0, 0);

//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const data = imageData.data;

//     for (let i = 0; i < data.length; i += 4) {
//       let r = data[i];
//       let g = data[i + 1];
//       let b = data[i + 2];

//       // Apply brightness - same as file 1
//       if (adjustments.brightness !== 0) {
//         const brightnessFactor = adjustments.brightness * 2.55; 
//         r = Math.max(0, Math.min(255, r + brightnessFactor));
//         g = Math.max(0, Math.min(255, g + brightnessFactor));
//         b = Math.max(0, Math.min(255, b + brightnessFactor));
//       }

//       // Apply contrast - same as file 1
//       if (adjustments.contrast !== 0) {
//         const contrastFactor = (259 * (adjustments.contrast + 255)) / (255 * (259 - adjustments.contrast));
//         r = Math.max(0, Math.min(255, contrastFactor * (r - 128) + 128));
//         g = Math.max(0, Math.min(255, contrastFactor * (g - 128) + 128));
//         b = Math.max(0, Math.min(255, contrastFactor * (b - 128) + 128));
//       }

//       // Apply saturation - same as file 1
//       if (adjustments.saturation !== 0) {
//         const gray = 0.299 * r + 0.587 * g + 0.114 * b;
//         const saturationFactor = (adjustments.saturation + 100) / 100;
//         r = Math.max(0, Math.min(255, gray + saturationFactor * (r - gray)));
//         g = Math.max(0, Math.min(255, gray + saturationFactor * (g - gray)));
//         b = Math.max(0, Math.min(255, gray + saturationFactor * (b - gray)));
//       }

//       // Final assignment with rounding like file 1
//       data[i] = Math.round(r);
//       data[i + 1] = Math.round(g);
//       data[i + 2] = Math.round(b);
//     }

//     ctx.putImageData(imageData, 0, 0);
//     return canvas.toDataURL('image/jpeg', 0.9);
//   };

//   const updateBasicAdjust = (property, value) => {
//     setBasicAdjust(prev => ({ ...prev, [property]: value }));
//   };

//   const resetBasicAdjust = () => {
//     setBasicAdjust({
//       brightness: 0,
//       contrast: 0,
//       saturation: 0,
//       sharpness: 0,
//     });
//   };

//   return {
//     basicAdjust,
//     setBasicAdjust,
//     updateBasicAdjust,
//     resetBasicAdjust,
//     performBasicAdjust
//   };
// }

// // Color Adjustments Hook
// export function useColorAdjust({ imageRef }) {
//   const [colorAdjust, setColorAdjust] = useState({
//     temperature: 0,
//     tint: 0,
//     invertcolors: 0,
//   });

//  const performColorAdjust = async (adjustments = colorAdjust) => {
//   if (!imageRef.current) return null;

//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');
//   const img = imageRef.current;

//   // Create new image to get original source
//   const originalImg = new Image();
//   originalImg.crossOrigin = "anonymous";
  
//   return new Promise((resolve, reject) => {
//     originalImg.onload = () => {
//       try {
//         const result = applyAllFiltersToCanvas(
//           canvas, 
//           ctx, 
//           originalImg, 
//           { brightness: 0, contrast: 0, saturation: 0, sharpness: 0 }, // default basic adjust
//           adjustments,
//           { exposure: 0, highlights: 0, shadows: 0 } // default fineTune adjust
//         );
//         resolve(result);
//       } catch (error) {
//         reject(error);
//       }
//     };
//     originalImg.onerror = () => reject(new Error('Failed to load image'));
//     originalImg.src = img.getAttribute('data-original-src') || img.src;
//   });
// };

//   const updateColorAdjust = (property, value) => {
//     setColorAdjust(prev => ({ ...prev, [property]: value }));
//   };

//   const resetColorAdjust = () => {
//     setColorAdjust({
//       temperature: 0,
//       tint: 0,
//       invertcolors: 0,
//     });
//   };

//   return {
//     colorAdjust,
//     setColorAdjust,
//     updateColorAdjust,
//     resetColorAdjust,
//     performColorAdjust
//   };
// }

// export function usefineTune({ imageRef }) {
//   const [fineTune, setfineTune] = useState({
//     exposure: 0,
//     highlights: 0,
//     shadows: 0,
//   });

//  const performfineTune = async (adjustments = fineTune) => {
//   if (!imageRef.current) return null;

//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');
//   const img = imageRef.current;

//   // Create new image to get original source
//   const originalImg = new Image();
//   originalImg.crossOrigin = "anonymous";
  
//   return new Promise((resolve, reject) => {
//     originalImg.onload = () => {
//       try {
//         const result = applyAllFiltersToCanvas(
//           canvas, 
//           ctx, 
//           originalImg, 
//           { brightness: 0, contrast: 0, saturation: 0, sharpness: 0 }, // default basic adjust
//           { temperature: 0, tint: 0, invertcolors: 0 }, // default color adjust
//           adjustments
//         );
//         resolve(result);
//       } catch (error) {
//         reject(error);
//       }
//     };
//     originalImg.onerror = () => reject(new Error('Failed to load image'));
//     originalImg.src = img.getAttribute('data-original-src') || img.src;
//   });
// };

//   const updatefineTune = (property, value) => {
//     setfineTune(prev => ({ ...prev, [property]: value }));
//   };

//   const resetfineTune = () => {
//     setfineTune({
//       exposure: 0,
//       highlights: 0,
//       shadows: 0,
//     });
//   };

//   return {
//     fineTune,
//     setfineTune,
//     updatefineTune,
//     resetfineTune,
//     performfineTune
//   };
// }

// // Crop Hook (unchanged as it wasn't in file 1)
// export function useCrop({ imageRef }) {
//   const [cropSettings, setCropSettings] = useState({
//     x: 0,
//     y: 0,
//     width: 0,
//     height: 0,
//     aspectRatio: 'freeform'
//   });

//   const performCrop = async (cropArea) => {
//     if (!imageRef.current) return null;

//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     const img = imageRef.current;

//     const { x, y, width, height } = cropArea;

//     canvas.width = width;
//     canvas.height = height;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.drawImage(
//       img,
//       x, y, width, height,
//       0, 0, width, height  
//     );

//     return canvas.toDataURL('image/jpeg', 0.9);
//   };

//   const updateCropSettings = (property, value) => {
//     setCropSettings(prev => ({ ...prev, [property]: value }));
//   };

//   return {
//     cropSettings,
//     setCropSettings,
//     updateCropSettings,
//     performCrop
//   };
// }

// // Helper functions for color conversion (kept for potential future use)
// function rgbToHsv(r, g, b) {
//   r /= 255;
//   g /= 255;
//   b /= 255;

//   const max = Math.max(r, g, b);
//   const min = Math.min(r, g, b);
//   const diff = max - min;

//   let h = 0;
//   if (diff !== 0) {
//     if (max === r) h = ((g - b) / diff) % 6;
//     else if (max === g) h = (b - r) / diff + 2;
//     else h = (r - g) / diff + 4;
//   }
//   h = Math.round(h * 60);
//   if (h < 0) h += 360;

//   const s = max === 0 ? 0 : diff / max;
//   const v = max;

//   return [h, s, v];
// }

// function hsvToRgb(h, s, v) {
//   const c = v * s;
//   const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
//   const m = v - c;

//   let r, g, b;
//   if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
//   else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0];
//   else if (h >= 120 && h < 180) [r, g, b] = [0, c, x];
//   else if (h >= 180 && h < 240) [r, g, b] = [0, x, c];
//   else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c];
//   else [r, g, b] = [c, 0, x];

//   return [
//     Math.round((r + m) * 255),
//     Math.round((g + m) * 255),
//     Math.round((b + m) * 255)
//   ];
// }