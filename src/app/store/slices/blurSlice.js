// // store/slices/blurSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const initialBlurState = {
//   type: 'circular',
//   intensity: 0,
//   preview: false,
//   applied: false,
// };

// const blurSlice = createSlice({
//   name: 'blur',
//   initialState: initialBlurState,
//   reducers: {
//     updateBlur: (state, action) => {
//       const { property, value } = action.payload;
      
//       if (property === 'type') {
//         state.type = value;
//         state.preview = state.intensity > 0;
//         state.applied = false;
//       } else if (property === 'intensity') {
//         state.intensity = parseInt(value);
//         state.preview = parseInt(value) > 0;
//         state.applied = false;
//       } else {
//         state[property] = value;
//       }
//     },
    
//     updateBlurBatch: (state, action) => {
//       const updates = action.payload;
//       Object.keys(updates).forEach(key => {
//         state[key] = updates[key];
//       });
//     },
    
//     setBlurType: (state, action) => {
//       state.type = action.payload;
//       state.preview = state.intensity > 0;
//       state.applied = false;
//     },
    
//     setBlurIntensity: (state, action) => {
//       state.intensity = parseInt(action.payload);
//       state.preview = parseInt(action.payload) > 0;
//       state.applied = false;
//     },
    
//     applyBlur: (state) => {
//       if (state.intensity > 0) {
//         state.applied = true;
//         state.preview = false;
//       }
//     },
    
//     resetBlur: () => initialBlurState,
    
//     setBlurPreview: (state, action) => {
//       state.preview = action.payload;
//     },
    
//     setBlurApplied: (state, action) => {
//       state.applied = action.payload;
//     },
//   },
// });

// export const {
//   updateBlur,
//   updateBlurBatch,
//   setBlurType,
//   setBlurIntensity,
//   applyBlur,
//   resetBlur,
//   setBlurPreview,
//   setBlurApplied,
// } = blurSlice.actions;

// // Selectors
// export const selectBlur = (state) => state.blur;
// export const selectBlurType = (state) => state.blur.type;
// export const selectBlurIntensity = (state) => state.blur.intensity;
// export const selectBlurPreview = (state) => state.blur.preview;
// export const selectBlurApplied = (state) => state.blur.applied;


// // Helper selectors
// export const selectHasBlurAdjustments = (state) => {
//   return state.blur.intensity > 0 && (state.blur.preview || state.blur.applied);
// };

// export const selectCanApplyBlur = (state) => {
//   return state.blur.intensity > 0 && !state.blur.applied;
// };

// export default blurSlice.reducer;