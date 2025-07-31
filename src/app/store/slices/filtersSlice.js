// store/slices/filtersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialFilters = {
  basicAdjust: { 
    brightness: 0, 
    contrast: 0, 
    saturation: 0, 
    sharpness: 0 
  },
  colorAdjust: { 
    temperature: 0, 
    tint: 0, 
    invertcolors: 0 
  },
  fineTuneAdjust: { 
    exposure: 0, 
    highlights: 0, 
    shadows: 0 
  },
  structureAdjust: { 
    details: 0, 
    gradient: 0 
  },
  denoiseAdjust: { 
    colornoise: 0, 
    luminancenoise: 0 
  },
  vignetteAdjust: { 
    intensity: 0, 
    size: 50, 
    feather: 50 
  },
  mosaicAdjust: { 
    type: "square", 
    size: 0, 
    pixelSize: 1 
  },
  blurAdjust: {
    type: "circular",
    intensity: 0,
    preview: false,
    applied: false,
  },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState: initialFilters,
  reducers: {
    updateFilter: (state, action) => {
      const { category, values } = action.payload;
      
      // Handle both object updates and direct value updates
      if (typeof values === "object" && values !== null && !Array.isArray(values)) {
        // Merge object values
        state[category] = { ...state[category], ...values };
      } else {
        // Direct value assignment
        state[category] = values;
      }
    },
    
    updateSingleFilterProperty: (state, action) => {
      const { category, property, value } = action.payload;
      if (state[category]) {
        state[category][property] = value;
      }
    },
    
    resetFilters: () => initialFilters,
    
    resetFilterCategory: (state, action) => {
      const category = action.payload;
      if (initialFilters[category]) {
        state[category] = { ...initialFilters[category] };
      }
    },
    
    // Specific actions for common operations
    setMosaicType: (state, action) => {
      state.mosaicAdjust.type = action.payload;
    },
    
    setMosaicSize: (state, action) => {
      state.mosaicAdjust.size = parseInt(action.payload);
    },
    
    setMosaicPixelSize: (state, action) => {
      state.mosaicAdjust.pixelSize = parseInt(action.payload);
    },
    
    // Batch update for multiple properties in same category
    batchUpdateFilter: (state, action) => {
      const { category, updates } = action.payload;
      if (state[category]) {
        Object.keys(updates).forEach(key => {
          state[category][key] = updates[key];
        });
      }
    },
  },
});

export const {
  updateFilter,
  updateSingleFilterProperty,
  resetFilters,
  resetFilterCategory,
  setMosaicType,
  setMosaicSize,
  setMosaicPixelSize,
  batchUpdateFilter,
} = filtersSlice.actions;

// Selectors for easy access to specific filter categories
export const selectBasicAdjust = (state) => state.filters.basicAdjust;
export const selectColorAdjust = (state) => state.filters.colorAdjust;
export const selectFineTuneAdjust = (state) => state.filters.fineTuneAdjust;
export const selectStructureAdjust = (state) => state.filters.structureAdjust;
export const selectDenoiseAdjust = (state) => state.filters.denoiseAdjust;
export const selectVignetteAdjust = (state) => state.filters.vignetteAdjust;
export const selectMosaicAdjust = (state) => state.filters.mosaicAdjust;
export const selectBlurAdjust = (state) => state.filters.blurAdjust;
export const selectAllFilters = (state) => state.filters;

// Helper selectors for checking if filters are active
export const selectHasMosaicAdjustments = (state) => {
  const mosaic = state.filters.mosaicAdjust;
  return mosaic && mosaic.size > 1;
};

export const selectHasAnyAdjustments = (state) => {
  const filters = state.filters;
  
  // Check basic adjustments
  const hasBasic = Object.values(filters.basicAdjust).some(val => val !== 0);
  
  // Check color adjustments
  const hasColor = Object.values(filters.colorAdjust).some(val => val !== 0);
  
  // Check fine-tune adjustments
  const hasFineTune = Object.values(filters.fineTuneAdjust).some(val => val !== 0);
  
  // Check structure adjustments
  const hasStructure = Object.values(filters.structureAdjust).some(val => val !== 0);
  
  // Check denoise adjustments
  const hasDenoise = Object.values(filters.denoiseAdjust).some(val => val !== 0);
  
  // Check vignette adjustments
  const hasVignette = filters.vignetteAdjust.intensity !== 0;
  
  // Check mosaic adjustments
  const hasMosaic = filters.mosaicAdjust.size > 1;
  
  // Check blur adjustments
  const hasBlur = filters.blurAdjust.intensity !== 0;
  
  return hasBasic || hasColor || hasFineTune || hasStructure || 
         hasDenoise || hasVignette || hasMosaic || hasBlur;
};

export default filtersSlice.reducer;