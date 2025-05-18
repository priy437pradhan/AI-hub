'use client';

export default function ImageCanvas({
  imagePreview,
  handleUploadClick,
  imageRef,
  activeTool,
  activeAdjustTool,
  setImagePreview
}) {
  return (
    <div 
      className="flex-1 flex items-center justify-center dark:bg-dark-bg mx-20 my-28"
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
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-full h-full flex items-center justify-center overflow-hidden">
          <div className="relative image-wrapper">
            <img 
              ref={imageRef}
              src={imagePreview}
              alt="Uploaded preview" 
              className="max-w-full max-h-full object-contain"
              style={{
                maxHeight: '70vh',
                width: 'auto'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}