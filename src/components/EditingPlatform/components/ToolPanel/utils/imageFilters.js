// Debug version to identify denoise issues
export const applyAllFiltersToCanvas = (canvas, ctx, originalImg, basicAdjust, colorAdjust, fineTuneAdjust, structureAdjust, denoiseAdjust, vignetteAdjust , mosaicAdjust , blurAdjust) => {
  console.log('=== FILTER DEBUG START ===');
  console.log('basicAdjust:', basicAdjust);
  console.log('colorAdjust:', colorAdjust);
  console.log('fineTuneAdjust:', fineTuneAdjust);
  console.log('structureAdjust:', structureAdjust);
  console.log('denoiseAdjust:', denoiseAdjust);
  console.log('vignetteAdjust:', vignetteAdjust);
  
  canvas.width = originalImg.naturalWidth || originalImg.width;
  canvas.height = originalImg.naturalHeight || originalImg.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(originalImg, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Create a copy of original data for noise reduction calculations
  const originalData = new Uint8ClampedArray(data);

  // Check if denoise should be applied
  const shouldApplyDenoise = denoiseAdjust && (denoiseAdjust.luminancenoise !== 0 || denoiseAdjust.colornoise !== 0);
  console.log('Should apply denoise:', shouldApplyDenoise, denoiseAdjust);

  // Apply denoise filters FIRST before other filters to avoid interference
  if (shouldApplyDenoise) {
    console.log('APPLYING DENOISE FILTERS...');
    applyDenoiseFilters(data, originalData, canvas.width, canvas.height, denoiseAdjust);
    console.log('DENOISE FILTERS APPLIED');
  }

  // Then apply other filters
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Apply brightness
    if (basicAdjust.brightness !== 0) {
      const brightnessFactor = basicAdjust.brightness * 2.55; 
      r = Math.max(0, Math.min(255, r + brightnessFactor));
      g = Math.max(0, Math.min(255, g + brightnessFactor));
      b = Math.max(0, Math.min(255, b + brightnessFactor));
    }

    // Apply contrast
    if (basicAdjust.contrast !== 0) {
      const contrastFactor = (259 * (basicAdjust.contrast + 255)) / (255 * (259 - basicAdjust.contrast));
      r = Math.max(0, Math.min(255, contrastFactor * (r - 128) + 128));
      g = Math.max(0, Math.min(255, contrastFactor * (g - 128) + 128));
      b = Math.max(0, Math.min(255, contrastFactor * (b - 128) + 128));
    }

    // Apply saturation
    if (basicAdjust.saturation !== 0) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const saturationFactor = (basicAdjust.saturation + 100) / 100;
      r = Math.max(0, Math.min(255, gray + saturationFactor * (r - gray)));
      g = Math.max(0, Math.min(255, gray + saturationFactor * (g - gray)));
      b = Math.max(0, Math.min(255, gray + saturationFactor * (b - gray)));
    }

    // Apply sharpness
    if (basicAdjust.sharpness !== 0) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const sharpnessFactor = (basicAdjust.sharpness + 100) / 100;
      r = Math.max(0, Math.min(255, gray + sharpnessFactor * (r - gray)));
      g = Math.max(0, Math.min(255, gray + sharpnessFactor * (g - gray)));
      b = Math.max(0, Math.min(255, gray + sharpnessFactor * (b - gray)));
    }

    // Apply temperature
    if (colorAdjust.temperature !== 0) {
      const tempFactor = colorAdjust.temperature / 100;
      if (tempFactor > 0) {
        r = Math.min(255, r + tempFactor * 50);
        b = Math.max(0, b - tempFactor * 50);
      } else {
        r = Math.max(0, r + tempFactor * 50);
        b = Math.min(255, b - tempFactor * 50);
      }
    }

    // Apply invertcolors
    if (colorAdjust.invertcolors !== 0) {
      const invertFactor = colorAdjust.invertcolors / 100;
      if (invertFactor > 0) {
        r = Math.min(255, r + invertFactor * 50);
        b = Math.max(0, b - invertFactor * 50);
      } else {
        r = Math.max(0, r + invertFactor * 50);
        b = Math.min(255, b - invertFactor * 50);
      }
    }

    // Apply tint
    if (colorAdjust.tint !== 0) {
      const tintFactor = colorAdjust.tint / 100;
      if (tintFactor > 0) {
        r = Math.min(255, r + tintFactor * 30);
        b = Math.min(255, b + tintFactor * 30);
      } else {
        g = Math.min(255, g - tintFactor * 30);
      }
    }

    // Calculate luminance for fine-tune adjustments
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    const normalizedLuminance = luminance / 255;

    // Apply exposure
    if (fineTuneAdjust.exposure !== 0) {
      const exposureFactor = Math.pow(2, fineTuneAdjust.exposure / 50);
      r = Math.max(0, Math.min(255, r * exposureFactor));
      g = Math.max(0, Math.min(255, g * exposureFactor));
      b = Math.max(0, Math.min(255, b * exposureFactor));
    }

    // Apply highlights
    if (fineTuneAdjust.highlights !== 0) {
      const highlightWeight = Math.max(0, (normalizedLuminance - 0.5) * 2);
      const highlightFactor = 1 + (fineTuneAdjust.highlights / 100) * highlightWeight;
      
      if (normalizedLuminance > 0.5) {
        r = Math.max(0, Math.min(255, r * highlightFactor));
        g = Math.max(0, Math.min(255, g * highlightFactor));
        b = Math.max(0, Math.min(255, b * highlightFactor));
      }
    }

    // Apply shadows
    if (fineTuneAdjust.shadows !== 0) {
      const shadowWeight = Math.max(0, (0.5 - normalizedLuminance) * 2);
      const shadowFactor = 1 + (fineTuneAdjust.shadows / 100) * shadowWeight;
      
      if (normalizedLuminance < 0.5) {
        r = Math.max(0, Math.min(255, r * shadowFactor));
        g = Math.max(0, Math.min(255, g * shadowFactor));
        b = Math.max(0, Math.min(255, b * shadowFactor));
      }
    }

    // Apply details (enhances local contrast)
    if (structureAdjust.details !== 0) {
      const detailFactor = structureAdjust.details / 100;
      const pixelIntensity = (r + g + b) / 3;
      const enhancement = detailFactor * 20;
      
      r = Math.max(0, Math.min(255, r + (r - pixelIntensity) * enhancement / 100));
      g = Math.max(0, Math.min(255, g + (g - pixelIntensity) * enhancement / 100));
      b = Math.max(0, Math.min(255, b + (b - pixelIntensity) * enhancement / 100));
    }

    // Apply gradient (creates a subtle vignette effect)
    if (structureAdjust.gradient !== 0) {
      const x = (i / 4) % canvas.width;
      const y = Math.floor((i / 4) / canvas.width);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      const gradientFactor = 1 - (structureAdjust.gradient / 100) * (distance / maxDistance) * 0.5;
      
      r = Math.max(0, Math.min(255, r * gradientFactor));
      g = Math.max(0, Math.min(255, g * gradientFactor));
      b = Math.max(0, Math.min(255, b * gradientFactor));
    }

    // Update pixel data
    data[i] = Math.round(r);
    data[i + 1] = Math.round(g);
    data[i + 2] = Math.round(b);
  }
  
  // Apply vignette filter after all other filters
  if (vignetteAdjust && vignetteAdjust.intensity !== 0) {
    console.log('Applying vignette filter:', vignetteAdjust);
    applyVignetteFilter(data, canvas.width, canvas.height, vignetteAdjust);
  }
   if (mosaicAdjust && mosaicAdjust.size > 1) {
    console.log('Applying mosaic filter:', mosaicAdjust);
    applyMosaicFilter(data, canvas.width, canvas.height, mosaicAdjust);
  }
 if (blurAdjust && blurAdjust.intensity > 0 && (blurAdjust.preview || blurAdjust.applied)) {
    console.log('Applying blur filter:', blurAdjust);
    applyBlurFilter(canvas, ctx, blurAdjust);
  }

  ctx.putImageData(imageData, 0, 0);
  console.log('=== FILTER DEBUG END ===');
  return canvas.toDataURL('image/jpeg', 0.9);
};

