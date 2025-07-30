
// store/slices/textSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  textElements: [],
  textSettings: {
    fontSize: 24,
    fontFamily: 'Arial',
    color: '#ffffff',
    bold: false,
    italic: false,
    underline: false,
    align: 'center',
  },
  styleSettings: {
    shadow: false,
    shadowColor: '#000000',
    shadowBlur: 5,
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    stroke: false,
    strokeColor: '#000000',
    strokeWidth: 2,
  },
  selectedTextId: null,
};

const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    addTextElement: (state, action) => {
      const newElement = {
        id: Date.now().toString(),
        text: 'New Text',
        x: 50,
        y: 50,
        ...state.textSettings,
        ...state.styleSettings,
        ...action.payload,
      };
      state.textElements.push(newElement);
      state.selectedTextId = newElement.id;
    },
    removeTextElement: (state, action) => {
      const id = action.payload;
      state.textElements = state.textElements.filter(el => el.id !== id);
      if (state.selectedTextId === id) {
        state.selectedTextId = null;
      }
    },
    updateTextElement: (state, action) => {
      const { id, updates } = action.payload;
      const element = state.textElements.find(el => el.id === id);
      if (element) {
        Object.assign(element, updates);
      }
    },
    setSelectedTextId: (state, action) => {
      state.selectedTextId = action.payload;
    },
    setTextSettings: (state, action) => {
      state.textSettings = { ...state.textSettings, ...action.payload };
    },
    setStyleSettings: (state, action) => {
      state.styleSettings = { ...state.styleSettings, ...action.payload };
    },
    toggleStyle: (state, action) => {
      const styleName = action.payload;
      if (styleName in state.textSettings) {
        state.textSettings[styleName] = !state.textSettings[styleName];
      } else if (styleName in state.styleSettings) {
        state.styleSettings[styleName] = !state.styleSettings[styleName];
      }
    },
    clearAllText: (state) => {
      state.textElements = [];
      state.selectedTextId = null;
    },
    resetTextSettings: (state) => {
      state.textSettings = initialState.textSettings;
      state.styleSettings = initialState.styleSettings;
    },
  },
});

export const {
  addTextElement,
  removeTextElement,
  updateTextElement,
  setSelectedTextId,
  setTextSettings,
  setStyleSettings,
  toggleStyle,
  clearAllText,
  resetTextSettings,
} = textSlice.actions;

export default textSlice.reducer;
