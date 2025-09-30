# Overview

Zinus Production Web is a modern React-based production management system built with Vite. The application provides a comprehensive dashboard for managing manufacturing operations including cutting processes, master data management, stock operations, and production workflow tracking. The system features a clean, responsive interface with multiple specialized modules for different aspects of production management.

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
- **Master Data Module**: Manages customer information, PO numbers, SKUs, and quantity planning
- **History Module**: Provides tracking and audit trails for various operations
- **Workable Module**: Manages production workflow and department operations
- **Stock Opname Module**: Handles inventory management and location-based tracking

## State Management
- Uses React's built-in state management (useState, useEffect)
- API client abstraction for centralized HTTP request handling
- Modular API services for different business domains (cutting, masterData, etc.)
- **Persistent Remain Quantity Tracking Per Layer**: InputCutting component implements session-level cumulative remain tracking using baseRemainByKey state that persists across multiple production entries for the same CustomerPO+SKU+S.CODE combination. Each layer (S.CODE) has independent remain tracking.

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