"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Crop from '../images/crop.png'
import RandF from '../images/RandF.png'
import Resize from '../images/resize.png'

export default function EditorPreview() {
  const tools = [
    { icon: "✂️", name: "Crop", image: Crop },
    { icon: "🔄", name: "Resize", image: RandF },
    { icon: "↻", name: "Rotate OR Flip", image: Resize },
    { icon: "🔆", name: "Blush", image: Resize },
    { icon: "◇", name: "Reshape", image: Resize },
    { icon: "😁", name: "Teeth Whitening", image: Crop },
    { icon: "✨", name: "Effects", image: Resize },
    { icon: "🪄", name: "Magic Remove", image: Resize }
  ]

  const [activeToolIndex, setActiveToolIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveToolIndex((prevIndex) => (prevIndex + 1) % tools.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="lg:absolute lg:top-[5%] lg:right-[10%] lg:w-[30%] w-full z-10">
      <div className="flex bg-gray-50 rounded-xl shadow-md overflow-hidden text-sm">

        
        <div className="bg-gray-800 w-24 md:w-36 p-2 md:p-3 text-white">
          {tools.map((tool, index) => (
            <div
              key={index}
              className={`flex items-center gap-1 md:gap-2 p-1 md:p-2 mb-1 rounded cursor-pointer transition-colors ${
                activeToolIndex === index
                  ? "text-primary-500 font-semibold"
                  : "hover:bg-gray-700"
              }`}
            >
              <span className="text-base md:text-lg">{tool.icon}</span>
              <span className="hidden md:inline">{tool.name}</span>
            </div>
          ))}
        </div>

       
        <div className="flex-1 relative min-h-60 md:min-h-72 bg-gray-200">
          {tools.map((tool, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-300 ${
                activeToolIndex === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={tool.image}
                  alt={`${tool.name} example`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
