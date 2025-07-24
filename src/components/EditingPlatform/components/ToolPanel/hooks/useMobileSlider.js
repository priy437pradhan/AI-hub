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
  Zap ,
  Moon
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

  const finetuneSliders = [
    
    { key: 'exposure', label: 'Exposure', icon: Sun, color: 'yellow', min: -100, max: 100 },
    { key: 'highlights', label: 'Highlights', icon: Zap, color: 'orange', min: -100, max: 100 },
    { key: 'shadows', label: 'Shadows', icon: Moon, color: 'gray', min: -100, max: 100 }
];

  return {
    createSliderConfig,
    basicAdjustSliders,
    colorAdjustSliders,
    finetuneSliders 
  };
};
