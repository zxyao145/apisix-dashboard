# APISIX Dashboard v3 - i18n Implementation Summary

## Overview

A comprehensive internationalization (i18n) system has been implemented for APISIX Dashboard v3 using `next-intl`. The system supports three locales with full type safety and a well-organized translation structure.

## Supported Locales

| Locale Code | Language | Display Name | Status |
|-------------|----------|--------------|--------|
| **en-US** | English (United States) | English | ✓ Default |
| **zh-CN** | Simplified Chinese | 简体中文 | ✓ Complete |
| **tr-TR** | Turkish | Türkçe | ✓ Complete |

## File Structure

```
webv3/
├── i18n/
│   ├── request.ts              # next-intl configuration
│   ├── utils.ts                # Helper utilities (locale validation, formatting)
│   └── messages.d.ts           # TypeScript type definitions
│
├── messages/
│   ├── en-US.json             # English translations (9KB)
│   ├── zh-CN.json             # Chinese translations (8.6KB)
│   ├── tr-TR.json             # Turkish translations (9.8KB)
│   └── README.md              # Translation file documentation
│
├── middleware.ts               # Locale detection and routing
│
├── app/
│   └── [locale]/              # Locale-based routing
│       ├── layout.tsx         # Root layout with i18n provider
│       └── page.tsx           # Localized home page
│
├── components/
│   └── LocaleSwitcher.tsx     # Reusable locale switcher component
│
└── docs/
    ├── i18n.md                # Comprehensive i18n documentation
    └── i18n-quick-reference.md # Quick reference guide
```

## Key Features

### 1. Automatic Locale Detection
- URL-based locale detection via middleware
- Browser language preference detection
- Fallback to default locale (en-US)

### 2. Type-Safe Translations
- Full TypeScript support with autocomplete
- Compile-time validation of translation keys
- IntelliSense support in IDE

### 3. Hierarchical Translation Structure
- Organized by functional areas (menu, component, page)
- Nested structure for related translations
- Consistent naming conventions

### 4. URL-Based Routing
All routes include locale prefix:
```
/en-US/routes
/zh-CN/services
/tr-TR/upstreams
```

### 5. Utilities and Helpers
- Locale validation functions
- Date/number formatting per locale
- Pathname locale switching
- Browser locale detection

## Translation Coverage

### Core Components
- **Navigation & Menus**: All menu items and navigation elements
- **Common Actions**: Create, edit, delete, save, cancel, etc.
- **Form Elements**: Labels, placeholders, validation messages
- **Status Messages**: Success, failure, loading states
- **Notifications**: Delete confirmations, success messages

### Pages
- **Routes**: Full translation coverage
- **SSL**: Certificate management
- **Upstream**: Load balancer configuration
- **Services**: Service configuration
- **Consumers**: Consumer management
- **Plugins**: Plugin configuration
- **Proto**: Protocol buffers
- **Server Info**: System information
- **Settings**: Dashboard settings

### Plugins & Features
- Plugin categories (Authentication, Security, Traffic Control, etc.)
- Upstream types and discovery methods
- Health check configurations
- Form validation messages

## Configuration Details

### next.config.ts
```typescript
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
```

### middleware.ts
```typescript
export default createMiddleware({
  locales: ['en-US', 'zh-CN', 'tr-TR'],
  defaultLocale: 'en-US',
  localePrefix: 'always',
  localeDetection: true,
});
```

### i18n/request.ts
```typescript
export const locales = ['en-US', 'zh-CN', 'tr-TR'] as const;
export const defaultLocale: Locale = 'en-US';

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

## Usage Examples

### Basic Translation
```typescript
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations();
  return <h1>{t('menu.routes')}</h1>;
}
```

### Scoped Translation
```typescript
const t = useTranslations('page.route');
return <button>{t('create')}</button>; // page.route.create
```

### Locale Switching
```typescript
import LocaleSwitcher from '@/components/LocaleSwitcher';

function Header() {
  return <LocaleSwitcher />;
}
```

### Get Current Locale
```typescript
import { useLocale } from 'next-intl';

