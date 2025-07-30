import { createSlice } from '@reduxjs/toolkit';

const toolNames = {
  ADJUST: "adjust",
  AI: "ai",
  EFFECTS: "effects",
  BEAUTY: "beauty",
  FRAMES: "frames",
  TEXT: "text",
  ELEMENTS: "elements",
};

const initialState = {
  activeTool: toolNames.ADJUST,
  activeTools: {
    adjust: null,
    beauty: null,
    frames: null,
    text: null,
    ai: null,
    effects: null,
    elements: null,
  },
};

const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    setActiveTool: (state, action) => {
      state.activeTool = action.payload;
    },
    setActiveSubTool: (state, action) => {
      const { toolType, subTool } = action.payload;
      state.activeTools[toolType] = subTool;
    },
    resetActiveTools: (state) => {
      state.activeTools = {
        adjust: null,
        beauty: null,
        frames: null,
        text: null,
        ai: null,
        effects: null,
        elements: null,
      };
    },
  },
});

export const {
  setActiveTool,
  setActiveSubTool,
  resetActiveTools,
} = toolsSlice.actions;

export { toolNames };
export default toolsSlice.reducer;