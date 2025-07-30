"use client"

import React, { useState } from 'react';
import AniOne from '../../src/app/images//animation-one.webp';
import Replace from '../../src/app/images//Replace.webp';
import Extended from '../../src/app/images//Extended.webp';
import Avtar from '../../src/app/images/Avtar.webp';

const AIImageGeneratorHero = () => {
 
  const [activeTab, setActiveTab] = useState('Text to Image');
  
 
  const featureTabs = [
    { id: 'text-to-image', name: 'Text to Image', description: 'Convert your text descriptions into stunning visual imagery' },
    { id: 'ai-replace', name: 'AI Replace', description: 'Seamlessly replace objects or people in your images' },
    { id: 'ai-expand', name: 'AI Expand', description: 'Extend your images beyond their original boundaries' },
    { id: 'ai-avatar', name: 'AI Avatar', description: 'Create personalized avatars from your descriptions' },
  ];
  
 
  const imageExamples = {
    'Text to Image': [
      { src: AniOne.src, alt: 'Cyberpunk woman with neon aesthetics', prompt: 'A cyberpunk woman with neon lights in a futuristic city' },
    ],
    'AI Replace': [
      { src: Replace.src, alt: 'Object replaced in beach scene', prompt: 'Replace the umbrella with a palm tree' },
    ],
    'AI Expand': [
      { src: Extended.src, alt: 'Landscape image expanded', prompt: 'Expand this mountain view to show more sky' },
    ],
    'AI Avatar': [
      { src: Avtar.src, alt: 'AI generated avatar', prompt: 'Create a fantasy warrior avatar with armor' },
    ],
  };

  return (
    <div className="w-full py-16 bg-white">
      
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
          Spark your imagination with generative AI
        </h1>
        
       
        <p className="text-lg text-center text-gray-700 max-w-4xl mx-auto mb-10">
          With powerful generative AI tools, you can edit photos and create beautiful images more efficiently than ever. Welcome to the future of image editing with our online photo editor!
        </p>
        
        
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {featureTabs.map((tab) => (
            <button 
              key={tab.id}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeTab === tab.name 
                  ? 'border border-primary-400 text-primary-500 hover:bg-blue-50' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.name}
            </button>
          ))}
        </div>
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          <div className="flex flex-col gap-6">
            {imageExamples[activeTab]?.map((image, index) => (
              <div key={index} className="relative">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="rounded-lg shadow-lg w-full max-w-sm mx-auto"
                />
                <div className="mt-2 bg-gray-50 p-3 rounded text-sm text-gray-600">
                  <strong>Prompt:</strong> "{image.prompt}"
                </div>
              </div>
            ))}
          </div>
          
          <div className="px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {activeTab === 'Text to Image' ? 'Generate stunning AI art from text' : 
               activeTab === 'AI Replace' ? 'Replace objects with AI precision' :
               activeTab === 'AI Expand' ? 'Expand your images seamlessly' : 
               'Create personalized AI avatars'}
            </h2>
            
            <p className="text-gray-700 mb-6">
              {activeTab === 'Text to Image' ? 
                'Convert your ideas into stunning AI art instantly with artificial intelligence. Just describe the image you want and watch as our powerful AI image generator tool brings it to life in the blink of an eye.' : 
                activeTab === 'AI Replace' ? 
                'Seamlessly replace objects, backgrounds, or people in your photos. Our AI tool intelligently blends the new elements to match lighting and style perfectly.' :
                activeTab === 'AI Expand' ? 
                'Expand your images beyond their original boundaries with our AI-powered tool. Perfect for creating wider landscapes or taller portraits without losing quality.' :
                'Create personalized avatars from simple text descriptions. Our AI understands style preferences and can generate unique characters for your gaming, social media, or creative projects.'}
              {' '}From realistic photos and logos to 3D characters and digital illustrations, you can create whatever you want. Get started with our photo editor now and embark on your artistic journey!
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