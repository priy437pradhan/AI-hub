import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * @param {string} initialImage - Initial image data URL
 * @param {number} maxHistorySize - Maximum number of history states to keep
 * @returns {Object} - History management functions and state
 */
export const useUndoRedo = (initialImage, maxHistorySize = 50) => {
  const [history, setHistory] = useState([initialImage]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(initialImage);
  const isUpdatingRef = useRef(false);

  // Add new state to history
  const addToHistory = useCallback((newImageData) => {
    if (isUpdatingRef.current) return;
    
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newImageData);
      
      // Keep history size under control
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        setCurrentIndex(prev => prev - 1);
      }
      
      return newHistory;
    });
    
    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      return newIndex >= maxHistorySize ? maxHistorySize - 1 : newIndex;
    });
    
    setCurrentImage(newImageData);
  }, [currentIndex, maxHistorySize]);

  // Undo function
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      isUpdatingRef.current = true;
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentImage(history[newIndex]);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [currentIndex, history]);

  // Redo function
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      isUpdatingRef.current = true;
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentImage(history[newIndex]);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [currentIndex, history]);

  // Can undo/redo flags
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Reset history
  const resetHistory = useCallback((newInitialImage) => {
    setHistory([newInitialImage]);
    setCurrentIndex(0);
    setCurrentImage(newInitialImage);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    currentImage,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
    historyLength: history.length,
    currentIndex
  };
};

// Example usage in your main image editor component
export const ImageEditorWithHistory = () => {
  const [originalImage, setOriginalImage] = useState(null);
  
  const {
    currentImage,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory
  } = useUndoRedo(originalImage);

  // Wrapper functions that save to history
  const performFlipWithHistory = useCallback((direction) => {
    // Your existing flip logic here
    const flippedImage = performFlip(direction, currentImage);
    addToHistory(flippedImage);
  }, [currentImage, addToHistory]);

  const performRotateWithHistory = useCallback((angle) => {
    // Your existing rotate logic here
    const rotatedImage = performRotate(angle, currentImage);
    addToHistory(rotatedImage);
  }, [currentImage, addToHistory]);

  const performCropWithHistory = useCallback((cropData) => {
    // Your existing crop logic here
    const croppedImage = performCrop(cropData, currentImage);
    addToHistory(croppedImage);
  }, [currentImage, addToHistory]);

  const applyEffectWithHistory = useCallback((effectType, intensity) => {
    // Your existing effect logic here
    const effectImage = applyEffect(effectType, intensity, currentImage);
    addToHistory(effectImage);
  }, [currentImage, addToHistory]);

  const applyAIFeatureWithHistory = useCallback((featureType, settings) => {
    // Your existing AI feature logic here
    const aiImage = applyAIFeature(featureType, settings, currentImage);
    addToHistory(aiImage);
  }, [currentImage, addToHistory]);

  const applyBeautyFeatureWithHistory = useCallback((beautyType, settings) => {
    // Your existing beauty feature logic here
    const beautyImage = applyBeautyFeature(beautyType, settings, currentImage);
    addToHistory(beautyImage);
  }, [currentImage, addToHistory]);

  const applyFrameWithHistory = useCallback((frameData) => {
    // Your existing frame logic here
    const framedImage = applyFrame(frameData, currentImage);
    addToHistory(framedImage);
  }, [currentImage, addToHistory]);

  const applyTextToImageWithHistory = useCallback((textData) => {
    // Your existing text logic here
    const textImage = applyTextToImage(textData, currentImage);
    addToHistory(textImage);
  }, [currentImage, addToHistory]);

  const addElementWithHistory = useCallback((elementData) => {
    // Your existing element logic here
    const elementImage = addElement(elementData, currentImage);
    addToHistory(elementImage);
  }, [currentImage, addToHistory]);

  // Handle new image upload
  const handleImageUpload = useCallback((newImage) => {
    setOriginalImage(newImage);
    resetHistory(newImage);
  }, [resetHistory]);

  return {
    currentImage,
    canUndo,
    canRedo,
    performUndo: undo,
    performRedo: redo,
    // Your history-enabled functions
    performFlip: performFlipWithHistory,
    performRotate: performRotateWithHistory,
    performCrop: performCropWithHistory,
    applyEffect: applyEffectWithHistory,
    applyAIFeature: applyAIFeatureWithHistory,
    applyBeautyFeature: applyBeautyFeatureWithHistory,
    applyFrame: applyFrameWithHistory,
    applyTextToImage: applyTextToImageWithHistory,
    addElement: addElementWithHistory,
    handleImageUpload
  };
};