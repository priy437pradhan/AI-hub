import EditorPreview from '../include/EditorPreview'
export default function MainContent() {
return (
<main>
   <section className="bg-gradient-to-br dark:bg-gray-800  from-blue-50 via-blue-100 to-blue-50 py-8 px-5 md:px-10 min-h-screen flex flex-col relative overflow-hidden">
      <div className="max-w-xl  ml-[6%]  mb-10 z-10">
         <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Online photo editor for everyone
         </h1>
         <p className="text-lg text-gray-700 mb-8">
            Our online photo editor offers everything you need to enhance and edit
            photos effortlessly. Experience simple photo editing online for free!
         </p>
         <a 
            href="#edit-now" 
            className="bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-7 rounded-lg inline-block transition-colors"
            >
         Edit photo for free
         </a>
      </div>
      <EditorPreview />
      <div className="mt-10 lg:mt-0 lg:pt-36 lg:pr-24 lg:pl-20 z-10">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
    Discover popular features
  </h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
        className="relative overflow-hidden bg-white rounded-xl p-4 flex items-center border border-gray-200 shadow-md cursor-pointer group transition-all duration-300"
      >
       
        <div className="absolute inset-0 bg-primary-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

        
        <span className="text-xl mr-2 relative z-10 transition-colors duration-500 group-hover:text-white">
          {feature.icon}
        </span>
        <span className="text-base font-medium text-gray-700 relative z-10 transition-colors duration-500 group-hover:text-white">
          {feature.text}
        </span>
      </div>
    ))}
  </div>
</div>



   </section>
</main>
);
}