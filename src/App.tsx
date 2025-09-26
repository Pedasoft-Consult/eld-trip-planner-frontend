import React, { Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Store
import { useAppStore } from '@store/useAppStore'

// Layouts
import MainLayout from '@/components/layout/MainLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

// Pages (Lazy loaded for code splitting)
const Dashboard = React.lazy(() => import('@pages/Dashboard'))
const TripPlanner = React.lazy(() => import('@pages/TripPlanner'))
const TripDetails = React.lazy(() => import('@pages/TripDetails'))
const ELDLogs = React.lazy(() => import('@pages/ELDLogs'))
const LogDetails = React.lazy(() => import('@pages/LogDetails'))
const ComplianceReports = React.lazy(() => import('@pages/ComplianceReports'))
const Settings = React.lazy(() => import('@pages/Settings'))
const NotFound = React.lazy(() => import('@pages/NotFound'))

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">Loading page...</p>
    </div>
  </div>
)

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
}

function App() {
  const { initializeApp, isInitialized, error } = useAppStore()

  useEffect(() => {
    // Initialize the app (load user preferences, check API status, etc.)
    const init = async () => {
      try {
        await initializeApp()
      } catch (error) {
        console.error('Failed to initialize app:', error)
      }
    }

    init()
  }, [initializeApp])

  // Show error state if app failed to initialize
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to Load Application
          </h1>
          <p className="text-gray-600 mb-4">
            {error || 'An unexpected error occurred while loading the ELD Trip Planner.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Reload Application
          </button>
        </div>
      </div>
    )
  }

  // Show loading state while app is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 text-lg">Initializing ELD Trip Planner...</p>
          <p className="mt-2 text-gray-500 text-sm">
            Loading mapping services and compliance data
          </p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="app min-h-screen bg-gray-50">
        <MainLayout>
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Dashboard - Default route */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route
                  path="/dashboard"
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Dashboard />
                    </motion.div>
                  }
                />

                {/* Trip Planning */}
                <Route
                  path="/trip-planner"
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <TripPlanner />
                    </motion.div>
                  }
                />
                <Route
                  path="/trips/:tripId"
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <TripDetails />
                    </motion.div>
                  }
                />

                {/* ELD Logs */}
                <Route
                  path="/eld-logs"
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <ELDLogs />
                    </motion.div>
                  }
                />
                <Route
                  path="/eld-logs/:logId"
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <LogDetails />
                    </motion.div>
                  }
                />

                {/* Compliance */}
                <Route
                  path="/compliance"
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <ComplianceReports />
                    </motion.div>
                  }
                />

                {/* Settings */}
                <Route
                  path="/settings"
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Settings />
                    </motion.div>
                  }
                />

                {/* 404 Not Found */}
                <Route
                  path="*"
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <NotFound />
                    </motion.div>
                  }
                />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </MainLayout>
      </div>
    </ErrorBoundary>
  )
}

export default App
