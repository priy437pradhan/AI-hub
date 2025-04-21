// components/ThemeToggle.jsx
'use client'

import { useThemeContext } from "../app/providers"
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeContext()
  const [mounted, setMounted] = useState(false)
  

  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 ml-2 rounded-md bg-gray-200 dark:bg-gray-800"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}