import { useState, useCallback } from 'react';

export const useTextStyles = ({ imageRef, setImagePreview }) => {
  const [styleSettings, setStyleSettings] = useState({
    bold: false,
    italic: false,
    underline: false,
    shadow: false,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 1,
    gradient: false,
    gradientColors: ['#ffffff', '#000000'],
    gradientDirection: 'horizontal' // horizontal, vertical, diagonal
  });

  const applyTextStyle = useCallback(async (textElement, styles) => {
    if (!imageRef.current || !textElement) {
      return null;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      // Set canvas dimensions
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // Calculate position
      const actualX = (textElement.x / 100) * canvas.width;
      const actualY = (textElement.y / 100) * canvas.height;

      // Build font string with styles
      let fontStyle = '';
      if (styles.bold || textElement.style === 'bold') fontStyle += 'bold ';
      if (styles.italic || textElement.style === 'italic') fontStyle += 'italic ';
      
      ctx.font = `${fontStyle}${textElement.fontSize}px ${textElement.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Apply outline if enabled
      if (styles.outline) {
        ctx.strokeStyle = styles.outlineColor;
        ctx.lineWidth = styles.outlineWidth;
        ctx.strokeText(textElement.content, actualX, actualY);
      }

      // Apply gradient if enabled
      if (styles.gradient) {
        const gradient = ctx.createLinearGradient(
          styles.gradientDirection === 'horizontal' ? actualX - 50 : actualX,
          styles.gradientDirection === 'vertical' ? actualY - 50 : actualY,
          styles.gradientDirection === 'horizontal' ? actualX + 50 : actualX,
          styles.gradientDirection === 'vertical' ? actualY + 50 : actualY
        );
        gradient.addColorStop(0, styles.gradientColors[0]);
        gradient.addColorStop(1, styles.gradientColors[1]);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = textElement.color;
      }

      // Apply shadow
      if (styles.shadow || textElement.shadow) {
        ctx.shadowColor = textElement.shadowColor || '#000000';
        ctx.shadowBlur = textElement.shadowBlur || 2;
        ctx.shadowOffsetX = textElement.shadowOffsetX || 1;
        ctx.shadowOffsetY = textElement.shadowOffsetY || 1;
      }

      // Draw the text
      ctx.fillText(textElement.content, actualX, actualY);

      // Apply underline
      if (styles.underline || textElement.decoration === 'underline') {
        const textMetrics = ctx.measureText(textElement.content);
        const underlineY = actualY + textElement.fontSize * 0.1;
        const underlineStart = actualX - textMetrics.width / 2;
        const underlineEnd = actualX + textMetrics.width / 2;
        
        ctx.beginPath();
        ctx.moveTo(underlineStart, underlineY);
        ctx.lineTo(underlineEnd, underlineY);
        ctx.strokeStyle = styles.gradient ? 
          (styles.gradientColors[0] === '#ffffff' ? styles.gradientColors[1] : styles.gradientColors[0]) : 
          textElement.color;
        ctx.lineWidth = Math.max(1, textElement.fontSize * 0.05);
        ctx.stroke();
      }

      // Convert to blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        }, 'image/jpeg', 0.9);
      });

    } catch (error) {
      console.error('Error applying text style:', error);
      return null;
    }
  }, [imageRef]);

  const toggleStyle = useCallback((styleName) => {
    setStyleSettings(prev => ({
      ...prev,
      [styleName]: !prev[styleName]
    }));
  }, []);

  const updateStyleSetting = useCallback((setting, value) => {
    setStyleSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  }, []);

  return {
    styleSettings,
    setStyleSettings,
    applyTextStyle,
    toggleStyle,
    updateStyleSetting
  };
};