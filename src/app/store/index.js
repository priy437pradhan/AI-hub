// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import imageSlice from './slices/imageSlice';
import toolsSlice from './slices/toolsSlice';
import filtersSlice from './slices/filtersSlice';
import uiSlice from './slices/uiSlice';
import cropSlice from './slices/cropSlice';
import textSlice from './slices/textSlice';
import frameSlice from './slices/frameSlice';
import beautySlice from './slices/beautySlice';
import historySlice from './slices/historySlice';

export const store = configureStore({
  reducer: {
    image: imageSlice,
    tools: toolsSlice,
    filters: filtersSlice,
    ui: uiSlice,
    crop: cropSlice,
    text: textSlice,
    frame: frameSlice,
    beauty: beautySlice,
    history: historySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'image/setUploadedImage',
          'history/saveToHistory',
          'history/initializeHistory',
        ]
    }
})
})

