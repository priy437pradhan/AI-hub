"use client"
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">AI-hub</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <a href="#" className="text-gray-900 hover:text-primary px-3 py-2 text-sm font-medium">Products</a>
              <a href="#" className="text-gray-900 hover:text-primary px-3 py-2 text-sm font-medium">Features</a>
              <a href="#" className="text-gray-900 hover:text-primary px-3 py-2 text-sm font-medium">Pricing</a>
              <a href="#" className="text-gray-900 hover:text-primary px-3 py-2 text-sm font-medium">Resources</a>
            </nav>
          </div>
          
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <a href="#" className="text-gray-900 hover:text-primary px-4 py-2 text-sm font-medium">Sign In</a>
            <a href="#" className="ml-4 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-opacity-90 rounded-lg">
              Try Free
            </a>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="bg-white p-2 rounded-md text-gray-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-primary">Products</a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-primary">Features</a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-primary">Pricing</a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-primary">Resources</a>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-primary">Sign In</a>
              <a href="#" className="block mt-2 px-3 py-2 text-base font-medium text-white bg-primary rounded-lg">Try Free</a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
