import {
    ChevronUp, ChevronDown, ArrowRight, FlipHorizontal, FlipVertical, Wand2, Sparkles, Smile, Square, Type, Image,
    Sliders, Paintbrush, Sun, Contrast, CircleDot, Palette, Layers, PenTool, ImagePlus, Sticker, ShapesIcon, Frame,
    SquareCode, Circle, BadgePlus, Shapes, Repeat, RotateCcw, RotateCw, ListFilter
  } from 'lucide-react';
  
  export const Icons = {
    ChevronUp, ChevronDown, ArrowRight, FlipHorizontal, FlipVertical, Wand2, Sparkles, Smile, Square, Type, Image,
    Sliders, Paintbrush, Sun, Contrast, CircleDot, Palette, Layers, PenTool, ImagePlus, Sticker, ShapesIcon, Frame,
    SquareCode, Circle, BadgePlus, Shapes, Repeat, RotateCcw, RotateCw, ListFilter
  };
  
  export const aspectRatios = [
    { id: 'freeform', label: 'Free', icon: '⊞', dimensions: null },
    { id: '1x1', label: '1:1', icon: '□', dimensions: { width: 1, height: 1 } },
    { id: '3x2', label: '3:2', icon: '▭', dimensions: { width: 3, height: 2 } },
    { id: '2x3', label: '2:3', icon: '▯', dimensions: { width: 2, height: 3 } },
    { id: '4x3', label: '4:3', icon: '▭', dimensions: { width: 4, height: 3 } },
    { id: '3x4', label: '3:4', icon: '▯', dimensions: { width: 3, height: 4 } },
    { id: '16x9', label: '16:9', icon: '▭', dimensions: { width: 16, height: 9 } },
    { id: '9x16', label: '9:16', icon: '▯', dimensions: { width: 9, height: 16 } },
    { id: 'original', label: 'Orig', icon: '▣', dimensions: null },
  ];
  
  export const filterEffects = [
    { id: 'none', label: 'None', icon: <Circle size={16} /> },
    { id: 'grayscale', label: 'Gray', icon: <Contrast size={16} /> },
    { id: 'sepia', label: 'Sepia', icon: <Palette size={16} /> },
    { id: 'vintage', label: 'Vintage', icon: <Layers size={16} /> },
    { id: 'blur', label: 'Blur', icon: <CircleDot size={16} /> },
    { id: 'sharpen', label: 'Sharp', icon: <Sliders size={16} /> },
  ];
  
  export const aiFeatures = [
    { id: 'remove-bg', label: 'Remove BG', icon: <Sparkles size={16} /> },
    { id: 'enhance', label: 'Enhance', icon: <Wand2 size={16} /> },
    { id: 'restore', label: 'Restore', icon: <RotateCcw size={16} /> },
    { id: 'smart-crop', label: 'Smart Crop', icon: <ListFilter size={16} /> },
  ];
  
  export const beautyFeatures = [
    { id: 'smooth', label: 'Smooth', icon: <PenTool size={16} /> },
    { id: 'whiten', label: 'Whiten', icon: <Sun size={16} /> },
    { id: 'eyes', label: 'Eyes', icon: <Smile size={16} /> },
    { id: 'face-shape', label: 'Face', icon: <ShapesIcon size={16} /> },
  ];
  
  export const frameStyles = [
    { id: 'none', label: 'None', icon: <Square size={16} /> },
    { id: 'thin-border', label: 'Thin', icon: <SquareCode size={16} /> },
    { id: 'thick-border', label: 'Thick', icon: <Frame size={16} /> },
    { id: 'polaroid', label: 'Polaroid', icon: <Image size={16} /> },
  ];
  
  export const elementTypes = [
    { id: 'stickers', label: 'Stickers', icon: <Sticker size={16} /> },
    { id: 'shapes', label: 'Shapes', icon: <Shapes size={16} /> },
    { id: 'icons', label: 'Icons', icon: <Icons.Image size={16} /> },
    { id: 'overlays', label: 'Overlays', icon: <Layers size={16} /> },
  ];
  
  export const toolNames = {
    ADJUST: 'adjust',
    AI: 'ai',
    EFFECTS: 'effects',
    BEAUTY: 'beauty',
    FRAMES: 'frames',
    TEXT: 'text',
    ELEMENTS: 'elements'
  };
  
  export const subToolNames = {
    // Adjust tool
    CROP: 'crop',
    FLIP: 'flip',
    ROTATE: 'rotate',
    
    // AI tool
    AI_FEATURES: 'ai-features',
    AI_HISTORY: 'ai-history',
    
    // Effects tool
    FILTERS: 'filters',
    ADJUSTMENTS: 'adjustments',
    
    // Beauty tool
    BEAUTY_FEATURES: 'beauty-features',
    QUICK_FIX: 'quick-fix',
    
    // Frames tool
    FRAME_STYLES: 'frame-styles',
    FRAME_EFFECTS: 'frame-effects',
    
    // Text tool
    TEXT_EDITOR: 'text-editor',
    TEXT_STYLES: 'text-styles',
    
    // Element tool
    ELEMENT_TYPES: 'element-types',
    ELEMENT_OPTIONS: 'element-options'
  };