import { useState, useCallback, useRef } from 'react';

export const useResizeHandlers = (
  resizeSettings,
  containerRef,
  updateResizeDimensions,
  resetResize
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0 });
  const dragRef = useRef(null);

  // Get resize overlay style
  const getResizeStyle = useCallback(() => {
    if (!resizeSettings.isActive || !resizeSettings.width || !resizeSettings.height) {
      return { display: 'none' };
    }

    return {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: `${resizeSettings.width}px`,
      height: `${resizeSettings.height}px`,
      border: '2px solid #3b82f6',
      borderRadius: '4px',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      zIndex: 20,
      pointerEvents: 'all'
    };
  }, [resizeSettings]);

  // Handle pointer down for dragging
  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const isTouch = e.type === 'touchstart';
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });

    // Store reference to the event target
    dragRef.current = e.currentTarget;
  }, []);

  // Handle resize corner/edge dragging
  const handleResize = useCallback((e, direction) => {
    e.preventDefault();
    e.stopPropagation();

    const isTouch = e.type === 'touchstart';
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startY = isTouch ? e.touches[0].clientY : e.clientY;

    setIsResizing(true);
    setResizeStart({
      width: resizeSettings.width,
      height: resizeSettings.height
    });

    const handleMove = (moveEvent) => {
      moveEvent.preventDefault();
      
      const moveX = moveEvent.type === 'touchmove' 
        ? moveEvent.touches[0].clientX 
        : moveEvent.clientX;
      const moveY = moveEvent.type === 'touchmove' 
        ? moveEvent.touches[0].clientY 
        : moveEvent.clientY;

      const deltaX = moveX - startX;
      const deltaY = moveY - startY;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;

      // Calculate new dimensions based on resize direction
      switch (direction) {
        case 'se': // Southeast (bottom-right)
          newWidth = Math.max(100, resizeStart.width + deltaX);
          newHeight = Math.max(100, resizeStart.height + deltaY);
          break;
        case 'sw': // Southwest (bottom-left)
          newWidth = Math.max(100, resizeStart.width - deltaX);
          newHeight = Math.max(100, resizeStart.height + deltaY);
          break;
        case 'ne': // Northeast (top-right)
          newWidth = Math.max(100, resizeStart.width + deltaX);
          newHeight = Math.max(100, resizeStart.height - deltaY);
          break;
        case 'nw': // Northwest (top-left)
          newWidth = Math.max(100, resizeStart.width - deltaX);
          newHeight = Math.max(100, resizeStart.height - deltaY);
          break;
        case 'n': // North (top)
          newHeight = Math.max(100, resizeStart.height - deltaY);
          break;
        case 's': // South (bottom)
          newHeight = Math.max(100, resizeStart.height + deltaY);
          break;
        case 'e': // East (right)
          newWidth = Math.max(100, resizeStart.width + deltaX);
          break;
        case 'w': // West (left)
          newWidth = Math.max(100, resizeStart.width - deltaX);
          break;
      }

      // Maintain aspect ratio if original dimensions are available
      if (resizeSettings.originalWidth && resizeSettings.originalHeight) {
        const aspectRatio = resizeSettings.originalWidth / resizeSettings.originalHeight;
        
        // Only adjust height to maintain aspect ratio for corner resizes
        if (['se', 'sw', 'ne', 'nw'].includes(direction)) {
          newHeight = newWidth / aspectRatio;
        } else if (['n', 's'].includes(direction)) {
          newWidth = newHeight * aspectRatio;
        } else if (['e', 'w'].includes(direction)) {
          newHeight = newWidth / aspectRatio;
        }
      }

      // Ensure minimum dimensions
      newWidth = Math.max(100, newWidth);
      newHeight = Math.max(100, newHeight);

      updateResizeDimensions(newWidth, newHeight);
    };

    const handleEnd = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
  }, [resizeSettings, resizeStart, updateResizeDimensions]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (!resizeSettings.isActive) return;

    switch (e.key) {
      case 'Escape':
        resetResize();
        break;
      case 'Enter':
        // Could trigger a "apply resize" action if needed
        break;
      case '+':
      case '=':
        // Increase size
        if (resizeSettings.width && resizeSettings.height) {
          const newWidth = resizeSettings.width * 1.1;
          const newHeight = resizeSettings.height * 1.1;
          updateResizeDimensions(newWidth, newHeight);
        }
        break;
      case '-':
        // Decrease size
        if (resizeSettings.width && resizeSettings.height) {
          const newWidth = Math.max(100, resizeSettings.width * 0.9);
          const newHeight = Math.max(100, resizeSettings.height * 0.9);
          updateResizeDimensions(newWidth, newHeight);
        }
        break;
    }
  }, [resizeSettings, updateResizeDimensions, resetResize]);

  // Apply resize to actual image
  const applyResize = useCallback(() => {
    if (!resizeSettings.isActive || !resizeSettings.width || !resizeSettings.height) {
      return null;
    }

    // Return the final dimensions that should be applied to the image
    return {
      width: resizeSettings.width,
      height: resizeSettings.height,
      scale: resizeSettings.scale
    };
  }, [resizeSettings]);

  return {
    isDragging,
    isResizing,
    setIsDragging,
    setIsResizing,
    getResizeStyle,
    handlePointerDown,
    handleResize,
    handleKeyDown,
    applyResize
  };
};