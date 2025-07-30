// store/slices/filtersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialFilters = {
  basicAdjust: { brightness: 0, contrast: 0, saturation: 0, sharpness: 0 },
  colorAdjust: { temperature: 0, tint: 0, invertcolors: 0 },
  fineTuneAdjust: { exposure: 0, highlights: 0, shadows: 0 },
  structureAdjust: { details: 0, gradient: 0 },
  denoiseAdjust: { colornoise: 0, luminancenoise: 0 },
  vignetteAdjust: { intensity: 0, size: 50, feather: 50 },
  mosaicAdjust: { type: "square", size: 0, pixelSize: 1 },
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
      if (typeof values === "object" && values !== null) {
        state[category] = { ...state[category], ...values };
      } else {
        state[category] = values;
      }
    },
    resetFilters: () => initialFilters,
    resetFilterCategory: (state, action) => {
      const category = action.payload;
      if (initialFilters[category]) {
        state[category] = { ...initialFilters[category] };
      }
    },
  },
});

export const {
  updateFilter,
  resetFilters,
  resetFilterCategory,
} = filtersSlice.actions;

export default filtersSlice.reducer;
