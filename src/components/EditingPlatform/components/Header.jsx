// Fixed Header component with consistent brightness behavior
'use client'
import { ChevronDown, Upload, Search, Download, Grid } from 'lucide-react';

export default function Header({ 
  isMobile, 
  sidebarOpen, 
  setSidebarOpen, 
  handleUploadClick, 
  downloadImage,
  imageRef,
  // Pass the hook functions as props
  performBasicAdjust,
  performColorAdjust, 
  performFineTune,
  // Pass the current adjustment states
  basicAdjust,
  colorAdjust,
  finetuneAdjust
}) {

  // Download function using the hook functions
  const downloadImageWithFilters = async () => {
    if (!imageRef.current) {
      alert("Please upload an image first.");
      return;
    }

    try {
      // Create a combined adjustment object
      const allAdjustments = {
        ...basicAdjust,
        ...colorAdjust,
        ...finetuneAdjust
      };

      // Use a single comprehensive filter function
      const processedImageData = await applyAllFiltersAtOnce(allAdjustments);

      // Download the filtered image
      const link = document.createElement('a');
      link.download = 'edited-image.jpg';
      link.href = processedImageData;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  // Helper function to clamp values
  const clamp = (value, min = 0, max = 255) => Math.max(min, Math.min(max, value));

  // Apply all filters at once to avoid multiple canvas operations
  const applyAllFiltersAtOnce = async (adjustments) => {
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

    // Apply all adjustments to each pixel in one pass
    for (let i = 0; i < data.length; i += 4) {
      // Start with original pixel values
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // BASIC ADJUSTMENTS (Apply in same order as individual hooks)
      
      // 1. Apply brightness FIRST (matches individual hook behavior exactly)
      if (adjustments.brightness !== 0) {
        const brightnessFactor = adjustments.brightness * 2.55; 
        r = Math.max(0, Math.min(255, r + brightnessFactor));
        g = Math.max(0, Math.min(255, g + brightnessFactor));
        b = Math.max(0, Math.min(255, b + brightnessFactor));
      }

      // 2. Apply contrast
      if (adjustments.contrast !== 0) {
        const contrastFactor = (259 * (adjustments.contrast + 255)) / (255 * (259 - adjustments.contrast));
        r = Math.max(0, Math.min(255, contrastFactor * (r - 128) + 128));
        g = Math.max(0, Math.min(255, contrastFactor * (g - 128) + 128));
        b = Math.max(0, Math.min(255, contrastFactor * (b - 128) + 128));
      }

      // 3. Apply saturation
      if (adjustments.saturation !== 0) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const saturationFactor = (adjustments.saturation + 100) / 100;
        r = Math.max(0, Math.min(255, gray + saturationFactor * (r - gray)));
        g = Math.max(0, Math.min(255, gray + saturationFactor * (g - gray)));
        b = Math.max(0, Math.min(255, gray + saturationFactor * (b - gray)));
      }

      // COLOR ADJUSTMENTS
      
      // Apply temperature
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

      // Apply invertcolors (Note: this duplicates temperature logic - you might want to fix this)
      if (adjustments.invertcolors !== 0) {
        const invertFactor = adjustments.invertcolors / 100;
        if (invertFactor > 0) {
          r = Math.min(255, r + invertFactor * 50);
          b = Math.max(0, b - invertFactor * 50);
        } else {
          r = Math.max(0, r + invertFactor * 50);
          b = Math.min(255, b - invertFactor * 50);
        }
      }

      // Apply tint
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

      // FINE TUNE ADJUSTMENTS
      
      // Calculate luminance for fine-tune adjustments
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      const normalizedLuminance = luminance / 255;

      // Apply exposure
      if (adjustments.exposure !== 0) {
        const exposureFactor = Math.pow(2, adjustments.exposure / 50);
        r = Math.max(0, Math.min(255, r * exposureFactor));
        g = Math.max(0, Math.min(255, g * exposureFactor));
        b = Math.max(0, Math.min(255, b * exposureFactor));
      }

      // Apply highlights
      if (adjustments.highlights !== 0) {
        const highlightWeight = Math.max(0, (normalizedLuminance - 0.5) * 2);
        const highlightFactor = 1 + (adjustments.highlights / 100) * highlightWeight;
        
        if (normalizedLuminance > 0.5) {
          r = Math.max(0, Math.min(255, r * highlightFactor));
          g = Math.max(0, Math.min(255, g * highlightFactor));
          b = Math.max(0, Math.min(255, b * highlightFactor));
        }
      }

      // Apply shadows
      if (adjustments.shadows !== 0) {
        const shadowWeight = Math.max(0, (0.5 - normalizedLuminance) * 2);
        const shadowFactor = 1 + (adjustments.shadows / 100) * shadowWeight;
        
        if (normalizedLuminance < 0.5) {
          r = Math.max(0, Math.min(255, r * shadowFactor));
          g = Math.max(0, Math.min(255, g * shadowFactor));
          b = Math.max(0, Math.min(255, b * shadowFactor));
        }
      }

      // Final assignment (values are already clamped)
      data[i] = Math.round(r);
      data[i + 1] = Math.round(g);
      data[i + 2] = Math.round(b);
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
  };

  return (
    <header className="flex items-center justify-between bg-white dark:bg-dark-card px-4 py-3 border-b border-gray-200 dark:border-dark-border">
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          <span className="ml-2 font-bold text-xl dark:text-dark-text">AI Hub</span>
        </div>
        <button className="hidden md:flex items-center px-3 py-1 text-sm bg-transparent hover:bg-gray-100 dark:hover:bg-dark-border rounded">
          <span className="dark:text-dark-text">AI Photo Editor</span>
          <ChevronDown size={16} className="ml-1 text-gray-600 dark:text-gray-400" />
        </button>
        <button 
          onClick={handleUploadClick}
          className="flex items-center px-2 md:px-3 py-1 text-sm bg-transparent hover:bg-gray-100 dark:hover:bg-dark-border rounded"
        >
          <Upload size={16} className="mr-1 text-gray-600 dark:text-gray-400" />
          <span className="dark:text-dark-text">Open</span>
          {!isMobile && (
            <>
              <span className="dark:text-dark-text ml-1">Image</span>
              <ChevronDown size={16} className="ml-1 text-gray-600 dark:text-gray-400" />
            </>
          )}
        </button>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <button className="hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-full">
          <Search size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <button 
          onClick={downloadImageWithFilters}
          className="flex items-center px-2 md:px-4 py-1 md:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Download size={16} className="mr-1 md:mr-2" />
          <span>Download</span>
        </button>
        <button className="hidden md:flex items-center px-3 py-1 bg-transparent border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-border rounded-md">
          <span className="text-gray-700 dark:text-gray-300">Up to 30% Off</span>
        </button>
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    </header>
  );
}