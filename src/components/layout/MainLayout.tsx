// src/components/layout/MainLayout.tsx
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Transition } from '@headlessui/react'
import Header from './Header'
import Sidebar from './Sidebar'
import MobileMenu from './MobileMenu'
import { useSidebar } from '../../store/useAppStore'
import { clsx } from 'clsx'

interface MainLayoutProps {
  children?: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { sidebarOpen, setSidebarOpen } = useSidebar()

  // Close sidebar on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setSidebarOpen])

  return (
    <div className="h-screen bg-gray-50">
      {/* Mobile menu */}
      <MobileMenu />

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <Transition
        show={sidebarOpen}
        enter="transition-opacity ease-linear duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />

          <Transition
            show={sidebarOpen}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <Sidebar mobile />
            </div>
          </Transition>
        </div>
      </Transition>

      {/* Main content */}
      <div className={clsx(
        'flex flex-col flex-1',
        'lg:pl-64' // Add left padding for desktop sidebar
      )}>
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children || <Outlet />}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
