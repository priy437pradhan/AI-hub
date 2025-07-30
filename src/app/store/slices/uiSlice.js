import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMobile: false,
  sidebarOpen: true,
  isBottomSheetOpen: false,
  isToolPanelExpanded: true,
  expandedSliders: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
      // Auto-close sidebar on mobile
      if (action.payload) {
        state.sidebarOpen = false;
      }
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setIsBottomSheetOpen: (state, action) => {
      state.isBottomSheetOpen = action.payload;
    },
    setIsToolPanelExpanded: (state, action) => {
      state.isToolPanelExpanded = action.payload;
    },
    toggleToolPanel: (state) => {
      state.isToolPanelExpanded = !state.isToolPanelExpanded;
    },
    toggleSliderExpansion: (state, action) => {
      const sliderKey = action.payload;
      const index = state.expandedSliders.indexOf(sliderKey);
      if (index > -1) {
        state.expandedSliders.splice(index, 1);
      } else {
        state.expandedSliders.push(sliderKey);
      }
    },
    setExpandedSliders: (state, action) => {
      state.expandedSliders = action.payload;
    },
  },
});

export const {
  setIsMobile,
  setSidebarOpen,
  toggleSidebar,
  setIsBottomSheetOpen,
  setIsToolPanelExpanded,
  toggleToolPanel,
  toggleSliderExpansion,
  setExpandedSliders,
} = uiSlice.actions;

export default uiSlice.reducer;