import React from 'react';
import { Grid, Square, Triangle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilter, resetFilterCategory } from '../../../../../../../app/store/slices/filtersSlice';
import { useMobileSliders } from "../../../constants/MobileSlider";
import { useDesktopSliders } from "../../../constants/DesktopSliders";
import { MobileSliderContainer } from "../../../components/MobileSlider";
import { DesktopSliderContainer } from "../../../components/DesktopSlider";

// Mosaic filter functions (same as before)
const applyMosaicFilter = (data, width, height, mosaicAdjust) => {
  const { type = 'square', size = 10, pixelSize = 1 } = mosaicAdjust;
  
  console.log('Mosaic params:', { type, size, pixelSize });
  
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

// [Include all the helper functions from your original code - applySquareMosaic, applyTriangularMosaic, etc.]
const applySquareMosaic = (data, originalData, width, height, tileSize, pixelSize) => {
  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      const avgColor = getAverageColorInRegion(originalData, width, height, x, y, 
        Math.min(tileSize, width - x), Math.min(tileSize, height - y));
      fillSquareTile(data, width, height, x, y, tileSize, pixelSize, avgColor);
    }
  }
};

const applyTriangularMosaic = (data, originalData, width, height, tileSize, pixelSize) => {
  const triangleHeight = Math.floor(tileSize * 0.866);
  
  for (let row = 0; row < Math.ceil(height / triangleHeight); row++) {
    for (let col = 0; col < Math.ceil(width / tileSize); col++) {
      const y = row * triangleHeight;
      const x = col * tileSize + (row % 2) * (tileSize / 2);
      
      if (x < width && y < height) {
        const avgColor = getAverageColorInTriangle(originalData, width, height, x, y, tileSize, triangleHeight);
        fillTriangleTile(data, width, height, x, y, tileSize, triangleHeight, pixelSize, avgColor, row % 2 === 0);
      }
    }
  }
};

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

// [Include all other helper functions from your original code]
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

