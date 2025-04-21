"use client"

import React from 'react';

const PhotoFiltersEffectsSection = () => {
  return (
    <section className="w-full py-16 bg-gradient-to-r from-pink-50 to-purple-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side content */}
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Stunning photo filters and effects in one click
            </h2>
            
            <p className="text-lg text-gray-700 mb-6">
              Elevate your photos with our diverse range of filters and effects.
            </p>
            
            <div className="space-y-6">
              <div>
                <p className="text-gray-700">
                  <span className="font-medium">Add filter to photo:</span> Give your photos a new tone and mood with artistic{' '}
                  <span className="text-purple-600 hover:underline cursor-pointer">photo effects</span>,
                  including vintage, black & white, sepia, bokeh blur, and more.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700">
                  <span className="font-medium">AI effects:</span> Play around with a diverse range of AI effects to transform your photos
                  into captivating cartoons, anime characters, or stunning sketches - all in just 1 click.
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
                Edit photo for free
              </button>
            </div>
          </div>
          
          {/* Right side images */}
          <div className="relative">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-purple-400 rounded-full filter blur-3xl opacity-30"></div>
            
            {/* Before/after image comparison */}
            <div className="relative">
              <div className="absolute right-4 top-0 z-10">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="relative">
                    <img 
                      src="/api/placeholder/400/300" 
                      alt="Before and after photo filter example" 
                      className="w-full h-auto"
                    />
                    <div className="absolute top-2 left-2 bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      Original
                    </div>
                    <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      Filter
                    </div>
                    {/* Divider line */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white"></div>
                  </div>
                </div>
              </div>
              
              {/* AI effect example */}
              <div className="absolute bottom-4 right-24 z-20">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="relative">
                    <img 
                      src="/api/placeholder/300/350" 
                      alt="AI transformed portrait with flowers" 
                      className="w-full h-auto"
                    />
                    <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      Effects
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Thumbnail previews */}
              <div className="absolute bottom-8 left-12 z-30">
                <div className="bg-white p-2 shadow-lg rounded-lg">
                  <div className="flex gap-2">
                    <img 
                      src="/api/placeholder/80/80" 
                      alt="Filter thumbnail 1" 
                      className="w-20 h-20 object-cover rounded"
                    />
                    <img 
                      src="/api/placeholder/80/80" 
                      alt="Filter thumbnail 2" 
                      className="w-20 h-20 object-cover rounded"
                    />
                    <img 
                      src="/api/placeholder/80/80" 
                      alt="Filter thumbnail 3" 
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>
                </div>
              </div>
              
              {/* This div provides height to the container */}
              <div className="h-96 md:h-80 lg:h-96"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoFiltersEffectsSection;