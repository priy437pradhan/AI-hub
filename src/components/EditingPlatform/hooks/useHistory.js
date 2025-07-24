// hooks/useHistory.js
import { useState, useCallback, useRef } from 'react';

export const useHistory = (maxHistorySize = 50) => {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isProcessingUndoRedo = useRef(false);

  // Add a new state to history
  const addToHistory = useCallback((newState, actionType = 'unknown') => {
    // Skip adding to history if we're processing undo/redo
    if (isProcessingUndoRedo.current) {
      console.log('Skipping history add during undo/redo');
      return;
    }

    console.log('Adding to history:', actionType);

    setHistory(prev => {
      setCurrentIndex(prevIndex => {
        // Remove any future history if we're not at the end
        const newHistory = prev.slice(0, prevIndex + 1);
        
        // Add the new state
        const newEntry = {
          state: JSON.parse(JSON.stringify(newState)), // Deep clone
          actionType,
          timestamp: Date.now()
        };
        
        newHistory.push(newEntry);
        
        // Limit history size
        const finalHistory = newHistory.length > maxHistorySize 
          ? newHistory.slice(-maxHistorySize) 
          : newHistory;
        
        // Update the history state
        setTimeout(() => {
          setHistory(finalHistory);
        }, 0);
        
        console.log('History updated, new length:', finalHistory.length);
        
        // Return the new current index
        return finalHistory.length - 1;
      });
      
      return prev; // This will be overridden by the setTimeout above
    });
  }, [maxHistorySize]);

  // Initialize history with first state
  const initializeHistory = useCallback((initialState, actionType = 'initial') => {
    console.log('Initializing history with:', actionType);
    
    const historyEntry = {
      state: JSON.parse(JSON.stringify(initialState)),
      actionType,
      timestamp: Date.now()
    };
    
    setHistory([historyEntry]);
    setCurrentIndex(0);
    
    console.log('History initialized');
  }, []);

  // Undo operation - SIMPLIFIED
  const undo = useCallback(() => {
    return new Promise((resolve) => {
      console.log('Undo requested');
      
      // Use functional updates to access current values
      setCurrentIndex(prevIndex => {
        if (prevIndex > 0) {
          isProcessingUndoRedo.current = true;
          const newIndex = prevIndex - 1;
          
          console.log('Undo successful, new index:', newIndex);
          
          // Get the previous state from current history
          setHistory(currentHistory => {
            const previousState = currentHistory[newIndex];
            console.log('Retrieved previous state:', previousState?.actionType);
            
            // Reset the flag after state updates complete
            setTimeout(() => {
              isProcessingUndoRedo.current = false;
            }, 200);
            
            resolve(previousState);
            return currentHistory; // Don't modify history, just access it
          });
          
          return newIndex;
        } else {
          console.log('Cannot undo - at beginning of history');
          resolve(null);
          return prevIndex;
        }
      });
    });
  }, []);

  // Redo operation - SIMPLIFIED
  const redo = useCallback(() => {
    return new Promise((resolve) => {
      console.log('Redo requested');
      
      // Use functional updates to access current values
      setCurrentIndex(prevIndex => {
        setHistory(currentHistory => {
          if (prevIndex < currentHistory.length - 1) {
            isProcessingUndoRedo.current = true;
            const newIndex = prevIndex + 1;
            const nextState = currentHistory[newIndex];
            
            console.log('Redo successful, new index:', newIndex, 'action:', nextState?.actionType);
            
            // Reset the flag after state updates complete
            setTimeout(() => {
              isProcessingUndoRedo.current = false;
            }, 200);
            
            resolve(nextState);
            
            // Update currentIndex after we have the state
            setTimeout(() => {
              setCurrentIndex(newIndex);
            }, 0);
            
            return currentHistory; // Don't modify history, just access it
          } else {
            console.log('Cannot redo - at end of history');
            resolve(null);
            return currentHistory;
          }
        });
        
        return prevIndex; // Will be updated by setTimeout above if redo is successful
      });
    });
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    console.log('Clearing history');
    setHistory([]);
    setCurrentIndex(-1);
    isProcessingUndoRedo.current = false;
  }, []);

  // Get current state
  const getCurrentState = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < history.length) {
      return history[currentIndex];
    }
    return null;
  }, [currentIndex, history]);

  // Check if undo/redo is possible with better logic
  const canUndo = currentIndex > 0 && history.length > 1;
  const canRedo = currentIndex >= 0 && currentIndex < history.length - 1;

  // Debug info
  const getDebugInfo = useCallback(() => ({
    historyLength: history.length,
    currentIndex,
    canUndo,
    canRedo,
    isProcessing: isProcessingUndoRedo.current,
    recentActions: history.slice(-3).map(h => h.actionType)
  }), [history, currentIndex, canUndo, canRedo]);

  return {
    history,
    currentIndex,
    addToHistory,
    initializeHistory,
    undo,
    redo,
    clearHistory,
    getCurrentState,
    canUndo,
    canRedo,
    getDebugInfo
  };
};