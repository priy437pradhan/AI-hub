

const PhotoEditorHero = () => {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
          How to edit photos with Fotor's online photo editor?
        </h1>
        <p className="text-lg text-gray-600">
          With Fotor's free image editor, you can edit photo online in just 3 simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-primary-100 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-3">Step 1: Upload photo</h2>
          <p className="text-gray-600">
            Upload or drag and drop a photo to our photo editor online to start editing.
          </p>
        </div>

        {/* Step 2 */}
        <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-primary-100 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-3">Step 2: Edit photo</h2>
          <p className="text-gray-600">
            Adjust lighting, color, and exposure, apply photo effects, and customize your photo with text.
          </p>
        </div>

        {/* Step 3 */}
        <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-primary-100 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-3">Step 3: Download & share</h2>
          <p className="text-gray-600">
            Download your edited photo in high-quality JPG, PNG or PDF formats and share it instantly on social media.
          </p>
        </div>
      </div>

      <div className="h-2 bg-gradient-to-r from-primary-400 via-primary-300 to-primary-600 mt-16 rounded-full"></div>
    </section>
  );
};

export default PhotoEditorHero;