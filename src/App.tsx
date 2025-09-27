import React from 'react'
import { Toaster } from 'react-hot-toast'
import TripPlanner from './pages/TripPlanner'

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with blue branding */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Blue truck icon */}
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                  <path d="M20 8h-3V4H3C1.9 4 1 4.9 1 6v9h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 17.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V8.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-black">
                ELD Trip Planner
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                FMCSA Compliant Route Planning
              </div>
              {/* Status indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <TripPlanner />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              © 2025 ELD Trip Planner. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <span>Version 1.0.0</span>
              <span>•</span>
              <a href="#" className="text-blue-600 hover:text-blue-800">Support</a>
              <span>•</span>
              <a href="#" className="text-blue-600 hover:text-blue-800">Documentation</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast notifications with blue theme */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#000',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#1e88e5',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#1e88e5',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  )
}

export default App
