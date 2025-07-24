import { useState, useCallback, useRef, useEffect } from 'react';

export const useResizeOverlay = (resizeSettings, containerRef, updateResizeDimensions) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialDimensions, setInitialDimensions] = useState({ width: 0, height: 0 });
  const overlayRef = useRef(null);

  // Calculate overlay position and size
  const getOverlayStyle = useCallback(() => {
    if (!resizeSettings.isActive || !containerRef.current || !resizeSettings.width || !resizeSettings.height) {
      return { display: 'none' };
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Center the overlay in the container
    const left = Math.max(0, (containerWidth - resizeSettings.width) / 2);
    const top = Math.max(0, (containerHeight - resizeSettings.height) / 2);

    return {
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`,
      width: `${resizeSettings.width}px`,
      height: `${resizeSettings.height}px`,
      border: '2px solid #3b82f6',
      borderRadius: '4px',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      cursor: isDragging ? 'grabbing' : 'grab',
      zIndex: 10,
      pointerEvents: 'all'
    };
  }, [resizeSettings, containerRef, isDragging]);

  // Handle mouse/touch start for dragging
  const handlePointerStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const isTouch = e.type === 'touchstart';
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setInitialDimensions({
      width: resizeSettings.width,
      height: resizeSettings.height
    });

    // Add event listeners for dragging
    const handleMove = (moveEvent) => {
      if (!isDragging) return;

      const moveClientX = moveEvent.type === 'touchmove' 
        ? moveEvent.touches[0].clientX 
        : moveEvent.clientX;
      const moveClientY = moveEvent.type === 'touchmove' 
        ? moveEvent.touches[0].clientY 
        : moveEvent.clientY;

      const deltaX = moveClientX - dragStart.x;
      const deltaY = moveClientY - dragStart.y;

      // Calculate new dimensions based on drag direction
      // Dragging right/down increases size, left/up decreases
      const scaleFactor = 0.5; // Adjust sensitivity
      const newWidth = Math.max(50, initialDimensions.width + (deltaX * scaleFactor));
      const newHeight = Math.max(50, initialDimensions.height + (deltaY * scaleFactor));

      // Maintain aspect ratio
      const aspectRatio = resizeSettings.originalWidth / resizeSettings.originalHeight;
      const adjustedHeight = newWidth / aspectRatio;

      updateResizeDimensions(newWidth, adjustedHeight);
    };

    const handleEnd = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
  }, [isDragging, dragStart, initialDimensions, resizeSettings, updateResizeDimensions]);

  // Handle resize corner dragging
  const handleCornerDrag = useCallback((e, corner) => {
    e.preventDefault();
    e.stopPropagation();

    const isTouch = e.type === 'touchstart';
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startY = isTouch ? e.touches[0].clientY : e.clientY;
    const startWidth = resizeSettings.width;
    const startHeight = resizeSettings.height;

    const handleMove = (moveEvent) => {
      const moveX = moveEvent.type === 'touchmove' 
        ? moveEvent.touches[0].clientX 
        : moveEvent.clientX;
      const moveY = moveEvent.type === 'touchmove' 
        ? moveEvent.touches[0].clientY 
        : moveEvent.clientY;

      const deltaX = moveX - startX;
      const deltaY = moveY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      // Calculate new dimensions based on corner being dragged
      switch (corner) {
        case 'se': // Southeast corner
          newWidth = Math.max(50, startWidth + deltaX);
          newHeight = Math.max(50, startHeight + deltaY);
          break;
        case 'sw': // Southwest corner
          newWidth = Math.max(50, startWidth - deltaX);
          newHeight = Math.max(50, startHeight + deltaY);
          break;
        case 'ne': // Northeast corner
          newWidth = Math.max(50, startWidth + deltaX);
          newHeight = Math.max(50, startHeight - deltaY);
          break;
        case 'nw': // Northwest corner
          newWidth = Math.max(50, startWidth - deltaX);
          newHeight = Math.max(50, startHeight - deltaY);
          break;
      }

      // Maintain aspect ratio
      if (resizeSettings.originalWidth && resizeSettings.originalHeight) {
        const aspectRatio = resizeSettings.originalWidth / resizeSettings.originalHeight;
        newHeight = newWidth / aspectRatio;
      }

      updateResizeDimensions(newWidth, newHeight);
    };

    const handleEnd = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
  }, [resizeSettings, updateResizeDimensions]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      setIsDragging(false);
    };
  }, []);

  return {
    overlayRef,
    isDragging,
    getOverlayStyle,
    handlePointerStart,
    handleCornerDrag
  };
};