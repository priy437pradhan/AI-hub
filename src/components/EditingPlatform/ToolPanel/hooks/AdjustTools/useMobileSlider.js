import { 
  Sun, 
  Droplets, 
  Focus, 
  Camera, 
  Lightbulb, 
  Square, 
  Circle, 
  Eye, 
  Thermometer, 
  Palette, 
  Move, 
  Zap 
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
    { key: 'exposure', label: 'Exposure', icon: Camera, color: 'blue' },
    { key: 'highlights', label: 'Highlights', icon: Lightbulb, color: 'blue' },
    { key: 'shadows', label: 'Shadows', icon: Square, color: 'blue' },
    { key: 'whites', label: 'Whites', icon: Circle, color: 'blue' },
    { key: 'blacks', label: 'Blacks', icon: Square, color: 'blue' },
    { key: 'vibrance', label: 'Vibrance', icon: Eye, color: 'blue' },
    { key: 'clarity', label: 'Clarity', icon: Focus, color: 'blue' },
    { key: 'dehaze', label: 'Dehaze', icon: Eye, color: 'blue' }
  ];

  const colorAdjustSliders = [
    { key: 'temperature', label: 'Temperature', icon: Thermometer, color: 'blue', minWidth: '60px' },
    { key: 'tint', label: 'Tint', icon: Palette, color: 'blue', minWidth: '60px' },
    { key: 'hue', label: 'Hue', icon: Circle, color: 'blue', minWidth: '60px' },
    { key: 'luminance', label: 'Luminance', icon: Sun, color: 'blue', minWidth: '60px' }
  ];

  const vignetteSliders = [
    { key: 'amount', label: 'Amount', icon: Circle, color: 'red', min: -100, max: 100 },
    { key: 'midpoint', label: 'Midpoint', icon: Move, color: 'blue', min: 0, max: 100 },
    { key: 'roundness', label: 'Roundness', icon: Circle, color: 'green', min: -100, max: 100 },
    { key: 'feather', label: 'Feather', icon: Droplets, color: 'purple', min: 0, max: 100 }
  ];

  return {
    createSliderConfig,
    basicAdjustSliders,
    colorAdjustSliders,
    vignetteSliders
  };
};
