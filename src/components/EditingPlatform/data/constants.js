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
  
  export   const aspectRatios = [
  { id: 'freeform', label: 'Freeform', icon: '⊞', dimensions: null },
  { id: '1x1', label: '1:1', icon: '□', dimensions: { width: 1, height: 1 } },
  { id: '4x5', label: '4:5', icon: '▯', dimensions: { width: 4, height: 5 } },
  { id: '5x4', label: '5:4', icon: '▭', dimensions: { width: 5, height: 4 } },
  { id: '3x4', label: '3:4', icon: '▯', dimensions: { width: 3, height: 4 } },
  { id: '4x3', label: '4:3', icon: '▭', dimensions: { width: 4, height: 3 } },
  { id: '2x3', label: '2:3', icon: '▯', dimensions: { width: 2, height: 3 } },
  { id: '3x2', label: '3:2', icon: '▭', dimensions: { width: 3, height: 2 } },
  { id: '9x16', label: '9:16', icon: '▯', dimensions: { width: 9, height: 16 } },
  { id: '16x9', label: '16:9', icon: '▭', dimensions: { width: 16, height: 9 } },
  { id: 'original', label: 'Original', icon: '▣', dimensions: null },
  { id: 'circle', label: 'Circle', icon: '○', dimensions: null },
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
  { id: 'none', name: 'No Frame', icon: '⬜' },
  { id: 'thin-border', name: 'Thin Border', icon: '🔲' },
  { id: 'thick-border', name: 'Thick Border', icon: '⬛' },
  { id: 'double-border', name: 'Double Border', icon: '🔳' },
  { id: 'polaroid', name: 'Polaroid', icon: '📸' },
  { id: 'rounded-corner', name: 'Rounded', icon: '⭕' },
  { id: 'vintage', name: 'Vintage', icon: '🎭' },
  { id: 'shadow-box', name: 'Shadow Box', icon: '📦' },
  { id: 'beveled', name: 'Beveled', icon: '💎' },
  { id: 'film-strip', name: 'Film Strip', icon: '🎬' },
  { id: 'torn-paper', name: 'Torn Paper', icon: '📄' },
  { id: 'mat-board', name: 'Mat Board', icon: '🖼️' },
  { id: 'wood-frame', name: 'Wood Frame', icon: '🪵' },
  { id: 'neon-glow', name: 'Neon Glow', icon: '✨' },
  { id: 'gold-ornate', name: 'Gold Ornate', icon: '👑' },
  { id: 'sketch-border', name: 'Sketch', icon: '✏️' },
  { id: 'instagram-square', name: 'Square', icon: '⬜' },
  { id: 'scalloped-edge', name: 'Scalloped', icon: '🌊' }
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
  ADVANCED_FRAMES: 'advanced-frames',
    
    // Text tool
    TEXT_EDITOR: 'text-editor',
    TEXT_STYLES: 'text-styles',
    
    // Element tool
    ELEMENT_TYPES: 'element-types',
    ELEMENT_OPTIONS: 'element-options'
  };
  export const frameColorPresets = {
  basic: [
    { color: '#ffffff', name: 'White' },
    { color: '#000000', name: 'Black' },
    { color: '#808080', name: 'Gray' },
    { color: '#C0C0C0', name: 'Silver' }
  ],
  wood: [
    { color: '#8B4513', name: 'Saddle Brown' },
    { color: '#D2691E', name: 'Chocolate' },
    { color: '#CD853F', name: 'Peru' },
    { color: '#A0522D', name: 'Sienna' },
    { color: '#DEB887', name: 'Burlywood' },
    { color: '#F4A460', name: 'Sandy Brown' }
  ],
  metal: [
    { color: '#FFD700', name: 'Gold' },
    { color: '#C0C0C0', name: 'Silver' },
    { color: '#CD7F32', name: 'Bronze' },
    { color: '#B87333', name: 'Copper' },
    { color: '#36454F', name: 'Charcoal' },
    { color: '#2F4F4F', name: 'Dark Slate' }
  ],
  vibrant: [
    { color: '#ff0000', name: 'Red' },
    { color: '#00ff00', name: 'Green' },
    { color: '#0000ff', name: 'Blue' },
    { color: '#ffff00', name: 'Yellow' },
    { color: '#ff00ff', name: 'Magenta' },
    { color: '#00ffff', name: 'Cyan' },
    { color: '#FFA500', name: 'Orange' },
    { color: '#800080', name: 'Purple' }
  ]
};

// Frame style categories for better organization
export const frameCategories = {
  basic: {
    name: 'Basic Frames',
    styles: ['none', 'thin-border', 'thick-border', 'double-border']
  },
  creative: {
    name: 'Creative Frames',
    styles: ['polaroid', 'film-strip', 'torn-paper', 'sketch-border']
  },
  elegant: {
    name: 'Elegant Frames',
    styles: ['rounded-corner', 'mat-board', 'beveled', 'gold-ornate']
  },
  artistic: {
    name: 'Artistic Frames',
    styles: ['vintage', 'wood-frame', 'shadow-box', 'scalloped-edge']
  },
  modern: {
    name: 'Modern Frames',
    styles: ['neon-glow', 'instagram-square']
  }
};

// Frame presets with predefined settings
export const framePresets = [
  {
    id: 'classic-black',
    name: 'Classic Black',
    settings: {
      style: 'thick-border',
      color: '#000000',
      width: 15,
      shadow: 5,
      spread: 2,
      shadowColor: '#000000'
    }
  },
  {
    id: 'vintage-gold',
    name: 'Vintage Gold',
    settings: {
      style: 'gold-ornate',
      color: '#FFD700',
      width: 20,
      shadow: 8,
      spread: 3,
      shadowColor: '#8B4513'
    }
  },
  {
    id: 'modern-white',
    name: 'Modern White',
    settings: {
      style: 'mat-board',
      color: '#ffffff',
      width: 25,
      shadow: 3,
      spread: 1,
      shadowColor: '#cccccc'
    }
  },
  {
    id: 'polaroid-classic',
    name: 'Polaroid Classic',
    settings: {
      style: 'polaroid',
      color: '#ffffff',
      width: 12,
      shadow: 6,
      spread: 2,
      shadowColor: '#666666'
    }
  },
  {
    id: 'neon-blue',
    name: 'Neon Blue',
    settings: {
      style: 'neon-glow',
      color: '#00ffff',
      width: 8,
      shadow: 15,
      spread: 0,
      shadowColor: '#00ffff'
    }
  },
  {
    id: 'wood-rustic',
    name: 'Rustic Wood',
    settings: {
      style: 'wood-frame',
      color: '#8B4513',
      width: 18,
      shadow: 4,
      spread: 2,
      shadowColor: '#654321'
    }
  }
];

// Effect presets for quick application
export const effectPresets = [
  {
    id: 'subtle-shadow',
    name: 'Subtle Shadow',
    shadow: 5,
    spread: 1,
    shadowColor: '#000000'
  },
  {
    id: 'dramatic-shadow',
    name: 'Dramatic Shadow',
    shadow: 20,
    spread: 5,
    shadowColor: '#000000'
  },
  {
    id: 'soft-glow',
    name: 'Soft Glow',
    shadow: 15,
    spread: 0,
    shadowColor: '#ffffff'
  },
  {
    id: 'colored-glow',
    name: 'Colored Glow',
    shadow: 12,
    spread: 2,
    shadowColor: '#ff6b6b'
  }
];

// Tool icons for UI
export const toolIcons = {
  frames: '🖼️',
  effects: '✨',
  presets: '🎨',
  advanced: '⚙️'
};