const getAverageColorInTriangle = (data, width, height, centerX, centerY, tileSize, triangleHeight) => {
  let r = 0, g = 0, b = 0, count = 0;
  
  for (let y = centerY; y < Math.min(centerY + triangleHeight, height); y++) {
    for (let x = centerX; x < Math.min(centerX + tileSize, width); x++) {
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

const fillSquareTile = (data, width, height, startX, startY, tileSize, pixelSize, color) => {
  for (let y = startY; y < Math.min(startY + tileSize, height); y += pixelSize) {
    for (let x = startX; x < Math.min(startX + tileSize, width); x += pixelSize) {
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

const fillTriangleTile = (data, width, height, centerX, centerY, tileSize, triangleHeight, pixelSize, color, upward) => {
  for (let y = centerY; y < Math.min(centerY + triangleHeight, height); y += pixelSize) {
    for (let x = centerX; x < Math.min(centerX + tileSize, width); x += pixelSize) {
      if (isPointInTriangle(x - centerX, y - centerY, tileSize, triangleHeight)) {
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

const fillHexagonTile = (data, width, height, centerX, centerY, radius, pixelSize, color) => {
  for (let y = Math.max(0, centerY - radius); y < Math.min(height, centerY + radius); y += pixelSize) {
    for (let x = Math.max(0, centerX - radius); x < Math.min(width, centerX + radius); x += pixelSize) {
      if (isPointInHexagon(x - centerX, y - centerY, radius)) {
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

const isPointInTriangle = (x, y, width, height) => {
  const centerX = width / 2;
  return x >= 0 && x <= width && y >= 0 && y <= height && 
         (x - centerX) / (width / 2) + y / height <= 1;
};

const isPointInHexagon = (x, y, radius) => {
  const distance = Math.sqrt(x * x + y * y);
  return distance <= radius;
};

const hasMosaicAdjustments = (mosaicAdjust) => {
  return mosaicAdjust && mosaicAdjust.size > 1;
};

// Visual Type Selector Component for Mobile
const MobileMosaicTypeSelector = ({ selectedType, onTypeChange }) => {
  const mosaicTypes = [
    {
      type: 'square',
      name: 'Square',
      icon: '▦',
      preview: (
        <div className="w-full h-full grid grid-cols-2 gap-[1px] bg-gray-600 p-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`${i % 2 === 0 ? 'bg-gray-400' : 'bg-gray-300'} rounded-[1px]`}></div>
          ))}
        </div>
      )
    },
    {
      type: 'triangular',
      name: 'Triangular',
      icon: '▲',
      preview: (
        <div className="w-full h-full flex items-center justify-center bg-gray-600 relative overflow-hidden">
          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-gray-400 absolute top-1"></div>
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-gray-300 absolute bottom-1 left-2"></div>
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-gray-500 absolute bottom-1 right-2"></div>
        </div>
      )
    },
    {
      type: 'hexagonal',
      name: 'Hexagonal',
      icon: '⬢',
      preview: (
        <div className="w-full h-full flex items-center justify-center bg-gray-600 relative overflow-hidden">
          <div className="w-3 h-3 bg-gray-400 transform rotate-45 absolute top-1 left-1"></div>
          <div className="w-3 h-3 bg-gray-300 transform rotate-45 absolute top-1 right-1"></div>
          <div className="w-3 h-3 bg-gray-500 transform rotate-45 absolute bottom-1 left-1/2 transform -translate-x-1/2"></div>
        </div>
      )
    }
  ];

  return (
    <div className="flex items-center space-x-2 mb-3 overflow-x-auto pb-1">
      {mosaicTypes.map(({ type, name, icon, preview }) => (
        <div
          key={type}
          className={`
            flex-shrink-0 cursor-pointer rounded-lg transition-all duration-200
            ${selectedType === type 
              ? 'bg-purple-500/20 border-2 border-purple-400 shadow-lg scale-105' 
              : 'bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50 hover:scale-102'
            }
            backdrop-blur-sm hover:shadow-md active:scale-95
            min-w-[70px]
          `}
          onClick={() => onTypeChange(type)}
        >
          <div className="p-2">
            <div className={`
              aspect-square rounded-md overflow-hidden mb-1
              ${selectedType === type ? 'bg-gray-700' : 'bg-gray-750'}
            `}>
              {preview}
            </div>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg">{icon}</span>
              <span className={`
                text-xs font-medium whitespace-nowrap
                ${selectedType === type ? 'text-purple-300' : 'text-gray-400'}
              `}>
                {name}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Desktop Visual Type Selector Component
const DesktopMosaicTypeSelector = ({ selectedType, onTypeChange }) => {
  const mosaicTypes = [
    {
      type: 'square',
      name: 'Square',
      preview: (
        <div className="w-full h-full grid grid-cols-3 gap-px bg-gray-600">
          {[...Array(9)].map((_, i) => (
            <div key={i} className={`${i % 2 === 0 ? 'bg-gray-400' : 'bg-gray-300'}`}></div>
          ))}
        </div>
      )
    },
    {
      type: 'triangular',
      name: 'Triangular',
      preview: (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-600 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-gray-400 absolute top-1 left-1/2 transform -translate-x-1/2"></div>
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[26px] border-l-transparent border-r-transparent border-t-gray-300 absolute bottom-1 left-1/4 transform -translate-x-1/2"></div>
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[26px] border-l-transparent border-r-transparent border-t-gray-500 absolute bottom-1 right-1/4 transform translate-x-1/2"></div>
          </div>
        </div>
      )
    },
    {
      type: 'hexagonal',
      name: 'Hexagonal',
      preview: (
        <div className="w-full h-full flex items-center justify-center bg-gray-600 relative overflow-hidden">
          <div className="w-6 h-6 bg-gray-400 transform rotate-45 absolute top-2 left-2"></div>
          <div className="w-6 h-6 bg-gray-300 transform rotate-45 absolute top-2 right-2"></div>
          <div className="w-6 h-6 bg-gray-500 transform rotate-45 absolute bottom-2 left-1/2 transform -translate-x-1/2 rotate-45"></div>
        </div>
      )
    }
  ];

  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-2">
        {mosaicTypes.map(({ type, name, preview }) => (
          <div
            key={type}
            className={`flex-1 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
              selectedType === type 
                ? 'border-purple-500 shadow-lg' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onClick={() => onTypeChange(type)}
          >
            <div className="aspect-square bg-gray-700 p-2">
              {preview}
            </div>
            <div className={`text-center py-1 text-xs ${
              selectedType === type ? 'text-purple-400' : 'text-gray-400'
            }`}>
              {name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MosaicComponent = ({
  isMobile = false,
  expandedSliders,
  onToggleSlider
}) => {
  const dispatch = useDispatch();
  const mosaicAdjust = useSelector(state => state.filters.mosaicAdjust);

  // Define mosaic-specific sliders (without type selector since we have visual selector)
  const mosaicAdjustSliders = [
    { 
      key: 'size', 
      label: 'Size', 
      icon: (props) => <Square size={16} {...props} />, 
      color: 'purple', 
      min: 1, 
      max: 50, 
      defaultValue: 10 
    },
    { 
      key: 'pixelSize', 
      label: 'Pixel Size', 
      icon: (props) => <Triangle size={16} {...props} />, 
      color: 'purple', 
      min: 1, 
      max: 10, 
      defaultValue: 1 
    },
  ];

  const handleMosaicAdjustChange = (property, value) => {
    const processedValue = property === 'type' ? value : parseInt(value);
    
    dispatch(updateFilter({
      category: 'mosaicAdjust',
      values: { [property]: processedValue }
    }));
  };

  const handleTypeChange = (type) => {
    dispatch(updateFilter({
      category: 'mosaicAdjust',
      values: { type }
    }));
  };

  const resetMosaicAdjust = () => {
    dispatch(resetFilterCategory('mosaicAdjust'));
  };

  if (isMobile) {
    return (
      <div className="relative">
        <MobileMosaicTypeSelector 
          selectedType={mosaicAdjust.type} 
          onTypeChange={handleTypeChange} 
        />
        <MobileSliderContainer
          sliders={mosaicAdjustSliders}
          values={mosaicAdjust}
          handleChange={handleMosaicAdjustChange}
          resetFunction={resetMosaicAdjust}
          expandedSliders={expandedSliders}
          onToggleSlider={onToggleSlider}
        />
      </div>
    );
  }

  return (
    <div>
      <DesktopMosaicTypeSelector 
        selectedType={mosaicAdjust.type} 
        onTypeChange={handleTypeChange} 
      />
      <DesktopSliderContainer
        sliders={mosaicAdjustSliders}
        values={mosaicAdjust}
        handleChange={handleMosaicAdjustChange}
        resetFunction={resetMosaicAdjust}
      />
    </div>
  );
};

export { applyMosaicFilter, hasMosaicAdjustments };
export default MosaicComponent;