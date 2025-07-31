// DenoiseComponent.jsx
import React from 'react';
import { Zap } from 'lucide-react';
import { useMobileSliders } from "../../../constants/MobileSlider";
import { useDesktopSliders } from "../../../constants/DesktopSliders";
import { MobileSliderContainer } from "../../../components/MobileSlider";
import { DesktopSliderContainer } from "../../../components/DesktopSlider";

const DenoiseComponent = ({
  denoiseAdjust,
  setDenoiseAdjust,
  isMobile = false,
  expandedSliders,
  onToggleSlider
}) => {
  const { denoiseAdjustSliders } = useDesktopSliders();
  const { denoiseAdjustSliders: mobileDenoiseAdjustSliders } = useMobileSliders();

  const handleDenoiseAdjustChange = (property, value) => {
    setDenoiseAdjust((prev) => ({ ...prev, [property]: parseInt(value) }));
  };

  const resetDenoiseAdjust = () => {
    setDenoiseAdjust({
      colornoise: 0,
      luminancenoise: 0, 
    });
  };

  // Denoise filter function
  const applyDenoiseFilters = (data, originalData, width, height, denoiseAdjust) => {
    // Apply luminance noise reduction with reddish effect
    if (denoiseAdjust.luminancenoise !== 0) {
      applySimpleLuminanceNoise(data, originalData, width, height, denoiseAdjust.luminancenoise);
    }
    
    // Apply color noise reduction with bluish effect
    if (denoiseAdjust.colornoise !== 0) {
      applySimpleColorNoise(data, originalData, width, height, denoiseAdjust.colornoise);
    }
  };

  // Helper function for luminance noise reduction with reddish tint
  const applySimpleLuminanceNoise = (data, originalData, width, height, intensity) => {
    const strength = Math.abs(intensity) / 100;
    const kernelSize = intensity > 50 ? 2 : 1;
    const redTintStrength = strength * 0.3; // Reddish tint intensity
    
    for (let y = kernelSize; y < height - kernelSize; y++) {
      for (let x = kernelSize; x < width - kernelSize; x++) {
        const centerIdx = (y * width + x) * 4;
        
        // Get center pixel
        const centerR = originalData[centerIdx];
        const centerG = originalData[centerIdx + 1];
        const centerB = originalData[centerIdx + 2];
        
        // Simple luminance noise reduction
        let avgR = centerR, avgG = centerG, avgB = centerB;
        let count = 1;
        
        // Sample neighboring pixels
        for (let dy = -kernelSize; dy <= kernelSize; dy++) {
          for (let dx = -kernelSize; dx <= kernelSize; dx++) {
            if (dx === 0 && dy === 0) continue;
            
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nIdx = (ny * width + nx) * 4;
              avgR += originalData[nIdx];
              avgG += originalData[nIdx + 1];
              avgB += originalData[nIdx + 2];
              count++;
            }
          }
        }
        
        avgR /= count;
        avgG /= count;
        avgB /= count;
        
        // Blend original with averaged values based on strength
        let newR = Math.round(centerR * (1 - strength) + avgR * strength);
        let newG = Math.round(centerG * (1 - strength) + avgG * strength);
        let newB = Math.round(centerB * (1 - strength) + avgB * strength);
        
        // Apply reddish tint
        newR = Math.min(255, Math.round(newR + (255 - newR) * redTintStrength));
        newG = Math.max(0, Math.round(newG * (1 - redTintStrength * 0.5)));
        newB = Math.max(0, Math.round(newB * (1 - redTintStrength * 0.7)));
        
        data[centerIdx] = newR;
        data[centerIdx + 1] = newG;
        data[centerIdx + 2] = newB;
      }
    }
  };

  // Helper function for color noise reduction with bluish tint
  const applySimpleColorNoise = (data, originalData, width, height, intensity) => {
    const strength = Math.abs(intensity) / 100;
    const kernelSize = intensity > 50 ? 2 : 1;
    const blueTintStrength = strength * 0.3; // Bluish tint intensity
    
    for (let y = kernelSize; y < height - kernelSize; y++) {
      for (let x = kernelSize; x < width - kernelSize; x++) {
        const centerIdx = (y * width + x) * 4;
        
        // Get center pixel
        const centerR = originalData[centerIdx];
        const centerG = originalData[centerIdx + 1];
        const centerB = originalData[centerIdx + 2];
        
        // Simple color noise reduction by averaging nearby pixels
        let avgR = centerR, avgG = centerG, avgB = centerB;
        let count = 1;
        
        // Sample neighboring pixels
        for (let dy = -kernelSize; dy <= kernelSize; dy++) {
          for (let dx = -kernelSize; dx <= kernelSize; dx++) {
            if (dx === 0 && dy === 0) continue;
            
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nIdx = (ny * width + nx) * 4;
              avgR += originalData[nIdx];
              avgG += originalData[nIdx + 1];
              avgB += originalData[nIdx + 2];
              count++;
            }
          }
        }
        
        avgR /= count;
        avgG /= count;
        avgB /= count;
        
        // Blend original with averaged values based on strength
        let newR = Math.round(centerR * (1 - strength) + avgR * strength);
        let newG = Math.round(centerG * (1 - strength) + avgG * strength);
        let newB = Math.round(centerB * (1 - strength) + avgB * strength);
        
        // Apply bluish tint
        newR = Math.max(0, Math.round(newR * (1 - blueTintStrength * 0.7)));
        newG = Math.max(0, Math.round(newG * (1 - blueTintStrength * 0.3)));
        newB = Math.min(255, Math.round(newB + (255 - newB) * blueTintStrength));
        
        data[centerIdx] = newR;
        data[centerIdx + 1] = newG;
        data[centerIdx + 2] = newB;
      }
    }
  };

  if (isMobile) {
    return (
      <MobileSliderContainer
        sliders={mobileDenoiseAdjustSliders}
        values={denoiseAdjust}
        handleChange={handleDenoiseAdjustChange}
        resetFunction={resetDenoiseAdjust}
        expandedSliders={expandedSliders}
        onToggleSlider={onToggleSlider}
      />
    );
  }

  return (
    <DesktopSliderContainer
      sliders={denoiseAdjustSliders}
      values={denoiseAdjust}
      handleChange={handleDenoiseAdjustChange}
      resetFunction={resetDenoiseAdjust}
    />
  );
};

