import React from 'react';
import { Focus } from 'lucide-react';
import { useMobileSliders } from "../../../constants/MobileSlider";
import { useDesktopSliders } from "../../../constants/DesktopSliders";
import { MobileSliderContainer } from "../../../components/MobileSlider";
import { DesktopSliderContainer } from "../../../components/DesktopSlider";

// Vignette filter function integrated into component
const applyVignetteFilter = (data, width, height, vignetteAdjust) => {
  const { intensity, size = 50, feather = 50 } = vignetteAdjust;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
  
  // Convert parameters to usable values
  const vignetteStrength = intensity / 100; // -1 to 1
  const vignetteSize = (100 - size) / 100; // Invert so 0 = full image, 100 = center only
  const vignetteFeather = Math.max(0.1, feather / 100); // 0.1 to 1 for smoothness
  
  console.log('Vignette params:', { vignetteStrength, vignetteSize, vignetteFeather });
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Calculate distance from center
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const normalizedDistance = distance / maxDistance;
      
      // Calculate vignette factor
      let vignetteFactor = 1;
      
      if (normalizedDistance > vignetteSize) {
        // Apply vignette beyond the size threshold
        const fadeDistance = (normalizedDistance - vignetteSize) / (1 - vignetteSize);
        const smoothedFade = Math.pow(fadeDistance, 1 / vignetteFeather);
        
        if (vignetteStrength > 0) {
          // Darken edges (classic vignette)
          vignetteFactor = 1 - (smoothedFade * vignetteStrength);
        } else {
          // Brighten edges (inverse vignette)
          vignetteFactor = 1 + (smoothedFade * Math.abs(vignetteStrength));
        }
      }
      
      // Clamp the factor
      vignetteFactor = Math.max(0, Math.min(2, vignetteFactor));
      
      // Apply vignette to RGB channels
      data[idx] = Math.max(0, Math.min(255, data[idx] * vignetteFactor));
      data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] * vignetteFactor));
      data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] * vignetteFactor));
      // Alpha channel remains unchanged
    }
  }
};

// Helper function to check if vignette adjustments are active
const hasVignetteAdjustments = (vignetteAdjust) => {
  return vignetteAdjust && vignetteAdjust.intensity !== 0;
};

const VignetteComponent = ({
  vignetteAdjust,
  setVignetteAdjust,
  isMobile = false,
  expandedSliders,
  onToggleSlider
}) => {
  const { vignetteAdjustSliders } = useDesktopSliders();
  const { vignetteAdjustSliders: mobileVignetteAdjustSliders } = useMobileSliders();

  const handleVignetteAdjustChange = (property, value) => {
    setVignetteAdjust((prev) => ({ ...prev, [property]: parseInt(value) }));
  };

  const resetVignetteAdjust = () => {
    setVignetteAdjust({
      intensity: 0,
      size: 50, // Size of the vignette effect (0-100)
      feather: 50, // Softness of the vignette edge (0-100)
    });
  };

  if (isMobile) {
    return (
      <MobileSliderContainer
        sliders={mobileVignetteAdjustSliders}
        values={vignetteAdjust}
        handleChange={handleVignetteAdjustChange}
        resetFunction={resetVignetteAdjust}
        expandedSliders={expandedSliders}
        onToggleSlider={onToggleSlider}
      />
    );
  }

  return (
    <DesktopSliderContainer
      sliders={vignetteAdjustSliders}
      values={vignetteAdjust}
      handleChange={handleVignetteAdjustChange}
      resetFunction={resetVignetteAdjust}
    />
  );
};

// Export the vignette functions for use in main filter application
export { applyVignetteFilter, hasVignetteAdjustments };
export default VignetteComponent;