// Simplified denoise function for testing
function applyDenoiseFilters(data, originalData, width, height, denoiseAdjust) {
  console.log('🔧 applyDenoiseFilters called with:', {
    luminancenoise: denoiseAdjust.luminancenoise,
    colornoise: denoiseAdjust.colornoise,
    width,
    height,
    dataLength: data.length
  });
  
  // Simple test: Apply luminance noise reduction
  if (denoiseAdjust.luminancenoise !== 0) {
    console.log('🎯 Applying luminance noise reduction...');
    applySimpleLuminanceNoise(data, originalData, width, height, denoiseAdjust.luminancenoise);
  }
  
  // Simple test: Apply color noise reduction
  if (denoiseAdjust.colornoise !== 0) {
    console.log('🎯 Applying color noise reduction...');
    applySimpleColorNoise(data, originalData, width, height, denoiseAdjust.colornoise);
  }
  
  console.log('✅ Denoise filters completed');
}

// Debug version with visible red tint to test if denoise is working
function applySimpleLuminanceNoise(data, originalData, width, height, intensity) {
  console.log('📊 Luminance noise - intensity:', intensity);
  
  const strength = Math.abs(intensity) / 100;
  const kernelSize = intensity > 50 ? 2 : 1;
  let pixelsProcessed = 0;
  
  // ADD VISIBLE RED TINT FOR DEBUG
  console.log('🔴 ADDING RED TINT TO DETECT LUMINANCE DENOISE');
  
  for (let y = kernelSize; y < height - kernelSize; y++) {
    for (let x = kernelSize; x < width - kernelSize; x++) {
      const centerIdx = (y * width + x) * 4;
      
      // Get center pixel
      const centerR = originalData[centerIdx];
      const centerG = originalData[centerIdx + 1];
      const centerB = originalData[centerIdx + 2];
      
      // APPLY RED TINT BASED ON INTENSITY (for debugging)
      const redBoost = (intensity / 100) * 100; // More visible red boost
      
      data[centerIdx] = Math.min(255, centerR + redBoost);     // Add red
      data[centerIdx + 1] = Math.max(0, centerG - redBoost/2); // Reduce green slightly  
      data[centerIdx + 2] = Math.max(0, centerB - redBoost/2); // Reduce blue slightly
      
      pixelsProcessed++;
    }
  }
  
  console.log('📊 Luminance noise processed pixels:', pixelsProcessed);
}

