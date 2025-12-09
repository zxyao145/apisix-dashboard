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

import { BaseEntity, HttpMethod, LabelRecord, EntityStatus, RedirectConfig } from './common';

/**
 * Route matching operators
 * '==' - equal
 * '~=' - regex match
 * '>' - greater than
 * '<' - less than
 * '~~' - fuzzy match
 * '~*' - case-insensitive regex
 * 'IN' - in array
 * 'HAS' - has key
 */
export type RouteOperator = '==' | '~=' | '>' | '<' | '~~' | '~*' | 'IN' | 'HAS';

/**
 * Negation operator for route matching
 */
export type OperatorNot = '!';

/**
 * Variable tuple format: [name, operator, value] or [name, '!', operator, value]
 */
export type RouteVarTuple =
  | [string, RouteOperator, string | (string | number)[]]
  | [string, OperatorNot, RouteOperator, string | (string | number)[]];

/**
 * Variable positions for route matching
 * 'arg' - query string parameter
 * 'post_arg' - post form parameter
 * 'http' - HTTP header
 * 'cookie' - cookie value
 * 'buildin' - built-in variables (method, host, path, etc.)
 */
export type RouteVarPosition = 'arg' | 'post_arg' | 'http' | 'cookie' | 'buildin';

/**
 * Route matching rules for advanced conditions
 */
export interface RouteMatchingRule {
  position: RouteVarPosition;
  name: string;
  reverse: boolean;
  operator: RouteOperator;
  value: string | (string | number)[];
  key: string;
}

/**
 * Upstream path rewrite configuration
 */
export interface UpstreamPathRewrite {
  type?: string;
  from?: string;
  to: string;
}

/**
 * Route request body for API
 */
export interface RouteRequest extends BaseEntity {
  status: EntityStatus;
  name: string;
  labels: LabelRecord;
  desc: string;
  priority?: number;
  methods: HttpMethod[];
  uri?: string;
  uris: string[];
  host?: string;
  hosts?: string[];
  remote_addr?: string;
  remote_addrs?: string[];
  upstream?: Record<string, any>;
  vars: RouteVarTuple[];
  upstream_path?: UpstreamPathRewrite;
  upstream_id?: string;
  plugins: Record<string, any>;
  plugin_config_id?: string;
  script: Record<string, any>;
  enable_websocket?: boolean;
  service_id?: string;
  filter_func?: string;
  service_protocol?: 'grpc' | 'http';
}

/**
 * Route response body from API
 */
export interface RouteResponse extends BaseEntity {
  id: string;
  status: EntityStatus;
  name: string;
  labels: LabelRecord;
  desc?: string;
  priority?: number;
  methods: HttpMethod[];
  uri: string;
  uris?: string[];
  host: string;
  hosts?: string[];
  remote_addr?: string;
  remote_addrs?: string[];
  upstream: Record<string, any>;
  vars?: RouteVarTuple[];
  upstream_path?: UpstreamPathRewrite;
  upstream_id?: string;
  plugins: Record<string, any>;
  plugin_config_id?: string;
  script: Record<string, any>;
  enable_websocket?: boolean;
  service_id?: string;
  filter_func?: string;
}

/**
 * Route creation/edit form data (UI-specific)
 */
export interface RouteFormData {
  id?: string;
  name: string;
  desc: string;
  custom_version_label: string;
  custom_normal_labels: string[];
  priority: number;
  websocket: boolean;
  hosts: string[];
  uris: string[];
  remote_addrs: string[];
  methods: HttpMethod[];
  redirectOption: 'forceHttps' | 'customRedirect' | 'disabled';
  redirectURI?: string;
  ret_code?: number;
  status: EntityStatus;
  enable_websocket?: boolean;
  service_id: string;
  proxyRewrite: ProxyRewrite;
  URIRewriteType: number;
  hostRewriteType: number;
}

/**
 * Proxy rewrite configuration for modifying upstream requests
 */
export interface ProxyRewrite {
  scheme?: 'keep' | 'http' | 'https';
  uri?: string;
  regex_uri?: [string, string][];
  host?: string;
  method?: string;
  headers?: Record<string, string>;
}

/**
 * Key-value pair for headers
 */
export interface KeyValuePair {
  key: string;
  value: string;
}

/**
 * Route debug request for testing
 */
export interface RouteDebugRequest {
  url: string;
  request_protocol: 'https' | 'http' | 'websocket' | 'grpc';
  method: string;
  body_params?: Record<string, any>;
  header_params?: Record<string, string>;
}

/**
 * Route debug response from server
 */
export interface RouteDebugResponse {
  code: number;
  message: string;
  data: any;
  header: Record<string, string[]>;
}

/**
 * Authentication data for debugging routes
 */
export interface RouteAuthData {
  authType: string;
  username?: string;
  password?: string;
  Authorization?: string;
  apikey?: string;
}

/**
 * Debug request form data
 */
export interface DebugRequestFormData {
  check: boolean;
  key: string;
  value: any;
  type?: string;
}

/**
 * Debug body type for requests
 */
export type DebugBodyType = 'none' | 'x-www-form-urlencoded' | 'raw input' | 'form-data';

/**
 * Route status enumeration
 * 1 - enabled
 * 0 - disabled
 */
export type RouteStatus = 0 | 1;

/**
 * Request mode for route creation
 */
export type RouteRequestMode = 'Normal' | 'RawData';

/**
 * Type alias for Route entity (combines request and response)
 */
export type Route = RouteRequest | RouteResponse;
