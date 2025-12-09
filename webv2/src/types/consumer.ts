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

/**
 * Consumer entity for API request
 * Consumers represent end users/applications that access routes
 */
export interface ConsumerRequest extends BaseEntity {
  username: string;
  desc?: string;
  labels?: LabelRecord;
  plugins?: Record<string, any>;
}

/**
 * Consumer entity for API response
 */
export interface ConsumerResponse extends BaseEntity {
  id: string;
  username: string;
  desc?: string;
  labels?: LabelRecord;
  plugins?: Record<string, any>;
  update_time?: number;
}

/**
 * Consumer form data for UI
 */
export interface ConsumerFormData {
  id?: string;
  username: string;
  desc?: string;
  labels?: LabelRecord;
  plugins?: Record<string, any>;
}

/**
 * Consumer credentials/plugin configuration
 */
export interface ConsumerCredential {
  [key: string]: any;
}
