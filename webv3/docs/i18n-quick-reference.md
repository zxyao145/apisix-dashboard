# i18n Quick Reference

Quick reference guide for using internationalization in APISIX Dashboard v3.

## Supported Locales

| Locale | Language | Label |
|--------|----------|-------|
| `en-US` | English (United States) | English ✓ Default |
| `zh-CN` | Simplified Chinese | 简体中文 |
| `tr-TR` | Turkish | Türkçe |

## Basic Usage

### Import and Use Translations

```typescript
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations();
  return <h1>{t('menu.routes')}</h1>;
}
```

### Scoped Translations

```typescript
import { useTranslations } from 'next-intl';

function RouteList() {
  const t = useTranslations('page.route');

  return (
    <div>
      <h1>{t('list')}</h1>           {/* page.route.list */}
      <p>{t('description')}</p>       {/* page.route.description */}
      <button>{t('create')}</button>  {/* page.route.create */}
    </div>
  );
}
```

### Get Current Locale

```typescript
import { useLocale } from 'next-intl';

function MyComponent() {
  const locale = useLocale(); // 'en-US' | 'zh-CN' | 'tr-TR'
  return <div>Current locale: {locale}</div>;
}
```

## Common Translation Keys

### Actions

```typescript
t('component.global.create')   // "Create"
t('component.global.edit')     // "Configure"
t('component.global.delete')   // "Delete"
t('component.global.save')     // "Save"
t('component.global.cancel')   // "Cancel"
t('component.global.confirm')  // "Confirm"
t('component.global.search')   // "Search"
t('component.global.reset')    // "Reset"
```

### Status

```typescript
t('component.status.success')  // "Successfully"
t('component.status.fail')     // "Failed"
```

### Form Placeholders

```typescript
t('component.global.pleaseEnter')   // "Please Enter"
t('component.global.pleaseChoose')  // "Please Choose"
t('component.global.pleaseCheck')   // "Please Check"
```

### Common Fields

```typescript
t('component.global.name')        // "Name"
t('component.global.description') // "Description"
t('component.global.id')          // "ID"
t('component.global.updateTime')  // "Update Time"
t('component.global.operation')   // "Operation"
```

## Page-Specific Keys

### Routes

```typescript
t('page.route.list')          // "Routes"
t('page.route.create')        // "Create Route"
t('page.route.edit')          // "Configure Route"
t('page.route.description')   // Full route description
```

### SSL

```typescript
t('page.ssl.list')            // "SSL List"
t('page.ssl.cert.label')      // "Certificate Content"
t('page.ssl.key.label')       // "Private Key"
```

### Upstream

```typescript
t('page.upstream.list')       // "Upstream List"
t('page.upstream.create')     // "Create Upstream"
t('page.upstream.configure')  // "Configure Upstream"
```

### Service

```typescript
t('page.service.list')        // "Service List"
t('page.service.create')      // "Create Service"
t('page.service.configure')   // "Configure Service"
```

### Consumer

```typescript
t('page.consumer.list')       // "Consumer List"
t('page.consumer.create')     // "Create Consumer"
t('page.consumer.configure')  // "Configure Consumer"
```

## Locale Switching

### Using LocaleSwitcher Component

```typescript
import LocaleSwitcher from '@/components/LocaleSwitcher';

function Header() {
  return (
    <header>
      <LocaleSwitcher />
    </header>
  );
}
```

### Manual Locale Switching

```typescript
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

function MyComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchToEnglish = () => {
    const newPath = pathname.replace(`/${locale}`, '/en-US');
    router.push(newPath);
  };

  return <button onClick={switchToEnglish}>Switch to English</button>;
}
```

### Link to Different Locale

```typescript
import Link from 'next/link';

function LanguageLinks() {
  return (
    <div>
      <Link href="/en-US/routes">English</Link>
      <Link href="/zh-CN/routes">中文</Link>
      <Link href="/tr-TR/routes">Türkçe</Link>
    </div>
  );
}
```

## Utility Functions

### Validate Locale

```typescript
import { isValidLocale } from '@/i18n/utils';

if (isValidLocale('en-US')) {
  // Valid locale
}
```

### Get Locale from Pathname

```typescript
import { getLocaleFromPathname } from '@/i18n/utils';

const locale = getLocaleFromPathname('/en-US/routes'); // 'en-US'
```

### Format Date

```typescript
import { formatDate } from '@/i18n/utils';

const formatted = formatDate(new Date(), 'en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
// "December 8, 2025"
```

### Format Number

```typescript
import { formatNumber } from '@/i18n/utils';

const formatted = formatNumber(1234.56, 'en-US', {
  style: 'currency',
  currency: 'USD'
});
// "$1,234.56"
```

## Translation File Structure

```
messages/
├── en-US.json
├── zh-CN.json
└── tr-TR.json

Structure within each file:
{
  "navBar": { ... },
  "layout": { ... },
  "menu": { ... },
  "component": {
    "global": { ... },
    "status": { ... },
    "notification": { ... },
    "steps": { ... },
    "user": { ... }
  },
  "page": {
    "route": { ... },
    "ssl": { ... },
    "upstream": { ... },
    "service": { ... },
    "consumer": { ... },
    "plugin": { ... },
    "proto": { ... },
    "serverInfo": { ... },
    "setting": { ... }
  },
  "plugin": { ... },
  "upstream": { ... }
}
```

## URL Structure

All routes must include the locale prefix:

```
✓ Good:
/en-US/routes
/zh-CN/services
/tr-TR/upstreams

✗ Bad:
/routes
/services
/upstreams
```

## Type Safety

TypeScript provides autocomplete for translation keys:

```typescript
// ✓ Valid - TypeScript will autocomplete
t('component.global.create')

// ✗ Invalid - TypeScript will show error
t('component.global.invalid')
```

## Best Practices

1. **Always use scoped translations** when possible:
   ```typescript
   const t = useTranslations('page.route');
   ```

2. **Never hardcode strings** - always use translation keys

3. **Keep keys consistent** across all locale files

4. **Use descriptive key names**:
   ```typescript
   // ✓ Good
   t('page.route.name.required')

   // ✗ Bad
   t('page.route.error1')
   ```

5. **Test with all locales** to ensure UI layout works

## Common Patterns

### Form Field with Validation

```typescript
const t = useTranslations('page.route');

<input
  placeholder={t('name.placeholder')}
  aria-label={t('name.label')}
/>
{errors.name && <span>{t('name.required')}</span>}
```

### Confirm Dialog

```typescript
const t = useTranslations('component.global');

const handleDelete = () => {
  if (confirm(t('popconfirmDelete'))) {
    // Delete item
  }
};
```

### Status Display

```typescript
const t = useTranslations('component.status');

<span className={success ? 'text-green' : 'text-red'}>
  {success ? t('success') : t('fail')}
</span>
```

## Resources

- [Full Documentation](../docs/i18n.md)
- [Message Files README](../messages/README.md)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)

## File Locations

```
webv3/
├── i18n/
│   ├── request.ts          # Configuration
│   ├── utils.ts            # Helper functions
│   └── messages.d.ts       # Type definitions
├── messages/
│   ├── en-US.json          # English translations
│   ├── zh-CN.json          # Chinese translations
│   └── tr-TR.json          # Turkish translations
├── middleware.ts           # Locale detection
└── components/
    └── LocaleSwitcher.tsx  # Locale switcher component
```
