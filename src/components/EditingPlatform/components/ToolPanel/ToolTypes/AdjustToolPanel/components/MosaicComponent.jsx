import React from 'react';
import { Grid, Square, Triangle } from 'lucide-react';
import { useMobileSliders } from "../../../constants/MobileSlider";
import { useDesktopSliders } from "../../../constants/DesktopSliders";
import { MobileSliderContainer } from "../../../components/MobileSlider";
import { DesktopSliderContainer } from "../../../components/DesktopSlider";

// Mosaic filter functions integrated into component
const applyMosaicFilter = (data, width, height, mosaicAdjust) => {
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
};

// Square mosaic implementation
const applySquareMosaic = (data, originalData, width, height, tileSize, pixelSize) => {
  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      // Calculate average color for this tile
      const avgColor = getAverageColorInRegion(originalData, width, height, x, y, 
        Math.min(tileSize, width - x), Math.min(tileSize, height - y));
      
      // Fill the tile with the average color, considering pixelSize
      fillSquareTile(data, width, height, x, y, tileSize, pixelSize, avgColor);
    }
  }
};

// Triangular mosaic implementation
const applyTriangularMosaic = (data, originalData, width, height, tileSize, pixelSize) => {
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
};

// Hexagonal mosaic implementation
const applyHexagonalMosaic = (data, originalData, width, height, tileSize, pixelSize) => {
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
};

// Helper function to get average color in a rectangular region
const getAverageColorInRegion = (data, width, height, startX, startY, regionWidth, regionHeight) => {
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
};

// Helper function to get average color in a triangle
const getAverageColorInTriangle = (data, width, height, centerX, centerY, tileSize, triangleHeight) => {
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
};

// Helper function to get average color in a hexagon
const getAverageColorInHexagon = (data, width, height, centerX, centerY, radius) => {
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
};

// Fill square tile with pixelation
const fillSquareTile = (data, width, height, startX, startY, tileSize, pixelSize, color) => {
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
};

// Fill triangle tile with pixelation
const fillTriangleTile = (data, width, height, centerX, centerY, tileSize, triangleHeight, pixelSize, color, upward) => {
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
};

// Fill hexagon tile with pixelation
const fillHexagonTile = (data, width, height, centerX, centerY, radius, pixelSize, color) => {
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
};

// Geometric helper functions
const isPointInTriangle = (x, y, width, height) => {
  // Simple triangle bounds check (equilateral triangle)
  const centerX = width / 2;
  return x >= 0 && x <= width && y >= 0 && y <= height && 
         (x - centerX) / (width / 2) + y / height <= 1;
};

const isPointInHexagon = (x, y, radius) => {
  const distance = Math.sqrt(x * x + y * y);
  return distance <= radius;
};

// Helper function to check if mosaic adjustments are active
const hasMosaicAdjustments = (mosaicAdjust) => {
  return mosaicAdjust && mosaicAdjust.size > 1;
};

const MosaicComponent = ({
  mosaicAdjust,
  setMosaicAdjust,
  isMobile = false,
  expandedSliders,
  onToggleSlider
}) => {
  // Define sliders with proper JSX icons instead of using hooks
  const mosaicAdjustSliders = [
    { 
      key: 'type', 
      label: 'Type', 
      icon: <Grid size={16} />, 
      color: 'purple', 
      type: 'select',
      options: [
        { value: 'square', label: 'Square' },
        { value: 'triangular', label: 'Triangular' },
        { value: 'hexagonal', label: 'Hexagonal' }
      ],
      defaultValue: 'square'
    },
    { key: 'size', label: 'Size', icon: <Square size={16} />, color: 'purple', min: 1, max: 50, defaultValue: 10 },
    { key: 'pixelSize', label: 'Pixel Size', icon: <Triangle size={16} />, color: 'purple', min: 1, max: 10, defaultValue: 1 },
  ];

  const mobileMosaicAdjustSliders = mosaicAdjustSliders; // Use the same for mobile

  const handleMosaicAdjustChange = (property, value) => {
    if (property === 'type') {
      setMosaicAdjust((prev) => ({ ...prev, [property]: value }));
    } else {
      setMosaicAdjust((prev) => ({ ...prev, [property]: parseInt(value) }));
    }
  };

  const resetMosaicAdjust = () => {
    setMosaicAdjust({
      type: 'square', 
      size: 0, 
      pixelSize: 1,
    });
  };

  if (isMobile) {
    return (
      <MobileSliderContainer
        sliders={mobileMosaicAdjustSliders}
        values={mosaicAdjust}
        handleChange={handleMosaicAdjustChange}
        resetFunction={resetMosaicAdjust}
        expandedSliders={expandedSliders}
        onToggleSlider={onToggleSlider}
      />
    );
  }

  return (
    <DesktopSliderContainer
      sliders={mosaicAdjustSliders}
      values={mosaicAdjust}
      handleChange={handleMosaicAdjustChange}
      resetFunction={resetMosaicAdjust}
    />
  );
};


export { applyMosaicFilter, hasMosaicAdjustments };
export default MosaicComponent;