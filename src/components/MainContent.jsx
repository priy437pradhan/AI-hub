import EditorPreview from '../include/EditorPreview'
export default function MainContent() {
  return (
    <main>
      <section className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 py-16 px-5 md:px-10 min-h-screen flex flex-col relative overflow-hidden">
       
        <div className="max-w-xl mb-10 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Online photo editor for everyone
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Our online photo editor offers everything you need to enhance and edit
            photos effortlessly. Experience simple photo editing online for free!
          </p>
          <a 
            href="#edit-now" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-7 rounded-lg inline-block transition-colors"
          >
            Edit photo for free
          </a>
        </div>

       
        <EditorPreview />

       
        <div className="mt-10 lg:mt-0 lg:pt-72 z-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Discover popular features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { icon: "✏️", text: "Create a design" },
              { icon: "🤖", text: "AI image generator" },
              { icon: "✨", text: "Enhance photo" },
              { icon: "🖼️", text: "Remove background" },
              { icon: "🎨", text: "Photo to art" },
              { icon: "👤", text: "Generate Headshots" }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-5 flex items-center shadow hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
              >
                <span className="text-2xl mr-3">{feature.icon}</span>
                <span className="font-medium text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}