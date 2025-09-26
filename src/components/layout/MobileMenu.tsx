// src/components/layout/MobileMenu.tsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { Transition } from '@headlessui/react'
import { clsx } from 'clsx'
import {
  HomeIcon,
  MapIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
  TruckIcon
} from '@heroicons/react/24/outline'
import { useSidebar } from '@/store/useAppStore'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Trip Planner', href: '/trip-planner', icon: MapIcon },
  { name: 'ELD Logs', href: '/eld-logs', icon: ClipboardDocumentListIcon },
  { name: 'Compliance', href: '/compliance', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

const MobileMenu: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar()

  const handleNavClick = () => {
    setSidebarOpen(false)
  }

  return (
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
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Mobile menu panel */}
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
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TruckIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-gray-900">ELD Planner</h2>
                  <p className="text-xs text-gray-500">FMCSA Compliant</p>
                </div>
              </div>

              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-5 px-2 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      clsx(
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                        isActive
                          ? 'bg-primary-100 text-primary-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )
                    }
                  >
                    <Icon
                      className={clsx(
                        'mr-3 flex-shrink-0 h-5 w-5'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">D</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Demo User</p>
                  <p className="text-xs text-gray-500">Commercial Driver</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  )
}

export default MobileMenu
