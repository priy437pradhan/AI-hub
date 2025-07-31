import React from 'react';
// import { Circle, Minus, Blur } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilter, resetFilterCategory } from '../../../../../../../app/store/slices/filtersSlice';
import { useMobileSliders } from "../../../constants/MobileSlider";
import { useDesktopSliders } from "../../../constants/DesktopSliders";
import { MobileSliderContainer } from "../../../components/MobileSlider";
import { DesktopSliderContainer } from "../../../components/DesktopSlider";

// Blur filter functions (same as your original)
const applyBlurFilter = (canvas, ctx, blurAdjust) => {
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
};

// Circular blur implementation (radial blur from center)
const applyCircularBlur = (canvas, ctx, sourceCanvas, intensity) => {
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
};

// Linear blur implementation (motion blur effect)
const applyLinearBlur = (canvas, ctx, sourceCanvas, intensity) => {
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
};

// Helper function to get average color in a radius
const getAverageColor = (data, centerX, centerY, width, height, radius) => {
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
};

const hasBlurAdjustments = (blurAdjust) => {
  return blurAdjust && blurAdjust.intensity > 0;
};

// Resize Handle Component for Blur Manual Adjustment
const ResizeHandle = ({ position, onResize, cursor = "nwse-resize" }) => {
  const getPositionClasses = (pos) => {
    switch (pos) {
      case 'top-left':
        return '-left-2 -top-2';
      case 'top':
        return 'left-1/2 -translate-x-1/2 -top-2';
      case 'top-right':
        return '-right-2 -top-2';
      case 'left':
        return '-left-2 top-1/2 -translate-y-1/2';
      case 'right':
        return '-right-2 top-1/2 -translate-y-1/2';
      case 'bottom-left':
        return '-left-2 -bottom-2';
      case 'bottom':
        return 'left-1/2 -translate-x-1/2 -bottom-2';
      case 'bottom-right':
        return '-right-2 -bottom-2';
      default:
        return '-right-2 -bottom-2';
    }
  };

  const getCursorClass = (cursorType) => {
    const cursorMap = {
      'nwse-resize': 'cursor-nw-resize',
      'nesw-resize': 'cursor-ne-resize', 
      'ns-resize': 'cursor-ns-resize',
      'ew-resize': 'cursor-ew-resize',
      'move': 'cursor-move'
    };
    return cursorMap[cursorType] || 'cursor-nw-resize';
  };

  const handleMouseDown = (e) => {
    const directionMap = {
      'top-left': 'top-left',
      'top': 'top',
      'top-right': 'top-right', 
      'left': 'left',
      'right': 'right',
      'bottom-left': 'bottom-left',
      'bottom': 'bottom',
      'bottom-right': 'bottom-right'
    };
    
    const direction = directionMap[position] || position;
    onResize(e, direction);
  };

  return (
    <div
      className={`resize-handle absolute ${getPositionClasses(position)} w-4 h-4 bg-blue-500 border-2 border-white rounded-full ${getCursorClass(cursor)} touch-none z-30 hover:bg-blue-600 transition-colors`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{ cursor: cursor }}
    />
  );
};

