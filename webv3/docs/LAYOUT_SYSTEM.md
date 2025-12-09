# Layout and Navigation System

This document describes the layout and navigation system for APISIX Dashboard v3.

## Architecture Overview

The layout system consists of several key components:

### 1. Authentication Context (`contexts/auth-context.tsx`)

Provides authentication state management across the application:
- User information storage
- Token management (localStorage)
- Login/logout functionality
- Authentication status checking

**Usage:**
```tsx
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, token, login, logout, isAuthenticated } = useAuth();
  // ...
}
```

### 2. Main Layout (`components/layout/MainLayout.tsx`)

The primary layout structure that contains:
- Sidebar navigation
- Header with user menu
- Main content area

This layout is automatically applied to all routes under `app/[locale]/(dashboard)/`.

### 3. Sidebar (`components/layout/Sidebar.tsx`)

Navigation sidebar featuring:
- Collapsible design
- Menu items from `MENU_DATA` constant
- Active route highlighting
- Internationalization support

**Features:**
- Responsive collapse/expand
- Icon + label display
- Smooth transitions
- Active state management

### 4. Header (`components/layout/Header.tsx`)

Top header bar containing:
- Language selector (English, 简体中文, Türkçe)
- User menu with avatar
- Logout functionality

### 5. PageHeader (`components/layout/PageHeader.tsx`)

Reusable component for page titles and breadcrumbs:
- Auto-generated breadcrumbs from pathname
- Custom breadcrumb support
- Optional page description
- Extra actions slot

**Usage:**
```tsx
<PageHeader
  title="Routes"
  description="Manage your API routes"
  extra={<Button>Create Route</Button>}
/>
```

## Menu Configuration

Menu items are defined in `/lib/constants.ts`:

```typescript
export const MENU_DATA: MenuItem[] = [
  { name: 'dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'routes', path: '/routes/list', icon: Route },
  { name: 'upstream', path: '/upstream/list', icon: Network },
  // ...
];
```

### Adding a New Menu Item

1. Add the menu item to `MENU_DATA` in `/lib/constants.ts`
2. Add translation key to all locale files in `/messages/`
3. Create the corresponding route page

## Route Structure

```
app/[locale]/
├── (dashboard)/           # Protected routes with layout
│   ├── layout.tsx        # Applies MainLayout
│   ├── page.tsx          # Redirects to /dashboard
│   ├── dashboard/
│   │   └── page.tsx      # Dashboard home
│   ├── routes/
│   │   └── list/
│   │       └── page.tsx  # Routes list
│   └── ...
└── user/                 # Public routes (no layout)
    └── login/
        └── page.tsx      # Login page
```

## Styling

The layout uses Tailwind CSS with shadcn/ui components:

- **Sidebar Width:**
  - Expanded: 256px (`w-64`)
  - Collapsed: 64px (`w-16`)

- **Header Height:** 64px (`h-16`)

- **Color Scheme:**
  - Uses CSS variables for theming
  - Supports light/dark mode (via shadcn/ui)

## Internationalization

All text content is internationalized using `next-intl`:

```tsx
const t = useTranslations('menu');
const menuLabel = t(item.name); // e.g., t('dashboard')
```

**Locale Files Location:** `/messages/{locale}.json`

Supported locales:
- `en-US` - English
- `zh-CN` - Simplified Chinese
- `tr-TR` - Turkish

## Components

### ActionBar (`components/ActionBar.tsx`)

Bottom action bar for multi-step forms:
- Previous/Next navigation
- Submit button
- Cancel button
- Loading states

**Usage:**
```tsx
<ActionBar
  step={currentStep}
  lastStep={3}
  onChange={(step) => setCurrentStep(step)}
  onSubmit={handleSubmit}
  onCancel={() => router.back()}
  loading={isSubmitting}
/>
```

### PageLoading (`components/PageLoading.tsx`)

Full-screen loading spinner for page transitions.

### IconFont (`components/icons/IconFont.tsx`)

Custom icon component for iconfont.cn SVG sprites:

```tsx
<IconFont name="icon-name" className="h-5 w-5" />
```

## State Management

### React Query (TanStack Query)

Global query client configuration in `components/providers/query-provider.tsx`:

- **Stale Time:** 1 minute
- **Cache Time:** 5 minutes
- **Retry:** 1 attempt
- **Refetch on Window Focus:** Disabled

### Authentication State

Managed via React Context (`contexts/auth-context.tsx`):
- Persisted to localStorage
- Auto-loaded on app mount
- Cleared on logout

## Best Practices

1. **Use PageHeader for consistency:**
   ```tsx
   <PageHeader title={t('page.route.list')} />
   ```

2. **Wrap protected routes in (dashboard) group:**
   All authenticated pages should be under `app/[locale]/(dashboard)/`

3. **Use the useAuth hook:**
   Always use `useAuth()` instead of accessing context directly

4. **Add translations:**
   When adding new pages, add all translation keys to all locale files

5. **Follow the menu structure:**
   Keep menu items organized by feature (routes, upstream, service, etc.)

## Migration Notes

This layout system is based on the web v2 architecture but uses:
- Next.js 15 App Router instead of UmiJS
- Shadcn/ui instead of Ant Design
- React Query instead of Dva
- next-intl instead of umi-plugin-locale

## Future Enhancements

Planned features:
- [ ] Breadcrumb customization per page
- [ ] Dark mode toggle
- [ ] User preferences (sidebar collapsed state persistence)
- [ ] Mobile responsive drawer sidebar
- [ ] Search functionality in header
- [ ] Notification center
- [ ] User profile page
