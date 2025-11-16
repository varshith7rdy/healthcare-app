# HealthCare Pro - Personal Health Companion

## Overview

HealthCare Pro is a comprehensive healthcare management platform that enables patients to manage their health through virtual consultations, appointment scheduling, wearables tracking, and health analytics. The application provides a modern, accessible interface for users to interact with healthcare providers, monitor their health metrics, and maintain their medical records.

The system is built as a full-stack web application with a React-based frontend and Express backend, utilizing PostgreSQL for data persistence. The application follows Material Design principles with healthcare-specific adaptations, emphasizing professional aesthetics, trustworthy design, and clear data visualization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing (instead of React Router)
- Single-page application (SPA) architecture with code splitting support

**UI Component System**
- shadcn/ui component library with Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom design tokens
- Custom theme system supporting light/dark modes via CSS variables
- Component configuration via `components.json` with "new-york" style variant

**State Management**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- Local React state for UI-specific interactions
- No global state management library (Redux/Zustand) - relies on React Query's cache

**Design System**
- Typography: Inter (primary) and Roboto (fallback) loaded via Google Fonts CDN
- Spacing: Standardized Tailwind units (4, 6, 8, 12, 16, 24)
- Color scheme: Neutral base with HSL color variables for theme customization
- Layout: Persistent sidebar navigation (collapsible on mobile), max-width content containers
- Design inspiration: Apple Health, Epic MyChart, Teladoc

**Key Application Pages**
- Dashboard: Overview with health metrics, upcoming appointments, and activity charts
- Virtual Assistant: Chat interface for health-related queries
- Appointments: Appointment management with create/edit/delete functionality
- Telemedicine: Video consultation interface
- Wearables: Device management and health metric visualization
- Analytics: Comprehensive health data analytics with charts
- Profile: User profile management and medical information

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- TypeScript throughout with ES modules
- Node.js runtime with development/production environment separation

**API Design**
- RESTful API endpoints under `/api` namespace
- JSON request/response format
- Request logging middleware for API calls with duration tracking
- Error handling with appropriate HTTP status codes
- No authentication middleware currently implemented (uses hardcoded DEFAULT_USER_ID)

**Data Access Layer**
- Abstraction pattern via `IStorage` interface for database operations
- In-memory implementation (`MemStorage`) for development/testing
- Designed to support future database implementation swap
- CRUD operations for: users, appointments, chat messages, wearable data, health metrics

**Validation**
- Zod schemas for runtime type validation of incoming requests
- Schema definitions in shared directory for frontend/backend reuse
- Drizzle-zod integration for generating Zod schemas from database schema

**Development Features**
- Vite middleware integration in development mode for SSR-like experience
- Hot module replacement support
- Source map support via @jridgewell/trace-mapping
- Replit-specific plugins for development (cartographer, dev-banner, runtime error overlay)

### Data Storage Solutions

**Database Technology**
- PostgreSQL as the primary relational database
- Connection via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries and schema management

**Schema Design**
The database schema (defined in `shared/schema.ts`) includes:

- **users**: User profiles with authentication credentials, personal information (name, email, phone), and medical data (blood type, allergies, date of birth)
- **appointments**: Appointment records with doctor information, scheduling details, status tracking, and appointment types (virtual/in-person)
- **chat_messages**: Virtual assistant conversation history with timestamps and sender identification
- **wearable_data**: Health metrics from connected devices including heart rate, steps, sleep hours, calories, and device metadata
- **health_metrics**: General health measurements with metric types, values, units, and optional reference ranges

All tables use UUID primary keys generated via PostgreSQL's `gen_random_uuid()` function.

**Migration Strategy**
- Drizzle Kit for database migrations
- Migration files stored in `/migrations` directory
- Push-based deployment via `npm run db:push` command

**Current Implementation**
- In-memory storage implementation for development (MemStorage class)
- Designed for easy swap to database-backed storage
- Connection string via DATABASE_URL environment variable

### Authentication & Authorization

**Current State**
- No authentication system implemented
- Hardcoded user ID ("user-1") used throughout the application
- Password field exists in user schema but not actively used

**Design Considerations**
- User schema includes username and password fields for future implementation
- Session management prepared via connect-pg-simple for PostgreSQL session store
- Frontend uses credential-based fetch requests ("credentials: include")

**Future Implementation Path**
- Session-based authentication ready to be implemented
- PostgreSQL session store configuration available
- User login/logout endpoints to be added

### External Dependencies

**Database Services**
- Neon (PostgreSQL serverless hosting)
- Connection pooling via @neondatabase/serverless driver

**Frontend Libraries**
- Radix UI: Comprehensive set of accessible component primitives (accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, popover, select, slider, tabs, toast, tooltip, etc.)
- TanStack Query: Server state management and caching
- Recharts: Data visualization library for charts and graphs
- Lucide React: Icon library
- React Hook Form: Form state management
- date-fns: Date manipulation and formatting
- cmdk: Command palette component
- Embla Carousel: Carousel component
- Vaul: Drawer component
- class-variance-authority: Variant-based styling utility
- clsx & tailwind-merge: Class name utilities

**Development Tools**
- Drizzle Kit: Database schema management and migrations
- TypeScript: Type checking and compilation
- ESBuild: Production build bundling for backend
- TSX: TypeScript execution for development server
- Vite: Frontend build tool and dev server
- Tailwind CSS: Utility-first CSS framework
- PostCSS & Autoprefixer: CSS processing

**Replit Integration**
- @replit/vite-plugin-cartographer: Development navigation
- @replit/vite-plugin-dev-banner: Development mode indicator
- @replit/vite-plugin-runtime-error-modal: Enhanced error display

**Build & Deployment**
- Development: tsx server with Vite middleware
- Production: Compiled Express server with pre-built static assets
- Static assets served from `dist/public` directory
- API and static serving from single Express server instance