// Helper function for luminance noise reduction with reddish tint (exported version)
const applySimpleLuminanceNoise = (data, originalData, width, height, intensity) => {
  const strength = Math.abs(intensity) / 100;
  const kernelSize = intensity > 50 ? 2 : 1;
  const redTintStrength = strength * 0.3; // Reddish tint intensity
  
  for (let y = kernelSize; y < height - kernelSize; y++) {
    for (let x = kernelSize; x < width - kernelSize; x++) {
      const centerIdx = (y * width + x) * 4;
      
      // Get center pixel
      const centerR = originalData[centerIdx];
      const centerG = originalData[centerIdx + 1];
      const centerB = originalData[centerIdx + 2];
      
      // Simple luminance noise reduction
      let avgR = centerR, avgG = centerG, avgB = centerB;
      let count = 1;
      
      // Sample neighboring pixels
      for (let dy = -kernelSize; dy <= kernelSize; dy++) {
        for (let dx = -kernelSize; dx <= kernelSize; dx++) {
          if (dx === 0 && dy === 0) continue;
          
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nIdx = (ny * width + nx) * 4;
            avgR += originalData[nIdx];
            avgG += originalData[nIdx + 1];
            avgB += originalData[nIdx + 2];
            count++;
          }
        }
      }
      
      avgR /= count;
      avgG /= count;
      avgB /= count;
      
      // Blend original with averaged values based on strength
      let newR = Math.round(centerR * (1 - strength) + avgR * strength);
      let newG = Math.round(centerG * (1 - strength) + avgG * strength);
      let newB = Math.round(centerB * (1 - strength) + avgB * strength);
      
      // Apply reddish tint
      newR = Math.min(255, Math.round(newR + (255 - newR) * redTintStrength));
      newG = Math.max(0, Math.round(newG * (1 - redTintStrength * 0.5)));
      newB = Math.max(0, Math.round(newB * (1 - redTintStrength * 0.7)));
      
      data[centerIdx] = newR;
      data[centerIdx + 1] = newG;
      data[centerIdx + 2] = newB;
    }
  }
};

// Helper function for color noise reduction with bluish tint (exported version)
const applySimpleColorNoise = (data, originalData, width, height, intensity) => {
  const strength = Math.abs(intensity) / 100;
  const kernelSize = intensity > 50 ? 2 : 1;
  const blueTintStrength = strength * 0.3; // Bluish tint intensity
  
  for (let y = kernelSize; y < height - kernelSize; y++) {
    for (let x = kernelSize; x < width - kernelSize; x++) {
      const centerIdx = (y * width + x) * 4;
      
      // Get center pixel
      const centerR = originalData[centerIdx];
      const centerG = originalData[centerIdx + 1];
      const centerB = originalData[centerIdx + 2];
      
      // Simple color noise reduction by averaging nearby pixels
      let avgR = centerR, avgG = centerG, avgB = centerB;
      let count = 1;
      
      // Sample neighboring pixels
      for (let dy = -kernelSize; dy <= kernelSize; dy++) {
        for (let dx = -kernelSize; dx <= kernelSize; dx++) {
          if (dx === 0 && dy === 0) continue;
          
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nIdx = (ny * width + nx) * 4;
            avgR += originalData[nIdx];
            avgG += originalData[nIdx + 1];
            avgB += originalData[nIdx + 2];
            count++;
          }
        }
      }
      
      avgR /= count;
      avgG /= count;
      avgB /= count;
      
      // Blend original with averaged values based on strength
      let newR = Math.round(centerR * (1 - strength) + avgR * strength);
      let newG = Math.round(centerG * (1 - strength) + avgG * strength);
      let newB = Math.round(centerB * (1 - strength) + avgB * strength);
      
      // Apply bluish tint
      newR = Math.max(0, Math.round(newR * (1 - blueTintStrength * 0.7)));
      newG = Math.max(0, Math.round(newG * (1 - blueTintStrength * 0.3)));
      newB = Math.min(255, Math.round(newB + (255 - newB) * blueTintStrength));
      
      data[centerIdx] = newR;
      data[centerIdx + 1] = newG;
      data[centerIdx + 2] = newB;
    }
  }
};

// Export the main denoise filter function for use in main filter application
export const applyDenoiseFilters = (data, originalData, width, height, denoiseAdjust) => {
  // Apply luminance noise reduction with reddish effect
  if (denoiseAdjust.luminancenoise !== 0) {
    applySimpleLuminanceNoise(data, originalData, width, height, denoiseAdjust.luminancenoise);
  }
  
  // Apply color noise reduction with bluish effect
  if (denoiseAdjust.colornoise !== 0) {
    applySimpleColorNoise(data, originalData, width, height, denoiseAdjust.colornoise);
  }
};

export const shouldApplyDenoise = (denoiseAdjust) => {
  return denoiseAdjust && (denoiseAdjust.luminancenoise !== 0 || denoiseAdjust.colornoise !== 0);
};

export default DenoiseComponent;