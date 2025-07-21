// src/constants/aspectRatios.js

export const categoryOrder = ["size", "color", "tool"];

export const categoryLabels = {
  size: "Size",
  color: "Color",
  tool: "Tool",
};

export const aspectRatios = [
  { id: "freeform", label: "Freeform", icon: "⊞", dimensions: null },
  { id: "original", label: "Original", icon: "▣", dimensions: null },
  { id: "circle", label: "Circle", icon: "○", dimensions: null },
  { id: "triangle", label: "Triangle", icon: "△", dimensions: null },
  { id: "star", label: "Star", icon: "★", dimensions: null },

  // Standard Aspect Ratios
  { id: "1x1", label: "1:1", icon: "□", dimensions: { width: 1, height: 1 } },
  { id: "4x5", label: "4:5", icon: "▯", dimensions: { width: 4, height: 5 } },
  { id: "5x4", label: "5:4", icon: "▭", dimensions: { width: 5, height: 4 } },
  { id: "3x4", label: "3:4", icon: "▯", dimensions: { width: 3, height: 4 } },
  { id: "4x3", label: "4:3", icon: "▭", dimensions: { width: 4, height: 3 } },
  { id: "2x3", label: "2:3", icon: "▯", dimensions: { width: 2, height: 3 } },
  { id: "3x2", label: "3:2", icon: "▭", dimensions: { width: 3, height: 2 } },
  { id: "9x16", label: "9:16", icon: "▯", dimensions: { width: 9, height: 16 } },
  { id: "16x9", label: "16:9", icon: "▭", dimensions: { width: 16, height: 9 } },

  // Social Media Specific (you can add icons if needed)
  { id: "whatsapp-dp", label: "WhatsApp DP", title: "social", icon: "", dimensions: { width: 1, height: 1 } },
  { id: "fb-dp", label: "Facebook DP", title: "social", icon: "", dimensions: { width: 1, height: 1 } },
  { id: "fb-cover", label: "FB Cover", title: "social", icon: "", dimensions: { width: 820, height: 312 } },
  { id: "fb-post", label: "FB Post", title: "social", icon: "", dimensions: { width: 4, height: 5 } },
  { id: "yt-thumbnail", label: "YouTube Thumbnail", title: "social", icon: "", dimensions: { width: 16, height: 9 } },
];
