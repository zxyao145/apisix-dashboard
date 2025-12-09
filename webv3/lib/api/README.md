/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

# APISIX Dashboard API Client

Comprehensive, type-safe API client for the Apache APISIX Dashboard backend.

## Features

- **Type-Safe**: Full TypeScript support with strict typing
- **Modular**: Organized by resource type (routes, upstreams, services, etc.)
- **Interceptors**: Request/response transformation and error handling
- **Caching**: Intelligent caching for plugin schemas and lists
- **Error Handling**: Automatic error handling with toast notifications
- **Authentication**: Automatic token injection and 401 redirect
- **Dev Tools**: Request/response logging in development mode

## Architecture

```
lib/api/
├── client.ts              # Core HTTP client with interceptors
├── routes.ts              # Route management API
├── upstreams.ts           # Upstream management API
├── services.ts            # Service management API
├── consumers.ts           # Consumer management API
├── ssl.ts                 # SSL certificate management API
├── plugins.ts             # Plugin and schema management API
├── plugin-templates.ts    # Plugin template management API
├── protos.ts              # Protocol buffer management API
├── dashboard.ts           # Dashboard/metrics API
├── settings.ts            # User settings management API
├── server-info.ts         # Server information API
└── index.ts               # Central export module
```

## Usage

### Basic Examples

```typescript
import { routes, upstreams, plugins } from '@/lib/api';

// Fetch paginated route list
const routeList = await routes.fetchList({
  page: 1,
  page_size: 10,
  name: 'api',
  status: 1,
});

// Create a new route
const newRoute = await routes.create({
  name: 'my-route',
  uri: '/api/*',
  methods: ['GET', 'POST'],
  upstream: {
    type: 'roundrobin',
    nodes: {
      'httpbin.org:80': 1,
    },
  },
});

// Fetch single route
const route = await routes.fetchItem('route-id');

// Update route status
await routes.updateRouteStatus('route-id', 1); // enable

// Delete routes
await routes.remove(['route-id-1', 'route-id-2']);
```

### Working with Plugins

```typescript
import { plugins } from '@/lib/api';

// Fetch all available plugins
const pluginList = await plugins.fetchList();

// Fetch plugin schema
const corsSchema = await plugins.fetchSchema('cors', 'route');

// Fetch all schemas for a type
const allSchemas = await plugins.fetchAllSchemas('route');

// Clear plugin cache (useful after APISIX update)
plugins.clearCache();
```

### Working with Upstreams

```typescript
import { upstreams } from '@/lib/api';

// Create upstream with health check
const upstream = await upstreams.create({
  name: 'my-upstream',
  type: 'roundrobin',
  nodes: {
    '192.168.1.100:80': 1,
    '192.168.1.101:80': 1,
  },
  checks: {
    active: {
      type: 'http',
      http_path: '/health',
      healthy: {
        interval: 2,
        successes: 2,
      },
    },
  },
});

// Fetch upstream list
const upstreamList = await upstreams.fetchList({
  page: 1,
  page_size: 10,
});
```

### Working with SSL Certificates

```typescript
import { ssl } from '@/lib/api';

// Verify certificate and key pair before creating
const verification = await ssl.verifyKeyPair(cert, key);

if (verification) {
  // Create SSL certificate
  await ssl.create({
    cert,
    key,
    snis: ['example.com', '*.example.com'],
  });
}

// Fetch SSL list with filters
const sslList = await ssl.fetchList({
  page: 1,
  page_size: 10,
  sni: 'example.com',
});
```

### Working with Consumers

```typescript
import { consumers } from '@/lib/api';

// Create consumer with key-auth plugin
await consumers.create({
  username: 'user123',
  desc: 'API User',
  plugins: {
    'key-auth': {
      key: 'api-key-secret',
    },
  },
});

// Fetch consumer
const consumer = await consumers.fetchItem('user123');

// Update consumer
await consumers.update('user123', {
  desc: 'Updated description',
  plugins: {
    'key-auth': {
      key: 'new-api-key',
    },
  },
});
```

### Working with Settings

```typescript
import { settings } from '@/lib/api';

// Get all settings
const allSettings = await settings.getSettings();

// Update settings
await settings.updateSettings({
  theme: 'dark',
  language: 'en-US',
  grafanaURL: 'http://grafana.example.com',
});

// Get specific setting
const theme = await settings.getSetting('theme', 'light');

// Update Grafana URL (legacy compatibility)
await settings.updateMonitorURL('http://grafana.example.com');
```

