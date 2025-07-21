import React, { useState, useRef, useCallback, useEffect } from 'react';
export const useSliderDrag = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  onDragStart,
  onDragEnd,
  orientation = 'horizontal'
}) => {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateValue = useCallback((clientX, clientY) => {
    if (!sliderRef.current) return value;
    
    const rect = sliderRef.current.getBoundingClientRect();
    let percentage;
    
    if (orientation === 'vertical') {
      percentage = Math.max(0, Math.min(1, (rect.bottom - clientY) / rect.height));
    } else {
      percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    }
    
    const range = max - min;
    const rawValue = min + percentage * range;
    const steppedValue = Math.round(rawValue / step) * step;
    
    return Math.max(min, Math.min(max, steppedValue));
  }, [min, max, step, value, orientation]);

  const startDrag = useCallback((clientX, clientY) => {
    if (disabled) return;
    
    setIsDragging(true);
    const newValue = calculateValue(clientX, clientY);
    onChange?.(newValue);
    onDragStart?.(newValue);
  }, [disabled, calculateValue, onChange, onDragStart]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  }, [startDrag]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || disabled) return;
    
    e.preventDefault();
    const newValue = calculateValue(e.clientX, e.clientY);
    onChange?.(newValue);
  }, [isDragging, disabled, calculateValue, onChange]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd?.(value);
    }
  }, [isDragging, value, onDragEnd]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, [startDrag]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || disabled) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const newValue = calculateValue(touch.clientX, touch.clientY);
    onChange?.(newValue);
  }, [isDragging, disabled, calculateValue, onChange]);

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd?.(value);
    }
  }, [isDragging, value, onDragEnd]);

  useEffect(() => {
    if (isDragging && !disabled) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, disabled, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const percentage = ((value - min) / (max - min)) * 100;

  return {
    sliderRef,
    isDragging,
    percentage,
    handlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
    }
  };
};

// Enhanced SliderControl component with drag functionality