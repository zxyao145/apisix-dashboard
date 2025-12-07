# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Apache APISIX Dashboard is a web-based control plane for Apache APISIX. The project is split into two main components:
- **manager-api** (`/api`): Go-based backend API that manages etcd and provides RESTful APIs
- **web** (`/web`): React/TypeScript frontend built with Ant Design Pro and UmiJS

The dashboard provides a UI for managing APISIX resources including routes, services, upstreams, consumers, SSL certificates, plugins, and more.

## Architecture

### Backend (manager-api)
- **Language**: Go 1.15+
- **Framework**: Gin
- **Storage**: etcd (Apache APISIX's configuration store)
- **Location**: `/api` directory
- **Entry point**: `api/main.go`
- **Configuration**: `api/conf/conf.yaml`
- **Key components**:
  - `internal/core/storage`: etcd client abstraction
  - `internal/core/store`: Business logic layer with validation
  - `internal/handler/*`: HTTP handlers for each resource type (routes, services, upstreams, consumers, SSL, etc.)
  - `internal/filter`: Middleware (authentication, CORS, logging, IP filtering, etc.)
  - `internal/route.go`: Router setup with handler registration

### Frontend (web)
- **Language**: TypeScript/React 16
- **Framework**: UmiJS 3 with Ant Design Pro
- **UI Library**: Ant Design 4
- **State Management**: Dva (built on Redux)
- **Location**: `/web` directory
- **Configuration**: `web/config/config.ts`, `web/config/routes.ts`
- **Key directories**:
  - `src/pages/*`: Page components for each resource type (Dashboard, Route, SSL, Upstream, Consumer, Service, Plugin, etc.)
  - `src/components/*`: Reusable components (Plugin, Upstream, RawDataEditor, etc.)
  - `src/locales/*`: i18n translations (en-US, zh-CN, tr-TR)

### Plugin System
The plugin system is a core feature:
- Backend fetches plugin schemas from APISIX
- Frontend provides both form-based and JSON editor interfaces for plugin configuration
- Custom UI components for specific plugins in `src/components/Plugin/UI/`
- Plugin orchestration support via `PluginFlow` component using @antv/x6 for visual DAG

## Development Commands

### Backend (manager-api)

From repository root:

```bash
# Run manager-api in development mode (with auto-rebuild)
make api-run

# Stop manager-api
make api-stop

# Run backend unit tests
cd api && go test -v ./...

# Run backend E2E tests (requires APISIX, etcd, and upstream services running)
cd api/test/e2e && ginkgo -r

# Run linter
make go-lint
```

### Frontend (web)

From `/web` directory:

```bash
# Install dependencies
yarn install

# Start development server (connects to manager-api at SERVE_URL_DEV)
yarn start
# or explicitly
yarn start:dev

# Build for production
yarn build

# Lint code
yarn lint

# Fix lint issues automatically
yarn lint:fix

# Run only JavaScript linting
yarn lint:js

# Run only style linting
yarn lint:style

# Format code with Prettier
yarn prettier

# Type checking
yarn tsc

# Run frontend E2E tests with Cypress
yarn cypress:open-dev      # Opens Cypress UI for development
yarn cypress:open          # Opens Cypress UI for local manager-api testing
yarn cypress:run-ci        # Runs all E2E tests headlessly
yarn cypress:run-plugin-ci # Runs plugin-specific E2E tests
```

### Environment Configuration

Frontend requires manager-api URL configuration:

```bash
# Create .env file in /web directory
echo "SERVE_URL_DEV=http://localhost:9000" > web/.env

# Or export as environment variable
export SERVE_URL_DEV=http://localhost:9000
```

### Full Build

From repository root:

```bash
# Build both backend and frontend
make build
```

## Testing

### Backend Tests

**Unit Tests**: Use Go's built-in testing with mock interfaces for etcd storage (`store.MockInterface`)

**E2E Tests**: Two approaches:
1. **Legacy** (`api/test/e2e`): Plain Go tests (deprecated, no new tests should be added here)
2. **Current** (`api/test/e2e`): Ginkgo BDD-style tests (all new tests must use this approach)

E2E test structure:
- Use `ginkgo` framework with BDD style
- Use `HttpTestCase` struct from `base` package for HTTP assertions
- Tests use `table.DescribeTable` and `table.Entry` for table-driven tests
- Requires running services: manager-api, APISIX, etcd, upstream-node

### Frontend Tests

**E2E Tests**: Uses Cypress framework
- Test files in `cypress/e2e/`
- Organized by feature: `route/`, `consumer/`, `plugin/`, `rest/`, etc.
- By default connects to remote manager-api; use `yarn start:e2e` for local manager-api testing

## Configuration Files

### Backend Configuration
- `api/conf/conf.yaml`: Main configuration
  - `listen.host` and `listen.port`: Manager API server address (default 0.0.0.0:9000)
  - `etcd.endpoints`: etcd cluster addresses (default 127.0.0.1:2379)
  - `etcd.prefix`: APISIX config prefix in etcd (default /apisix)
  - `allow_list`: IP whitelist for API access
  - `log.error_log` and `log.access_log`: Logging configuration

### Frontend Configuration
- `web/config/config.ts`: UmiJS configuration
- `web/config/routes.ts`: Route definitions
- `web/.env`: Environment-specific settings (SERVE_URL_DEV, SERVE_URL_TEST)

## Key Patterns

### Backend
- Handlers follow factory pattern: `NewHandler()` returns `handler.RegisterFactory`
- Use `store.MockInterface` for unit tests instead of direct etcd dependencies
- All handlers registered in `internal/route.go` via `SetUpRouter()`
- Middleware chain: request logging → IP filter → authentication → CORS → gzip → static files
- OIDC authentication optional (controlled by `conf.OidcEnabled`)

### Frontend
- Pages follow multi-step wizard pattern (Step1, Step2, etc. components)
- Shared components for cross-cutting concerns: Plugin, Upstream, RawDataEditor
- i18n via `useIntl()` hook with locale files in `src/locales/`
- API requests use umi-request with automatic auth token injection
- Form state managed with Ant Design Form hooks
- Monaco Editor integration for JSON/code editing

### Plugin Configuration
- Dual interface: Form UI for common plugins + JSON editor for all
- Schema-driven form generation using `@rjsf/antd`
- Custom form components in `src/components/Plugin/UI/` for plugins: api-breaker, basic-auth, cors, limit-conn, limit-count, limit-req, proxy-mirror, referer-restriction
- Plugin orchestration visual editor using @antv/x6 graph library

## Common Development Workflows

### Adding a New Backend Handler
1. Create handler in `api/internal/handler/<resource>/`
2. Implement `NewHandler()` factory function
3. Register factory in `api/internal/route.go`
4. Add E2E tests in `api/test/e2e/<resource>/` using Ginkgo

### Adding a New Frontend Page
1. Create page component in `src/pages/<Resource>/`
2. Add route in `web/config/routes.ts`
3. Add i18n entries in `src/locales/*/menu.ts` and resource-specific locale files
4. Create service functions in page's `service.ts`
5. Add Cypress E2E tests in `cypress/e2e/<resource>/`

### Working with Plugins
- Backend plugin schema served via `/apisix/admin/schemas/plugins/<plugin-name>`
- Frontend custom plugin UI in `src/components/Plugin/UI/<plugin-name>.tsx`
- Plugin metadata and icons in `src/components/Plugin/data.tsx`

## Build Output
- Frontend builds to `../output/html` (relative to web directory)
- Combined build creates deployable package with static files served by manager-api

## Dependencies Management
- Backend: Go modules (`api/go.mod`)
- Frontend: Yarn (`web/package.json`, `web/yarn.lock`)

## License
All files must include Apache License 2.0 header. Use `make license-check` to verify.