// Blur Manual Adjustment Overlay
const BlurManualOverlay = ({ blurAdjust, onAdjustmentChange, imageWidth, imageHeight }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);
  
  // Default blur area settings (can be adjusted manually)
  const [blurArea, setBlurArea] = React.useState({
    x: 25, // percentage
    y: 25, // percentage  
    width: 50, // percentage
    height: 50 // percentage
  });

  const handleDrag = React.useCallback((e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    setBlurArea(prev => ({
      ...prev,
      x: Math.max(0, Math.min(100 - prev.width, x)),
      y: Math.max(0, Math.min(100 - prev.height, y))
    }));
  }, [isDragging]);

  const handleResize = React.useCallback((e, direction) => {
    setIsResizing(true);
    
    const handleMouseMove = (moveEvent) => {
      const rect = e.currentTarget.parentElement.parentElement.getBoundingClientRect();
      const clientX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const clientY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;
      
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      
      setBlurArea(prev => {
        let newArea = { ...prev };
        
        if (direction.includes('right')) {
          newArea.width = Math.max(10, Math.min(100 - prev.x, x - prev.x));
        }
        if (direction.includes('bottom')) {
          newArea.height = Math.max(10, Math.min(100 - prev.y, y - prev.y));
        }
        if (direction.includes('left')) {
          const newWidth = prev.width + (prev.x - x);
          if (newWidth >= 10 && x >= 0) {
            newArea.x = x;
            newArea.width = newWidth;
          }
        }
        if (direction.includes('top')) {
          const newHeight = prev.height + (prev.y - y);
          if (newHeight >= 10 && y >= 0) {
            newArea.y = y;
            newArea.height = newHeight;
          }
        }
        
        return newArea;
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
  }, []);

  React.useEffect(() => {
    const handleMouseMove = (e) => handleDrag(e);
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleDrag]);

  if (blurAdjust.intensity === 0) return null;

  return (
    <div
      className={`absolute ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: `${blurArea.x}%`,
        top: `${blurArea.y}%`,
        width: `${blurArea.width}%`,
        height: `${blurArea.height}%`,
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
    >
      {/* Blur overlay visualization */}
      <div className="absolute inset-0 border-2 border-blue-400 bg-blue-400/10 rounded-lg">
        {blurAdjust.type === 'circular' && (
          <div className="absolute inset-0 rounded-full border-2 border-blue-500 bg-blue-500/10" />
        )}
        
        {/* Center dot for circular blur */}
        {blurAdjust.type === 'circular' && (
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        )}
        
        {/* Direction indicator for linear blur */}
        {blurAdjust.type === 'linear' && (
          <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-blue-500 transform -translate-y-1/2">
            <div className="absolute right-0 top-1/2 w-0 h-0 border-l-2 border-t-1 border-b-1 border-l-blue-500 border-t-transparent border-b-transparent transform -translate-y-1/2" />
          </div>
        )}
      </div>

      {/* Resize handles */}
      <ResizeHandle position="top-left" onResize={handleResize} cursor="nwse-resize" />
      <ResizeHandle position="top-right" onResize={handleResize} cursor="nesw-resize" />
      <ResizeHandle position="bottom-left" onResize={handleResize} cursor="nesw-resize" />
      <ResizeHandle position="bottom-right" onResize={handleResize} cursor="nwse-resize" />
      <ResizeHandle position="top" onResize={handleResize} cursor="ns-resize" />
      <ResizeHandle position="bottom" onResize={handleResize} cursor="ns-resize" />
      <ResizeHandle position="left" onResize={handleResize} cursor="ew-resize" />
      <ResizeHandle position="right" onResize={handleResize} cursor="ew-resize" />

      {/* Info display */}
      <div className="absolute -top-8 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
        {blurAdjust.type === 'circular' ? 'Circular' : 'Linear'} Blur: {blurAdjust.intensity}%
      </div>
    </div>
  );
};

// Mobile Visual Type Selector Component
const MobileBlurTypeSelector = ({ selectedType, onTypeChange }) => {
  const blurTypes = [
    {
      type: 'circular',
      name: 'Circular',
      icon: '○',
      preview: (
        <div className="w-full h-full bg-gradient-radial from-gray-300 via-gray-400 to-gray-600 rounded-full opacity-80"></div>
      )
    },
    {
      type: 'linear',
      name: 'Linear',
      icon: '━',
      preview: (
        <div className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 opacity-80"></div>
      )
    }
  ];

  return (
    <div className="flex items-center space-x-2 mb-3 overflow-x-auto pb-1">
      {blurTypes.map(({ type, name, icon, preview }) => (
        <div
          key={type}
          className={`
            flex-shrink-0 cursor-pointer rounded-lg transition-all duration-200
            ${selectedType === type 
              ? 'bg-blue-500/20 border-2 border-blue-400 shadow-lg scale-105' 
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
                ${selectedType === type ? 'text-blue-300' : 'text-gray-400'}
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
const DesktopBlurTypeSelector = ({ selectedType, onTypeChange }) => {
  const blurTypes = [
    {
      type: 'circular',
      name: 'Circular',
      preview: (
        <div className="w-full h-full bg-gradient-radial from-gray-300 via-gray-400 to-gray-700 rounded-lg opacity-90"></div>
      )
    },
    {
      type: 'linear',
      name: 'Linear',
      preview: (
        <div className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-700 rounded-lg opacity-90"></div>
      )
    }
  ];

  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-2">
        {blurTypes.map(({ type, name, preview }) => (
          <div
            key={type}
            className={`flex-1 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
              selectedType === type 
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onClick={() => onTypeChange(type)}
          >
            <div className="aspect-square bg-gray-700 p-2">
              {preview}
            </div>
            <div className={`text-center py-1 text-xs ${
              selectedType === type ? 'text-blue-400' : 'text-gray-400'
            }`}>
              {name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BlurComponent = ({
  isMobile = false,
  expandedSliders,
  onToggleSlider,
  showManualAdjustment = false,
  imageWidth,
  imageHeight
}) => {
  const dispatch = useDispatch();
  const blurAdjust = useSelector(state => state.filters.blurAdjust);

  // Define blur-specific sliders
  const blurAdjustSliders = [
    { 
      key: 'intensity', 
      label: 'Intensity', 
      icon: (props) => <Blur size={16} {...props} />, 
      color: 'blue', 
      min: 0, 
      max: 100, 
      defaultValue: 0 
    }
  ];

  // DIRECT APPLICATION - no need for apply button
  const handleBlurAdjustChange = (property, value) => {
    const processedValue = property === 'type' ? value : parseInt(value);
    
    // Directly apply the blur without preview/applied state
    dispatch(updateFilter({
      category: 'blurAdjust',
      values: { 
        [property]: processedValue
      }
    }));
  };

  const handleTypeChange = (type) => {
    dispatch(updateFilter({
      category: 'blurAdjust',
      values: { type }
    }));
  };

  const resetBlurAdjust = () => {
    dispatch(resetFilterCategory('blurAdjust'));
  };

  if (isMobile) {
    return (
      <div className="relative">
        <MobileBlurTypeSelector 
          selectedType={blurAdjust.type} 
          onTypeChange={handleTypeChange} 
        />
        <MobileSliderContainer
          sliders={blurAdjustSliders}
          values={blurAdjust}
          handleChange={handleBlurAdjustChange}
          resetFunction={resetBlurAdjust}
          expandedSliders={expandedSliders}
          onToggleSlider={onToggleSlider}
        />
        
        {/* Manual adjustment overlay for mobile */}
        {showManualAdjustment && (
          <BlurManualOverlay 
            blurAdjust={blurAdjust}
            onAdjustmentChange={handleBlurAdjustChange}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <DesktopBlurTypeSelector 
        selectedType={blurAdjust.type} 
        onTypeChange={handleTypeChange} 
      />
      <DesktopSliderContainer
        sliders={blurAdjustSliders}
        values={blurAdjust}
        handleChange={handleBlurAdjustChange}
        resetFunction={resetBlurAdjust}
      />
      
      {/* Manual adjustment overlay for desktop */}
      {showManualAdjustment && (
        <BlurManualOverlay 
          blurAdjust={blurAdjust}
          onAdjustmentChange={handleBlurAdjustChange}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
        />
      )}
    </div>
  );
};

export { applyBlurFilter, hasBlurAdjustments };
export default BlurComponent;