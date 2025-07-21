// hooks/useDesktopSliders.js
import { Sun, Contrast, Droplets, Focus, Camera, Lightbulb, Square, Circle, Eye, Thermometer, Palette, Move ,Zap } from 'lucide-react';

export const useDesktopSliders = () => {
  const basicAdjustSliders = [
    { key: 'brightness', label: 'Brightness', icon: <Sun size={14} />, color: 'blue' },
    { key: 'contrast', label: 'Contrast', icon: <Contrast size={14} />, color: 'blue' },
    { key: 'saturation', label: 'Saturation', icon: <Droplets size={14} />, color: 'blue' },
    { key: 'sharpness', label: 'Sharpness', icon: <Focus size={14} />, color: 'blue' },
    { key: 'exposure', label: 'Exposure', icon: <Camera size={14} />, color: 'blue' },
    { key: 'highlights', label: 'Highlights', icon: <Lightbulb size={14} />, color: 'blue' },
    { key: 'shadows', label: 'Shadows', icon: <Square size={14} />, color: 'blue' },
    { key: 'whites', label: 'Whites', icon: <Circle size={14} />, color: 'blue' },
    { key: 'blacks', label: 'Blacks', icon: <Square size={14} />, color: 'blue' },
    { key: 'vibrance', label: 'Vibrance', icon: <Eye size={14} />, color: 'blue' },
    { key: 'clarity', label: 'Clarity', icon: <Focus size={14} />, color: 'blue' },
    { key: 'dehaze', label: 'Dehaze', icon: <Eye size={14} />, color: 'blue' }
  ];

  const colorAdjustSliders = [
    { key: 'temperature', label: 'Temperature', icon: <Thermometer size={14} />, color: 'blue' },
    { key: 'tint', label: 'Tint', icon: <Palette size={14} />, color: 'blue' },
    { key: 'hue', label: 'Hue', icon: <Circle size={14} />, color: 'blue' },
    { key: 'luminance', label: 'Luminance', icon: <Sun size={14} />, color: 'blue' }
  ];

  const vignetteSliders = [
    { key: 'amount', label: 'Amount', icon: <Circle size={14} />, color: 'red', min: -100, max: 100 },
    { key: 'midpoint', label: 'Midpoint', icon: <Move size={14} />, color: 'blue', min: 0, max: 100 },
    { key: 'roundness', label: 'Roundness', icon: <Circle size={14} />, color: 'green', min: -100, max: 100 },
    { key: 'feather', label: 'Feather', icon: <Droplets size={14} />, color: 'purple', min: 0, max: 100 }
  ];

  return {
    basicAdjustSliders,
    colorAdjustSliders,
    vignetteSliders
  };
};