// store/slices/cropSlice.js - FIXED VERSION
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cropSettings: {
    x: 10,
    y: 10,
    width: 80,
    height: 80,
    aspectRatio: null,
    isActive: false,
  },
  aspectRatio: null,
};

const cropSlice = createSlice({
  name: 'crop',
  initialState,
  reducers: {
    setCropSettings: (state, action) => {
      state.cropSettings = { ...state.cropSettings, ...action.payload };
    },
    setAspectRatio: (state, action) => {
      state.aspectRatio = action.payload;
      // Also update the aspect ratio in crop settings
      state.cropSettings.aspectRatio = action.payload;
    },
    updateCropPosition: (state, action) => {
      const { x, y } = action.payload;
      state.cropSettings.x = Math.max(0, Math.min(100 - state.cropSettings.width, x));
      state.cropSettings.y = Math.max(0, Math.min(100 - state.cropSettings.height, y));
    },
    updateCropDimensions: (state, action) => {
      const { width, height } = action.payload;
      state.cropSettings.width = Math.max(1, Math.min(100, width));
      state.cropSettings.height = Math.max(1, Math.min(100, height));
      state.cropSettings.x = Math.max(0, Math.min(100 - width, state.cropSettings.x));
      state.cropSettings.y = Math.max(0, Math.min(100 - height, state.cropSettings.y));
    },
    toggleCropMode: (state) => {
      state.cropSettings.isActive = !state.cropSettings.isActive;
    },
    // FIXED: Add setCropActive action
    setCropActive: (state, action) => {
      state.cropSettings.isActive = action.payload;
    },
    cancelCrop: (state) => {
      state.cropSettings.isActive = false;
    },
    resetCrop: (state) => {
      state.cropSettings = {
        x: 10,
        y: 10,
        width: 80,
        height: 80,
        aspectRatio: null,
        isActive: false,
      };
      state.aspectRatio = null;
    },
  },
});

export const {
  setCropSettings,
  setAspectRatio,
  updateCropPosition,
  updateCropDimensions,
  toggleCropMode,
  setCropActive, 
  cancelCrop,
  resetCrop,
} = cropSlice.actions;

export default cropSlice.reducer;