// Debug version with visible green tint to test if color denoise is working
function applySimpleColorNoise(data, originalData, width, height, intensity) {
  console.log('🎨 Color noise - intensity:', intensity);
  
  const strength = Math.abs(intensity) / 100;
  const kernelSize = intensity > 50 ? 2 : 1;
  let pixelsProcessed = 0;
  
  // ADD VISIBLE GREEN TINT FOR DEBUG
  console.log('🟢 ADDING GREEN TINT TO DETECT COLOR DENOISE');
  
  for (let y = kernelSize; y < height - kernelSize; y++) {
    for (let x = kernelSize; x < width - kernelSize; x++) {
      const centerIdx = (y * width + x) * 4;
      
      // Get center pixel
      const centerR = originalData[centerIdx];
      const centerG = originalData[centerIdx + 1];
      const centerB = originalData[centerIdx + 2];
      
      // APPLY GREEN TINT BASED ON INTENSITY (for debugging)
      const greenBoost = (intensity / 100) * 100; // More visible green boost
      
      data[centerIdx] = Math.max(0, centerR - greenBoost/2);     // Reduce red slightly
      data[centerIdx + 1] = Math.min(255, centerG + greenBoost); // Add green
      data[centerIdx + 2] = Math.max(0, centerB - greenBoost/2); // Reduce blue slightly
      
      pixelsProcessed++;
    }
  }
  
  console.log('🎨 Color noise processed pixels:', pixelsProcessed);
}

