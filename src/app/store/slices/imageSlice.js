import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uploadedImage: null,
  imagePreview: null,
  originalImage: null,
  currentBaseImage: null,
  isFlippedHorizontally: false,
  isFlippedVertically: false,
  rotationDegrees: 0,
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    
    setUploadedImage: (state, action) => {
      state.uploadedImage = action.payload;
    },
    setImagePreview: (state, action) => {
      state.imagePreview = action.payload;
    },
    setOriginalImage: (state, action) => {
      state.originalImage = action.payload;
    },
    setCurrentBaseImage: (state, action) => {
      state.currentBaseImage = action.payload;
    },
    setFlippedHorizontally: (state, action) => {
      state.isFlippedHorizontally = action.payload;
    },
    setFlippedVertically: (state, action) => {
      state.isFlippedVertically = action.payload;
    },
    setRotationDegrees: (state, action) => {
      state.rotationDegrees = action.payload;
    },
    resetToOriginal: (state) => {
      state.imagePreview = state.originalImage;
      state.currentBaseImage = state.originalImage;
      state.isFlippedHorizontally = false;
      state.isFlippedVertically = false;
      state.rotationDegrees = 0;
    },
    resetImageState: () => initialState,
  },
});

export const {
  setUploadedImage,
  setImagePreview,
  setOriginalImage,
  setCurrentBaseImage,
  setFlippedHorizontally,
  setFlippedVertically,
  setRotationDegrees,
  resetToOriginal,
  resetImageState,
} = imageSlice.actions;

export default imageSlice.reducer;