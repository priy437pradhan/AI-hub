

"use client"
import { useState } from 'react';
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-800">{question}</h3>
        <svg 
          className={`w-5 h-5 text-gray-500 transform ${isOpen ? 'rotate-180' : ''} transition-transform`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div 
        className={`mt-2 text-gray-600 ${isOpen ? 'block' : 'hidden'}`}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqItems = [
    {
      question: "Is Fotor's online photo editor free to use?",
      answer: "Yes, Fotor offers a free version of its online photo editor with essential editing features. There's also a premium subscription that unlocks advanced editing tools and removes watermarks."
    },
    {
      question: "What file formats are supported for upload?",
      answer: "Fotor supports common image formats including JPG, PNG, TIFF, BMP, and RAW files from most digital cameras. You can also upload PSD files with basic layer support."
    },
    {
      question: "Can I edit my photos on mobile devices?",
      answer: "Yes, Fotor's online editor is fully responsive and works on smartphones and tablets. We also offer dedicated mobile apps for iOS and Android with similar functionality."
    },
    {
      question: "How do I remove the background from my photos?",
      answer: "Fotor offers an AI-powered background remover tool. Simply upload your image, click on the 'Background Remover' option in the editing panel, and let our AI do the work. You can then fine-tune the results if needed."
    },
    {
      question: "Is there a limit to how many photos I can edit?",
      answer: "Free users can edit up to 5 photos per day. Premium subscribers have unlimited editing capabilities without daily restrictions."
    }
  ];

  return (
    <section className="py-16 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-gray-600">
          Everything you need to know about our online photo editor
        </p>
      </div>

      <div className="rounded-xl bg-white shadow-lg p-6">
        {faqItems.map((item, index) => (
          <FAQItem 
            key={index} 
            question={item.question} 
            answer={item.answer} 
          />
        ))}
      </div>
    </section>
  );
};

export default FAQ;