function applyVignetteFilter(data, width, height, vignetteAdjust) {
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
}

// Helper function to check if vignette adjustments are active
export const hasVignetteAdjustments = (vignetteAdjust) => {
  return vignetteAdjust && vignetteAdjust.intensity !== 0;
};

// Mosaic filter implementation
function applyMosaicFilter(data, width, height, mosaicAdjust) {
  const { type = 'square', size = 10, pixelSize = 1 } = mosaicAdjust;
  
  console.log('Mosaic params:', { type, size, pixelSize });
  
  // Create a copy of the original data to read from
  const originalData = new Uint8ClampedArray(data);
  
  switch (type) {
    case 'square':
      applySquareMosaic(data, originalData, width, height, size, pixelSize);
      break;
    case 'triangular':
      applyTriangularMosaic(data, originalData, width, height, size, pixelSize);
      break;
    case 'hexagonal':
      applyHexagonalMosaic(data, originalData, width, height, size, pixelSize);
      break;
    default:
      applySquareMosaic(data, originalData, width, height, size, pixelSize);
  }
}

// Square mosaic implementation
function applySquareMosaic(data, originalData, width, height, tileSize, pixelSize) {
  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      // Calculate average color for this tile
      const avgColor = getAverageColorInRegion(originalData, width, height, x, y, 
        Math.min(tileSize, width - x), Math.min(tileSize, height - y));
      
      // Fill the tile with the average color, considering pixelSize
      fillSquareTile(data, width, height, x, y, tileSize, pixelSize, avgColor);
    }
  }
}

// Triangular mosaic implementation
function applyTriangularMosaic(data, originalData, width, height, tileSize, pixelSize) {
  const triangleHeight = Math.floor(tileSize * 0.866); // Height of equilateral triangle
  
  for (let row = 0; row < Math.ceil(height / triangleHeight); row++) {
    for (let col = 0; col < Math.ceil(width / tileSize); col++) {
      const y = row * triangleHeight;
      const x = col * tileSize + (row % 2) * (tileSize / 2); // Offset every other row
      
      if (x < width && y < height) {
        const avgColor = getAverageColorInTriangle(originalData, width, height, x, y, tileSize, triangleHeight);
        fillTriangleTile(data, width, height, x, y, tileSize, triangleHeight, pixelSize, avgColor, row % 2 === 0);
      }
    }
  }
}

// Hexagonal mosaic implementation
function applyHexagonalMosaic(data, originalData, width, height, tileSize, pixelSize) {
  const hexRadius = tileSize / 2;
  const hexHeight = hexRadius * Math.sqrt(3);
  const hexWidth = hexRadius * 2;
  
  for (let row = 0; row < Math.ceil(height / (hexHeight * 0.75)); row++) {
    for (let col = 0; col < Math.ceil(width / hexWidth); col++) {
      const x = col * hexWidth + (row % 2) * hexRadius;
      const y = row * hexHeight * 0.75;
      
      if (x < width && y < height) {
        const avgColor = getAverageColorInHexagon(originalData, width, height, x, y, hexRadius);
        fillHexagonTile(data, width, height, x, y, hexRadius, pixelSize, avgColor);
      }
    }
  }
}

// Helper function to get average color in a rectangular region
function getAverageColorInRegion(data, width, height, startX, startY, regionWidth, regionHeight) {
  let r = 0, g = 0, b = 0, count = 0;
  
  for (let y = startY; y < Math.min(startY + regionHeight, height); y++) {
    for (let x = startX; x < Math.min(startX + regionWidth, width); x++) {
      const idx = (y * width + x) * 4;
      r += data[idx];
      g += data[idx + 1];
      b += data[idx + 2];
      count++;
    }
  }
  
  return count > 0 ? {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count)
  } : { r: 0, g: 0, b: 0 };
}

