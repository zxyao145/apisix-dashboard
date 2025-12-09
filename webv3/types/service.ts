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

import { BaseEntity, LabelRecord } from './common';
import { UpstreamComponentData } from './upstream';

/**
 * Service entity for API request
 */
export interface ServiceRequest extends BaseEntity {
  name: string;
  desc: string;
  hosts?: string[];
  upstream?: UpstreamComponentData;
  upstream_id: string;
  labels?: LabelRecord;
  enable_websocket: boolean;
  plugins?: Record<string, any>;
}

/**
 * Service entity for API response
 */
export interface ServiceResponse extends BaseEntity {
  id: string;
  plugins?: Record<string, any>;
  upstream_id: string;
  upstream?: Record<string, any>;
  name: string;
  desc: string;
  enable_websocket: boolean;
  labels?: LabelRecord;
}

/**
 * Service display/edit form data (UI-specific)
 */
export interface ServiceFormData {
  id?: string;
  name: string;
  desc: string;
  hosts?: string[];
  upstream: UpstreamComponentData;
  upstream_id: string;
  labels?: LabelRecord;
  enable_websocket: boolean;
  plugins?: Record<string, any>;
}
