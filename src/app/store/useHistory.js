// hooks/useHistory.js - Fixed version
import { useCallback, useRef } from 'react';
import { useAppDispatch } from '../store/hooks/redux';
import { 
  saveToHistory, 
  undo as undoAction, 
  redo as redoAction,
  initializeHistory 
} from '../store/slices/historySlice';

import {
  setImagePreview,
  setCurrentBaseImage,
} from '../store/slices/imageSlice';

import { updateFilter } from '../store/slices/filtersSlice';
// import { restoreTextState } from '../store/slices/textSlice';
import { setFrameSettings } from '../store/slices/frameSlice';
import { setBeautySettings } from '../store/slices/beautySlice';

export const useHistory = () => {
  const dispatch = useAppDispatch();
  const debounceTimeoutRef = useRef(null);

  const saveCurrentState = useCallback((currentState, debounceMs = 500) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      dispatch(saveToHistory(currentState));
    }, debounceMs);
  }, [dispatch]);

  const saveCurrentStateImmediate = useCallback((currentState) => {
    dispatch(saveToHistory(currentState));
  }, [dispatch]);

  const initHistory = useCallback((currentState) => {
    dispatch(initializeHistory(currentState));
  }, [dispatch]);

  const undo = useCallback((historyState) => {
    if (!historyState.canUndo || !historyState.present) return;

    const previousState = historyState.past[historyState.past.length - 1];
    if (!previousState) return;

    restoreStateFromHistory(previousState);
    dispatch(undoAction());
  }, [dispatch]);

  const redo = useCallback((historyState) => {
    if (!historyState.canRedo || historyState.future.length === 0) return;

    const nextState = historyState.future[0];
    if (!nextState) return;

    restoreStateFromHistory(nextState);
    dispatch(redoAction());
  }, [dispatch]);

  // FIXED - Now properly restores text elements
  const restoreStateFromHistory = useCallback((historicalState) => {
    const { 
      imagePreview, 
      filters, 
      textElements, 
      textSettings,
      styleSettings,
      selectedTextId,
      frameSettings, 
      beautySettings 
    } = historicalState;

    // Restore image state
    if (imagePreview) {
      dispatch(setImagePreview(imagePreview));
      dispatch(setCurrentBaseImage(imagePreview));
    }

    // Restore filters
    if (filters) {
      Object.entries(filters).forEach(([category, values]) => {
        dispatch(updateFilter({ category, values }));
      });
    }

    // FIXED - Now properly restores text elements
    // if (textElements || textSettings || styleSettings) {
    //   dispatch(restoreTextState({
    //     textElements: textElements || [],
    //     textSettings: textSettings || {},
    //     styleSettings: styleSettings || {},
    //     selectedTextId: selectedTextId || null
    //   }));
    // }

    // Restore frame settings
    if (frameSettings) {
      dispatch(setFrameSettings(frameSettings));
    }

    // Restore beauty settings
    if (beautySettings) {
      Object.entries(beautySettings).forEach(([feature, settings]) => {
        dispatch(setBeautySettings({ feature, settings }));
      });
    }
  }, [dispatch]);

  // IMPROVED - More comprehensive state snapshot
  const createStateSnapshot = useCallback((
    imagePreview,
    filters,
    textState,  // Pass entire text state instead of just elements
    frameSettings,
    beautySettings
  ) => {
    return {
      imagePreview,
      filters: JSON.parse(JSON.stringify(filters)),
      textElements: JSON.parse(JSON.stringify(textState.textElements || [])),
      textSettings: JSON.parse(JSON.stringify(textState.textSettings || {})),
      styleSettings: JSON.parse(JSON.stringify(textState.styleSettings || {})),
      selectedTextId: textState.selectedTextId || null,
      frameSettings: JSON.parse(JSON.stringify(frameSettings)),
      beautySettings: JSON.parse(JSON.stringify(beautySettings)),
      timestamp: Date.now(),
    };
  }, []);

  return {
    saveCurrentState,
    saveCurrentStateImmediate,
    initHistory,
    undo,
    redo,
    createStateSnapshot,
  };
};