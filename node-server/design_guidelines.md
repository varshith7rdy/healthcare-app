# Healthcare Application Design Guidelines

## Design Approach

**Design System Foundation**: Material Design with healthcare-specific adaptations
- Inspiration: Apple Health, Epic MyChart, Teladoc
- Principle: Professional, trustworthy, accessible, data-clarity focused
- Key differentiator: Clean information hierarchy with subtle, calming aesthetics

## Typography System

**Font Family**: Inter (primary), Roboto (fallback) via Google Fonts CDN

**Hierarchy**:
- Page Titles: text-3xl font-bold (Dashboard, Appointments, etc.)
- Section Headers: text-xl font-semibold
- Card Titles: text-lg font-medium
- Body Text: text-base font-normal
- Metadata/Labels: text-sm text-gray-600
- Metrics/Numbers: text-2xl to text-4xl font-bold (health data emphasis)

## Spacing System

**Tailwind Units**: Standardize on 4, 6, 8, 12, 16, 24
- Component padding: p-6 or p-8
- Section spacing: space-y-6 or space-y-8
- Card gaps: gap-6 in grids
- Page container: px-6 lg:px-8, py-8

## Layout Architecture

**Navigation**: Persistent sidebar (hidden on mobile, drawer-style)
- Logo + app name at top
- Icon + text navigation items
- Active state indicator (border-l-4 or bg treatment)
- User profile/settings at bottom

**Main Content Area**:
- Max-width container: max-w-7xl mx-auto
- Dashboard: 2-3 column grid for stat cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Full-width charts/tables below cards

**Page Header Pattern** (consistent across all pages):
- Page title + description/breadcrumb
- Primary action button (right-aligned)
- Filters/tabs when applicable

## Core Components

**Health Metric Cards**:
- White background with subtle shadow (shadow-sm)
- Icon in colored circle (top-left or center)
- Large metric number (text-3xl font-bold)
- Label below (text-sm text-gray-600)
- Trend indicator with arrow icon and percentage
- Rounded corners: rounded-lg

**Data Visualization**:
- Chart.js or Recharts for line/bar charts
- Soft gradients in chart fills
- Grid lines: subtle gray (stroke-gray-200)
- Tooltips: rounded shadow-lg with white background

**Chat Interface (Virtual Assistant)**:
- Two-column messages (user right, assistant left)
- User messages: rounded-2xl rounded-tr-sm with solid background
- Assistant messages: rounded-2xl rounded-tl-sm with border
- Avatar circles for assistant, initials for user
- Input area: fixed bottom with rounded-full input field
- Send button: circular icon button

**Appointment Cards**:
- Horizontal layout: time + doctor info + status badge
- Status badges: rounded-full px-3 py-1 text-xs (Confirmed: green, Pending: yellow)
- Doctor avatar + name + specialty in flex row
- Action buttons (Join, Reschedule, Cancel) aligned right

**Video Call Interface (Telemedicine)**:
- Large video container: aspect-video rounded-lg overflow-hidden
- Controls bar: absolute bottom with blur backdrop (backdrop-blur-md bg-black/30)
- Circular control buttons with white icons
- Self-view: absolute top-right, smaller aspect-video rounded-lg

**Wearables Display**:
- Device cards with device icon + name + last sync time
- Live metric tiles: grid layout with icon, current value, and sparkline chart
- Sync status indicator (green dot for connected)

**Analytics Dashboard**:
- Tab navigation for time periods (Day, Week, Month, Year)
- Large primary chart (full-width)
- Secondary metrics in grid below
- Export/share buttons in header

**Profile Page**:
- Two-column layout: left sidebar (avatar, name, edit button), right content (form fields)
- Form inputs: rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500
- Section dividers with subtle borders
- Save button: sticky bottom or top-right

## Interaction Patterns

**Buttons**:
- Primary: rounded-md px-6 py-2.5 text-sm font-medium with solid color
- Secondary: same sizing with border and transparent background
- Icon buttons: rounded-full p-2 for compact actions

**Loading States**:
- Skeleton screens for cards: animate-pulse with bg-gray-200 rounded shapes
- Spinner for async actions: border-t-transparent animate-spin

**Hover States**:
- Cards: subtle shadow increase (shadow-md to shadow-lg transition)
- Buttons: slight opacity change (hover:opacity-90)
- Navigation items: background color shift

**Icons**: Heroicons (outline for default, solid for active states)

## Accessibility Standards

- WCAG AA minimum contrast ratios
- Focus states: ring-2 ring-offset-2 on all interactive elements
- aria-labels on icon-only buttons
- Keyboard navigation support
- Screen reader announcements for dynamic content updates

## Images

**Dashboard Hero**: Optional health-themed illustration (abstract wellness imagery) at top of dashboard - if used, subtle and non-distracting, max height 200px

**Profile Page**: User avatar upload with placeholder icon

**Telemedicine**: Doctor profile photos in appointment cards and video interface

**No large hero images** - this is a utility-focused application prioritizing functionality over marketing aesthetics

## Special Healthcare Considerations

- Privacy indicators (lock icons) for sensitive data sections
- Emergency contact button: prominent red styling, always accessible
- Medication/allergy warnings: alert-style components with yellow/red backgrounds
- Data export options: HIPAA-compliant language in UI
- Timestamp displays for all health records (text-xs text-gray-500)