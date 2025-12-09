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
 * Label for organizing and grouping resources
 * Labels are key-value pairs used to organize routes, services, upstreams, etc.
 */
export interface Label {
  key: string;
  value: string;
}

/**
 * Label collection - object with key-value pairs
 */
export interface LabelCollection {
  [key: string]: string;
}

/**
 * Label response format - array of label objects
 */
export interface LabelResponse {
  [key: string]: string[];
}

/**
 * Request format for updating labels
 */
export interface UpdateLabelsRequest {
  labels: LabelCollection;
}

/**
 * Possible label values for common label keys
 */
export interface CommonLabelValues {
  version?: string[];
  environment?: string[];
  team?: string[];
  [key: string]: string[] | undefined;
}

/**
 * Parsed label data for internal use
 */
export interface ParsedLabel {
  key: string;
  value: string;
}

/**
 * Label filter for queries
 */
export interface LabelFilter {
  key: string;
  values: string[];
  operator?: 'OR' | 'AND';
}

/**
 * Label selector for resource filtering
 */
export interface LabelSelector {
  matchLabels?: LabelCollection;
  matchExpressions?: LabelSelectorRequirement[];
}

/**
 * Label selector requirement
 */
export interface LabelSelectorRequirement {
  key: string;
  operator: 'In' | 'NotIn' | 'Exists' | 'DoesNotExist';
  values?: string[];
}

/**
 * Label group for displaying related labels
 */
export interface LabelGroup {
  name: string;
  labels: Label[];
}

/**
 * Helper type for label-related operations
 */
export type LabelKey = string;
export type LabelValue = string;

/**
 * Version label (commonly used)
 */
export type VersionLabel = string;

/**
 * Environment label (commonly used)
 */
export type EnvironmentLabel = 'dev' | 'test' | 'staging' | 'production' | string;

/**
 * Team/Owner label (commonly used)
 */
export type TeamLabel = string;
