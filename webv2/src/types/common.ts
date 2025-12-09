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
 * Common type definitions used across APISIX Dashboard
 */

// HTTP Methods as defined in APISIX
export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'PUT'
  | 'OPTIONS'
  | 'HEAD'
  | 'PATCH'
  | 'CONNECT'
  | 'TRACE'
  | 'PURGE';

// Generic API Response wrapper
export interface ApiResponse<T> {
  code: number;
  message: string;
  request_id: string;
  data: T;
}

// List API Response wrapper
export interface ApiListResponse<T> {
  rows: T[];
  total_size: number;
}

// Page operation modes
export type PageMode = 'CREATE' | 'EDIT' | 'VIEW';

// Entity status (enabled/disabled)
export type EntityStatus = 0 | 1;

// Label collection type
export interface LabelRecord {
  [key: string]: string;
}

// Base entity with common fields
export interface BaseEntity {
  id?: string;
  create_time?: number;
  update_time?: number;
}

// Request protocols
export type RequestProtocol = 'https' | 'http' | 'websocket' | 'grpc';

// Redirect configuration
export interface RedirectConfig {
  ret_code?: number;
  uri?: string;
  http_to_https?: boolean;
}
