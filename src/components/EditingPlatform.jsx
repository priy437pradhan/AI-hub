import { useState, useRef, useEffect } from 'react';
import { 
ChevronDown, Upload, Search, Download, Crop, Maximize, ArrowRight,Image,Sliders,Sparkles,Smile,Layers,Type,Square,
MoreHorizontal,Grid,Settings,Check
} 
from 'lucide-react';
export default function AIhubEditor() {
// State for active tool selection
const [activeTool, setActiveTool] = useState('adjust');
const [aspectRatio, setAspectRatio] = useState('freeform');
const [width, setWidth] = useState('475');
const [height, setHeight] = useState('475');
const [keepAspectRatio, setKeepAspectRatio] = useState(false);
// State for image upload
const [uploadedImage, setUploadedImage] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const fileInputRef = useRef(null);
const imageRef = useRef(null);
// Crop state
const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
const [isCropping, setIsCropping] = useState(false);
const [croppedImage, setCroppedImage] = useState(null);
const canvasRef = useRef(null);
const cropBoxRef = useRef(null);
const isDraggingRef = useRef(false);
const isResizingRef = useRef(false);
const resizeHandleRef = useRef(null);
const startXRef = useRef(0);
const startYRef = useRef(0);
const cropStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
// Responsive state
const [isMobile, setIsMobile] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(true);
const sidebarTools = [
{ id: 'ai', icon: <Sparkles size={20} />, label: 'AI Tools' },
{ id: 'adjust', icon: <Sliders size={20} />, label: 'Adjust' },
{ id: 'effects', icon: <Sparkles size={20} />, label: 'Effects' },
{ id: 'beauty', icon: <Smile size={20} />, label: 'Beauty' },
{ id: 'frames', icon: <Layers size={20} />, label: 'Frames' },
{ id: 'text', icon: <Type size={20} />, label: 'Text' },
{ id: 'elements', icon: <Square size={20} />, label: 'Elements' },
{ id: 'uploads', icon: <Upload size={20} />, label: 'Uploads' },
{ id: 'apps', icon: <Grid size={20} />, label: 'Apps' },
{ id: 'more', icon: <MoreHorizontal size={20} />, label: 'More' },
];
const aspectRatios = [
{ id: 'freeform', label: 'Freeform', icon: '⊞', dimensions: null },
{ id: '1x1', label: '1 x 1', icon: '□', dimensions: { width: 1, height: 1 } },
{ id: '3x2', label: '3 x 2', icon: '▭', dimensions: { width: 3, height: 2 } },
{ id: '2x3', label: '2 x 3', icon: '▯', dimensions: { width: 2, height: 3 } },
{ id: '4x3', label: '4 x 3', icon: '▭', dimensions: { width: 4, height: 3 } },
{ id: '3x4', label: '3 x 4', icon: '▯', dimensions: { width: 3, height: 4 } },
{ id: '16x9', label: '16 x 9', icon: '▭', dimensions: { width: 16, height: 9 } },
{ id: '9x16', label: '9 x 16', icon: '▯', dimensions: { width: 9, height: 16 } },
{ id: 'original', label: 'Original Ratio', icon: '▣', dimensions: null },
{ id: 'circle', label: 'Circle', icon: '○', dimensions: null },
{ id: 'triangle', label: 'Triangle', icon: '△', dimensions: null },
{ id: 'heart', label: 'Heart-shape', icon: '♥', dimensions: null },
];
// Sample demo images
const demoImages = [
"/api/placeholder/500/500",
"/api/placeholder/500/500",
"/api/placeholder/500/500"
];
// Check if mobile on mount and window resize
useEffect(() => {
const checkMobile = () => {
setIsMobile(window.innerWidth < 768);
if (window.innerWidth < 768) {
setSidebarOpen(false);
} else {
setSidebarOpen(true);
}
};
checkMobile();
window.addEventListener('resize', checkMobile);
return () => window.removeEventListener('resize', checkMobile);
}, []);
// Initialize crop area when image is loaded
useEffect(() => {
   if (imagePreview && imageRef.current) {
     const img = imageRef.current;
     
     // Wait for image to load to get its dimensions
     img.onload = () => {
       const imgWidth = img.naturalWidth;
       const imgHeight = img.naturalHeight;
       
       // Create a crop area centered on the image
       const size = 425;
       // Make sure the square fits within the image
       const finalSize = Math.min(size, imgWidth * 0.9, imgHeight * 0.9);
       const x = (imgWidth - finalSize) / 2;
       const y = (imgHeight - finalSize) / 2;
       
       setCropArea({
         x: x,
         y: y,
         width: finalSize,
         height: finalSize
       });
       
       // Update input fields
       setWidth("425");
       setHeight("425");
       
       // Ensure crop tool is active
       setActiveTool('adjust');
       setIsCropping(true);
     };
   }
 }, [imagePreview]);
// Update crop area when aspect ratio changes
useEffect(() => {
if (!imagePreview) return;
if (aspectRatio === 'freeform') {
// For freeform, don't constrain the ratio but keep current size
setKeepAspectRatio(false);
} else if (aspectRatio === 'circle') {
// For circle, enforce 1:1 ratio
setKeepAspectRatio(true);
const imgWidth = imageRef.current.naturalWidth;
const imgHeight = imageRef.current.naturalHeight;
const size = Math.min(imgWidth, imgHeight) * 0.8;
setCropArea({
x: (imgWidth - size) / 2,
y: (imgHeight - size) / 2,
width: size,
height: size
});
setWidth(Math.round(size).toString());
setHeight(Math.round(size).toString());
} else if (aspectRatio === 'triangle' || aspectRatio === 'heart') {
// For triangle and heart, start with a square but will apply shape mask when cropping
setKeepAspectRatio(true);
const imgWidth = imageRef.current.naturalWidth;
const imgHeight = imageRef.current.naturalHeight;
const size = Math.min(imgWidth, imgHeight) * 0.8;
setCropArea({
x: (imgWidth - size) / 2,
y: (imgHeight - size) / 2,
width: size,
height: size
});
setWidth(Math.round(size).toString());
setHeight(Math.round(size).toString());
} else if (aspectRatio !== 'original') {
const selectedRatio = aspectRatios.find(r => r.id === aspectRatio);
if (selectedRatio?.dimensions) {
const { width: rWidth, height: rHeight } = selectedRatio.dimensions;
const imgWidth = imageRef.current.naturalWidth;
const imgHeight = imageRef.current.naturalHeight;
// Calculate new crop dimensions based on aspect ratio
let newWidth, newHeight;
if ((imgWidth / imgHeight) > (rWidth / rHeight)) {
// Image is wider than target ratio
newHeight = imgHeight;
newWidth = newHeight * (rWidth / rHeight);
} else {
// Image is taller than target ratio
newWidth = imgWidth;
newHeight = newWidth * (rHeight / rWidth);
}
// Center the crop area
const newX = (imgWidth - newWidth) / 2;
const newY = (imgHeight - newHeight) / 2;
setCropArea({
x: newX,
y: newY,
width: newWidth,
height: newHeight
});
// Update input fields
setWidth(Math.round(newWidth).toString());
setHeight(Math.round(newHeight).toString());
}
}
}, [aspectRatio, imagePreview]);
const handleFileChange = (event) => {
const file = event.target.files[0];
if (file) {
setUploadedImage(file);
const reader = new FileReader();
reader.onloadend = () => {
setImagePreview(reader.result);
setCroppedImage(null);
};
reader.readAsDataURL(file);
setActiveTool('adjust');
setIsCropping(true);
}
};
const handleMouseDown = (e) => {
if (cropBoxRef.current && isCropping) {
isDraggingRef.current = true;
startXRef.current = e.clientX;
startYRef.current = e.clientY;
cropStartRef.current = { 
x: cropArea.x, 
y: cropArea.y,
width: cropArea.width,
height: cropArea.height
};
e.preventDefault();
}
};
// Handle resize start event
const handleResizeStart = (e, handle) => {
if (cropBoxRef.current && isCropping) {
e.stopPropagation();
isResizingRef.current = true;
resizeHandleRef.current = handle;
startXRef.current = e.clientX;
startYRef.current = e.clientY;
cropStartRef.current = { 
x: cropArea.x, 
y: cropArea.y,
width: cropArea.width,
height: cropArea.height
};
e.preventDefault();
}
};
const handleMouseMove = (e) => {
if (isDraggingRef.current && cropBoxRef.current && imageRef.current) {
const img = imageRef.current;
const imgRect = img.getBoundingClientRect();
// Calculate movement delta
const deltaX = e.clientX - startXRef.current;
const deltaY = e.clientY - startYRef.current;
// Scale delta by image scale factor
const scaleX = img.naturalWidth / imgRect.width;
const scaleY = img.naturalHeight / imgRect.height;
// Calculate new position
let newX = cropStartRef.current.x + (deltaX * scaleX);
let newY = cropStartRef.current.y + (deltaY * scaleY);
// Constrain within image bounds
newX = Math.max(0, Math.min(img.naturalWidth - cropArea.width, newX));
newY = Math.max(0, Math.min(img.naturalHeight - cropArea.height, newY));
// Update crop area
setCropArea(prev => ({
...prev,
x: newX,
y: newY
}));
}
else if (isResizingRef.current && cropBoxRef.current && imageRef.current) {
const img = imageRef.current;
const imgRect = img.getBoundingClientRect();
// Calculate movement delta
const deltaX = e.clientX - startXRef.current;
const deltaY = e.clientY - startYRef.current;
// Scale delta by image scale factor
const scaleX = img.naturalWidth / imgRect.width;
const scaleY = img.naturalHeight / imgRect.height;
// Calculate scaled deltas
const scaledDeltaX = deltaX * scaleX;
const scaledDeltaY = deltaY * scaleY;
let newX = cropStartRef.current.x;
let newY = cropStartRef.current.y;
let newWidth = cropStartRef.current.width;
let newHeight = cropStartRef.current.height;
const handle = resizeHandleRef.current;
// Handle resize based on which handle was grabbed
if (handle.includes('n')) {
newY = cropStartRef.current.y + scaledDeltaY;
newHeight = cropStartRef.current.height - scaledDeltaY;
}
if (handle.includes('s')) {
newHeight = cropStartRef.current.height + scaledDeltaY;
}
if (handle.includes('w')) {
newX = cropStartRef.current.x + scaledDeltaX;
newWidth = cropStartRef.current.width - scaledDeltaX;
}
if (handle.includes('e')) {
newWidth = cropStartRef.current.width + scaledDeltaX;
}
// Maintain aspect ratio if enabled
if (keepAspectRatio && aspectRatio !== 'freeform') {
const selectedRatio = aspectRatios.find(r => r.id === aspectRatio);
if (selectedRatio?.dimensions) {
const { width: rWidth, height: rHeight } = selectedRatio.dimensions;
const ratio = rWidth / rHeight;
if (handle.includes('n') || handle.includes('s')) {
// Vertical resize, adjust width based on height
newWidth = newHeight * ratio;
if (handle.includes('w')) {
newX = cropStartRef.current.x + cropStartRef.current.width - newWidth;
}
} else if (handle.includes('w') || handle.includes('e')) {
// Horizontal resize, adjust height based on width
newHeight = newWidth / ratio;
if (handle.includes('n')) {
newY = cropStartRef.current.y + cropStartRef.current.height - newHeight;
}
}
}
} else if (aspectRatio === 'freeform') {
// In freeform mode, allow any dimensions
// No constraints on width/height ratio
}
// Ensure minimum size
newWidth = Math.max(20, newWidth);
newHeight = Math.max(20, newHeight);
// Constrain within image bounds
const imgWidth = img.naturalWidth;
const imgHeight = img.naturalHeight;
if (newX < 0) {
newWidth += newX;
newX = 0;
}
if (newY < 0) {
newHeight += newY;
newY = 0;
}
if (newX + newWidth > imgWidth) {
newWidth = imgWidth - newX;
}
if (newY + newHeight > imgHeight) {
newHeight = imgHeight - newY;
}
// Update crop area
setCropArea({
x: newX,
y: newY,
width: newWidth,
height: newHeight
});
// Update dimension input fields
setWidth(Math.round(newWidth).toString());
setHeight(Math.round(newHeight).toString());
}
};    
const handleMouseUp = () => {
isDraggingRef.current = false;
isResizingRef.current = false;
resizeHandleRef.current = null;
};
// Crop the image
const performCrop = () => {
if (!imageRef.current || !cropArea) return;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
// Set canvas size to crop area
canvas.width = cropArea.width;
canvas.height = cropArea.height;
// Apply shape mask for special shapes
if (aspectRatio === 'circle' || aspectRatio === 'triangle' || aspectRatio === 'heart') {
  ctx.save();
  
  if (aspectRatio === 'circle') {
    ctx.beginPath();
    ctx.arc(cropArea.width/2, cropArea.height/2, cropArea.width/2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  } else if (aspectRatio === 'triangle') {
    ctx.beginPath();
    ctx.moveTo(cropArea.width/2, 0);
    ctx.lineTo(0, cropArea.height);
    ctx.lineTo(cropArea.width, cropArea.height);
    ctx.closePath();
    ctx.clip();
  } else if (aspectRatio === 'heart') {
    // Improved heart shape path
    ctx.beginPath();
    const size = Math.min(cropArea.width, cropArea.height);
    const x = cropArea.width / 2;
    const y = cropArea.height / 2;
    const width = size;
    const height = size;
    
    // Move to top center of heart
    ctx.moveTo(x, y - 0.3 * height);
    
    // Draw left curve (top left of heart)
    ctx.bezierCurveTo(
      x - 0.25 * width, y - 0.45 * height,  // control point 1
      x - 0.5 * width, y - 0.25 * height,   // control point 2
      x - 0.5 * width, y                    // end point
    );
    
    // Draw left bottom curve
    ctx.bezierCurveTo(
      x - 0.5 * width, y + 0.3 * height,    // control point 1
      x - 0.3 * width, y + 0.4 * height,    // control point 2
      x, y + 0.5 * height                  // end point (bottom of heart)
    );
    
    // Draw right bottom curve
    ctx.bezierCurveTo(
      x + 0.3 * width, y + 0.4 * height,    // control point 1
      x + 0.5 * width, y + 0.3 * height,    // control point 2
      x + 0.5 * width, y                    // end point
    );
    
    // Draw right top curve
    ctx.bezierCurveTo(
      x + 0.5 * width, y - 0.25 * height,   // control point 1
      x + 0.25 * width, y - 0.45 * height,  // control point 2
      x, y - 0.3 * height                  // back to start
    );
    
    ctx.closePath();
    ctx.clip();
  }
}
// Draw cropped portion of image to canvas
ctx.drawImage(
imageRef.current,
cropArea.x, cropArea.y, cropArea.width, cropArea.height,
0, 0, cropArea.width, cropArea.height
);
if (aspectRatio === 'circle' || aspectRatio === 'triangle' || aspectRatio === 'heart') {
ctx.restore();
}
// Convert canvas to data URL
const croppedDataUrl = canvas.toDataURL('image/jpeg');
setCroppedImage(croppedDataUrl);
setIsCropping(false);
// Return to showing the cropped image
setImagePreview(croppedDataUrl);
};
// Download the cropped image
const downloadImage = () => {
if (!croppedImage && !imagePreview) {
alert("Please upload and crop an image first.");
return;
}
// Create a download link
const link = document.createElement('a');
link.download = 'cropped-image.jpg';
link.href = croppedImage || imagePreview;
link.click();
};
// Trigger file input click
const handleUploadClick = () => {
fileInputRef.current.click();
};
// Load demo image
const loadDemoImage = (index) => {
   setImagePreview(demoImages[index]);
   setUploadedImage("demo-image");
   setCroppedImage(null);
   setActiveTool('adjust');
   setIsCropping(true);
   setAspectRatio('freeform');
 };
return (
<div className="flex flex-col h-screen bg-gray-100 dark:bg-dark-bg">
   {/* Hidden file input */}
   <input 
      type="file" 
      ref={fileInputRef} 
      onChange={handleFileChange} 
      accept="image/*" 
      className="hidden" 
      />
   {/* Top Navigation */}
   <header className="flex items-center justify-between bg-white dark:bg-dark-card px-4 py-3 border-b border-gray-200 dark:border-dark-border">
      <div className="flex items-center space-x-2 md:space-x-4">
         {isMobile && (
         <button
            onClick={() =>
            setSidebarOpen(!sidebarOpen)}
            className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border rounded"
            >
            <Grid size={20} />
         </button>
         )}
         <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
               <span className="text-white font-bold">AI</span>
            </div>
            <span className="ml-2 font-bold text-xl dark:text-dark-text">AI Hub</span>
         </div>
         <button className="hidden md:flex items-center px-3 py-1 text-sm bg-transparent hover:bg-gray-100 dark:hover:bg-dark-border rounded">
            <span className="dark:text-dark-text">AI Photo Editor</span>
            <ChevronDown size={16} className="ml-1 text-gray-600 dark:text-gray-400" />
         </button>
         <button 
            onClick={handleUploadClick}
            className="flex items-center px-2 md:px-3 py-1 text-sm bg-transparent hover:bg-gray-100 dark:hover:bg-dark-border rounded"
            >
            <Upload size={16} className="mr-1 text-gray-600 dark:text-gray-400" />
            <span className="dark:text-dark-text">Open</span>
            {!isMobile && (
            <>
            <span className="dark:text-dark-text ml-1">Image</span>
            <ChevronDown size={16} className="ml-1 text-gray-600 dark:text-gray-400" />
            </>
            )}
         </button>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
         <button className="hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-full">
            <Search size={20} className="text-gray-600 dark:text-gray-400" />
         </button>
         <button 
            onClick={downloadImage}
            className="flex items-center px-2 md:px-4 py-1 md:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
            <Download size={16} className="mr-1 md:mr-2" />
            <span>Download</span>
         </button>
         <button className="hidden md:flex items-center px-3 py-1 bg-transparent border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-border rounded-md">
         <span className="text-gray-700 dark:text-gray-300">Up to 30% Off</span>
         </button>
         <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
   </header>
   {/* Main Content */}
   <div className="flex flex-1 overflow-hidden">
      {/* Left Sidebar */}
      {sidebarOpen && (
      <div className="w-16 bg-gray-800 dark:bg-dark-card flex flex-col items-center py-2 z-10">
         {sidebarTools.map((tool) => (
         <div 
            key={tool.id} 
            onClick={() => {
            setActiveTool(tool.id);
            if (isMobile) setSidebarOpen(false);
            }}
            className={`w-full flex flex-col items-center py-3 cursor-pointer text-xs ${tool.id === activeTool ? 'bg-gray-700 dark:bg-dark-bg' : 'hover:bg-gray-700 dark:hover:bg-dark-bg'}`}
            >
            <div className={`p-1 rounded-md ${tool.id === activeTool ? 'text-primary-500' : 'text-gray-300'}`}>
            {tool.icon}
         </div>
         <span className={`mt-1 ${tool.id === activeTool ? 'text-primary-500' : 'text-gray-300'}`}>{tool.label}</span>
      </div>
      ))}
   </div>
   )}
   {/* Tool Panel */}
   {(!isMobile || (isMobile && activeTool !== 'adjust')) && (
   <div className={`${isMobile ? 'absolute inset-0 z-20 w-full' : 'w-72'} bg-gray-900 dark:bg-dark-card border-r border-gray-700 dark:border-dark-border overflow-y-auto`}>
   <div className="p-4">
      {isMobile && (
      <div className="flex justify-between items-center mb-4">
         <h2 className="text-gray-300 font-medium">{activeTool.charAt(0).toUpperCase() + activeTool.slice(1)} Tools</h2>
         <button 
            onClick={() =>
            setSidebarOpen(true)}
            className="p-2 bg-gray-800 rounded-full"
            >
            <ArrowRight size={16} className="text-gray-400" />
         </button>
      </div>
      )}
      {activeTool === 'ai' && (
      <div>
         <h2 className="text-gray-300 mb-4 font-medium">AI Tools</h2>
         <div className="bg-gray-800 dark:bg-dark-border rounded-md p-4 mb-4">
            <h3 className="text-gray-300 mb-2">AI Background Remover</h3>
            <p className="text-gray-400 text-sm mb-4">Remove image backgrounds automatically with AI</p>
            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Remove Background
            </button>
         </div>
      </div>
      )}
      {activeTool === 'adjust' && (
      <div>
         <h2 className="text-gray-400 mb-2">Size</h2>
         <div className="bg-gray-800 dark:bg-dark-border rounded-md p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
               <span className="text-gray-300">Crop</span>
               <ChevronDown size={16} className="text-gray-400" />
            </div>
            {/* Grid of aspect ratios */}
            <div className="grid grid-cols-3 gap-2 mb-4">
               {aspectRatios.slice(0, 12).map((ratio) => (
               <div 
                  key={ratio.id}
                  onClick={() =>
                  {
                  setAspectRatio(ratio.id);
                  // For freeform, automatically disable keep aspect ratio
                  if (ratio.id === 'freeform') {
                  setKeepAspectRatio(false);
                  }
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded cursor-pointer ${aspectRatio === ratio.id ? 'border-2 border-blue-500' : 'border border-gray-600 hover:border-gray-500'}`}
                  >
                  <div className="text-2xl text-gray-300 mb-1">{ratio.icon}</div>
                  <span className="text-xs text-gray-400">{ratio.label}</span>
               </div>
               ))}
            </div>
            <div className="mb-4">
               <div className="flex items-center mb-2">
                  <div className="h-4 w-4 mr-2 border-b-2 border-r-2 border-gray-500"></div>
               </div>
               <div className="flex space-x-2">
                  <div className="flex-1 relative">
                     <input
                        type="text"
                        value={width}
                        onChange={(e) => {
                     setWidth(e.target.value);
                     if (keepAspectRatio && cropArea) {
                     const newWidth = parseInt(e.target.value) || cropArea.width;
                     const ratio = cropArea.height / cropArea.width;
                     setHeight(Math.round(newWidth * ratio).toString());
                     }
                     }}
                     className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-300"
                     />
                     <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">×</span>
                  </div>
                  <div className="flex-1">
                     <input
                        type="text"
                        value={height}
                        onChange={(e) => {
                     setHeight(e.target.value);
                     if (keepAspectRatio && cropArea) {
                     const newHeight = parseInt(e.target.value) || cropArea.height;
                     const ratio = cropArea.width / cropArea.height;
                     setWidth(Math.round(newHeight * ratio).toString());
                     }
                     }}
                     className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-300"
                     />
                  </div>
                  <button 
                     onClick={() =>
                     {
                     if (cropArea) {
                     const newWidth = parseInt(width) || cropArea.width;
                     const newHeight = parseInt(height) || cropArea.height;
                     // Center the crop area
                     const img = imageRef.current;
                     const imgWidth = img.naturalWidth;
                     const imgHeight = img.naturalHeight;
                     const newX = Math.min((imgWidth - newWidth) / 2, imgWidth - newWidth);
                     const newY = Math.min((imgHeight - newHeight) / 2, imgHeight - newHeight);
                     setCropArea({
                     x: Math.max(0, newX),
                     y: Math.max(0, newY),
                     width: newWidth,
                     height: newHeight
                     });
                     }
                     }}
                     className="p-2 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600"
                     >
                     <ArrowRight size={16} className="text-gray-400" />
                  </button>
               </div>
            </div>
            <div className="flex items-center mb-4">
               <input
                  type="checkbox"
                  id="keepAspect"
                  checked={keepAspectRatio}
                  onChange={() => setKeepAspectRatio(!keepAspectRatio)}
               className="mr-2"
               />
               <label htmlFor="keepAspect" className="text-gray-400 text-sm">Keep Aspect Ratio</label>
            </div>
            <div className="flex space-x-2">
               <button 
                  onClick={performCrop}
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  >
               Apply
               </button>
               <button 
                  onClick={() => setIsCropping(false)}
               className="flex-1 bg-gray-700 text-gray-300 py-2 rounded hover:bg-gray-600"
               >
               Cancel
               </button>
            </div>
         </div>
      </div>
      )}
      {activeTool !== 'ai' && activeTool !== 'adjust' && (
      <div className="py-6 px-4 text-center">
         <h3 className="text-gray-300 mb-2">Tool: {activeTool}</h3>
         <p className="text-gray-400 text-sm">This tool panel would show options for the {activeTool} tool.</p>
      </div>
      )}
   </div>
</div>
)}
{/* Canvas Area */}
<div 
   className="flex-1 flex items-center justify-center bg-gray-200 dark:bg-dark-bg p-4"
   onMouseMove={handleMouseMove}
   onMouseUp={handleMouseUp}
   onMouseLeave={handleMouseUp}
   >
   {!imagePreview ? (
   <div 
      onClick={handleUploadClick}
      className="w-full max-w-3xl aspect-auto border-2 border-dashed border-gray-300 dark:border-dark-border rounded-md flex flex-col items-center justify-center p-8 cursor-pointer"
      >
      <div className="mb-4">
         <div className="w-8 h-8 flex items-center justify-center">
            <span className="text-gray-400 text-3xl">+</span>
         </div>
      </div>
      <p className="text-gray-700 dark:text-dark-text mb-4">Drag or upload your own images</p>
      <button className="bg-blue-500 text-white px-6 py-3 rounded-md flex items-center">
         Open Image
         <ChevronDown size={16} className="ml-2" />
      </button>
   </div>
   ) : (
   <div className="relative w-full max-w-full h-full flex items-center justify-center overflow-hidden">
      <img 
         ref={imageRef}
         src={imagePreview}
         alt="Uploaded preview" 
         className="max-w-full max-h-full object-contain"
         />
      {isCropping && activeTool === 'adjust' && (
      <>
      {/* Semi-transparent dark overlay for non-selected areas */}
      <div className="absolute inset-0" style={{ 
      clipPath: `path('M0,0 L${window.innerWidth},0 L${window.innerWidth},${window.innerHeight} L0,${window.innerHeight}Z M${cropArea.x * (imageRef.current?.clientWidth / imageRef.current?.naturalWidth || 1)},${cropArea.y * (imageRef.current?.clientHeight / imageRef.current?.naturalHeight || 1)} L${(cropArea.x + cropArea.width) * (imageRef.current?.clientWidth / imageRef.current?.naturalWidth || 1)},${cropArea.y * (imageRef.current?.clientHeight / imageRef.current?.naturalHeight || 1)} L${(cropArea.x + cropArea.width) * (imageRef.current?.clientWidth / imageRef.current?.naturalWidth || 1)},${(cropArea.y + cropArea.height) * (imageRef.current?.clientHeight / imageRef.current?.naturalHeight || 1)} L${cropArea.x * (imageRef.current?.clientWidth / imageRef.current?.naturalWidth || 1)},${(cropArea.y + cropArea.height) * (imageRef.current?.clientHeight / imageRef.current?.naturalHeight || 1)}Z')`,
      backgroundColor: 'rgb(253 253 253 / 0%)'
      }}>
   </div>
   <div 
  ref={cropBoxRef}
  className="absolute border-2 border-blue-500 cursor-move"
  style={{
    top: `${cropArea.y}px`,
    left: `${cropArea.x}px`,
    width: `${cropArea.width}px`,
    height: `${cropArea.height}px`,
    transform: imageRef.current ? `scale(${imageRef.current.clientWidth / imageRef.current.naturalWidth})` : 'scale(1)',
    transformOrigin: 'top left',
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)', 
    filter: 'brightness(1.2)',
    clipPath: aspectRatio === 'circle' ? 'circle(50%)' : 
              aspectRatio === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
              aspectRatio === 'heart' ? 'path("M50,20 C90,0 100,40 100,50 C100,70 70,90 50,100 C30,90 0,70 0,50 C0,40 10,0 50,20 Z")' : 
              'none'
  }}
  onMouseDown={handleMouseDown}
>
   {/* Resize handles */}
   <div className="absolute top-0 left-0 w-3 h-3 bg-blue-500 border border-white cursor-nw-resize" onMouseDown={(e) => handleResizeStart(e, 'nw')}></div>
   <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 border border-white cursor-ne-resize" onMouseDown={(e) => handleResizeStart(e, 'ne')}></div>
   <div className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 border border-white cursor-sw-resize" onMouseDown={(e) => handleResizeStart(e, 'sw')}></div>
   <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border border-white cursor-se-resize" onMouseDown={(e) => handleResizeStart(e, 'se')}></div>
   <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white cursor-n-resize" onMouseDown={(e) => handleResizeStart(e, 'n')}></div>
   <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white cursor-s-resize" onMouseDown={(e) => handleResizeStart(e, 's')}></div>
   <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white cursor-w-resize" onMouseDown={(e) => handleResizeStart(e, 'w')}></div>
   <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white cursor-e-resize" onMouseDown={(e) => handleResizeStart(e, 'e')}></div>
</div>
</>
)}
{/* Overlay when cropping is active */}
{isCropping && activeTool === 'adjust' && (
<div className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-75 p-3 rounded-lg flex space-x-3">
   <button 
      onClick={performCrop}
      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
      title="Apply Crop"
      >
      <Check size={20} />
   </button>
   <button 
      onClick={() =>
      setIsCropping(false)}
      className="p-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600"
      title="Cancel"
      >
      <Crop size={20} />
   </button>
</div>
)}
</div>
)}
</div>
</div>
{/* Bottom Area */}
<div className="bg-white dark:bg-dark-card p-4 border-t border-gray-200 dark:border-dark-border">
   <p className="text-center text-gray-600 dark:text-gray-400 mb-2">Try the ready-to-use photos</p>
   <div className="flex justify-center space-x-4">
      <div 
         onClick={() => loadDemoImage(0)}
         className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
         >
         <img src="/api/placeholder/200/200" alt="Landscape" className="w-full h-full object-cover" />
      </div>
      <div 
         onClick={() => loadDemoImage(1)}
         className="w-16 h-16 md:w-20 md:h-20 bg-yellow-100 rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
         >
         <img src="/api/placeholder/200/200" alt="Portrait" className="w-full h-full object-cover" />
      </div>
      <div 
         onClick={() => loadDemoImage(2)}
         className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
         >
         <img src="/api/placeholder/200/200" alt="Still life" className="w-full h-full object-cover" />
      </div>
   </div>
</div>
</div>
);
}