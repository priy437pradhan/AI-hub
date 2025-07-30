import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  beautySettings: {},
  activeBeautyTool: null,
};

const beautySlice = createSlice({
  name: 'beauty',
  initialState,
  reducers: {
    setBeautySettings: (state, action) => {
      const { feature, settings } = action.payload;
      state.beautySettings[feature] = settings;
    },
    setActiveBeautyTool: (state, action) => {
      state.activeBeautyTool = action.payload;
    },
    resetBeautySettings: (state) => {
      state.beautySettings = {};
    },
  },
});

export const {
  setBeautySettings,
  setActiveBeautyTool,
  resetBeautySettings,
} = beautySlice.actions;

export default beautySlice.reducer;