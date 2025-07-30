import { useCallback } from 'react';
import { useAppDispatch, useCropState } from '../../../../../../../app/store/hooks/redux';
import {
  setCropSettings,
  setAspectRatio,
  resetCrop,
  setCropActive
} from '../../../../../../../app/store/slices/cropSlice';

export const useCropOperations = (imageRef, setImagePreview) => {
  const dispatch = useAppDispatch();
  const { cropSettings, aspectRatio } = useCropState();

  // Keep all your existing complex logic here
  const drawTriangle = useCallback((ctx, width, height) => {
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);           
    ctx.lineTo(0, height);             
    ctx.lineTo(width, height);          
    ctx.closePath();
  }, []);

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

  const calculateAspectRatioDimensions = useCallback((aspectRatio, containerWidth, containerHeight) => {
    if (!aspectRatio?.dimensions) {
      return { width: 80, height: 80 };
    }

    const { width: ratioWidth, height: ratioHeight } = aspectRatio.dimensions;
    
    if (!ratioWidth || !ratioHeight || ratioWidth <= 0 || ratioHeight <= 0) {
      return { width: 80, height: 80 };
    }

    const targetAspectRatio = ratioWidth / ratioHeight;
    const containerAspectRatio = containerWidth / containerHeight;
    
    let cropWidth, cropHeight;
    const maxSize = 80;
    
    if (targetAspectRatio > containerAspectRatio) {
      cropWidth = maxSize;
      cropHeight = cropWidth / targetAspectRatio;
    } else {
      cropHeight = maxSize;
      cropWidth = cropHeight * targetAspectRatio;
    }

    const minSize = 20;
    cropWidth = Math.max(minSize, Math.min(90, cropWidth));
    cropHeight = Math.max(minSize, Math.min(90, cropHeight));

    return { width: cropWidth, height: cropHeight };
  }, []);

  const setCropWithAspectRatio = useCallback((aspectRatioId, aspectRatios, callback) => {
    const selectedRatio = aspectRatios.find(ratio => ratio.id === aspectRatioId);
    
    if (!imageRef.current) {
      console.error('No image reference available');
      return;
    }

    const imgRect = imageRef.current.getBoundingClientRect();

    if (aspectRatioId === 'freeform') {
      const newSettings = {
        x: 10, y: 10, width: 80, height: 80,
        aspectRatio: null, isActive: true
      };
      
      dispatch(setCropSettings(newSettings));
      dispatch(setAspectRatio(null));
      
      if (typeof callback === 'function') {
        setTimeout(() => callback(newSettings), 0);
      }
    } 
    else if (aspectRatioId === 'original') {
      dispatch(resetCrop());
    } 
    else if (['circle', 'triangle', 'star'].includes(aspectRatioId)) {
      const containerAspectRatio = imgRect.width / imgRect.height;
      
      let size;
      if (containerAspectRatio > 1) {
        size = Math.min(60, (60 * imgRect.height) / imgRect.width);
      } else {
        size = Math.min(60, (60 * imgRect.width) / imgRect.height);
      }
      
      const newSettings = {
        width: size, height: size,
        aspectRatio: selectedRatio, isActive: true,
        x: (100 - size) / 2, y: (100 - size) / 2
      };
      
      dispatch(setCropSettings(newSettings));
      dispatch(setAspectRatio(selectedRatio));
      
      if (typeof callback === 'function') {
        setTimeout(() => callback(newSettings), 0);
      }
    }
    else if (selectedRatio?.dimensions) {
      let finalDimensions;
      
      if (aspectRatioId === 'fb-cover') {
        finalDimensions = { width: 90, height: 34.2 };
      } else if (aspectRatioId === 'whatsapp-dp' || aspectRatioId === 'fb-dp') {
        finalDimensions = { width: 60, height: 60 };
      } else {
        finalDimensions = calculateAspectRatioDimensions(selectedRatio, imgRect.width, imgRect.height);
      }

      const newSettings = {
        width: finalDimensions.width,
        height: finalDimensions.height,
        aspectRatio: selectedRatio,
        isActive: true,
        x: (100 - finalDimensions.width) / 2,
        y: (100 - finalDimensions.height) / 2
      };

      dispatch(setCropSettings(newSettings));
      dispatch(setAspectRatio(selectedRatio));

      if (typeof callback === 'function') {
        setTimeout(() => callback(newSettings), 0);
      }
    }
  }, [calculateAspectRatioDimensions, imageRef, dispatch]);

  const performCrop = useCallback((settings, imagePreview, setCurrentBaseImage) => {
    return new Promise((resolve, reject) => {
      if (!imagePreview || !imageRef.current) {
        reject(new Error('Missing imagePreview or imageRef'));
        return;
      }

      const imageSrc = typeof imagePreview === 'string' ? imagePreview : imageRef.current.src;
      if (!imageSrc || imageSrc === '' || imageSrc === 'data:') {
        reject(new Error('Invalid image source'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          if (img.naturalWidth === 0 || img.naturalHeight === 0) {
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

          if (actualWidth <= 0 || actualHeight <= 0) {
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

          // Clear canvas with white background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

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
            setImagePreview(croppedDataUrl);
            
            if (setCurrentBaseImage) {
              setCurrentBaseImage(croppedDataUrl);
            }
            
            setTimeout(() => {
              dispatch(resetCrop());
            }, 50);
            
            resolve(croppedDataUrl);
          } else {
            reject(new Error('Failed to generate cropped image data'));
          }
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = (error) => {
        reject(new Error('Failed to load image for cropping'));
      };

      img.src = imageSrc;
    });
  }, [imageRef, setImagePreview, drawTriangle, drawStar, dispatch]);

  return {
    cropSettings,
    aspectRatio,
    setCropWithAspectRatio,
    performCrop,
    calculateAspectRatioDimensions
  };
};