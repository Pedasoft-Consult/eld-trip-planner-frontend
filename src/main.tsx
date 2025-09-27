import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Get root element
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find the root element')
}

// Create root and render app
const root = ReactDOM.createRoot(rootElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Enhanced loading screen management
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen')
  if (loadingScreen) {
    // Add fade out class
    loadingScreen.classList.add('fade-out')

    // Remove from DOM after animation completes
    setTimeout(() => {
      loadingScreen.remove()
    }, 500)
  }

  // Add app-loaded class to body
  document.body.classList.add('app-loaded')
}

// Hide loading screen after React app mounts
// Add a small delay to ensure everything is properly initialized
setTimeout(() => {
  hideLoadingScreen()
}, 150)

// Keyboard navigation detection for accessibility
let keyboardNavigation = false

document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    keyboardNavigation = true
    document.body.classList.add('keyboard-navigation')
  }
})

document.addEventListener('mousedown', () => {
  keyboardNavigation = false
  document.body.classList.remove('keyboard-navigation')
})

// Service worker registration (for future PWA capabilities)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

// Error boundary for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
  // You could send this to an error reporting service
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  // You could send this to an error reporting service
})

// Performance monitoring
if (import.meta.env.DEV) {
  // Log performance metrics in development
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      console.log('Page Load Performance:', {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        totalTime: perfData.loadEventEnd - perfData.fetchStart
      })
    }, 0)
  })
}
