"use client";
import { useState, useCallback } from "react";

export const useCropHandlers = (
  cropSettings,
  containerRef,
  updateCropPosition,
  updateCropDimensions
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const getEventCoordinates = useCallback((e) => {
    if (e.touches && e.touches[0]) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  }, []);

  const getCropStyle = useCallback(() => ({
    left: `${cropSettings.x}%`,
    top: `${cropSettings.y}%`,
    width: `${cropSettings.width}%`,
    height: `${cropSettings.height}%`,
  }), [cropSettings]);

  const handlePointerDown = useCallback((e) => {
    if (e.target.classList.contains("resize-handle")) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    const coords = getEventCoordinates(e);
    const bounds = containerRef.current.getBoundingClientRect();
    const startDragX =
      ((coords.clientX - bounds.left) * 100) / bounds.width - cropSettings.x;
    const startDragY =
      ((coords.clientY - bounds.top) * 100) / bounds.height - cropSettings.y;

    setDragStart({ x: startDragX, y: startDragY });

    const handleGlobalMove = (moveEvent) => {
      moveEvent.preventDefault();
      moveEvent.stopPropagation();
      
      const moveCoords = getEventCoordinates(moveEvent);
      const currentBounds = containerRef.current?.getBoundingClientRect();
      if (!currentBounds) return;

      const x = Math.max(
        0,
        Math.min(
          100 - cropSettings.width,
          ((moveCoords.clientX - currentBounds.left) * 100) /
            currentBounds.width - startDragX
        )
      );
      const y = Math.max(
        0,
        Math.min(
          100 - cropSettings.height,
          ((moveCoords.clientY - currentBounds.top) * 100) /
            currentBounds.height - startDragY
        )
      );

      if (typeof updateCropPosition === "function") {
        updateCropPosition(x, y);
      }
    };

    const handleGlobalEnd = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleGlobalMove);
      document.removeEventListener("mouseup", handleGlobalEnd);
      document.removeEventListener("touchmove", handleGlobalMove);
      document.removeEventListener("touchend", handleGlobalEnd);
    };

    document.addEventListener("mousemove", handleGlobalMove, { passive: false });
    document.addEventListener("mouseup", handleGlobalEnd);
    document.addEventListener("touchmove", handleGlobalMove, { passive: false });
    document.addEventListener("touchend", handleGlobalEnd);
  }, [cropSettings, containerRef, getEventCoordinates, updateCropPosition]);

  const handleResize = useCallback((e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);

    const coords = getEventCoordinates(e);
    const bounds = containerRef.current.getBoundingClientRect();
    const startX = coords.clientX;
    const startY = coords.clientY;
    const initialSettings = { ...cropSettings };

    const onMove = (moveEvent) => {
      moveEvent.preventDefault();
      moveEvent.stopPropagation();
      
      const moveCoords = getEventCoordinates(moveEvent);
      const dx = ((moveCoords.clientX - startX) * 100) / bounds.width;
      const dy = ((moveCoords.clientY - startY) * 100) / bounds.height;

      let newX = initialSettings.x;
      let newY = initialSettings.y;
      let newWidth = initialSettings.width;
      let newHeight = initialSettings.height;

      if (direction.includes("right")) {
        newWidth = Math.min(100 - newX, Math.max(5, initialSettings.width + dx));
      }
      if (direction.includes("bottom")) {
        newHeight = Math.min(100 - newY, Math.max(5, initialSettings.height + dy));
      }
      if (direction.includes("left")) {
        const maxDx = initialSettings.width - 5;
        const constrainedDx = Math.min(maxDx, Math.max(-initialSettings.x, dx));
        newX = initialSettings.x + constrainedDx;
        newWidth = initialSettings.width - constrainedDx;
      }
      if (direction.includes("top")) {
        const maxDy = initialSettings.height - 5;
        const constrainedDy = Math.min(maxDy, Math.max(-initialSettings.y, dy));
        newY = initialSettings.y + constrainedDy;
        newHeight = initialSettings.height - constrainedDy;
      }

      if (typeof updateCropDimensions === "function") {
        updateCropDimensions(newWidth, newHeight);
      }
      if (typeof updateCropPosition === "function") {
        updateCropPosition(newX, newY);
      }
    };

    const onEnd = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };

    window.addEventListener("mousemove", onMove, { passive: false });
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
  }, [cropSettings, containerRef, getEventCoordinates, updateCropDimensions, updateCropPosition]);

  return {
    isDragging,
    isResizing,
    setIsDragging,
    setIsResizing,
    getCropStyle,
    handlePointerDown,
    handleResize
  };
};