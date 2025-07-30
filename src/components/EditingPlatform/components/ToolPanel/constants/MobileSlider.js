import { 
  Sun, Droplets, Focus, Circle, Thermometer, 
  Palette, Zap, Moon, Grid, Square, Triangle, Hexagon 
} from "lucide-react";

const Contrast = Circle;

export const useMobileSliders = () => {
  const createSliderConfig = (sliders, handleChange, resetFunction) => ({
    sliders,
    handleChange,
    resetFunction
  });

  const basicAdjustSliders = [
    { key: 'brightness', label: 'Brightness', icon: Sun, color: 'blue' },
    { key: 'contrast', label: 'Contrast', icon: Contrast, color: 'blue' },
    { key: 'saturation', label: 'Saturation', icon: Droplets, color: 'blue' },
    { key: 'sharpness', label: 'Sharpness', icon: Focus, color: 'blue' },
  ];

  const colorAdjustSliders = [
    { key: 'temperature', label: 'Temperature', icon: Thermometer, color: 'blue', minWidth: '60px' },
    { key: 'tint', label: 'Tint', icon: Palette, color: 'blue', minWidth: '60px' },
    { key: 'invertcolors', label: 'Invert Colors', icon: Palette, color: 'blue', minWidth: '60px' },
  ];

  const fineTuneSliders = [
    { key: 'exposure', label: 'Exposure', icon: Sun, color: 'blue', min: -100, max: 100 },
    { key: 'highlights', label: 'Highlights', icon: Zap, color: 'blue', min: -100, max: 100 },
    { key: 'shadows', label: 'Shadows', icon: Moon, color: 'blue', min: -100, max: 100 }
  ];

  const structureAdjustSliders = [
    { key: 'details', label: 'Details', icon: Sun, color: 'blue', min: -100, max: 100 },
    { key: 'gradient', label: 'Gradient', icon: Sun, color: 'blue', min: -100, max: 100 }
  ];

  const denoiseAdjustSliders = [
    { key: 'luminancenoise', label: 'Luminance Noise', icon: Sun, color: 'blue', min: -100, max: 100 },
    { key: 'colornoise', label: 'Color Noise', icon: Palette, color: 'blue', min: -100, max: 100 }
  ];

  const vignetteAdjustSliders = [
    { key: 'intensity', label: 'Intensity', icon: Focus, color: 'blue', min: -100, max: 100 },
    { key: 'size', label: 'Size', icon: Circle, color: 'blue', min: 0, max: 100, defaultValue: 50 },
    { key: 'feather', label: 'Feather', icon: Zap, color: 'blue', min: 0, max: 100, defaultValue: 50 },
  ];

  const mosaicAdjustSliders = [
    { 
      key: 'type', 
      label: 'Type', 
      icon: Grid, 
      color: 'purple', 
      type: 'select',
      options: [
        { value: 'square', label: 'Square' },
        { value: 'triangular', label: 'Triangular' },
        { value: 'hexagonal', label: 'Hexagonal' }
      ],
      defaultValue: 'square'
    },
    { key: 'size', label: 'Size', icon: Square, color: 'purple', min: 1, max: 50, defaultValue: 10 },
    { key: 'pixelSize', label: 'Pixel Size', icon: Triangle, color: 'purple', min: 1, max: 10, defaultValue: 1 },
  ];

  const blurAdjustSliders = [
    { key: 'intensity', label: 'Intensity', icon: Moon, color: 'blue', min: 0, max: 100 },
  ];

  return {
    createSliderConfig,
    basicAdjustSliders,
    colorAdjustSliders,
    fineTuneSliders,
    structureAdjustSliders,
    denoiseAdjustSliders,
    vignetteAdjustSliders,
    mosaicAdjustSliders,
    blurAdjustSliders
  };
};
