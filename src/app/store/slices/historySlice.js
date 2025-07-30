// store/slices/historySlice.js
import { createSlice } from '@reduxjs/toolkit';

const MAX_HISTORY_SIZE = 20;

const initialState = {
  past: [],
  present: null,
  future: [],
  canUndo: false,
  canRedo: false,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    saveToHistory: (state, action) => {
      const { imagePreview, filters, textElements, frameSettings, beautySettings } = action.payload;
      
      // Only save if there's a meaningful change
      if (state.present && 
          state.present.imagePreview === imagePreview &&
          JSON.stringify(state.present.filters) === JSON.stringify(filters) &&
          JSON.stringify(state.present.textElements) === JSON.stringify(textElements) &&
          JSON.stringify(state.present.frameSettings) === JSON.stringify(frameSettings) &&
          JSON.stringify(state.present.beautySettings) === JSON.stringify(beautySettings)) {
        return;
      }

      const newState = {
        imagePreview,
        filters,
        textElements,
        frameSettings,
        beautySettings,
        timestamp: Date.now(),
      };

      // Move current present to past
      if (state.present) {
        state.past.push(state.present);
        
        // Limit history size
        if (state.past.length > MAX_HISTORY_SIZE) {
          state.past.shift();
        }
      }

      // Set new present and clear future
      state.present = newState;
      state.future = [];
      
      // Update flags
      state.canUndo = state.past.length > 0;
      state.canRedo = false;
    },
    
    undo: (state) => {
      if (state.past.length === 0) return;
      
      // Move present to future
      if (state.present) {
        state.future.unshift(state.present);
      }
      
      // Move last past to present
      state.present = state.past.pop();
      
      // Update flags
      state.canUndo = state.past.length > 0;
      state.canRedo = state.future.length > 0;
    },
    
    redo: (state) => {
      if (state.future.length === 0) return;
      
      // Move present to past
      if (state.present) {
        state.past.push(state.present);
      }
      
      // Move first future to present
      state.present = state.future.shift();
      
      // Update flags
      state.canUndo = state.past.length > 0;
      state.canRedo = state.future.length > 0;
    },
    
    clearHistory: (state) => {
      state.past = [];
      state.present = null;
      state.future = [];
      state.canUndo = false;
      state.canRedo = false;
    },
    
    initializeHistory: (state, action) => {
      // Initialize with current state
      const { imagePreview, filters, textElements, frameSettings, beautySettings } = action.payload;
      
      state.present = {
        imagePreview,
        filters,
        textElements,
        frameSettings,
        beautySettings,
        timestamp: Date.now(),
      };
      state.past = [];
      state.future = [];
      state.canUndo = false;
      state.canRedo = false;
    },
  },
});

export const {
  saveToHistory,
  undo,
  redo,
  clearHistory,
  initializeHistory,
} = historySlice.actions;

export default historySlice.reducer;