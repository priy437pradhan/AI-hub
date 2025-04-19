"use client"
import { useState, useEffect } from 'react'

export default function EditorPreview() {
  const tools = [
    { icon: "✂️", name: "Crop", image: "/crop-example.jpg" },
    { icon: "🔄", name: "Resize", image: "/resize-example.jpg" },
    { icon: "↻", name: "Rotate & Flip", image: "/rotate-example.jpg" },
    { icon: "🔆", name: "Blush", image: "/blush-example.jpg" },
    { icon: "◇", name: "Reshape", image: "/reshape-example.jpg" },
    { icon: "😁", name: "Teeth Whitening", image: "/teeth-example.jpg" },
    { icon: "✨", name: "Effects", image: "/effects-example.jpg" },
    { icon: "🪄", name: "Magic Remove", image: "/magic-example.jpg" }
  ]
  
  const [activeToolIndex, setActiveToolIndex] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveToolIndex((prevIndex) => (prevIndex + 1) % tools.length)
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="lg:absolute lg:top-1/6 lg:right-[5%] lg:w-[45%] w-full z-10">
      <div className="flex bg-gray-50 rounded-2xl shadow-lg overflow-hidden">
        
        <div className="bg-gray-800 w-32 md:w-48 p-4 text-white">
          {tools.map((tool, index) => (
            <div 
              key={index} 
              className={`flex items-center p-2 mb-2 rounded transition-colors cursor-pointer ${
                activeToolIndex === index 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-gray-700"
              }`}
            >
              <span className="mr-2 text-lg">{tool.icon}</span>
              <span className="text-sm md:text-base">{tool.name}</span>
            </div>
          ))}
        </div>
        
        {/* Image Preview */}
        <div className="flex-1 relative min-h-72 bg-gray-200 overflow-hidden">
          {tools.map((tool, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-300 ${
                activeToolIndex === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <img 
                src={tool.image} 
                alt={`${tool.name} example`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          
          
        </div>
      </div>
    </div>
  )
}