import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Get root element
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

// Create root and render app
const root = ReactDOM.createRoot(rootElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Hide loading screen after React app mounts
setTimeout(() => {
  document.body.classList.add('app-loaded')
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen')
    if (loadingScreen) {
      loadingScreen.remove()
    }
  }, 500)
}, 100)
