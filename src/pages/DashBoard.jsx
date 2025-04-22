"use client"
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [userData, setUserData] = useState({
    name: 'User',
    recentProjects: [
      { id: 1, name: 'Profile Photo Edit', date: '2025-04-15', type: 'Photo Editing' },
      { id: 2, name: 'Business Card Design', date: '2025-04-10', type: 'Template' },
      { id: 3, name: 'Background Removal', date: '2025-04-05', type: 'AI Tool' }
    ],
    savedTemplates: [
      { id: 1, name: 'Modern Logo', thumbnail: '/api/placeholder/100/100', category: 'Logo' },
      { id: 2, name: 'Business Card', thumbnail: '/api/placeholder/100/100', category: 'Business Card' },
      { id: 3, name: 'Social Media Post', thumbnail: '/api/placeholder/100/100', category: 'Instagram' }
    ]
  })

  // Simulate loading user data
  useEffect(() => {
    // In a real app, you would fetch user data from an API
    console.log('Dashboard mounted - would fetch user data here')
  }, [])

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {userData.name}!</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Here's what you've been working on</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="#" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Edit Photo</span>
            </a>
            <a href="#" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Create Template</span>
            </a>
            <a href="#" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">AI Image Tool</span>
            </a>
            <a href="#" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-pink-600 dark:text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">New Project</span>
            </a>
          </div>
        </div>
        
        {/* Recent Projects */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Projects</h2>
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Modified</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {userData.recentProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">{project.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">{project.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-primary hover:text-primary-dark">Edit</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Saved Templates */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Saved Templates</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userData.savedTemplates.map((template) => (
              <div key={template.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
                <div className="p-1">
                  <img src={template.thumbnail} alt={template.name} className="w-full h-24 object-cover rounded" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{template.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{template.category}</p>
                </div>
              </div>
            ))}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 flex flex-col items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-300 mt-2">Add Template</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}