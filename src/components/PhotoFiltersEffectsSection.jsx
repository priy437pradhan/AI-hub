"use client"
import AniTwo from '../images/animation-two.webp';
import React from 'react';

const PhotoFiltersEffectsSection = () => {
  return (
    <section className="w-full py-16 bg-gradient-to-r from-primary-50 to-primary-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      
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
                  <span className="text-primary hover:underline cursor-pointer">photo effects</span>,
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
              <button className="px-8 py-3 bg-primary hover:bg-primary-600 text-white font-medium rounded-md transition-colors">
                Edit photo for free
              </button>
            </div>
          </div>
          
        
          <div className="relative">
         
            <div className="absolute inset-0 bg-primary-400 rounded-full filter blur-3xl opacity-30"></div>
            
            
            <div className="relative">
              
              
        
              <div className="absolute bottom-4 right-24 z-20">
                
                  <div className="relative">
                    <img 
                      src={AniTwo.src}
                      alt="AI transformed portrait with flowers" 
                      className="w-full h-auto"
                    />
                   
                  </div>
                
              </div>
              <div className="h-64 md:h-64 lg:h-96"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoFiltersEffectsSection;