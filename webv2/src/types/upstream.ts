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
 * Upstream load balancing algorithm types
 * 'roundrobin' - round robin (default)
 * 'chash' - consistent hash
 * 'ewma' - exponentially weighted moving average
 * 'least_conn' - least connections
 */
export type UpstreamType = 'roundrobin' | 'chash' | 'ewma' | 'least_conn';

/**
 * Service discovery types for dynamic upstream discovery
 */
export type UpstreamDiscoveryType = 'dns' | 'consul' | 'consul_kv' | 'nacos' | 'eureka';

/**
 * Upstream node representing a backend server
 */
export interface UpstreamNode {
  host: string;
  port: number;
  weight: number;
  priority?: number;
}

/**
 * Upstream node in simplified format (host:port => weight)
 */
export type UpstreamNodeMap = Record<string, number>;

/**
 * Timeout configuration for upstream connections (in seconds)
 */
export interface UpstreamTimeout {
  connect: number;
  send: number;
  read: number;
}

/**
 * TLS configuration for upstream HTTPS connections
 */
export interface UpstreamTLS {
  client_cert: string;
  client_key: string;
}

/**
 * Keepalive pool configuration for connection reuse
 */
export interface UpstreamKeepalivePool {
  size?: number;
  idle_timeout?: number;
  requests?: number;
}

/**
 * Service discovery arguments for dynamic discovery
 */
export interface UpstreamDiscoveryArgs {
  group_name?: string;
  namespace_id?: string;
  [key: string]: any;
}

/**
 * Active health check configuration
 * Proactively checks upstream health at intervals
 */
export interface UpstreamActiveHealthCheck {
  timeout?: number;
  http_path: string;
  host: string;
  healthy: {
    interval: number;
    successes: number;
  };
  unhealthy: {
    interval: number;
    http_failures: number;
  };
  req_headers?: string[];
  port?: number;
  type?: 'http' | 'tcp' | 'grpc';
}

/**
 * Passive health check configuration
 * Checks health based on request/response results
 */
export interface UpstreamPassiveHealthCheck {
  healthy: {
    http_statuses: number[];
    successes: number;
  };
  unhealthy: {
    http_statuses: number[];
    http_failures: number;
    tcp_failures: number;
  };
}

/**
 * Complete health check configuration with active and passive checks
 */
export interface UpstreamHealthCheck {
  active?: UpstreamActiveHealthCheck;
  passive?: UpstreamPassiveHealthCheck;
}

/**
 * K8S deployment information for service discovery
 */
export interface UpstreamK8SDeploymentInfo {
  namespace: string;
  deploy_name: string;
  service_name: string;
  backend_type: string;
  port: number;
}

/**
 * Pass host configuration for upstream requests
 * 'pass' - pass original request host
 * 'node' - use backend node address
 * 'rewrite' - rewrite to specific host
 */
export type UpstreamPassHost = 'pass' | 'node' | 'rewrite';

/**
 * Hash key configuration for consistent hash
 * 'vars' - hash based on variables
 * 'header' - hash based on header value
 * 'cookie' - hash based on cookie value
 * 'consumer' - hash based on consumer
 */
export type UpstreamHashOn = 'vars' | 'header' | 'cookie' | 'consumer';

/**
 * Upstream request body for API
 */
export interface UpstreamRequest extends BaseEntity {
  upstream_id?: string;
  type: UpstreamType;
  upstream_type?: string;
  name?: string;
  desc?: string;
  discovery_type?: UpstreamDiscoveryType;
  service_name?: string;
  discovery_args?: UpstreamDiscoveryArgs;
  nodes?: UpstreamNode[] | UpstreamNodeMap;
  hash_on?: UpstreamHashOn;
  key?: string;
  checks?: UpstreamHealthCheck;
  retries?: number;
  retry_timeout?: number;
  enable_websocket?: boolean;
  timeout?: UpstreamTimeout;
  pass_host?: UpstreamPassHost;
  pass_host_value?: string;
  scheme?: 'http' | 'https' | 'grpc' | 'grpcs';
  upstream_host?: string;
  tls?: UpstreamTLS;
  keepalive_pool?: UpstreamKeepalivePool;
}

/**
 * Upstream response body from API
 */
export interface UpstreamResponse extends BaseEntity {
  id: string;
  upstream_id?: string;
  type: UpstreamType;
  upstream_type?: string;
  name?: string;
  desc?: string;
  discovery_type?: UpstreamDiscoveryType;
  service_name?: string;
  discovery_args?: UpstreamDiscoveryArgs;
  nodes?: UpstreamNode[] | UpstreamNodeMap;
  hash_on?: UpstreamHashOn;
  key?: string;
  checks?: UpstreamHealthCheck;
  retries?: number;
  retry_timeout?: number;
  enable_websocket?: boolean;
  timeout?: UpstreamTimeout;
  pass_host?: UpstreamPassHost;
  pass_host_value?: string;
  scheme?: 'http' | 'https' | 'grpc' | 'grpcs';
  upstream_host?: string;
  tls?: UpstreamTLS;
  keepalive_pool?: UpstreamKeepalivePool;
}

/**
 * Simplified upstream data for components
 * Used in route and service creation forms
 */
export interface UpstreamComponentData {
  nodes?: UpstreamNode[] | UpstreamNodeMap;
  retries?: number;
  timeout?: UpstreamTimeout;
  tls?: UpstreamTLS;
  type?: string;
  checks?: {
    active?: UpstreamActiveHealthCheck;
    passive?: UpstreamPassiveHealthCheck;
  };
  hash_on?: string;
  key?: string;
  scheme?: string;
  discovery_type?: string;
  pass_host?: string;
  upstream_host?: string;
  name?: string;
  desc?: string;
  service_name?: string;
  id?: string;
  upstream_id?: string;
  upstream_type?: string;
  // Custom field for UI state
  custom?: Record<string, any>;
}
