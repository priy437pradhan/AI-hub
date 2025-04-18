"use client"

import React from 'react';

const AIImageGeneratorHero = () => {
  return (
    <div className="w-full py-16 bg-white">
      {/* Main heading */}
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
          Spark your imagination with generative AI
        </h1>
        
        {/* Subheading */}
        <p className="text-lg text-center text-gray-700 max-w-4xl mx-auto mb-10">
          With powerful generative AI tools, you can edit photos and create beautiful images more efficiently than ever. Welcome to the future of image editing with our online photo editor!
        </p>
        
        {/* Tool filters buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button className="px-6 py-2 border border-blue-400 text-blue-500 rounded-full hover:bg-blue-50 transition-colors">
            Text to Image
          </button>
          <button className="px-6 py-2 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
            AI Replace
          </button>
          <button className="px-6 py-2 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
            AI Expand
          </button>
          <button className="px-6 py-2 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
            AI Avatar
          </button>
        </div>
        
        {/* Image showcase and description section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Image examples with labels */}
          <div className="relative bg-gradient-to-br from-cyan-100 to-purple-100 p-8 rounded-3xl">
            <div className="flex flex-col gap-6">
              {/* Cyberpunk image */}
              <div className="relative">
                <img 
                  src="/api/placeholder/400/320" 
                  alt="Cyberpunk woman with neon aesthetics" 
                  className="rounded-lg shadow-lg w-full max-w-sm mx-auto"
                />
                <div className="absolute left-4 -top-5">
                  <span className="bg-green-200 text-green-800 px-4 py-2 rounded-full text-sm">
                    Cyberpunk Woman
                  </span>
                </div>
              </div>
              
              {/* Jellyfish image */}
              <div className="relative ml-16">
                <img 
                  src="/api/placeholder/400/240" 
                  alt="Jellyfish in a forest-like underwater environment" 
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute left-4 -top-5">
                  <span className="bg-green-200 text-green-800 px-4 py-2 rounded-full text-sm">
                    Jellyfish In The Forest
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description section */}
          <div className="px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Generate stunning AI art from text
            </h2>
            
            <p className="text-gray-700 mb-6">
              Convert your ideas into stunning AI art instantly with artificial intelligence. Just describe the image you want and watch as our powerful <span className="text-blue-600">AI image generator</span> tool brings it to life in the blink of an eye. From realistic photos and logos to 3D characters and digital illustrations, you can create whatever you want. Get started with our photo editor now and embark on your artistic journey!
            </p>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIImageGeneratorHero;