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
 * APISIX Dashboard Plugin Template Types
 *
 * Plugin templates allow storing and reusing plugin configurations across routes
 */

import { BaseEntity, LabelRecord } from './common';
import { PluginConfig, PluginName } from './plugin';

/**
 * Plugin template entity for API request
 */
export interface PluginTemplateRequest extends BaseEntity {
  desc?: string;
  labels?: LabelRecord;
  plugins: Record<PluginName, PluginConfig>;
}

/**
 * Plugin template entity for API response
 */
export interface PluginTemplateResponse extends BaseEntity {
  id: string;
  desc?: string;
  labels?: LabelRecord;
  plugins: Record<PluginName, PluginConfig>;
  update_time?: number;
}

/**
 * Plugin template form data for UI
 */
export interface PluginTemplateFormData {
  id?: string;
  desc?: string;
  labels?: LabelRecord;
  plugins: Record<PluginName, PluginConfig>;
}
