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

# API Client Quick Reference

## Import

```typescript
import { routes, upstreams, services, consumers, ssl, plugins } from '@/lib/api';
```

## Routes

```typescript
// List
const { data, total } = await routes.fetchList({ page: 1, page_size: 10 });

// Get
const route = await routes.fetchItem('id');

// Create
await routes.create({ name: 'route', uri: '/api/*', methods: ['GET'], ... });

// Update
await routes.update('id', { name: 'updated' });

// Delete
await routes.remove('id');
await routes.remove(['id1', 'id2']); // batch

// Status
await routes.updateRouteStatus('id', 1); // enable
await routes.updateRouteStatus('id', 0); // disable

// Validation
await routes.checkUniqueName('name', 'exclude-id');

// Utilities
await routes.fetchLabelList();
await routes.checkHostWithSSL(['example.com']);
await routes.debugRoute({}, { url: '...', method: 'GET' });
await routes.importRoutes(formData);
```

## Upstreams

```typescript
// CRUD
const { data, total } = await upstreams.fetchList({ page: 1, page_size: 10 });
const upstream = await upstreams.fetchItem('id');
await upstreams.create({ name: 'upstream', type: 'roundrobin', nodes: {...} });
await upstreams.update('id', { nodes: {...} });
await upstreams.remove('id');
```

## Services

```typescript
// CRUD
const { data, total } = await services.fetchList({ page: 1, page_size: 10 });
const service = await services.fetchItem('id');
await services.create({ name: 'service', upstream: {...} });
await services.update('id', { name: 'updated' });
await services.remove('id');
```

## Consumers

```typescript
// CRUD (Note: create/update use PUT)
const { data, total } = await consumers.fetchList({ page: 1, page_size: 10 });
const consumer = await consumers.fetchItem('username');
await consumers.create({ username: 'user', plugins: {...} });
await consumers.update('username', { plugins: {...} });
await consumers.remove('username');
```

## SSL

```typescript
// CRUD
const { data, total } = await ssl.fetchList({ page: 1, page_size: 10 });
const cert = await ssl.fetchItem('id');
await ssl.create({ cert: '...', key: '...', snis: ['example.com'] });
await ssl.update('id', { snis: ['*.example.com'] });
await ssl.remove('id');

// Verification
const result = await ssl.verifyKeyPair(cert, key);
```

## Plugins

```typescript
// List (cached)
const plugins = await plugins.fetchList();
const pluginsFresh = await plugins.fetchList(true); // skip cache

// Schema (cached by type)
const schema = await plugins.fetchSchema('cors', 'route');
const consumerSchema = await plugins.fetchSchema('key-auth', 'consumer');

// Batch
const allSchemas = await plugins.fetchAllSchemas('route');

// Cache
plugins.clearCache();
```

## Plugin Templates

```typescript
// CRUD
const { data, total } = await pluginTemplates.fetchList({ page: 1, page_size: 10 });
const template = await pluginTemplates.fetchItem('id');
await pluginTemplates.create({ desc: 'template', plugins: {...} });
await pluginTemplates.update('id', { plugins: {...} }); // PATCH
await pluginTemplates.remove('id');

// Utilities
await pluginTemplates.fetchLabelList();
await pluginTemplates.fetchAll(); // no pagination
```

## Protos

```typescript
// CRUD
const { data, total } = await protos.fetchList({ page: 1, page_size: 10 });
const proto = await protos.fetchItem('id');
await protos.create({ desc: 'proto', content: '...' });
await protos.update('id', { content: '...' });
await protos.remove('id');
```

## Dashboard

```typescript
// Grafana URL (localStorage)
const url = await dashboard.getGrafanaURL();
await dashboard.updateGrafanaURL('http://grafana.example.com');
await dashboard.clearGrafanaURL();
```

## Settings

```typescript
// Get
const settings = await settings.getSettings();
const theme = await settings.getSetting('theme', 'light');

// Update
await settings.updateSettings({ theme: 'dark', language: 'en-US' });
await settings.setSetting('theme', 'dark');

// Clear
await settings.clearSettings();

// Legacy
await settings.updateMonitorURL('http://grafana.example.com');
```

## Server Info

```typescript
// Server nodes
const nodes = await serverInfo.fetchInfoList();

// Dashboard version
const version = await serverInfo.fetchVersion();

// Combined
const { nodes, dashboard } = await serverInfo.fetchServerInfo();
```

## Direct HTTP Client

```typescript
import { client } from '@/lib/api';

// Methods
const data = await client.get('/endpoint', { params: {...} });
const data = await client.post('/endpoint', body, { params: {...} });
const data = await client.put('/endpoint', body);
const data = await client.patch('/endpoint', body);
const data = await client.delete('/endpoint');

// Generic request
const data = await client.request('/endpoint', {
  method: 'POST',
  params: { key: 'value' },
  data: { body: 'data' },
  requestType: 'json', // or 'form'
});
```

## Error Handling

```typescript
import { ApiError } from '@/lib/api';

try {
  await routes.fetchItem('id');
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.code);    // HTTP status code
    console.error(error.message); // Error message
    console.error(error.response); // Original Response
    console.error(error.data);    // Response body
  }
}
```

## Types

```typescript
import type {
  Route, RouteListParams,
  Upstream, UpstreamListParams,
  Service, ServiceListParams,
  Consumer, ConsumerListParams,
  SSL, SSLListParams,
  Plugin, PluginSchema,
  PluginTemplate,
  Proto,
} from '@/lib/api';
```

## Configuration

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:9000
```

## Common Patterns

### Pagination
```typescript
const fetchPage = async (page: number) => {
  const { data, total } = await routes.fetchList({
    page,
    page_size: 20,
  });
  return { data, total, hasMore: page * 20 < total };
};
```

### Search/Filter
```typescript
const searchRoutes = async (name: string) => {
  return routes.fetchList({
    page: 1,
    page_size: 100,
    name,
    status: 1,
  });
};
```

### Batch Operations
```typescript
const [routes, upstreams, services] = await Promise.all([
  routes.fetchList({ page: 1, page_size: 10 }),
  upstreams.fetchList({ page: 1, page_size: 10 }),
  services.fetchList({ page: 1, page_size: 10 }),
]);
```