### Advanced: Custom HTTP Client

```typescript
import { client, HttpClient } from '@/lib/api';

// Use the default client directly
const response = await client.get('/custom/endpoint', {
  params: { key: 'value' },
});

// Create a custom client instance
const customClient = new HttpClient('http://custom-api.example.com');

// Add custom interceptor
customClient.addInterceptor({
  onRequest: async (config) => {
    // Add custom headers
    config.headers = {
      ...config.headers,
      'X-Custom-Header': 'value',
    };
    return config;
  },
  onResponse: async (response, data) => {
    // Transform response data
    return data;
  },
  onError: async (error) => {
    // Custom error handling
    console.error('API Error:', error);
  },
});
```

### File Upload Example

```typescript
import { routes } from '@/lib/api';

// Import routes from OpenAPI file
const formData = new FormData();
formData.append('file', file);
formData.append('mode', 'merge'); // or 'skip', 'overwrite'

const result = await routes.importRoutes(formData);
```

## Configuration

### Environment Variables

Set the API base URL in your environment:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:9000
```

If not set, defaults to `http://localhost:9000`.

### Authentication

The client automatically:
- Injects JWT token from `localStorage.token` into requests
- Redirects to `/login` on 401 responses
- Clears token on logout

### Error Handling

The client provides three levels of error handling:

1. **HTTP Errors**: Automatically converted to `ApiError` instances
2. **API Response Errors**: Checks `code` field in API responses
3. **Interceptor Errors**: Custom error handling via interceptors

```typescript
import { ApiError } from '@/lib/api';

try {
  await routes.fetchItem('invalid-id');
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message, error.code);
    // Access original response
    console.error('Response:', error.response);
    console.error('Data:', error.data);
  }
}
```

## API Response Format

The APISIX Dashboard API uses a standard response wrapper:

```typescript
{
  code: 0,           // 0 or 200 = success
  message: 'string', // Error message if code != 0
  request_id: 'string',
  data: T           // Response data
}
```

The client automatically unwraps this and returns `data` directly.

### Paginated Responses

List endpoints return:

```typescript
{
  rows: T[],        // Array of items
  total_size: number // Total count
}
```

The API client transforms this to:

```typescript
{
  data: T[],        // Array of items
  total: number     // Total count
}
```

## Type Safety

All API functions are fully typed:

```typescript
import type { Route, RouteListParams } from '@/lib/api';

// TypeScript will enforce correct parameter types
const params: RouteListParams = {
  page: 1,
  page_size: 10,
  name: 'api',
  status: 1, // Type: 0 | 1
};

const result = await routes.fetchList(params);
// result.data is typed as Route[]
// result.total is typed as number
```

## Caching

### Plugin Cache

The plugin API implements intelligent caching:

```typescript
// First call fetches from API
const plugins = await plugins.fetchList();

// Subsequent calls return cached data
const pluginsCached = await plugins.fetchList();

// Skip cache if needed
const pluginsFresh = await plugins.fetchList(true);

// Clear cache manually
plugins.clearCache();
```

Plugin schemas are also cached by schema type:

```typescript
// Cached per plugin name and schema type
const routeSchema = await plugins.fetchSchema('cors', 'route');
const consumerSchema = await plugins.fetchSchema('cors', 'consumer');
```

## Best Practices

1. **Use TypeScript**: Leverage full type safety
2. **Error Handling**: Always wrap API calls in try-catch
3. **Pagination**: Use consistent page sizes for better UX
4. **Caching**: Use cached plugin data when possible
5. **Cleanup**: Clear caches after APISIX version updates

## Migration from Old API

The new API client maintains compatibility with the old UmiJS request patterns:

```typescript
// Old (UmiJS)
import { request } from 'umi';
const data = await request('/routes');

// New
import { client } from '@/lib/api';
const data = await client.get('/routes');

// Or use specific module
import { routes } from '@/lib/api';
const data = await routes.fetchList();
```

## Development

### Debug Mode

In development mode (`NODE_ENV=development`), the client logs all requests:

```
[API] GET /routes { params: {...}, data: {...}, response: {...} }
[API] POST /routes { params: {...}, data: {...}, response: {...} }
```

### Testing

Mock the API client in tests:

```typescript
import { client } from '@/lib/api';

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ code: 0, data: mockData }),
  })
);
```

## License

Licensed under the Apache License 2.0. See LICENSE file for details.
