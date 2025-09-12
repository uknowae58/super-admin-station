# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Server
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Package Management
- `npm install` - Install all dependencies

## Project Architecture

### Core Framework
- **Next.js 15.5.0** with App Router (app directory structure)
- **TypeScript** with strict mode enabled
- **Tailwind CSS** for styling with CSS variables
- **Turbopack** for fast development builds

### UI Framework
- **Radix UI** primitives for accessibility-compliant components
- **shadcn/ui** component system (New York style variant)
- **Lucide React** for icons
- **next-themes** for dark/light mode support

### File Structure
- `app/` - Next.js App Router pages and layouts
  - `companies/` - Company management pages
  - `dashboard/` - Dashboard interface
  - `stations/` - Station management pages
- `components/` - Reusable UI components
  - `ui/` - shadcn/ui component library
  - `app-sidebar.tsx` - Main navigation sidebar
- `lib/` - Utility functions and API layer
- `hooks/` - Custom React hooks

### State Management & Data
- `lib/api.ts` - API interface layer
- Local state management with React hooks
- No global state management library currently configured

### Key Dependencies
- **@tanstack/react-table** for data table functionality
- **date-fns** for date manipulation
- **class-variance-authority** for component variant management
- **sonner** for toast notifications

### Import Aliases
- `@/*` - Root directory alias
- All components, utils, and hooks use absolute imports via aliases

### Styling
- Tailwind CSS with custom configuration
- CSS variables for theme support
- Component variants using class-variance-authority
- Responsive design patterns throughout

### ESLint Configuration
- Next.js recommended rules with TypeScript support
- Extends `next/core-web-vitals` and `next/typescript`
- Ignores build directories and generated files

### Coding Standards
- **Code Language**: All code (variables, functions, classes, etc.) should be written in English
- **UI Language**: All user-facing text, labels, and content should be in French