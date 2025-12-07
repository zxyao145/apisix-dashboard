# 代码结构概览

其结构围绕“路由页面 (app) → 业务上下文 (app/{domain}/components、hooks) → API 封装 (lib) → 领域类型 (types)”构成，辅以一套统一的 UI 组件库与构建配置。

## 目录结构

```text
src/
├── app/

│   ├── components/            # Home page components
│   ├── layout/                # Root layout components
│   ├── pages/                 # App routes (file-based routing)
│   │   ├── login/             # /pages/login
│   │   │   ├── components/    # login page's components
│   │   │   ├── page.tsx
│   │   │   └── login.css
│   │   ├── {domain}/          # Business domain sub routing, including [id]/page. tsx, etc
│   │   │   ├── components/    # Business components under sub routing
│   │   │   ├── page.tsx       # Subrouting page
│   │   └── ...
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page (/pages)
├── components/                # General basic components
├── contexts/
│   ├─ auth/                   # AuthProvider + useAuth
│   ├── ui/                    # shadcn/ui
│   └── ...
├── hooks/                     # Custom hooks (authentication, permissions)
├── lib/
│   └─ api/                    # Axios API client
│      ├─ httpClient.ts        # wrapper of Axios
│      └─ account.ts           # base httpClient，account domain request
└── types/                     # TypeScript type definitions
├── public/                    # static resources (svg)
├── components.json            # shadcn/ui component configuration
├── next.config.ts / tsconfig.json / eslint & postcss configuration
└── package.json / pnpm-lock.yaml
```

## 核心模块说明

### app/

- `layout.tsx`：设置字体变量，包裹 `AuthProvider` 与 `Toaster`，是整个前端的根入口。
- `page.tsx`：开屏页，调用 `useAuth`，认证后使用 `useRouter` 跳转至 `/apps`。
- `login/page.tsx` + `LoginClient.tsx`：登录视图与表单逻辑，调用 `AuthProvider` 暴露的 `signIn`/`signInWithPassword`。
- `apps/`：采用嵌套布局，`apps/layout.tsx` 将 `AppContextProvider` 与 `MainLayout` 叠加；`[id]/page.tsx` 展示应用详情和 API Key 管理，通过 `api.app.*` 与 `usePermissions` 协调。

### components/

- `auth/auth-context.tsx`：定义 `AuthProvider`。内部 reducer 管理 `AuthState`，封装登录/登出/刷新，并调用 `lib/auth` 中的 API 包装函数；`hooks/use-auth.ts` 仅 re-export 该 context。
- `ui/` 与 `table/`：改造自 shadcn/ui（受 `components.json` 支持），作为 Tailwind 的封装原子，例如 `button.tsx`、`tabs.tsx`、`table-header.tsx`。

### hooks/

- `use-auth.ts`：转发 `AuthContext`，避免跨层级多次导入。
- `use-permissions.ts`：组合 `useAuth` 与 `lib/permissions` 暴露的 `normalizeRole`、`canManage*` 方法，生成布尔能力图供页面按需控制按钮/路由。

### lib/

- `api.ts`：集中定义 `apiRequest`，设置 `API_BASE_URL`、cookie 凭证策略，统一 401 → `redirectToLogin`，并在结尾导出 `accountApi/appApi/...`。页面只与这些语义化方法交互以减少重复 fetch。
- `auth.ts`：二次封装账户 API，提供 `login`, `loginWithPassword`, `loginWithToken`, `getCurrentUser`, `logout`，并输出 `AuthState` 类型。
- `permissions.ts`：权限判断方法。
- `utils.ts`：`cn`（Tailwind class 合并）、`fotmatDateString`、`redirectToLogin` 等通用工具。

### types/

集中描述领域模型及接口约束 (`api-result.ts`)。

### 其他资产

- `public/`：Next.js 静态素材（logos、icons）。
- `openapi.json`：对应 Server 端的 API 定义，可供前端或文档生成使用。

## 模块依赖关系

- `app/*` 页面依赖 `app/components/layout` 提供的布局、`components/auth` 提供的上下文，借助 `hooks/use-auth` 和 `hooks/use-permissions` 读取状态；页面中的数据操作统一调用 `lib/api`。
- `components/auth` 内部调用 `lib/auth`，后者又依赖 `lib/api` 与 `types/account`，形成 “API 封装 → AuthProvider → 页面/Hook” 的链路。
- `components/app` → `lib/api/*` → `types/app`，同时 `Sidebar` 使用 `types/menu` 的枚举定义，保证路由与 UI 一致。
- `lib/permissions` 与 `hooks/use-permissions` 围绕角色的枚举工作，使权限判定与 UI 控制解耦。
- 配置层 (`next.config.ts`, `tsconfig.json`) 定义了 `@/*` 路径别名与 Tailwind pipeline，供上述模块共享。

## 设计与约定

- 采用 Next.js App Router 与 React Server Components，页面/布局普遍用 `'use client'` 声明以获得状态能力。
- 通过 Context (AuthContext) 管理跨路由状态，避免 prop drilling；`hooks` 目录仅暴露语义化钩子。
- 所有网络调用集中在 `lib/api.ts`，并统一返回 `ApiResult<T>`，简化错误/401 处理。

```typescript
export interface ApiResult<T> {
  code: number
  title?: string
  detail?: string
  data?: T
}
```

- UI 组件体系基于 Tailwind + shadcn，结构上区分 `layout`（页面骨架）与 `ui`（原子组件），并用 `components.json` 记录源。
- 类型与菜单配置分离于 `types/`，使 GraphQL/REST 模型、枚举与菜单/权限在 TS 层有单一事实来源。