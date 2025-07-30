import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  frameSettings: {
    style: 'none',
    color: '#ffffff',
    width: 10,
    shadow: 0,
    spread: 0,
    shadowColor: '#000000',
  },
};

const frameSlice = createSlice({
  name: 'frame',
  initialState,
  reducers: {
    setFrameSettings: (state, action) => {
      state.frameSettings = { ...state.frameSettings, ...action.payload };
    },
    resetFrameSettings: (state) => {
      state.frameSettings = { ...initialState.frameSettings };
    },
  },
});

export const {
  setFrameSettings,
  resetFrameSettings,
} = frameSlice.actions;

export default frameSlice.reducer;