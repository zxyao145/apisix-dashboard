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
 * APISIX Dashboard API Client
 *
 * This module provides a comprehensive, type-safe API client for interacting
 * with the Apache APISIX Dashboard backend API.
 */

// Core client
export { default as client, HttpClient, ApiError } from './client';

// Resource APIs
export * as routes from './routes';
export * as upstreams from './upstreams';
export * as services from './services';
export * as consumers from './consumers';
export * as ssl from './ssl';
export * as plugins from './plugins';
export * as pluginTemplates from './plugin-templates';
export * as protos from './protos';
export * as dashboard from './dashboard';
export * as settings from './settings';
export * as serverInfo from './server-info';

// Re-export commonly used types
export type {
  RouteListParams,
  RouteDebugRequest,
} from './routes';

export type {
  UpstreamListParams,
} from './upstreams';

export type {
  ServiceListParams,
} from './services';

export type {
  ConsumerListParams,
} from './consumers';

export type {
  SSLListParams,
} from './ssl';

export type {
  SchemaType,
} from './plugins';

export type {
  PluginTemplateListParams,
} from './plugin-templates';

export type {
  ProtoListParams,
} from './protos';

export type {
  DashboardSettings,
} from './settings';

export type {
  ServerNode,
  DashboardInfo,
} from './server-info';
