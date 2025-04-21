"use client"
import { useState } from 'react'
// import ThemeToggle from './ThemeToggle'  

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  
  const menuItems = [
    {
      title: "Photo Editing Tool",
      submenu: ["AI Assistant", "Data Analysis", "Voice Recognition", "Image Generation"]
    },
    {
      title: "AI Tool",
      submenu: ["Documentation", "API Reference", "Tutorials", "Community Forum"]
    },
    {
      title: "Pricing",
      submenu: ["Documentation", "API Reference", "Tutorials", "Community Forum"]
    }
  ]

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index)
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary dark:text-white">AI-hub</span>
            </div>
            
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {menuItems.map((item, index) => (
                <div key={index} className="relative group">
                  <a href="#" className="text-gray-900 dark:text-gray-200 hover:text-primary px-3 py-2 text-sm font-medium">{item.title}</a>
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg hidden group-hover:block">
                    <div className="py-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <a 
                          key={subIndex}
                          href="#" 
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          </div>
          
          <div className="hidden md:flex items-center">
            <a href="#" className="text-gray-900 dark:text-gray-200 hover:text-primary px-4 py-2 text-sm font-medium">Sign In</a>
            <a href="#" className="ml-4 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-200 hover:text-primary hover:bg-opacity-90 rounded-lg">
              Try Free
            </a>
            {/* <ThemeToggle /> */}
          </div>
          
          <div className="md:hidden">
            <button
              type="button"
              className="bg-white dark:bg-gray-700 p-2 rounded-md text-gray-400"
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
      
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg mx-4 mb-4">
          <div className="py-2">
            {menuItems.map((item, index) => (
              <div key={index} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <button
                  onClick={() => toggleDropdown(index)}
                  className="flex items-center justify-between w-full px-4 py-3 text-left"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200">{item.title}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === index ? 'transform rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === index && (
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2">
                    {item.submenu.map((subItem, subIndex) => (
                      <a 
                        key={subIndex} 
                        href="#" 
                        className="block py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary"
                      >
                        {subItem}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="px-4 py-3">
              <a href="#" className="block w-full py-2 text-center text-gray-800 dark:text-gray-200 hover:text-primary font-medium border border-gray-200 dark:border-gray-700 rounded-lg">Sign In</a>
              <a href="#" className="block w-full py-2 mt-2 text-center text-gray-900 dark:text-gray-200 hover:text-primary font-medium border border-gray-200 dark:border-gray-700 rounded-lg">Try Free</a>
              <div className="mt-2 flex justify-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}