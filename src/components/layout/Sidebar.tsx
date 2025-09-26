// src/components/layout/Sidebar.tsx
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  HomeIcon,
  MapIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  TruckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useSidebar } from '@/store/useAppStore'

interface SidebarProps {
  mobile?: boolean
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Trip Planner', href: '/trip-planner', icon: MapIcon },
  { name: 'ELD Logs', href: '/eld-logs', icon: ClipboardDocumentListIcon },
  { name: 'Compliance', href: '/compliance', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

const Sidebar: React.FC<SidebarProps> = ({ mobile = false }) => {
  const location = useLocation()
  const { setSidebarOpen } = useSidebar()

  const handleNavClick = () => {
    if (mobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
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

        {mobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <XMarkIcon className="
