'use client';
import { useState } from 'react';

export function useResizeImage({ imageRef }) {
  const [scale, setScale] = useState(1); // Initial scale = 100%

  const performResizeBase = async (direction) => {
    if (!imageRef.current) return null;
    const img = imageRef.current;

    let newScale = scale;

    const step = 0.1; // 10% scale step

    if (direction === 'shrink') {
      newScale = Math.max(0.1, scale - step); // min 10%
    } else if (direction === 'expand') {
      newScale = Math.min(3, scale + step); // max 300%
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const newWidth = img.naturalWidth * newScale;
    const newHeight = img.naturalHeight * newScale;

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    setScale(newScale);

    return canvas.toDataURL('image/jpeg');
  };

  return {
    scale,
    performResizeBase,
  };
}
