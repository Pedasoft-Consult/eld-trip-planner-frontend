# ELD Trip Planner - React Frontend

A modern, professional React application for truck drivers and fleet managers to plan FMCSA-compliant trips and manage Electronic Logging Device (ELD) records. This frontend pairs with the Django ELD Trip Planner backend to provide a complete solution for Hours of Service compliance and route planning.

## 🚛 Features

### Core Functionality

* **Trip Planning**: Plan routes with automatic HOS compliance checking
* **ELD Log Generation**: Generate FMCSA-compliant electronic logs
* **Hours of Service**: Real-time HOS status monitoring and violation alerts
* **Route Optimization**: Automatic rest stops and fuel stop recommendations
* **Compliance Reporting**: Detailed compliance reports and analytics
* **Driver Management**: Manage driver profiles and certifications
* **Vehicle Tracking**: Track vehicle information and odometer readings

### Technical Features

* **Modern React 18**: With TypeScript for type safety
* **Responsive Design**: Mobile-first design with Tailwind CSS
* **Real-time Updates**: Live data with React Query
* **State Management**: Zustand for efficient state management
* **Interactive Maps**: MapBox integration for route visualization
* **Progressive Web App**: PWA capabilities for offline usage
* **Accessibility**: WCAG 2.1 AA compliant
* **Performance**: Code splitting and lazy loading

## 🛠️ Technology Stack

* **Framework**: React 18 with TypeScript
* **Styling**: Tailwind CSS with custom design system
* **State Management**: Zustand with persistence
* **API Client**: Axios with React Query for caching
* **Routing**: React Router v6
* **Maps**: MapBox GL JS
* **Charts**: Recharts for data visualization
* **Forms**: React Hook Form with validation
* **Animations**: Framer Motion
* **Icons**: Heroicons and Lucide React
* **Build Tool**: Vite for fast development
* **Testing**: Vitest with React Testing Library

## 🚀 Quick Start

### Prerequisites

* Node.js 18.0.0 or higher
* npm 9.0.0 or higher
* Django ELD Trip Planner backend running

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd eld-trip-planner-frontend
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Environment setup**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:

   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   VITE_MAPBOX_TOKEN=your_mapbox_token_here
   ```
4. **Start development server**

   ```bash
   npm run dev
   ```
5. **Open your browser** Navigate to [http://localhost:3000](http://localhost:3000)

### Backend Setup

Make sure your Django backend is running:

```bash
# In your Django project directory
python manage.py runserver
```

## 📁 Project Structure

```
src/
├── api/                    # API client and services
│   ├── client.ts          # Axios configuration
│   └── services.ts        # API service functions
├── components/            # React components
│   ├── layout/           # Layout components
│   │   ├── MainLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MobileMenu.tsx
│   └── ui/               # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── LoadingSpinner.tsx
│       └── ...
├── pages/                 # Page components
│   ├── Dashboard.tsx
│   ├── TripPlanner.tsx
│   ├── ELDLogs.tsx
│   ├── ComplianceReports.tsx
│   └── Settings.tsx
├── store/                 # State management
│   └── useAppStore.ts     # Zustand store
├── types/                 # TypeScript definitions
│   └── index.ts
├── styles/                # Global styles
│   └── index.css         # Tailwind + custom CSS
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
└── App.tsx               # Main app component
```

## 🎨 Design System

The application uses a comprehensive design system built on Tailwind CSS:

### Colors

* **Primary**: Blue theme for actions and navigation
* **Semantic**: Success (green), warning (yellow), danger (red)
* **Duty Status**: Custom colors for ELD compliance
  * Off Duty: Gray (`#64748b`)
  * Sleeper Berth: Purple (`#7c3aed`)
  * Driving: Red (`#dc2626`)
  * On Duty: Amber (`#f59e0b`)

### Components

* Consistent button styles and variants
* Form components with validation states
* Card layouts for content sections
* Loading states and skeletons
* Responsive navigation

## 📱 Features Overview

### Dashboard

* Fleet overview with real-time statistics
* Driver status breakdown
* HOS compliance monitoring
* Quick action shortcuts
* System status indicators

### Trip Planner

* Multi-step trip creation wizard
* Real-time HOS compliance checking
* Driver and vehicle assignment
* Route visualization with MapBox
* Automatic ELD log generation

### ELD Logs

* Digital log sheet display
* FMCSA-compliant formatting
* Printable log generation
* Duty status tracking
* Violation alerts

### Compliance Reports

* HOS compliance analytics
* Violation tracking
* Fleet performance metrics
* Exportable reports
* Trend analysis

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1

# MapBox Configuration
VITE_MAPBOX_TOKEN=pk.your_mapbox_token_here

# App Configuration
VITE_APP_NAME=ELD Trip Planner
VITE_APP_VERSION=1.0.0
```

### MapBox Setup

1. Create a free account at [mapbox.com](https://mapbox.com)
2. Get your access token from the dashboar
