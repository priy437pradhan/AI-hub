// hooks/useCrop.js - FIXED VERSION
import { useCallback } from 'react';
import { useAppDispatch, useCropState } from '../../../../../../../../src/app/store/hooks/redux';
import {
  setCropSettings,
  setAspectRatio,
  updateCropPosition,
  updateCropDimensions,
  toggleCropMode,
  setCropActive,
  cancelCrop,
  resetCrop,
} from '../../../../../../../../src/app/store/slices/cropSlice';

export const useCrop = (imageRef, setImagePreview) => {
  const dispatch = useAppDispatch();
  const { cropSettings, aspectRatio } = useCropState();

  // Draw triangle path
  const drawTriangle = useCallback((ctx, width, height) => {
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);           
    ctx.lineTo(0, height);             
    ctx.lineTo(width, height);          
    ctx.closePath();
  }, []);

  // Draw star path
  const drawStar = useCallback((ctx, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) / 2;
    const innerRadius = outerRadius * 0.4;
    const spikes = 5;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = centerX + Math.cos(angle - Math.PI / 2) * radius;
      const y = centerY + Math.sin(angle - Math.PI / 2) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
  }, []);

  // Calculate aspect ratio dimensions properly
  const calculateAspectRatioDimensions = useCallback((aspectRatio, containerWidth, containerHeight) => {
    if (!aspectRatio?.dimensions) {
      return { width: 80, height: 80 };
    }

    const { width: ratioWidth, height: ratioHeight } = aspectRatio.dimensions;
    const targetAspectRatio = ratioWidth / ratioHeight;
    const containerAspectRatio = containerWidth / containerHeight;

    let cropWidth, cropHeight;

    if (targetAspectRatio > containerAspectRatio) {
      cropWidth = Math.min(90, 80);
      cropHeight = cropWidth / targetAspectRatio;
    } else {
      cropHeight = Math.min(90, 80);
      cropWidth = cropHeight * targetAspectRatio;
    }

    const widthPercent = Math.min(90, (cropWidth * 100) / 100);
    const heightPercent = Math.min(90, (cropHeight * 100) / 100);

    return {
      width: widthPercent,
      height: heightPercent
    };
  }, []);

  // Redux action dispatchers
  const dispatchResetCrop = useCallback(() => {
    dispatch(resetCrop());
  }, [dispatch]);

  const dispatchSetCropSettings = useCallback((settings) => {
    dispatch(setCropSettings(settings));
  }, [dispatch]);

  const dispatchSetAspectRatio = useCallback((ratio) => {
    dispatch(setAspectRatio(ratio));
  }, [dispatch]);

  const dispatchUpdateCropPosition = useCallback((x, y) => {
    dispatch(updateCropPosition({ x, y }));
  }, [dispatch]);

  const dispatchUpdateCropDimensions = useCallback((width, height) => {
    dispatch(updateCropDimensions({ width, height }));
  }, [dispatch]);

  const dispatchToggleCropMode = useCallback(() => {
    dispatch(toggleCropMode());
  }, [dispatch]);

  const dispatchSetCropActive = useCallback((isActive) => {
    dispatch(setCropActive(isActive));
  }, [dispatch]);

  const dispatchCancelCrop = useCallback(() => {
    dispatch(cancelCrop());
  }, [dispatch]);

  // Set crop with aspect ratio
  const setCropWithAspectRatio = useCallback((aspectRatioId, aspectRatios, callback) => {
    const selectedRatio = aspectRatios.find(ratio => ratio.id === aspectRatioId);
    
    console.log('Setting crop with aspect ratio:', { aspectRatioId, selectedRatio });

    if (selectedRatio?.dimensions && imageRef.current) {
      const imgRect = imageRef.current.getBoundingClientRect();
      const dimensions = calculateAspectRatioDimensions(
        selectedRatio,
        imgRect.width,
        imgRect.height
      );

      const newSettings = {
        width: dimensions.width,
        height: dimensions.height,
        aspectRatio: selectedRatio,
        isActive: true,
        x: (100 - dimensions.width) / 2,
        y: (100 - dimensions.height) / 2
      };

      console.log('New crop settings with correct aspect ratio:', newSettings);

      dispatch(setCropSettings(newSettings));
      dispatch(setAspectRatio(selectedRatio));

      if (typeof callback === 'function') {
        setTimeout(() => callback(newSettings), 0);
      }
    } else if (aspectRatioId === 'freeform') {
      const newSettings = {
        x: 10,
        y: 10,
        width: 80,
        height: 80,
        aspectRatio: null,
        isActive: true
      };
      
      dispatch(setCropSettings(newSettings));
      dispatch(setAspectRatio(null));
      
      console.log('Set freeform crop:', newSettings);
    } else if (aspectRatioId === 'original') {
      dispatchResetCrop();
    } else if (['circle', 'triangle', 'star'].includes(aspectRatioId)) {
      if (!imageRef.current) return;
      
      const imgRect = imageRef.current.getBoundingClientRect();
      const containerAspectRatio = imgRect.width / imgRect.height;
      
      let size;
      if (containerAspectRatio > 1) {
        size = Math.min(60, (60 * imgRect.height) / imgRect.width);
      } else {
        size = Math.min(60, (60 * imgRect.width) / imgRect.height);
      }
      
      const newSettings = {
        width: size,
        height: size,
        aspectRatio: selectedRatio,
        isActive: true,
        x: (100 - size) / 2,
        y: (100 - size) / 2
      };
      
      console.log('Set shape crop:', newSettings);
      
      dispatch(setCropSettings(newSettings));
      dispatch(setAspectRatio(selectedRatio));
      
      if (typeof callback === 'function') {
        setTimeout(() => callback(newSettings), 0);
      }
    }
  }, [calculateAspectRatioDimensions, imageRef, dispatch, dispatchResetCrop]);

 // FIXED performCrop function in your useCrop hook
