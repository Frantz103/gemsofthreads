
# Gems of Threads

A modern React application for displaying and filtering threads from Meta's Threads platform. This app provides a clean, responsive interface to browse threads with text and image content.

## Features

- **Thread Filtering**: Filter threads by type (all, text, images)
- **Responsive Design**: Optimized for desktop and mobile viewing
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Meta Threads Integration**: Designed to work with Meta's Threads API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd gemsofthreads
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Tech Stack

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library with modern hooks
- **shadcn/ui** - Modern UI components built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Data fetching and state management
- **React Router** - Client-side routing
- **React Hook Form + Zod** - Form handling and validation

## API Integration

This project is designed to integrate with Meta's Threads API:
- **Documentation**: [Meta Threads API](https://developers.facebook.com/docs/threads/)
- Currently uses mock data for development
- TanStack Query is configured for future API integration

## Development

The project was originally created using [Lovable](https://lovable.dev/projects/b35142a5-d915-4fad-a1f5-c0f947fd9380) and can be further developed there.

## Project Structure

```
src/
├── components/     # React components
├── pages/         # Route components
├── data/          # Mock data and types
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
└── styles/        # Global styles
```