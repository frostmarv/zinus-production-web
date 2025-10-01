# Overview

Zinus Production Web is a modern React-based production management system built with Vite. The application provides a comprehensive dashboard for managing manufacturing operations including cutting processes, master data management, stock operations, and production workflow tracking. The system features a clean, responsive interface with multiple specialized modules for different aspects of production management.

# Recent Changes

## October 1, 2025 - Master Data Foam/Spring Refactoring
- **Renamed MasterPlanning → MasterFoam**: Component renamed to better reflect its purpose
  - File: `src/pages/MasterData/Planning/MasterFoam.jsx`
  - Route updated: `/master/planning` → `/master/foam`
  - UI labels: "Master Data Planning" → "Master Data Foam"
- **API Refactoring for Foam/Spring Support**: masterPlanning.js now supports type-based endpoints
  - Added `type` parameter to all API functions (foam/spring)
  - Endpoints structure:
    - `GET /api/production-planning/{type}` (getAll)
    - `POST /api/production-planning/{type}` (create)
    - `PUT /api/production-planning/{type}/{id}` (update)
    - `DELETE /api/production-planning/{type}/{id}` (delete)
  - MasterFoam.jsx integrated with type 'foam' for all CRUD operations
  - Ready for Spring component implementation (same API, type 'spring')

## October 1, 2025 - InputCutting Bug Fixes
- **HTTP 400 Error Resolution**: Fixed critical bug where `remainQuantity` field was being sent to backend, causing DTO validation errors
  - Solution: Excluded `remainQuantity` from submission payload (UI-only field, computed server-side)
  - Architecture alignment: RemainQuantity fetched from `/api/master-data/remain-quantity` API, not stored in database
- **Enhanced Error Handling**: Improved error extraction from backend responses to display detailed validation messages
  - Extracts errorData.message, errorData.error, or errorData.errors from backend
  - Better debugging with console logging of backend error details
- **Controlled Input Fix**: Added `machine` and `operator` fields to form reset state to prevent controlled/uncontrolled input warnings

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18.2.0 with JavaScript/TypeScript support
- **Build Tool**: Vite 5.0.0 for fast development and optimized builds
- **Routing**: React Router DOM 7.8.2 for client-side navigation
- **UI Components**: Lucide React for iconography
- **Styling**: Modular CSS approach with component-specific stylesheets

## Component Structure
The application follows a modular component architecture organized by feature:
- **Cutting Module**: Handles wood/material cutting operations with input forms, editing capabilities, and history tracking
  - InputCutting.jsx: Production input with Machine and Operator fields (9 machine options: Multi Cutting 1-2, Rountable 1-4, Vertikal 1-3)
  - CuttingHistorySummary.jsx: Production history with modal popup for view/edit/delete operations
- **Master Data Module**: Manages customer information, PO numbers, SKUs, and quantity planning
- **History Module**: Provides tracking and audit trails for various operations
  - CuttingHistorySummary: Features filter (date, shift, group, machine, operator), pagination, and modal popup with edit/delete capabilities
- **Workable Module**: Manages production workflow and department operations
- **Stock Opname Module**: Handles inventory management and location-based tracking

## State Management
- Uses React's built-in state management (useState, useEffect)
- API client abstraction for centralized HTTP request handling
- Modular API services for different business domains (cutting, masterData, etc.)
- **Modal State Management**: CuttingHistorySummary uses functional setState for concurrent operation handling (edit/delete) with proper loading states and error handling

## Key Features
- **Cutting Production Summary Modal**:
  - View detailed production information with all entries (including Week from entries)
  - Edit mode: Modify shift, group, time, machine, operator, and entry quantities
  - Delete function with confirmation dialog
  - Quantity validation: Ensures qty ≥ 0 and qty ≤ quantityOrder
  - Automatic remainQuantity recalculation
  - Real-time data refresh after edit/delete operations
  - ESC key and overlay click to close with unsaved changes warning
  
- **Real-time Remain Quantity (Backend-Driven)**:
  - Frontend no longer calculates remain manually
  - Calls API `/api/master-data/remain-quantity?customerPo=X&sku=Y&sCode=Z` when S.CODE is selected
  - Backend returns actual remain based on database: `remainQuantity = quantityOrder - SUM(quantityProduksi)` for same layer (CustomerPO + SKU + S.CODE)
  - Ensures accurate remain tracking across multiple production entries

## Styling System
- CSS custom properties (CSS variables) for consistent theming
- Modern design system with primary, secondary, and accent color palettes
- Responsive grid layouts and flexbox for component positioning
- Component-scoped CSS files to prevent style conflicts

## Build Configuration
- Vite configuration with React plugin
- Path aliases for cleaner imports (@assets)
- Development server configured for hot module replacement
- TypeScript support with strict type checking enabled

# External Dependencies

## Core Dependencies
- **React**: Frontend framework for building user interfaces
- **React DOM**: DOM rendering for React components
- **React Router DOM**: Client-side routing and navigation
- **Lucide React**: Icon library for consistent UI elements

## Development Dependencies
- **Vite**: Build tool and development server
- **@vitejs/plugin-react**: Vite plugin for React support
- **TypeScript**: Type checking and enhanced development experience
- **@types/react**: Type definitions for React
- **@types/react-dom**: Type definitions for React DOM

## API Integration
- Custom API client for HTTP requests to backend services
- Environment variable configuration for API base URL
- RESTful API structure for CRUD operations across different modules
- Centralized error handling and request/response logging

## Infrastructure
- Configured for Replit hosting environment
- Static asset handling through Vite
- Development server runs on port 5000 with host binding for external access