# APISIX Dashboard Type Definitions

Comprehensive TypeScript type definitions for the APISIX Dashboard webv3 project. These types ensure type safety across all API interactions and provide comprehensive documentation for the APISIX Dashboard API structure.

## Directory Structure

```
types/
├── index.ts                  # Main export file - re-exports all types
├── common.ts                 # Common types used across all resources
├── api.ts                    # API request/response wrapper types
├── route.ts                  # Route resource types
├── upstream.ts               # Upstream resource types
├── service.ts                # Service resource types
├── consumer.ts               # Consumer resource types
├── ssl.ts                    # SSL certificate types
├── plugin.ts                 # Plugin types and configurations
├── plugin-template.ts        # Plugin template types
├── proto.ts                  # Protocol buffer types
├── label.ts                  # Label/tagging types
└── TYPE_DEFINITIONS.md       # This file
```

## File Descriptions

### common.ts

Common type definitions used across all APISIX Dashboard resources.

**Key Exports:**
- `HttpMethod`: HTTP methods (GET, POST, DELETE, PUT, OPTIONS, HEAD, PATCH, CONNECT, TRACE, PURGE)
- `ApiResponse<T>`: Generic API response wrapper
- `ApiListResponse<T>`: Paginated list response wrapper
- `PageMode`: Page operation modes (CREATE, EDIT, VIEW)
- `EntityStatus`: Entity status type (0 = disabled, 1 = enabled)
- `LabelRecord`: Label key-value collection
- `BaseEntity`: Base entity interface with common fields (id, create_time, update_time)
- `RequestProtocol`: Request protocol types
- `RedirectConfig`: HTTP redirect configuration

**Usage:**
```typescript
import { HttpMethod, ApiResponse, BaseEntity } from '@/types';

interface MyResource extends BaseEntity {
  name: string;
}

const response: ApiResponse<MyResource> = {
  code: 0,
  message: 'Success',
  data: { id: '1', name: 'Example' }
};
```

### route.ts

Type definitions for APISIX routes - the core resource for request routing and API definitions.

**Key Exports:**
- `RouteOperator`: Matching operators (==, ~=, >, <, ~~, ~*, IN, HAS)
- `RouteVarTuple`: Variable matching tuple format
- `RouteMatchingRule`: Advanced matching rules for route conditions
- `RouteRequest`: Route request body for API
- `RouteResponse`: Route response body from API
- `RouteFormData`: Route form data for UI
- `ProxyRewrite`: Upstream path/header rewriting
- `RouteDebugRequest/Response`: Route debugging/testing types
- `DebugBodyType`: Debug request body types
- `RouteStatus`: Route enabled/disabled status

**Key Features:**
- Support for multiple URI/host matching
- Advanced variable matching with operators
- Path rewriting and proxy configuration
- Debug/testing capabilities
- Redirect configuration (HTTP to HTTPS)
- WebSocket and gRPC support via service_protocol
- Plugin and script configuration
- Priority-based routing

**Usage:**
```typescript
import { RouteRequest, RouteResponse, RouteOperator } from '@/types';

const routeRequest: RouteRequest = {
  name: 'my-route',
  status: 1,
  uris: ['/api/users'],
  methods: ['GET', 'POST'],
  upstream_id: 'upstream-1',
  plugins: {},
  vars: [
    ['http_user_agent', 'IN', ['curl', 'wget']]
  ]
};
```

### upstream.ts

Type definitions for APISIX upstreams - backend server configurations for load balancing.

**Key Exports:**
- `UpstreamType`: Load balancing algorithms (roundrobin, chash, ewma, least_conn)
- `UpstreamNode`: Backend server definition
- `UpstreamNodeMap`: Simplified node format (host:port => weight)
- `UpstreamTimeout`: Connection timeout configuration
- `UpstreamTLS`: TLS configuration for HTTPS upstreams
- `UpstreamHealthCheck`: Active and passive health check configs
- `UpstreamKeepalivePool`: Connection pooling configuration
- `UpstreamDiscoveryType`: Service discovery types
- `UpstreamHashOn`: Hash algorithm for consistent hash
- `UpstreamRequest/Response`: API request/response types
- `UpstreamComponentData`: Simplified upstream data for components

**Key Features:**
- Multiple load balancing algorithms
- Active and passive health checking
- Connection keepalive pooling
- TLS/SSL support
- Dynamic service discovery (DNS, Consul, Nacos, Eureka)
- Consistent hash with custom keys
- Timeout and retry configuration
- WebSocket support

