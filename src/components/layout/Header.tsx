import React, { useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import {
  Bars3Icon,
  BellIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

// Store - Fixed import path
import { useNotifications, useAppTheme, useAppStore } from '../../store/useAppStore'

// Components
import NotificationDropdown from '../ui/NotificationDropdown'

// Utils
import { clsx } from 'clsx'

const Header: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const { notifications, unreadCount } = useNotifications()
  const theme = useAppTheme()
  const { setTheme, toggleSidebar } = useAppStore()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 lg:border-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Page title */}
            <div className="ml-4 lg:ml-0">
              <h1 className="text-2xl font-semibold text-gray-900">
                ELD Trip Planner
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                FMCSA Compliant Route Planning & Electronic Logging
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className={clsx(
                  'p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500',
                  showNotifications
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                )}
                title={`${unreadCount} unread notifications`}
              >
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </button>

              <NotificationDropdown
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                notifications={notifications}
              />
            </div>

            {/* Settings dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex text-sm rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors">
                <span className="sr-only">Open settings menu</span>
                <Cog6ToothIcon className="h-5 w-5" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/settings"
                          className={clsx(
                            'flex items-center px-4 py-2 text-sm',
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          )}
                        >
                          <Cog6ToothIcon className="mr-3 h-4 w-4 text-gray-400" />
                          Settings
                        </a>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={toggleTheme}
                          className={clsx(
                            'flex items-center w-full px-4 py-2 text-sm',
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          )}
                        >
                          {theme === 'light' ? (
                            <MoonIcon className="mr-3 h-4 w-4 text-gray-400" />
                          ) : (
                            <SunIcon className="mr-3 h-4 w-4 text-gray-400" />
                          )}
                          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                        </button>
                      )}
                    </Menu.Item>

                    <div className="border-t border-gray-100">
                      <div className="px-4 py-2">
                        <p className="text-xs text-gray-500">
                          System Status: <span className="text-green-600 font-medium">Online</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          API: Connected
                        </p>
                      </div>
                    </div>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* User menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-red-500">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <UserCircleIcon className="h-6 w-6 text-red-600" />
                </div>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Demo User</p>
                      <p className="text-xs text-gray-500">demo@eldplanner.com</p>
                    </div>

                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={clsx(
                            'block px-4 py-2 text-sm',
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          )}
                        >
                          Your Profile
                        </a>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={clsx(
                            'block px-4 py-2 text-sm',
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          )}
                        >
                          Documentation
                        </a>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={clsx(
                            'block px-4 py-2 text-sm',
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          )}
                        >
                          Support
                        </a>
                      )}
                    </Menu.Item>

                    <div className="border-t border-gray-100">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              // Placeholder for sign out functionality
                              console.log('Sign out clicked')
                            }}
                            className={clsx(
                              'block w-full text-left px-4 py-2 text-sm',
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      {/* Mobile breadcrumb bar */}
      <div className="lg:hidden border-t border-gray-200 px-4 py-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Dashboard</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Overview</span>
        </div>
      </div>
    </div>
  )
}

export default Header
