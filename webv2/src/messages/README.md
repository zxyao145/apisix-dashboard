# Translation Messages

This directory contains all translation files for the APISIX Dashboard.

## Files

- **en-US.json** - English (United States) translations - Default locale
- **zh-CN.json** - Simplified Chinese translations
- **tr-TR.json** - Turkish translations

## Structure

All translation files follow the same hierarchical structure organized by functional areas:

### Top-Level Sections

```
{
  "navBar": {},           // Navigation bar translations
  "layout": {},           // Layout-specific translations
  "menu": {},             // Menu items
  "component": {},        // Shared component translations
  "page": {},             // Page-specific translations
  "plugin": {},           // Plugin-related translations
  "upstream": {}          // Upstream configuration translations
}
```

### Component Section

The `component` section contains translations for reusable components:

```json
{
  "component": {
    "global": {
      "search": "Search",
      "reset": "Reset",
      "confirm": "Confirm",
      // ... common actions and labels
    },
    "status": {
      "success": "Successfully",
      "fail": "Failed"
    },
    "notification": {
      "deleteSuccess": "Deleted Successfully"
    },
    "steps": {
      "basicInformation": "Basic Information",
      "preview": "Preview",
      "pluginConfig": "Plugin Config"
    },
    "user": {
      "loginByPassword": "Username & Password",
      "login": "Login"
    }
  }
}
```

### Page Section

The `page` section contains translations for specific pages:

```json
{
  "page": {
    "route": {
      "list": "Routes",
      "create": "Create Route",
      "edit": "Configure Route",
      "name": {
        "required": "Please enter the route name",
        "placeholder": "Please enter the route name"
      },
      // ... more route-specific translations
    },
    "ssl": { /* SSL page translations */ },
    "upstream": { /* Upstream page translations */ },
    "service": { /* Service page translations */ },
    "consumer": { /* Consumer page translations */ },
    "plugin": { /* Plugin page translations */ },
    "proto": { /* Proto page translations */ },
    "serverInfo": { /* System info page translations */ },
    "setting": { /* Settings page translations */ }
  }
}
```

## Naming Conventions

### Keys

- Use **camelCase** for all keys: `userName`, `createButton`, `connectionTimeout`
- Use descriptive names: `confirmDelete` instead of `confirm`
- Group related items under common parent keys

### Form Fields

For form fields, use this structure:

```json
{
  "fieldName": {
    "label": "Field Label",
    "placeholder": "Enter value...",
    "required": "This field is required",
    "error": "Invalid value",
    "help": "Helper text"
  }
}
```

Example:

```json
{
  "page": {
    "route": {
      "name": {
        "required": "Please enter the route name",
        "placeholder": "Please enter the route name"
      }
    }
  }
}
```

## Adding New Translations

When adding new translations:

1. **Add to ALL locale files** - Maintain consistency across all languages
2. **Follow the existing structure** - Place translations in the appropriate section
3. **Use the same key structure** - Keep keys identical across all files
4. **Test thoroughly** - Verify translations display correctly in the UI

Example of adding a new feature translation:

### en-US.json
```json
{
  "page": {
    "newFeature": {
      "title": "New Feature",
      "description": "This is a new feature",
      "create": "Create New Item",
      "edit": "Edit Item"
    }
  }
}
```

### zh-CN.json
```json
{
  "page": {
    "newFeature": {
      "title": "新功能",
      "description": "这是一个新功能",
      "create": "创建新项目",
      "edit": "编辑项目"
    }
  }
}
```

### tr-TR.json
```json
{
  "page": {
    "newFeature": {
      "title": "Yeni Özellik",
      "description": "Bu yeni bir özelliktir",
      "create": "Yeni Öğe Oluştur",
      "edit": "Öğeyi Düzenle"
    }
  }
}
```

## Translation Guidelines

### English (en-US)

- Use American English spelling
- Keep messages concise and clear
- Use sentence case for titles
- Use title case for buttons and actions

### Chinese (zh-CN)

- Use Simplified Chinese characters
- Maintain professional and formal tone
- Keep translations concise
- Use appropriate Chinese punctuation

### Turkish (tr-TR)

- Use proper Turkish characters (ç, ğ, ı, ö, ş, ü)
- Follow Turkish grammar rules
- Maintain consistency with existing translations
- Use appropriate formal/informal language

## Common Translation Patterns

### Actions/Buttons

```json
{
  "component": {
    "global": {
      "create": "Create",      // zh-CN: "创建", tr-TR: "Oluştur"
      "edit": "Configure",     // zh-CN: "配置", tr-TR: "Düzenle"
      "delete": "Delete",      // zh-CN: "删除", tr-TR: "Sil"
      "save": "Save",          // zh-CN: "保存", tr-TR: "Kaydet"
      "cancel": "Cancel",      // zh-CN: "取消", tr-TR: "İptal"
      "confirm": "Confirm"     // zh-CN: "确认", tr-TR: "Onayla"
    }
  }
}
```

### Form Validation

```json
{
  "component": {
    "global": {
      "pleaseEnter": "Please Enter",    // zh-CN: "请输入", tr-TR: "Lütfen girin"
      "pleaseChoose": "Please Choose",  // zh-CN: "请选择", tr-TR: "Lütfen seçin"
      "pleaseCheck": "Please Check"     // zh-CN: "请检查", tr-TR: "Lütfen kontrol edin"
    }
  }
}
```

### Status Messages

```json
{
  "component": {
    "status": {
      "success": "Successfully",  // zh-CN: "成功", tr-TR: "Başarılı"
      "fail": "Failed"            // zh-CN: "失败", tr-TR: "Başarısız"
    }
  }
}
```

## Validation

Before committing translation changes:

1. **Validate JSON syntax** - Ensure files are valid JSON
2. **Check key consistency** - All locale files should have the same keys
3. **Test in UI** - Verify translations display correctly
4. **Review context** - Ensure translations make sense in context

You can use this command to validate JSON files:

```bash
# Validate all translation files
for file in messages/*.json; do
  echo "Validating $file"
  jq empty "$file" && echo "✓ Valid" || echo "✗ Invalid"
done
```

## Migration Notes

These translations were migrated from the original APISIX Dashboard v2 implementation located at `/web/src/locales/`. The migration involved:

1. Converting from TypeScript modules to JSON files
2. Reorganizing flat key-value pairs into hierarchical structure
3. Consolidating translations from multiple component files
4. Standardizing key naming conventions

## Support

For questions or issues related to translations:

- Check the [i18n documentation](../docs/i18n.md)
- Review the [next-intl documentation](https://next-intl-docs.vercel.app/)
- Open an issue on GitHub

## License

Licensed under the Apache License 2.0. See LICENSE file for details.
