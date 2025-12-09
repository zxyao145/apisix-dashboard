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
 * APISIX Dashboard Type Definitions
 *
 * This package exports comprehensive TypeScript type definitions for the APISIX Dashboard.
 * All types are organized by resource type for better maintainability and clarity.
 *
 * Usage:
 * import { RouteResponse, UpstreamRequest } from '@/types';
 */

// Common types used across all resources
export * from './common';

// Resource-specific types
export * from './route';
export * from './upstream';
export * from './service';
export * from './consumer';
export * from './ssl';
export * from './plugin';
export * from './plugin-template';
export * from './proto';
export * from './label';
export * from './api';
