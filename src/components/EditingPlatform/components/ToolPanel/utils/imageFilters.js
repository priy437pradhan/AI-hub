// Import all filter functions from their respective components
import { applyBasicFilters } from '../ToolTypes/AdjustToolPanel/components/BasicAdjustComponent';
import { applyColorFilters } from '../ToolTypes/AdjustToolPanel/components/ColorAdjustComponent';
import { applyFineTuneFilters } from '../ToolTypes/AdjustToolPanel/components/FineTuneComponent';
import { applyStructureFilters } from '../ToolTypes/AdjustToolPanel/components/StructureComponent';
import { applyDenoiseFilters, shouldApplyDenoise } from '../ToolTypes/AdjustToolPanel/components/DenoiseComponent';
import { applyVignetteFilter, hasVignetteAdjustments } from '../ToolTypes/AdjustToolPanel/components/VignetteComponent';
import { applyMosaicFilter, hasMosaicAdjustments } from '../ToolTypes/AdjustToolPanel/components/MosaicComponent';
import { applyBlurFilter, hasBlurAdjustments } from '../ToolTypes/AdjustToolPanel/components/BlurComponent';

export const applyAllFiltersToCanvas = (canvas, ctx, originalImg, basicAdjust, colorAdjust, fineTuneAdjust, structureAdjust, denoiseAdjust, vignetteAdjust, mosaicAdjust, blurAdjust) => {
  console.log('=== FILTER DEBUG START ===');
  console.log('basicAdjust:', basicAdjust);
  console.log('colorAdjust:', colorAdjust);
  console.log('fineTuneAdjust:', fineTuneAdjust);
  console.log('structureAdjust:', structureAdjust);
  console.log('denoiseAdjust:', denoiseAdjust);
  console.log('vignetteAdjust:', vignetteAdjust);
  console.log('mosaicAdjust:', mosaicAdjust);
  console.log('blurAdjust:', blurAdjust);
  
  // Set canvas dimensions
  canvas.width = originalImg.naturalWidth || originalImg.width;
  canvas.height = originalImg.naturalHeight || originalImg.height;

  // Clear and draw original image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(originalImg, 0, 0);

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Create a copy of original data for noise reduction calculations
  const originalData = new Uint8ClampedArray(data);

  // Apply denoise filters FIRST before other filters to avoid interference
  if (shouldApplyDenoise(denoiseAdjust)) {
    console.log('APPLYING DENOISE FILTERS...');
    applyDenoiseFilters(data, originalData, canvas.width, canvas.height, denoiseAdjust);
    console.log('DENOISE FILTERS APPLIED');
  }
  
    if (basicAdjust && (basicAdjust.brightness !== 0 || basicAdjust.contrast !== 0 || basicAdjust.saturation !== 0 || basicAdjust.sharpness !== 0)) {
    console.log('Applying basic filters:', basicAdjust);
    applyBasicFilters(data, basicAdjust);
  }

  // Apply basic adjustments (brightness, contrast, saturation, sharpness)
  if (basicAdjust && (basicAdjust.brightness !== 0 || basicAdjust.contrast !== 0 || basicAdjust.saturation !== 0 || basicAdjust.sharpness !== 0)) {
    console.log('Applying basic filters:', basicAdjust);
    applyBasicFilters(data, basicAdjust);
  }

  // Apply color adjustments (temperature, tint, invert colors)
  if (colorAdjust && (colorAdjust.temperature !== 0 || colorAdjust.tint !== 0 || colorAdjust.invertcolors !== 0)) {
    console.log('Applying color filters:', colorAdjust);
    applyColorFilters(data, colorAdjust);
  }

  // Apply fine-tune adjustments (exposure, highlights, shadows)
  if (fineTuneAdjust && (fineTuneAdjust.exposure !== 0 || fineTuneAdjust.highlights !== 0 || fineTuneAdjust.shadows !== 0)) {
    console.log('Applying fine-tune filters:', fineTuneAdjust);
    applyFineTuneFilters(data, fineTuneAdjust);
  }

  // Apply structure adjustments (details, gradient)
  if (structureAdjust && (structureAdjust.details !== 0 || structureAdjust.gradient !== 0)) {
    console.log('Applying structure filters:', structureAdjust);
    applyStructureFilters(data, structureAdjust, canvas);
  }

  // Apply vignette filter
  if (hasVignetteAdjustments(vignetteAdjust)) {
    console.log('Applying vignette filter:', vignetteAdjust);
    applyVignetteFilter(data, canvas.width, canvas.height, vignetteAdjust);
  }

  // Apply mosaic filter
  if (hasMosaicAdjustments(mosaicAdjust)) {
    console.log('Applying mosaic filter:', mosaicAdjust);
    applyMosaicFilter(data, canvas.width, canvas.height, mosaicAdjust);
  }

  // Put image data back to canvas before blur (blur needs to read from canvas)
  ctx.putImageData(imageData, 0, 0);

  // Apply blur filter (this operates on the canvas directly)
  if (hasBlurAdjustments(blurAdjust)) {
    console.log('Applying blur filter:', blurAdjust);
    applyBlurFilter(canvas, ctx, blurAdjust);
  }

  console.log('=== FILTER DEBUG END ===');
  return canvas.toDataURL('image/jpeg', 0.9);
};

// Re-export helper functions for convenience
export { 
  hasVignetteAdjustments, 
  hasMosaicAdjustments, 
  hasBlurAdjustments, 
  shouldApplyDenoise 
};