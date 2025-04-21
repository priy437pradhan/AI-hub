// app/providers.js
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// Create theme context
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
})

// Export the hook to use the context
export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}

export default function Providers({ children }) {
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)
  
  // Only run on client side
  useEffect(() => {
    setMounted(true)
    
    // Get initial theme
    try {
      const savedTheme = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setTheme('dark')
        document.documentElement.classList.add('dark')
      } else {
        setTheme('light')
        document.documentElement.classList.remove('dark')
      }
    } catch (e) {
      console.error("Error accessing localStorage:", e)
    }
  }, [])
  
 
  useEffect(() => {
    if (!mounted) return
    
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    } catch (e) {
      console.error("Error updating theme:", e)
    }
  }, [theme, mounted])
  
  const contextValue = {
    theme,
    setTheme: (newTheme) => {
      setTheme(newTheme)
    }
  }
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}