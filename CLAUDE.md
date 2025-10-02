# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application built with modern web technologies, originally created using Lovable. The project implements a Threads interface displaying filtered threads from Meta via their Threads API with text and image content.

## Technology Stack

- **Vite** - Build tool and dev server
- **React 18** with TypeScript
- **shadcn/ui** - UI component library based on Radix UI
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and state management
- **React Hook Form** with Zod - Form handling and validation

## Development Commands

```bash
# Start development server (runs on http://localhost:8080)
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components (auto-generated)
│   ├── Header.tsx    # Main header component
│   ├── FilterButtons.tsx  # Thread filtering UI
│   └── ThreadCard.tsx     # Thread display component
├── pages/
│   ├── Index.tsx     # Home page with threads feed
│   └── NotFound.tsx  # 404 page
├── services/
│   └── threadsApi.ts # Threads API service functions
├── types/
│   └── threads.ts    # TypeScript interfaces for Threads API
├── hooks/
│   ├── use-toast.ts  # Toast notification hook
│   └── useThreads.ts # Custom hooks for Threads API calls
├── lib/
│   └── utils.ts      # Utility functions (cn helper)
├── App.tsx           # Root component with providers
└── main.tsx          # Application entry point
```

## Architecture Notes

### Component Organization
- UI components from shadcn/ui are located in `src/components/ui/`
- Custom components are in `src/components/`
- Page components are in `src/pages/`

### Routing
- Uses React Router with BrowserRouter
- Main route: `/` renders the Index page
- Catch-all route renders NotFound page
- Add custom routes above the catch-all "*" route in App.tsx

### State Management
- TanStack Query is configured for server state
- Local state uses React hooks
- Toast notifications via Sonner

### Styling
- Uses Tailwind CSS with CSS variables for theming
- shadcn/ui components support dark/light themes via next-themes
- Path alias `@/` points to `src/` directory

### Data Structure
The app currently uses mock data with this Thread interface:
```typescript
interface Tweet {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  retweets: number;
  type: "text" | "image";
}
```

### Meta Threads API Integration
- **API Documentation**: https://developers.facebook.com/docs/threads/
- **GitHub Examples**: https://github.com/fbsamples/threads_api
- **Live Integration**: Application now uses real Threads API calls
- **Environment Setup**: Requires `VITE_THREADS_ACCESS_TOKEN` in `.env` file
- **Focused Content**: Filters for Design/UI related posts from official Meta accounts (@meta, @threads, @instagram, @facebook)
- **API Service**: Located in `src/services/threadsApi.ts`
- **Data Types**: Threads API response types in `src/types/threads.ts`
- **React Hooks**: Custom hooks for API calls in `src/hooks/useThreads.ts`

## Development Notes

- The project uses the Lovable component tagger in development mode
- Path aliases are configured: `@/` maps to `./src`
- ESLint is configured for React and TypeScript
- Server runs on port 8080 by default
- Uses SWC for fast TypeScript compilation

## Component Generation

When adding new shadcn/ui components, use:
```bash
npx shadcn@latest add [component-name]
```

Components are automatically configured to use the project's alias structure and Tailwind setup.