**Usage:**
```typescript
import { UpstreamRequest, UpstreamType } from '@/types';

const upstream: UpstreamRequest = {
  type: 'roundrobin',
  nodes: {
    'backend1.example.com:8000': 100,
    'backend2.example.com:8000': 50
  },
  timeout: {
    connect: 6,
    send: 6,
    read: 6
  }
};
```

### service.ts

Type definitions for APISIX services - abstractions over upstreams with additional features.

**Key Exports:**
- `ServiceRequest`: Service request body for API
- `ServiceResponse`: Service response body from API
- `ServiceFormData`: Service form data for UI

**Key Features:**
- Upstream configuration reuse via upstream_id
- Host-based routing
- WebSocket support
- Plugin configuration
- Label support

**Usage:**
```typescript
import { ServiceRequest } from '@/types';

const service: ServiceRequest = {
  name: 'user-service',
  desc: 'User management service',
  upstream_id: 'upstream-1',
  plugins: {
    'cors': {
      allow_origins: '*'
    }
  }
};
```

### consumer.ts

Type definitions for APISIX consumers - end users or applications accessing routes.

**Key Exports:**
- `ConsumerRequest`: Consumer request body for API
- `ConsumerResponse`: Consumer response body from API
- `ConsumerFormData`: Consumer form data for UI
- `ConsumerCredential`: Credential/plugin configuration

**Key Features:**
- Username-based identification
- Plugin configuration (authentication, rate limiting, etc.)
- Label support for organization
- Description/metadata

**Usage:**
```typescript
import { ConsumerRequest } from '@/types';

const consumer: ConsumerRequest = {
  username: 'john_doe',
  desc: 'API consumer',
  plugins: {
    'basic-auth': {
      username: 'john',
      password: 'secret'
    }
  }
};
```

### ssl.ts

Type definitions for APISIX SSL certificates - TLS/HTTPS configuration.

**Key Exports:**
- `SSLRequest`: SSL certificate request body
- `SSLResponse`: SSL certificate response body
- `SSLCertificate`: SSL certificate with validity info
- `SSLFormData`: SSL form data for UI
- `CertificateInfo`: Extracted certificate information
- `SSLUploadFile`: File upload metadata

**Key Features:**
- Certificate and key management
- SNI (Server Name Indication) configuration
- Validity date tracking
- Certificate expiration monitoring
- Multi-certificate support

**Usage:**
```typescript
import { SSLRequest } from '@/types';

const ssl: SSLRequest = {
  snis: ['example.com', 'www.example.com'],
  cert: '-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----',
  key: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----'
};
```

### plugin.ts

Type definitions for APISIX plugins - request/response processing middleware.

**Key Exports:**
- `PluginName`: Built-in plugin names (api-breaker, cors, limit-count, etc.)
- `PluginType`: Plugin categorization
- `PluginSchema`: Plugin schema for validation
- `PluginMetadata`: Plugin metadata from APISIX
- `PluginConfig`: Plugin configuration
- `PluginRequest/Response`: API request/response types
- `TransformedPlugin`: Transformed plugin data
- `GlobalPluginRule`: Global plugin configuration
- Specific plugin config types: `CORSPluginConfig`, `BasicAuthPluginConfig`, `LimitCountPluginConfig`, etc.

**Key Features:**
- Comprehensive plugin name enumeration
- Plugin schema validation
- Consumer-specific plugins
- Plugin configuration with JSON/YAML support
- Global rule support
- Custom plugin support

**Usage:**
```typescript
import { PluginConfig, CORSPluginConfig } from '@/types';

const corsConfig: CORSPluginConfig = {
  allow_origins: '*',
  allow_methods: ['GET', 'POST'],
  allow_headers: ['Content-Type'],
  max_age: 3600
};
```

### plugin-template.ts

Type definitions for APISIX plugin templates - reusable plugin configurations.

**Key Exports:**
- `PluginTemplateRequest`: Plugin template request body
- `PluginTemplateResponse`: Plugin template response body
- `PluginTemplateFormData`: Plugin template form data for UI

**Key Features:**
- Reusable plugin configurations
- Label-based organization
- Description/documentation
- Multi-plugin support per template

**Usage:**
```typescript
import { PluginTemplateRequest } from '@/types';

const template: PluginTemplateRequest = {
  desc: 'Standard rate limiting and auth',
  plugins: {
    'limit-count': { count: 100, time_window: 60 },
    'cors': { allow_origins: '*' }
  }
};
```

### proto.ts

