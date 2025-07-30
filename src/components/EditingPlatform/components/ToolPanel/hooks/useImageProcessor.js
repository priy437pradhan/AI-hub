// hooks/useImageProcessor.js - FIXED VERSION
import { useCallback, useMemo } from 'react';
import { applyAllFiltersToCanvas } from '../../ToolPanel/utils/imageFilters';
import { useFiltersState, useImageState } from '../../../../../app/store/hooks/redux';

export const useImageProcessor = () => {
  const filtersState = useFiltersState();
  const imageState = useImageState();

  const hasFilterChanges = useMemo(
    () => {
      const hasChanges = Object.values(filtersState).some((category) =>
        Object.values(category).some(
          (value) => typeof value === "number" && value !== 0,
        ),
      );
      console.log('=== FILTER DEBUG: hasFilterChanges calculated:', hasChanges);
      return hasChanges;
    },
    [filtersState],
  );

  const processImage = useCallback(async (imageRef, canvas, ctx, baseImageDataUrl) => {
    console.log('=== FILTER DEBUG: processImage called ===');
    console.log('baseImageDataUrl provided:', !!baseImageDataUrl);
    console.log('imageState.currentBaseImage available:', !!imageState.currentBaseImage);
    
    const imageSourceToUse = baseImageDataUrl || imageState.currentBaseImage;
    
    if (!imageSourceToUse) {
      console.error('=== FILTER DEBUG: No image source available ===');
      return null;
    }

    console.log('=== FILTER DEBUG: Using image source:', imageSourceToUse.substring(0, 50));

    if (!hasFilterChanges) {
      console.log('=== FILTER DEBUG: No filters, returning base image ===');
      return imageSourceToUse;
    }

    console.log('=== FILTER DEBUG: Processing with filters ===');

    return new Promise((resolve, reject) => {
      const baseImg = new Image();
      baseImg.crossOrigin = "anonymous";

      baseImg.onload = () => {
        try {
          console.log('=== FILTER DEBUG: Base image loaded, applying filters ===');
          canvas.width = baseImg.naturalWidth;
          canvas.height = baseImg.naturalHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const processedDataURL = applyAllFiltersToCanvas(
            canvas,
            ctx,
            baseImg,
            filtersState.basicAdjust,
            filtersState.colorAdjust,
            filtersState.fineTuneAdjust,
            filtersState.structureAdjust,
            filtersState.denoiseAdjust,
            filtersState.vignetteAdjust,
            filtersState.mosaicAdjust,
            filtersState.blurAdjust
          );
          
          console.log('=== FILTER DEBUG: Filters applied successfully ===');
          resolve(processedDataURL);
        } catch (error) {
          console.error("=== FILTER DEBUG: Filter processing failed ===", error);
          reject(error);
        }
      };

      baseImg.onerror = (error) => {
        console.error('=== FILTER DEBUG: Failed to load base image ===', error);
        reject(new Error('Failed to load image'));
      };

      baseImg.src = imageSourceToUse;
    });
  }, [filtersState, imageState.currentBaseImage, hasFilterChanges]);

  return {
    processImage,
    hasFilterChanges
  };
};