// Helper function to get average color in a triangle
function getAverageColorInTriangle(data, width, height, centerX, centerY, tileSize, triangleHeight) {
  let r = 0, g = 0, b = 0, count = 0;
  
  for (let y = centerY; y < Math.min(centerY + triangleHeight, height); y++) {
    for (let x = centerX; x < Math.min(centerX + tileSize, width); x++) {
      // Simple triangle boundary check
      if (isPointInTriangle(x - centerX, y - centerY, tileSize, triangleHeight)) {
        const idx = (y * width + x) * 4;
        r += data[idx];
        g += data[idx + 1];
        b += data[idx + 2];
        count++;
      }
    }
  }
  
  return count > 0 ? {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count)
  } : { r: 0, g: 0, b: 0 };
}

// Helper function to get average color in a hexagon
function getAverageColorInHexagon(data, width, height, centerX, centerY, radius) {
  let r = 0, g = 0, b = 0, count = 0;
  
  for (let y = Math.max(0, centerY - radius); y < Math.min(height, centerY + radius); y++) {
    for (let x = Math.max(0, centerX - radius); x < Math.min(width, centerX + radius); x++) {
      if (isPointInHexagon(x - centerX, y - centerY, radius)) {
        const idx = (y * width + x) * 4;
        r += data[idx];
        g += data[idx + 1];
        b += data[idx + 2];
        count++;
      }
    }
  }
  
  return count > 0 ? {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count)
  } : { r: 0, g: 0, b: 0 };
}

// Fill square tile with pixelation
function fillSquareTile(data, width, height, startX, startY, tileSize, pixelSize, color) {
  for (let y = startY; y < Math.min(startY + tileSize, height); y += pixelSize) {
    for (let x = startX; x < Math.min(startX + tileSize, width); x += pixelSize) {
      // Fill a pixelSize x pixelSize block
      for (let py = 0; py < pixelSize && y + py < height; py++) {
        for (let px = 0; px < pixelSize && x + px < width; px++) {
          const idx = ((y + py) * width + (x + px)) * 4;
          data[idx] = color.r;
          data[idx + 1] = color.g;
          data[idx + 2] = color.b;
        }
      }
    }
  }
}

// Fill triangle tile with pixelation
function fillTriangleTile(data, width, height, centerX, centerY, tileSize, triangleHeight, pixelSize, color, upward) {
  for (let y = centerY; y < Math.min(centerY + triangleHeight, height); y += pixelSize) {
    for (let x = centerX; x < Math.min(centerX + tileSize, width); x += pixelSize) {
      if (isPointInTriangle(x - centerX, y - centerY, tileSize, triangleHeight)) {
        // Fill a pixelSize x pixelSize block
        for (let py = 0; py < pixelSize && y + py < height; py++) {
          for (let px = 0; px < pixelSize && x + px < width; px++) {
            const idx = ((y + py) * width + (x + px)) * 4;
            data[idx] = color.r;
            data[idx + 1] = color.g;
            data[idx + 2] = color.b;
          }
        }
      }
    }
  }
}

// Fill hexagon tile with pixelation
function fillHexagonTile(data, width, height, centerX, centerY, radius, pixelSize, color) {
  for (let y = Math.max(0, centerY - radius); y < Math.min(height, centerY + radius); y += pixelSize) {
    for (let x = Math.max(0, centerX - radius); x < Math.min(width, centerX + radius); x += pixelSize) {
      if (isPointInHexagon(x - centerX, y - centerY, radius)) {
        // Fill a pixelSize x pixelSize block
        for (let py = 0; py < pixelSize && y + py < height; py++) {
          for (let px = 0; px < pixelSize && x + px < width; px++) {
            const idx = ((y + py) * width + (x + px)) * 4;
            data[idx] = color.r;
            data[idx + 1] = color.g;
            data[idx + 2] = color.b;
          }
        }
      }
    }
  }
}

