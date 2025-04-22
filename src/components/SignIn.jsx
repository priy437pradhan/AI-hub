"use client"
import { useState } from 'react'

const SignInPopup = ({ isOpen, onClose }) => {
  const [authMethod, setAuthMethod] = useState('email') 
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGmailSignIn = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you would handle Google OAuth here
      console.log('Gmail sign in')
      
      // Redirect to dashboard after successful sign in
      window.location.href = '/dashboard'
    } catch (err) {
      setError('Failed to sign in with Gmail. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you would validate credentials here
      if (authMethod === 'email' && !email) {
        throw new Error('Email is required')
      }
      
      if (authMethod === 'phone' && !phone) {
        throw new Error('Phone number is required')
      }
      
      if (!password) {
        throw new Error('Password is required')
      }
      
      // Redirect to dashboard after successful sign in
      window.location.href = '/dashboard'
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="px-4 py-6 sm:p-6">
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
              Sign in to your account
            </h2>

            {/* Sign in with Gmail */}
            <div>
              <button
                onClick={handleGmailSignIn}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.787-1.676-4.139-2.701-6.735-2.701-5.518 0-10 4.477-10 10s4.482 10 10 10c8.396 0 10-7.584 10-10 0-0.769-0.068-1.511-0.219-2.222h-9.779z" fill="#4285F4"/>
                  <path d="M7.545 14.032l-2.545 1.968c1.544 3.063 4.744 5 8.313 5 2.595 0 4.947-1.025 6.735-2.701l-2.814-2.814c-1.055 0.904-2.423 1.453-3.921 1.453-2.798 0-4.733-1.657-5.445-3.972l-0.323 1.066z" fill="#34A853"/>
                  <path d="M2.785 9.762c-0.481 1.424-0.754 2.927-0.754 4.483 0 1.556 0.273 3.059 0.754 4.483l2.857-2.218c-0.189-0.703-0.293-1.441-0.293-2.182 0-0.741 0.104-1.479 0.293-2.182l-2.857-2.384z" fill="#FBBC05"/>
                  <path d="M12.545 9.032c1.568 0 2.786 0.684 3.477 1.568l2.531-2.531c-1.549-1.459-3.568-2.349-6.008-2.349-3.568 0-6.768 1.937-8.312 5l2.857 2.384c0.712-2.315 2.647-3.972 5.445-3.972z" fill="#EA4335"/>
                </svg>
                Sign in with Gmail
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('email')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                      authMethod === 'email'
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('phone')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                      authMethod === 'phone'
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Phone
                  </button>
                </div>

                <form className="space-y-6" onSubmit={handleFormSubmit}>
                  {authMethod === 'email' ? (
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone number
                      </label>
                      <div className="mt-1">
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <a href="#" className="font-medium text-primary hover:text-primary-dark">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    New to AI-hub?
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <a
                  href="/signup"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Create an account
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPopup