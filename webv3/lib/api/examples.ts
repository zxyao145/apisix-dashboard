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

/**
 * APISIX Dashboard API Client Examples
 *
 * This file demonstrates common usage patterns for the API client.
 * These are examples only and should not be imported directly.
 */

import {
  routes,
  upstreams,
  services,
  consumers,
  ssl,
  plugins,
  pluginTemplates,
  settings,
} from '@/lib/api';
import type { Route, Upstream, Service } from '@/types';

// ============================================================================
// ROUTES EXAMPLES
// ============================================================================

async function routeExamples() {
  // Fetch paginated route list with filters
  const routeList = await routes.fetchList({
    page: 1,
    page_size: 20,
    name: 'api',
    status: 1,
    host: 'example.com',
  });

  // Create a simple route
  const simpleRoute = await routes.create({
    name: 'simple-route',
    uri: '/api/users',
    methods: ['GET', 'POST'],
    upstream: {
      type: 'roundrobin',
      nodes: {
        'httpbin.org:80': 1,
      },
    },
  });

  // Create route with plugins
  const routeWithPlugins = await routes.create({
    name: 'protected-route',
    uri: '/api/protected/*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    plugins: {
      'key-auth': {},
      'limit-count': {
        count: 100,
        time_window: 60,
        key: 'remote_addr',
      },
      cors: {
        allow_origins: '*',
        allow_methods: '**',
        allow_headers: '*',
      },
    },
    upstream: {
      type: 'roundrobin',
      nodes: {
        'backend.example.com:443': 1,
      },
      scheme: 'https',
    },
  });

  // Update route status
  await routes.updateRouteStatus('route-id', 1); // enable
  await routes.updateRouteStatus('route-id', 0); // disable

  // Check if route name is unique
  const isUnique = await routes.checkUniqueName('my-route', 'existing-route-id');

  // Debug route
  const debugResult = await routes.debugRoute(
    { 'X-API-Key': 'test-key' },
    {
      url: 'http://example.com/api/test',
      method: 'GET',
      request_protocol: 'http',
    }
  );
}

// ============================================================================
// UPSTREAMS EXAMPLES
// ============================================================================

async function upstreamExamples() {
  // Create upstream with health checks
  const upstream = await upstreams.create({
    name: 'backend-cluster',
    type: 'roundrobin',
    nodes: {
      '192.168.1.100:8080': 1,
      '192.168.1.101:8080': 1,
      '192.168.1.102:8080': 1,
    },
    timeout: {
      connect: 6,
      send: 6,
      read: 6,
    },
    checks: {
      active: {
        type: 'http',
        http_path: '/health',
        healthy: {
          interval: 2,
          successes: 2,
        },
        unhealthy: {
          interval: 1,
          http_failures: 2,
        },
      },
      passive: {
        healthy: {
          http_statuses: [200, 201],
          successes: 3,
        },
        unhealthy: {
          http_statuses: [500, 502, 503, 504],
          http_failures: 3,
        },
      },
    },
  });

  // Create upstream with service discovery
  const sdUpstream = await upstreams.create({
    name: 'consul-services',
    type: 'roundrobin',
    discovery_type: 'consul',
    service_name: 'my-service',
  });

  // Update upstream
  await upstreams.update('upstream-id', {
    nodes: {
      '192.168.1.100:8080': 2, // Increase weight
      '192.168.1.101:8080': 1,
    },
  });
}

// ============================================================================
// SERVICES EXAMPLES
// ============================================================================

async function serviceExamples() {
  // Create service with upstream
  const service = await services.create({
    name: 'user-service',
    desc: 'User management service',
    upstream: {
      type: 'roundrobin',
      nodes: {
        'users.example.com:443': 1,
      },
      scheme: 'https',
    },
    plugins: {
      'prometheus': {},
      'cors': {
        allow_origins: '*',
      },
    },
  });

  // Create route using service
  const routeWithService = await routes.create({
    name: 'service-route',
    uri: '/users/*',
    methods: ['GET', 'POST'],
    service_id: service.id!,
  });
}

// ============================================================================
// CONSUMERS EXAMPLES
// ============================================================================

async function consumerExamples() {
  // Create consumer with key-auth
  await consumers.create({
    username: 'john-doe',
    desc: 'John Doe API User',
    plugins: {
      'key-auth': {
        key: 'john-api-key-secret',
      },
    },
  });

  // Create consumer with JWT auth
  await consumers.create({
    username: 'jane-doe',
    desc: 'Jane Doe JWT User',
    plugins: {
      'jwt-auth': {
        key: 'jane-jwt-key',
        secret: 'jane-jwt-secret',
      },
    },
  });

  // Create consumer with multiple auth methods
  await consumers.create({
    username: 'multi-auth-user',
    desc: 'User with multiple auth methods',
    plugins: {
      'key-auth': {
        key: 'api-key-123',
      },
      'basic-auth': {
        username: 'basic-user',
        password: 'basic-pass',
      },
      'limit-count': {
        count: 1000,
        time_window: 3600,
        key: 'consumer_name',
      },
    },
  });
}

// ============================================================================
// SSL EXAMPLES
// ============================================================================

async function sslExamples() {
  const cert = '-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----';
  const key = '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----';

  // Verify certificate before creating
  const verification = await ssl.verifyKeyPair(cert, key);

  if (verification) {
    // Create SSL certificate
    await ssl.create({
      cert,
      key,
      snis: ['example.com', '*.example.com'],
    });
  }

  // Fetch SSL list filtered by SNI
  const sslList = await ssl.fetchList({
    page: 1,
    page_size: 10,
    sni: 'example.com',
  });
}

// ============================================================================
// PLUGINS EXAMPLES
// ============================================================================

async function pluginExamples() {
  // Fetch all available plugins
  const allPlugins = await plugins.fetchList();

  // Fetch plugin schema for route
  const corsSchema = await plugins.fetchSchema('cors', 'route');

  // Fetch plugin schema for consumer
  const keyAuthSchema = await plugins.fetchSchema('key-auth', 'consumer');

  // Fetch all schemas for routes
  const allRouteSchemas = await plugins.fetchAllSchemas('route');

  // Use plugin in route configuration
  await routes.create({
    name: 'plugin-test',
    uri: '/test',
    methods: ['GET'],
    plugins: {
      'rate-limiting': {
        count: 100,
        time_window: 60,
      },
      'response-rewrite': {
        headers: {
          'X-Custom-Header': 'custom-value',
        },
      },
    },
    upstream: {
      type: 'roundrobin',
      nodes: { 'httpbin.org:80': 1 },
    },
  });
}

// ============================================================================
// PLUGIN TEMPLATES EXAMPLES
// ============================================================================

async function pluginTemplateExamples() {
  // Create plugin template
  const template = await pluginTemplates.create({
    desc: 'Standard API Protection',
    plugins: {
      'key-auth': {},
      'limit-count': {
        count: 100,
        time_window: 60,
        key: 'remote_addr',
      },
      'cors': {
        allow_origins: '*',
      },
    },
  });

  // Use plugin template in route
  await routes.create({
    name: 'template-route',
    uri: '/protected',
    methods: ['GET'],
    plugin_config_id: template.id!,
    upstream: {
      type: 'roundrobin',
      nodes: { 'backend.example.com:80': 1 },
    },
  });
}

// ============================================================================
// SETTINGS EXAMPLES
// ============================================================================

async function settingsExamples() {
  // Get all settings
  const allSettings = await settings.getSettings();

  // Update settings
  await settings.updateSettings({
    theme: 'dark',
    language: 'en-US',
    grafanaURL: 'http://grafana.example.com:3000',
  });

  // Get specific setting with default
  const theme = await settings.getSetting('theme', 'light');

  // Set individual setting
  await settings.setSetting('language', 'zh-CN');

  // Update Grafana URL
  await settings.updateMonitorURL('http://grafana.example.com:3000');
}

// ============================================================================
// ERROR HANDLING EXAMPLES
// ============================================================================

async function errorHandlingExamples() {
  try {
    await routes.fetchItem('non-existent-id');
  } catch (error: any) {
    console.error('Failed to fetch route:', error.message);
    // Error is automatically handled by interceptors
    // 401 -> redirects to login
    // Other errors -> logged to console
  }

  // Validate data before creating
  try {
    const newRoute = await routes.create({
      name: 'test-route',
      uri: '/test',
      methods: ['GET'],
      upstream: {
        type: 'roundrobin',
        nodes: {},
      },
    });
  } catch (error: any) {
    if (error.code === 400) {
      console.error('Validation error:', error.message);
    }
  }
}

// ============================================================================
// ADVANCED EXAMPLES
// ============================================================================

async function advancedExamples() {
  // Batch operations
  const [routeList, upstreamList, serviceList] = await Promise.all([
    routes.fetchList({ page: 1, page_size: 10 }),
    upstreams.fetchList({ page: 1, page_size: 10 }),
    services.fetchList({ page: 1, page_size: 10 }),
  ]);

  // Create complete routing stack
  const upstream = await upstreams.create({
    name: 'api-backend',
    type: 'roundrobin',
    nodes: { 'api.example.com:443': 1 },
    scheme: 'https',
  });

  const service = await services.create({
    name: 'api-service',
    upstream_id: upstream.id!,
    plugins: {
      prometheus: {},
      'cors': { allow_origins: '*' },
    },
  });

  const route = await routes.create({
    name: 'api-route',
    uri: '/api/*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    service_id: service.id!,
    plugins: {
      'key-auth': {},
      'limit-count': {
        count: 1000,
        time_window: 3600,
        key: 'consumer_name',
      },
    },
  });

  // Import routes from OpenAPI
  const formData = new FormData();
  formData.append('file', openApiFile);
  formData.append('mode', 'merge');
  await routes.importRoutes(formData);
}

export {
  routeExamples,
  upstreamExamples,
  serviceExamples,
  consumerExamples,
  sslExamples,
  pluginExamples,
  pluginTemplateExamples,
  settingsExamples,
  errorHandlingExamples,
  advancedExamples,
};
