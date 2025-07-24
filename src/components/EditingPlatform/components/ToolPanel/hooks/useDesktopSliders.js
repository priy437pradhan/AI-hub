// hooks/useDesktopSliders.js
import { Sun, Contrast, Droplets, Focus, Camera, Lightbulb, Square, Circle, Eye, Thermometer, Palette, Move ,Zap , Moon } from 'lucide-react';

export const useDesktopSliders = () => {
  const basicAdjustSliders = [
    { key: 'brightness', label: 'Brightness', icon: <Sun size={14} />, color: 'blue' },
    { key: 'contrast', label: 'Contrast', icon: <Contrast size={14} />, color: 'blue' },
    { key: 'saturation', label: 'Saturation', icon: <Droplets size={14} />, color: 'blue' },
    { key: 'sharpness', label: 'Sharpness', icon: <Focus size={14} />, color: 'blue' },
  
  ];

  const colorAdjustSliders = [
    { key: 'temperature', label: 'Temperature', icon: <Thermometer size={14} />, color: 'blue' },
    { key: 'tint', label: 'Tint', icon: <Palette size={14} />, color: 'blue' },
    { key: 'invertcolors', label: 'Invert Colors', icon: <Palette size={14} />, color: 'blue' },

  ];
  const fineTuneSliders = [
    { key: 'exposure', label: 'Exposure', icon: <Sun size={14} />, color: 'blue', min: -100, max: 100 },
    { key: 'highlights', label: 'Highlights', icon: <Zap size={14} />, color: 'blue', min: -100, max: 100 },
    { key: 'shadows', label: 'Shadows', icon: <Moon size={14} />, color: 'blue', min: -100, max: 100 }
  ];

  return {
    basicAdjustSliders,
    colorAdjustSliders,
    fineTuneSliders
  };
};