const locale = useLocale(); // 'en-US' | 'zh-CN' | 'tr-TR'
```

## Translation Statistics

| File | Size | Keys | Lines |
|------|------|------|-------|
| en-US.json | 9.2 KB | ~200 | ~230 |
| zh-CN.json | 8.6 KB | ~200 | ~230 |
| tr-TR.json | 9.8 KB | ~200 | ~230 |

All locale files maintain identical structure with complete coverage.

## Migration from v2

Translations were migrated from the existing web (v2) implementation:

**Source**: `/web/src/locales/{locale}/`
- Multiple TypeScript files per locale
- Flat key-value structure
- Spread across component directories

**Target**: `/webv3/messages/{locale}.json`
- Single JSON file per locale
- Hierarchical structure
- Centralized management

**Changes**:
1. Converted TypeScript to JSON
2. Reorganized into logical sections
3. Standardized key naming
4. Added type safety

## Validation

All translation files have been validated:
- ✓ Valid JSON syntax
- ✓ Consistent key structure across locales
- ✓ Complete translation coverage
- ✓ Type definitions generated

## Documentation

### Comprehensive Guides
1. **i18n.md** - Complete implementation guide
   - Configuration details
   - Usage patterns
   - Best practices
   - Troubleshooting

2. **i18n-quick-reference.md** - Quick reference
   - Common patterns
   - Translation keys
   - Code examples
   - Utility functions

3. **messages/README.md** - Translation file guide
   - File structure
   - Naming conventions
   - Adding translations
   - Validation

## Type Safety

TypeScript integration provides:
- Autocomplete for translation keys
- Compile-time validation
- IDE IntelliSense support
- Type-safe locale handling

Example:
```typescript
// ✓ Valid - TypeScript autocomplete works
t('component.global.create')

// ✗ Invalid - TypeScript shows error
t('component.global.invalid')
```

## Utilities Provided

### Locale Validation
```typescript
import { isValidLocale, getValidLocale } from '@/i18n/utils';
```

### Path Manipulation
```typescript
import { getLocaleFromPathname, switchLocaleInPathname } from '@/i18n/utils';
```

### Formatting
```typescript
import { formatDate, formatNumber, formatRelativeTime } from '@/i18n/utils';
```

## Components

### LocaleSwitcher
A ready-to-use component for locale switching:
```typescript
import LocaleSwitcher from '@/components/LocaleSwitcher';
<LocaleSwitcher />
```

Features:
- Dropdown select with locale labels
- Automatic path updating
- Preserves current route

## Best Practices

1. **Always use translation keys** - Never hardcode strings
2. **Use scoped translations** - `useTranslations('namespace')`
3. **Keep keys consistent** - Same structure across all locales
4. **Test with all locales** - Verify UI with different text lengths
5. **Follow naming conventions** - camelCase, descriptive names

## Dependencies

```json
{
  "next-intl": "^3.28.2"
}
```

Already included in package.json - no additional installation needed.

## Next Steps

### For Development
1. Import and use translations in components
2. Add new translation keys as needed
3. Test with different locales
4. Add more languages if required

### For Maintenance
1. Keep all locale files in sync
2. Validate JSON on changes
3. Update documentation as needed
4. Monitor for missing translations

## Testing Checklist

- [x] JSON syntax validation
- [x] Type definitions generated
- [x] Middleware configured
- [x] Locale switching functional
- [x] Translation coverage complete
- [x] Documentation comprehensive
- [x] Examples provided
- [ ] Integration testing (to be done during development)
- [ ] UI testing with all locales (to be done during development)

## Resources

### Internal Documentation
- `/webv3/docs/i18n.md` - Full documentation
- `/webv3/docs/i18n-quick-reference.md` - Quick reference
- `/webv3/messages/README.md` - Translation guide

### External Resources
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Original APISIX Dashboard](https://github.com/apache/apisix-dashboard)

## License

Licensed under the Apache License 2.0. All files include proper license headers.

---

**Implementation Status**: ✓ Complete and Ready for Integration

**Created**: December 8, 2025
**Version**: 1.0.0
**Framework**: Next.js 15 + next-intl 3.28.2
