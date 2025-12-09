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

import client from './client';
import { ApiResponse, PaginatedResponse, ListParams } from '@/types/api';
import { PluginTemplate } from '@/types/plugin-template';
import { Label } from '@/types/label';

/**
 * Plugin template list request parameters
 */
export interface PluginTemplateListParams extends ListParams {
  desc?: string;
  labels?: string[];
}

/**
 * Fetch paginated plugin template list
 */
export const fetchList = async (params: PluginTemplateListParams = {}) => {
  const { page = 1, page_size = 10, labels = [], ...rest } = params;

  const response = await client.get<PaginatedResponse<PluginTemplate>>('/plugin_configs', {
    params: {
      search: rest.desc,
      label: labels.join(','),
      page,
      page_size,
    },
  });

  return {
    data: response.rows,
    total: response.total_size,
  };
};

/**
 * Fetch single plugin template by ID
 */
export const fetchItem = async (id: string): Promise<PluginTemplate> => {
  const response = await client.get<ApiResponse<PluginTemplate>>(`/plugin_configs/${id}`);
  return response.data!;
};

/**
 * Create a new plugin template
 */
export const create = async (
  data: Partial<PluginTemplate>,
): Promise<ApiResponse<PluginTemplate>> => {
  return client.post('/plugin_configs', data);
};

/**
 * Update an existing plugin template
 */
export const update = async (
  id: string,
  data: Partial<PluginTemplate>,
): Promise<ApiResponse<PluginTemplate>> => {
  return client.patch(`/plugin_configs/${id}`, data);
};

/**
 * Delete a plugin template
 */
export const remove = async (id: string): Promise<ApiResponse<void>> => {
  return client.delete(`/plugin_configs/${id}`);
};

/**
 * Fetch plugin template label list
 */
export const fetchLabelList = async (): Promise<Label[]> => {
  const response = await client.get<ApiResponse<PaginatedResponse<Label>>>(
    '/labels/plugin_config',
  );
  return response.data!.rows;
};

/**
 * Fetch all plugin templates (no pagination)
 */
export const fetchAll = async (): Promise<PluginTemplate[]> => {
  const response = await client.get<ApiResponse<PaginatedResponse<PluginTemplate>>>(
    '/plugin_configs',
  );
  return response.data!.rows;
};