Type definitions for Protocol Buffer definitions - used for gRPC services and transcoding.

**Key Exports:**
- `ProtoMessage`: Protocol Buffer message definition
- `ProtoField`: Message field definition
- `ProtoService`: RPC service definition
- `ProtoMethod`: RPC method definition
- `ProtoRequest/Response`: API request/response types
- `ProtoFormData`: Proto form data for UI
- `ParsedProto`: Parsed proto content structure
- `ProtoEnum`: Enum definition
- `ProtoEditMode`: Edit mode (create/update)

**Key Features:**
- Proto file content storage
- Message and service definition parsing
- gRPC service discovery
- Transcoding support

**Usage:**
```typescript
import { ProtoRequest } from '@/types';

const proto: ProtoRequest = {
  content: `
    syntax = "proto3";
    package api;

    service UserService {
      rpc GetUser(GetUserRequest) returns (User);
    }

    message User {
      int32 id = 1;
      string name = 2;
    }
  `,
  desc: 'User service proto'
};
```

### label.ts

Type definitions for labels - key-value metadata for resource organization and filtering.

**Key Exports:**
- `Label`: Single label definition
- `LabelCollection`: Key-value pair collection
- `LabelResponse`: API response format
- `LabelFilter`: Label filter for queries
- `LabelSelector`: Label selector for filtering
- `LabelGroup`: Grouped labels for display
- Helper types: `LabelKey`, `LabelValue`, `VersionLabel`, `EnvironmentLabel`, `TeamLabel`

**Key Features:**
- Key-value label metadata
- Label filtering and selection
- Standardized label keys (version, environment, team)
- Label requirements/selectors

**Usage:**
```typescript
import { LabelCollection, VersionLabel } from '@/types';

const labels: LabelCollection = {
  'version': '1.0.0',
  'environment': 'production',
  'team': 'platform'
};
```

### api.ts

API request and response wrapper types (existing file).

**Key Exports:**
- `ApiResponse<T>`: Standard API response wrapper
- `PaginatedResponse<T>`: Paginated list response
- `ListParams`: Standard list request parameters

## Usage Examples

### Basic Import

```typescript
import { RouteResponse, UpstreamRequest, ServiceRequest } from '@/types';

// Type-safe API responses
const getRoute = async (id: string): Promise<RouteResponse> => {
  const res = await fetch(`/api/routes/${id}`);
  const data: RouteResponse = await res.json();
  return data;
};
```

### Component Props

```typescript
import { RouteFormData, HttpMethod } from '@/types';

interface RouteFormProps {
  initialData?: Partial<RouteFormData>;
  onSubmit: (data: RouteFormData) => Promise<void>;
}

const RouteForm: React.FC<RouteFormProps> = ({ initialData, onSubmit }) => {
  // Component implementation
};
```

### API Service Functions

```typescript
import { RouteRequest, RouteResponse, ApiResponse } from '@/types';

export const routeAPI = {
  create: (data: RouteRequest): Promise<ApiResponse<RouteResponse>> => {
    return fetch('/api/routes', {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(r => r.json());
  },

  update: (id: string, data: Partial<RouteRequest>): Promise<ApiResponse<RouteResponse>> => {
    return fetch(`/api/routes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }).then(r => r.json());
  }
};
```

## Extending Types

To add new types or extend existing ones:

1. Create a new file in the `types/` directory
2. Add Apache License header
3. Export interfaces/types
4. Update `index.ts` to export the new types
5. Document in this file

Example:

```typescript
// types/custom-resource.ts
/*
 * Licensed to the Apache Software Foundation (ASF)...
 */

import { BaseEntity } from './common';

export interface CustomResource extends BaseEntity {
  name: string;
  value: string;
}

export interface CustomResourceRequest extends Omit<CustomResource, 'id'> {}
export interface CustomResourceResponse extends CustomResource {}
```

Then in `index.ts`:

```typescript
export * from './custom-resource';
```

## Type Compatibility

All types are designed to be compatible with:

- Manager API responses from `/api/` endpoints
- React components and hooks
- Form validation libraries (Ant Design Form, React Hook Form, etc.)
- API client libraries (umi-request, axios, etc.)

## References

- [APISIX Documentation](https://apisix.apache.org/)
- [APISIX Admin API](https://apisix.apache.org/docs/apisix/next/admin-api/)
- [Protocol Buffers](https://developers.google.com/protocol-buffers)

## License

All type definitions are licensed under Apache License 2.0. See LICENSE file for details.