// Geometric helper functions
function isPointInTriangle(x, y, width, height) {
  // Simple triangle bounds check (equilateral triangle)
  const centerX = width / 2;
  return x >= 0 && x <= width && y >= 0 && y <= height && 
         (x - centerX) / (width / 2) + y / height <= 1;
}

function isPointInHexagon(x, y, radius) {
  const distance = Math.sqrt(x * x + y * y);
  return distance <= radius;
}

// Helper function to check if mosaic adjustments are active
export const hasMosaicAdjustments = (mosaicAdjust) => {
  return mosaicAdjust && mosaicAdjust.size > 1;
};








function applyBlurFilter(canvas, ctx, blurAdjust) {
  const { type, intensity } = blurAdjust;
  
  if (intensity === 0) return;
  
  console.log('Applying blur filter:', blurAdjust);
  
  // Create a temporary canvas for blur processing
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  
  // Copy current canvas to temp canvas
  tempCtx.drawImage(canvas, 0, 0);
  
  if (type === 'circular') {
    applyCircularBlur(canvas, ctx, tempCanvas, intensity);
  } else if (type === 'linear') {
    applyLinearBlur(canvas, ctx, tempCanvas, intensity);
  }
}
// Circular blur implementation (radial blur from center)
function applyCircularBlur(canvas, ctx, sourceCanvas, intensity) {
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
  
  const imageData = ctx.getImageData(0, 0, width, height);
  const sourceImageData = sourceCanvas.getContext('2d').getImageData(0, 0, width, height);
  const data = imageData.data;
  const sourceData = sourceImageData.data;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Calculate distance from center
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const normalizedDistance = distance / maxDistance;
      
      // Calculate blur amount based on distance from center
      const blurAmount = Math.floor(normalizedDistance * intensity / 10);
      
      if (blurAmount > 0) {
        const blurred = getAverageColor(sourceData, x, y, width, height, blurAmount);
        data[idx] = blurred.r;
        data[idx + 1] = blurred.g;
        data[idx + 2] = blurred.b;
        // Alpha remains unchanged
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// Linear blur implementation (motion blur effect)
function applyLinearBlur(canvas, ctx, sourceCanvas, intensity) {
  const width = canvas.width;
  const height = canvas.height;
  
  const imageData = ctx.getImageData(0, 0, width, height);
  const sourceImageData = sourceCanvas.getContext('2d').getImageData(0, 0, width, height);
  const data = imageData.data;
  const sourceData = sourceImageData.data;
  
  const blurDistance = Math.floor(intensity / 5);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Apply horizontal blur
      let r = 0, g = 0, b = 0, count = 0;
      
      for (let i = -blurDistance; i <= blurDistance; i++) {
        const sampleX = Math.max(0, Math.min(width - 1, x + i));
        const sampleIdx = (y * width + sampleX) * 4;
        
        r += sourceData[sampleIdx];
        g += sourceData[sampleIdx + 1];
        b += sourceData[sampleIdx + 2];
        count++;
      }
      
      data[idx] = Math.floor(r / count);
      data[idx + 1] = Math.floor(g / count);
      data[idx + 2] = Math.floor(b / count);
      // Alpha remains unchanged
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// Helper function to get average color in a radius
function getAverageColor(data, centerX, centerY, width, height, radius) {
  let r = 0, g = 0, b = 0, count = 0;
  
  for (let y = Math.max(0, centerY - radius); y <= Math.min(height - 1, centerY + radius); y++) {
    for (let x = Math.max(0, centerX - radius); x <= Math.min(width - 1, centerX + radius); x++) {
      const idx = (y * width + x) * 4;
      r += data[idx];
      g += data[idx + 1];
      b += data[idx + 2];
      count++;
    }
  }
  
  return {
    r: Math.floor(r / count),
    g: Math.floor(g / count),
    b: Math.floor(b / count)
  };
}
export const hasBlurAdjustments = (blurAdjust) => {
  return blurAdjust && blurAdjust.intensity > 0 && (blurAdjust.preview || blurAdjust.applied);
};