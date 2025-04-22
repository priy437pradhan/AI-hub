"use client"
import { useState } from 'react'
import Header from './Header'
import SignInPopup from './SignIn'

export default function App() {
  const [isSignInOpen, setIsSignInOpen] = useState(false)

  const handleOpenSignIn = () => {
    setIsSignInOpen(true)
  }

  const handleCloseSignIn = () => {
    setIsSignInOpen(false)
  }

  return (
    <div>
      <Header onSignInClick={handleOpenSignIn} />
      <SignInPopup isOpen={isSignInOpen} onClose={handleCloseSignIn} />
      
     
    </div>
  )
}