const performCrop = useCallback((settings, imagePreview, setCurrentBaseImage) => {
  return new Promise((resolve, reject) => {
    console.log('=== CROP HOOK DEBUG: Starting performCrop ===');
    console.log('Settings:', settings);
    console.log('ImagePreview provided:', !!imagePreview);
    console.log('setCurrentBaseImage callback provided:', !!setCurrentBaseImage);
    
    if (!imagePreview || !imageRef.current) {
      console.error('=== CROP HOOK DEBUG: Missing imagePreview or imageRef ===');
      reject(new Error('Missing imagePreview or imageRef'));
      return;
    }

    const imageSrc = typeof imagePreview === 'string' ? imagePreview : imageRef.current.src;
    if (!imageSrc || imageSrc === '' || imageSrc === 'data:') {
      console.error('=== CROP HOOK DEBUG: Invalid image source ===', imageSrc);
      reject(new Error('Invalid image source'));
      return;
    }

    console.log('=== CROP HOOK DEBUG: Using image source:', imageSrc.substring(0, 50));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        console.log('=== CROP HOOK DEBUG: Image loaded, processing crop ===');
        console.log('Image dimensions:', img.naturalWidth, 'x', img.naturalHeight);
        
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
          console.error('=== CROP HOOK DEBUG: Invalid image dimensions ===');
          reject(new Error('Image has invalid dimensions'));
          return;
        }

        // Calculate actual crop coordinates
        const actualX = Math.max(0, (settings.x / 100) * img.naturalWidth);
        const actualY = Math.max(0, (settings.y / 100) * img.naturalHeight);
        const actualWidth = Math.min(
          (settings.width / 100) * img.naturalWidth,
          img.naturalWidth - actualX
        );
        const actualHeight = Math.min(
          (settings.height / 100) * img.naturalHeight,
          img.naturalHeight - actualY
        );

        console.log('=== CROP HOOK DEBUG: Crop coordinates ===');
        console.log('X:', actualX, 'Y:', actualY, 'W:', actualWidth, 'H:', actualHeight);

        if (actualWidth <= 0 || actualHeight <= 0) {
          console.error('=== CROP HOOK DEBUG: Invalid crop dimensions ===');
          reject(new Error('Invalid crop dimensions'));
          return;
        }

        // Maintain aspect ratio for non-shape crops
        let finalWidth = actualWidth;
        let finalHeight = actualHeight;

        if (settings.aspectRatio?.dimensions && !['circle', 'triangle', 'star'].includes(settings.aspectRatio.id)) {
          const targetRatio = settings.aspectRatio.dimensions.width / settings.aspectRatio.dimensions.height;
          const currentRatio = actualWidth / actualHeight;
          
          if (Math.abs(currentRatio - targetRatio) > 0.01) {
            if (currentRatio > targetRatio) {
              finalWidth = actualHeight * targetRatio;
            } else {
              finalHeight = actualWidth / targetRatio;
            }
          }
        }

        // Set canvas size
        canvas.width = Math.floor(finalWidth);
        canvas.height = Math.floor(finalHeight);

        console.log('=== CROP HOOK DEBUG: Canvas size set to:', canvas.width, 'x', canvas.height);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Handle different shapes
        if (settings.aspectRatio?.id === 'circle') {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = Math.min(canvas.width, canvas.height) / 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.clip();
        } else if (settings.aspectRatio?.id === 'triangle') {
          drawTriangle(ctx, canvas.width, canvas.height);
          ctx.clip();
        } else if (settings.aspectRatio?.id === 'star') {
          drawStar(ctx, canvas.width, canvas.height);
          ctx.clip();
        }

        // Draw the cropped image
        ctx.drawImage(
          img,
          Math.floor(actualX), Math.floor(actualY), Math.floor(finalWidth), Math.floor(finalHeight),
          0, 0, canvas.width, canvas.height
        );

        // Convert to high quality PNG
        const croppedDataUrl = canvas.toDataURL('image/png', 1.0);
        
        if (croppedDataUrl && croppedDataUrl.length > 100) {
          console.log('=== CROP HOOK DEBUG: Crop successful ===');
          console.log('Cropped image data URL:', croppedDataUrl.substring(0, 50));
          
          // CRITICAL: Update both preview and currentBaseImage immediately
          setImagePreview(croppedDataUrl);
          
          // CRITICAL: Call the setCurrentBaseImage callback if provided
          if (setCurrentBaseImage) {
            console.log('=== CROP HOOK DEBUG: Calling setCurrentBaseImage callback ===');
            setCurrentBaseImage(croppedDataUrl);
          }
          
          // Reset crop after successful completion
          setTimeout(() => {
            console.log('=== CROP HOOK DEBUG: Resetting crop state ===');
            dispatchResetCrop();
          }, 50); // Reduced timeout for faster state updates
          
          resolve(croppedDataUrl);
        } else {
          console.error('=== CROP HOOK DEBUG: Failed to generate cropped image data ===');
          reject(new Error('Failed to generate cropped image data'));
        }
      } catch (error) {
        console.error('=== CROP HOOK DEBUG: Error during crop processing ===', error);
        reject(error);
      }
    };

    img.onerror = (error) => {
      console.error('=== CROP HOOK DEBUG: Error loading image for crop ===', error);
      reject(new Error('Failed to load image for cropping'));
    };

    console.log('=== CROP HOOK DEBUG: Loading image ===');
    img.src = imageSrc;
  });
}, [imageRef, setImagePreview, drawTriangle, drawStar, dispatchResetCrop]);

  // Apply crop on Enter key
  const handleCropApply = useCallback(async (setCurrentBaseImage) => {
    if (cropSettings.isActive && imageRef.current?.src) {
      try {
        console.log('Applying crop with settings:', cropSettings);
        await performCrop(cropSettings, imageRef.current.src, setCurrentBaseImage);
      } catch (error) {
        console.error('Failed to apply crop:', error);
      }
    }
  }, [cropSettings, performCrop, imageRef]);

  return {
    cropSettings,
    aspectRatio,
    setCropSettings: dispatchSetCropSettings,
    performCrop,
    setCropWithAspectRatio,
    toggleCropMode: dispatchToggleCropMode,
    setCropActive: dispatchSetCropActive,
    cancelCrop: dispatchCancelCrop,
    updateCropPosition: dispatchUpdateCropPosition,    
    updateCropDimensions: dispatchUpdateCropDimensions,   
    resetCrop: dispatchResetCrop,
    handleCropApply,
    calculateAspectRatioDimensions
  };
};