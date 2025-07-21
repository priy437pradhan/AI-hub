import { useState, useCallback } from 'react';

export const useFrames = ({ imageRef, setImagePreview }) => {
  const [frameSettings, setFrameSettings] = useState({
    style: 'none',
    color: '#ffffff',
    width: 10,
    shadow: 0,
    spread: 0,
    shadowColor: '#000000'
  });

  const applyFrame = useCallback(async (frameStyle, frameColor = '#ffffff', frameWidth = 10) => {
    if (!imageRef.current || !frameStyle || frameStyle === 'none') {
      console.log('No image or frame style to apply');
      return null;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      // Wait for image to load if needed
      if (!img.complete) {
        await new Promise(resolve => {
          img.onload = resolve;
        });
      }

      // Calculate frame dimensions
      const frameThickness = frameWidth;
      const totalFrameWidth = frameThickness * 2;

      // Set canvas size to include frame
      canvas.width = img.naturalWidth + totalFrameWidth;
      canvas.height = img.naturalHeight + totalFrameWidth;

      // Apply frame based on style
      switch (frameStyle) {
        case 'none':
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);
          break;

        case 'thin-border':
          // Simple solid border
          ctx.fillStyle = frameColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, frameThickness, frameThickness);
          break;

        case 'thick-border':
          // Thick solid border
          ctx.fillStyle = frameColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Add inner border effect
          const innerBorder = frameThickness * 0.2;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(innerBorder, innerBorder, 
                      canvas.width - innerBorder * 2, 
                      canvas.height - innerBorder * 2);
          
          ctx.fillStyle = frameColor;
          ctx.fillRect(innerBorder * 2, innerBorder * 2, 
                      canvas.width - innerBorder * 4, 
                      canvas.height - innerBorder * 4);
          
          ctx.drawImage(img, frameThickness, frameThickness);
          break;

        case 'polaroid':
          // Polaroid style frame (larger bottom margin)
          const topMargin = frameThickness;
          const sideMargin = frameThickness;
          const bottomMargin = frameThickness * 3;
          
          canvas.width = img.naturalWidth + sideMargin * 2;
          canvas.height = img.naturalHeight + topMargin + bottomMargin;
          
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, sideMargin, topMargin);
          
          ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
          ctx.shadowBlur = 5;
          ctx.shadowOffsetY = 3;
          break;

        case 'double-border':
          // Double border with gap
          ctx.fillStyle = frameColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Outer white gap
          const gap = frameThickness * 0.3;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(gap, gap, canvas.width - gap * 2, canvas.height - gap * 2);
          
          // Inner border
          const innerThickness = frameThickness * 0.4;
          ctx.fillStyle = frameColor;
          ctx.fillRect(gap, gap, canvas.width - gap * 2, canvas.height - gap * 2);
          
          ctx.drawImage(img, frameThickness, frameThickness);
          break;

        case 'rounded-corner':
          // Rounded corner frame
          const radius = frameThickness * 0.5;
          ctx.fillStyle = frameColor;
          
          // Draw rounded rectangle
          ctx.beginPath();
          ctx.roundRect(0, 0, canvas.width, canvas.height, radius);
          ctx.fill();
          
          // Draw image with rounded corners
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(frameThickness, frameThickness, 
                       img.naturalWidth, img.naturalHeight, radius * 0.5);
          ctx.clip();
          ctx.drawImage(img, frameThickness, frameThickness);
          ctx.restore();
          break;

        case 'vintage':
          // Vintage ornate frame effect
          ctx.fillStyle = frameColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Create vintage pattern
          const step = frameThickness / 4;
          for (let i = 0; i < frameThickness; i += step) {
            ctx.strokeStyle = i % 2 === 0 ? '#8B4513' : frameColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(i, i, canvas.width - i * 2, canvas.height - i * 2);
          }
          
          ctx.drawImage(img, frameThickness, frameThickness);
          break;

        case 'shadow-box':
          // Shadow box frame
          const shadowDepth = frameThickness * 0.3;
          
          // Draw shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(shadowDepth, shadowDepth, canvas.width - shadowDepth, canvas.height - shadowDepth);
          
          // Draw main frame
          ctx.fillStyle = frameColor;
          ctx.fillRect(0, 0, canvas.width - shadowDepth, canvas.height - shadowDepth);
          
          ctx.drawImage(img, frameThickness, frameThickness);
          break;

        case 'beveled':
          // Beveled frame effect
          ctx.fillStyle = frameColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Create gradient for bevel effect
          const gradient = ctx.createLinearGradient(0, 0, frameThickness, frameThickness);
          gradient.addColorStop(0, '#ffffff');
          gradient.addColorStop(0.5, frameColor);
          gradient.addColorStop(1, '#000000');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.drawImage(img, frameThickness, frameThickness);
          break;

        case 'film-strip':
          // Film strip frame
          canvas.width = img.naturalWidth + totalFrameWidth;
          canvas.height = img.naturalHeight + totalFrameWidth;
          
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw film holes
          const holeSize = frameThickness * 0.3;
          const holeSpacing = holeSize * 2;
          
          ctx.fillStyle = '#ffffff';
          for (let y = holeSpacing; y < canvas.height; y += holeSpacing) {
            // Left side holes
            ctx.fillRect(frameThickness * 0.2, y, holeSize, holeSize * 0.6);
            // Right side holes
            ctx.fillRect(canvas.width - frameThickness * 0.2 - holeSize, y, holeSize, holeSize * 0.6);
          }
          
          ctx.drawImage(img, frameThickness, frameThickness);
          break;

        case 'torn-paper':
          // Torn paper effect
          ctx.fillStyle = frameColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Create torn edge effect
          ctx.save();
          ctx.beginPath();
          const x = frameThickness;
          const y = frameThickness;
          const w = img.naturalWidth;
          const h = img.naturalHeight;
          
          ctx.moveTo(x, y);
          for (let i = 0; i < w; i += 10) {
            ctx.lineTo(x + i, y + Math.random() * 5);
          }
          ctx.lineTo(x + w, y);
          ctx.lineTo(x + w, y + h);
          for (let i = w; i > 0; i -= 10) {
            ctx.lineTo(x + i, y + h + Math.random() * 5);
          }
          ctx.lineTo(x, y + h);
          ctx.lineTo(x, y);
          ctx.clip();
          
          ctx.drawImage(img, frameThickness, frameThickness);
          ctx.restore();
          break;

        case 'mat-board':
          // Mat board frame (like gallery frames)
          ctx.fillStyle = frameColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Inner shadow for depth
          const matDepth = 5;
          const gradient2 = ctx.createLinearGradient(
            frameThickness - matDepth, frameThickness - matDepth,
            frameThickness, frameThickness
          );
          gradient2.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
          gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = gradient2;
          ctx.fillRect(frameThickness - matDepth, frameThickness - matDepth,
                      img.naturalWidth + matDepth * 2, img.naturalHeight + matDepth * 2);
          
          ctx.drawImage(img, frameThickness, frameThickness);
          break;

        case 'wood-frame':
          // Wood texture frame
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Create wood grain effect
          ctx.strokeStyle = '#654321';
          ctx.lineWidth = 1;
          for (let i = 0; i < canvas.width; i += 3) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i + Math.random() * 2, canvas.height);
            ctx.stroke();
          }
          
          ctx.drawImage(img, frameThickness, frameThickness);
          break;

        case 'neon-glow':
          // Neon glow frame
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Create glow effect
          ctx.shadowColor = frameColor;
          ctx.shadowBlur = frameThickness;
          ctx.strokeStyle = frameColor;
          ctx.lineWidth = 3;
          ctx.strokeRect(frameThickness, frameThickness, img.naturalWidth, img.naturalHeight);
          
          ctx.shadowBlur = 0;
          ctx.drawImage(img, frameThickness, frameThickness);
          break;

        case 'gold-ornate':
          // Gold ornate frame
          const goldGradient = ctx.createLinearGradient(0, 0, frameThickness, frameThickness);
          goldGradient.addColorStop(0, '#FFD700');
          goldGradient.addColorStop(0.5, '#FFA500');
          goldGradient.addColorStop(1, '#B8860B');
          
          ctx.fillStyle = goldGradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Add ornate details
          ctx.strokeStyle = '#8B7355';
          ctx.lineWidth = 2;
          for (let i = 2; i < frameThickness; i += 4) {
            ctx.strokeRect(i, i, canvas.width - i * 2, canvas.height - i * 2);
          }
          
          ctx.drawImage(img, frameThickness, frameThickness);
          break;

        case 'sketch-border':
          // Hand-drawn sketch border
          ctx.fillStyle = frameColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw sketchy border
          ctx.strokeStyle = '#333333';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          
          // Create rough, hand-drawn lines
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            const jitter = 3;
            
            // Top line
            ctx.moveTo(frameThickness + Math.random() * jitter, frameThickness + Math.random() * jitter);
            for (let x = frameThickness; x < canvas.width - frameThickness; x += 10) {
              ctx.lineTo(x + Math.random() * jitter, frameThickness + Math.random() * jitter);
            }
            
            // Continue for other sides...
            ctx.stroke();
          }
          
          ctx.drawImage(img, frameThickness, frameThickness);
          break;

        case 'instagram-square':
          // Instagram-style square frame
          const maxSize = Math.max(img.naturalWidth, img.naturalHeight);
          canvas.width = maxSize + totalFrameWidth;
          canvas.height = maxSize + totalFrameWidth;
          
          ctx.fillStyle = frameColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Center the image
          const offsetX = (maxSize - img.naturalWidth) / 2 + frameThickness;
          const offsetY = (maxSize - img.naturalHeight) / 2 + frameThickness;
          
          ctx.drawImage(img, offsetX, offsetY);
          break;

        case 'scalloped-edge':
          // Scalloped edge frame
          ctx.fillStyle = frameColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Create scalloped edge
          ctx.save();
          ctx.beginPath();
          const scallops = 20;
          const scallop = frameThickness / 2;
          
          for (let i = 0; i <= scallops; i++) {
            const x = frameThickness + (img.naturalWidth * i) / scallops;
            const y = frameThickness + (i % 2 === 0 ? 0 : scallop);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          
          ctx.lineTo(canvas.width - frameThickness, frameThickness);
          ctx.lineTo(canvas.width - frameThickness, canvas.height - frameThickness);
          ctx.lineTo(frameThickness, canvas.height - frameThickness);
          ctx.closePath();
          ctx.clip();
          
          ctx.drawImage(img, frameThickness, frameThickness);
          ctx.restore();
          break;

        default:
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);
          break;
      }

      // Convert canvas to blob URL
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        }, 'image/jpeg', 0.9);
      });

    } catch (error) {
      console.error('Error applying frame:', error);
      return null;
    }
  }, [imageRef, setImagePreview]);

  const applyFrameEffects = useCallback(async (shadow = 0, spread = 0, shadowColor = '#000000') => {
    if (!imageRef.current) {
      console.log('No image to apply effects to');
      return null;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      if (!img.complete) {
        await new Promise(resolve => {
          img.onload = resolve;
        });
      }

      const shadowBlur = shadow;
      const shadowSpread = spread;
      const padding = shadowBlur + shadowSpread + 10;

      canvas.width = img.naturalWidth + padding * 2;
      canvas.height = img.naturalHeight + padding * 2;

      if (shadow > 0) {
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = shadowSpread;
        ctx.shadowOffsetY = shadowSpread;
      }

      ctx.drawImage(img, padding, padding);

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        }, 'image/jpeg', 0.9);
      });

    } catch (error) {
      console.error('Error applying frame effects:', error);
      return null;
    }
  }, [imageRef]);

  // Frame style options for UI
  const frameStyles = [
    { value: 'none', label: 'No Frame' },
    { value: 'thin-border', label: 'Thin Border' },
    { value: 'thick-border', label: 'Thick Border' },
    { value: 'double-border', label: 'Double Border' },
    { value: 'polaroid', label: 'Polaroid' },
    { value: 'rounded-corner', label: 'Rounded Corner' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'shadow-box', label: 'Shadow Box' },
    { value: 'beveled', label: 'Beveled' },
    { value: 'film-strip', label: 'Film Strip' },
    { value: 'torn-paper', label: 'Torn Paper' },
    { value: 'mat-board', label: 'Mat Board' },
    { value: 'wood-frame', label: 'Wood Frame' },
    { value: 'neon-glow', label: 'Neon Glow' },
    { value: 'gold-ornate', label: 'Gold Ornate' },
    { value: 'sketch-border', label: 'Sketch Border' },
    { value: 'instagram-square', label: 'Instagram Square' },
    { value: 'scalloped-edge', label: 'Scalloped Edge' }
  ];

  return {
    frameSettings,
    setFrameSettings,
    applyFrame,
    applyFrameEffects,
    frameStyles
  };
};