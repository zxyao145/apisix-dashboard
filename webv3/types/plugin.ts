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

import { BaseEntity } from './common';

/**
 * Plugin name enumeration - common plugins in APISIX
 */
export type PluginName =
  | 'api-breaker'
  | 'authz-casbin'
  | 'authz-keycloak'
  | 'aws-lambda'
  | 'azure-functions'
  | 'batch-requests'
  | 'basic-auth'
  | 'clickhouse-logger'
  | 'cors'
  | 'datadog'
  | 'echo'
  | 'error-log-logger'
  | 'ext-plugin-post-resp'
  | 'ext-plugin-post-req'
  | 'ext-plugin-pre-req'
  | 'file-logger'
  | 'forward-auth'
  | 'google-cloud-logging'
  | 'gRPC-transcode'
  | 'grpc-web'
  | 'gzip'
  | 'hmac-auth'
  | 'http-logger'
  | 'ip-restriction'
  | 'jwt-auth'
  | 'kafka-logger'
  | 'key-auth'
  | 'ldap-auth'
  | 'limit-conn'
  | 'limit-count'
  | 'limit-req'
  | 'log-rotate'
  | 'mocking'
  | 'mqtt-proxy'
  | 'node-red'
  | 'oauth2'
  | 'ocsp-stapling'
  | 'openid-connect'
  | 'opentelemetry'
  | 'openwhisk'
  | 'proxy-cache'
  | 'proxy-mirror'
  | 'proxy-rewrite'
  | 'real-ip'
  | 'referer-restriction'
  | 'request-id'
  | 'request-validation'
  | 'response-rewrite'
  | 'rocketmq-logger'
  | 'route-by-regex'
  | 'serverless-google-cloud-function'
  | 'serverless-post-function'
  | 'serverless-pre-function'
  | 'serverless-python-function'
  | 'skywalking'
  | 'skywalking-logger'
  | 'splunk-hec-logging'
  | 'statsd'
  | 'sls-logger'
  | 'syslog'
  | 'tcp-logger'
  | 'tencent-cloud-cls'
  | 'tencent-cloud-scf'
  | 'traffic-split'
  | 'ua-restriction'
  | 'uri-blocker'
  | 'wolf-rbac'
  | 'zipkin'
  | string; // Allow custom plugin names

/**
 * Plugin type enumeration
 */
export type PluginType = 'authentication' | 'security' | 'logging' | 'limit' | 'transformation' | 'other';

/**
 * Plugin schema type for validation
 */
export type PluginSchemaType = '' | 'route' | 'consumer' | 'service' | 'global';

/**
 * Plugin schema definition from APISIX
 * Describes the structure and validation rules for plugin configuration
 */
export interface PluginSchema {
  $id?: string;
  type: string;
  title?: string;
  description?: string;
  properties?: Record<string, any>;
  required?: string[];
  additionalProperties?: boolean;
  [key: string]: any;
}

/**
 * Plugin metadata from APISIX schema endpoint
 */
export interface PluginMetadata {
  name: string;
  priority: number;
  schema: PluginSchema;
  type: string;
  originType: string;
  version: number;
  consumer_schema?: PluginSchema;
  hidden?: boolean;
  [key: string]: any;
}

/**
 * Plugin configuration/instance
 */
export interface PluginConfig {
  [key: string]: any;
}

/**
 * Plugin request body for API
 */
export interface PluginRequest extends BaseEntity {
  name: PluginName;
  config: PluginConfig;
}

/**
 * Plugin response body from API
 */
export interface PluginResponse extends BaseEntity {
  id: string;
  name: PluginName;
  config: PluginConfig;
}

/**
 * Transformed plugin data for internal use
 */
export interface TransformedPlugin {
  id: string;
  name: PluginName;
  value: PluginConfig;
}

/**
 * Global plugin rules (applies to all routes)
 */
export interface GlobalPluginRule extends BaseEntity {
  id: string;
  plugins: Record<PluginName, PluginConfig>;
}

/**
 * Plugin form data for UI
 */
export interface PluginFormData {
  id?: string;
  name: PluginName;
  config: PluginConfig;
  formData?: Record<string, any>;
  monacoData?: string;
  shouldDelete?: boolean;
}

/**
 * Plugin detail values from form
 */
export interface PluginDetailValues {
  formData: any;
  monacoData: any;
  shouldDelete?: boolean;
}

/**
 * Monaco editor language for plugin configuration
 */
export type PluginEditorLanguage = 'JSON' | 'YAML' | 'Form';

/**
 * Plugin reference page context
 */
export type PluginReferencePage = '' | 'route' | 'consumer' | 'service' | 'plugin' | 'global';

/**
 * Common plugin configurations with their types

/**
 * API Breaker plugin configuration
 */
export interface APIBreakerPluginConfig {
  break_response_code?: number;
  break_response_body?: string;
  break_response_headers?: Record<string, string>;
  max_breaker_sec?: number;
  unhealthy_threshold?: number;
  healthy_threshold?: number;
  [key: string]: any;
}

/**
 * Basic Auth plugin configuration
 */
export interface BasicAuthPluginConfig {
  [key: string]: any;
}

/**
 * CORS plugin configuration
 */
export interface CORSPluginConfig {
  allow_origins?: string | string[] | Record<string, boolean>;
  allow_methods?: string[];
  allow_headers?: string[];
  expose_headers?: string[];
  max_age?: number;
  allow_credentials?: boolean;
  [key: string]: any;
}

/**
 * Limit Count plugin configuration
 */
export interface LimitCountPluginConfig {
  count: number;
  time_window: number;
  key: string;
  rejected_code?: number;
  rejected_msg?: string;
  policy?: 'local' | 'redis' | 'redis-cluster';
  redis_database?: number;
  redis_timeout?: number;
  show_limit_quota_header?: boolean;
  allow_multiple_status_codes?: boolean;
  status_code?: number[];
  [key: string]: any;
}

/**
 * Limit Req plugin configuration
 */
export interface LimitReqPluginConfig {
  rate: number;
  burst: number;
  key: string;
  rejected_code?: number;
  nodelay?: boolean;
  [key: string]: any;
}

/**
 * Limit Conn plugin configuration
 */
export interface LimitConnPluginConfig {
  conn: number;
  burst: number;
  default_conn_delay: number;
  key: string;
  rejected_code?: number;
  [key: string]: any;
}

/**
 * Proxy Mirror plugin configuration
 */
export interface ProxyMirrorPluginConfig {
  host: string;
  path?: string;
  sample_ratio?: number;
  [key: string]: any;
}

/**
 * Proxy Rewrite plugin configuration
 */
export interface ProxyRewritePluginConfig {
  uri?: string;
  method?: string;
  regex_uri?: [string, string][];
  host?: string;
  headers?: Record<string, string>;
  use_real_request_uri_instead_of_rewrite?: boolean;
  [key: string]: any;
}

/**
 * Referer Restriction plugin configuration
 */
export interface RefererRestrictionPluginConfig {
  bypass_missing?: boolean;
  whitelist?: string[];
  blacklist?: string[];
  message?: string;
  [key: string]: any;
}

/**
 * Type alias for Plugin entity
 */
export type Plugin = PluginMetadata;
