// hooks/redux.js - Redux hooks without TypeScript
import { useDispatch, useSelector } from 'react-redux';

// App-specific selector hooks
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Custom hooks for common operations
export const useImageState = () => useAppSelector(state => state.image);
export const useToolsState = () => useAppSelector(state => state.tools);
export const useFiltersState = () => useAppSelector(state => state.filters);
export const useUIState = () => useAppSelector(state => state.ui);
export const useCropState = () => useAppSelector(state => state.crop);
export const useTextState = () => useAppSelector(state => state.text);
export const useFrameState = () => useAppSelector(state => state.frame);
export const useBeautyState = () => useAppSelector(state => state.beauty);
export const useHistoryState = () => useAppSelector(state => state.history);
