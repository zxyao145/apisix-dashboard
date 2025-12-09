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
import { Route, RouteStatus } from '@/types/route';
import { Label } from '@/types/label';

/**
 * Route list request parameters
 */
export interface RouteListParams extends ListParams {
  uri?: string;
  labels?: string[];
  API_VERSION?: string[];
  host?: string;
  id?: string;
  desc?: string;
  status?: RouteStatus;
}

/**
 * Route debug request
 */
export interface RouteDebugRequest {
  url: string;
  request_protocol?: string;
  method?: string;
  body_params?: any;
  header_params?: Record<string, string>;
}

/**
 * Fetch paginated route list
 */
export const fetchList = async (params: RouteListParams) => {
  const { page = 1, page_size = 10, labels = [], API_VERSION = [], ...rest } = params;

  const response = await client.get<PaginatedResponse<Route>>('/routes', {
    params: {
      name: rest.name,
      uri: rest.uri,
      label: labels.concat(API_VERSION).join(','),
      page,
      page_size,
      status: rest.status,
      host: rest.host,
      desc: rest.desc,
      id: rest.id,
    },
  });

  return {
    data: response.rows,
    total: response.total_size,
  };
};

/**
 * Fetch single route by ID
 */
export const fetchItem = async (id: string | number): Promise<Route> => {
  const response = await client.get<ApiResponse<Route>>(`/routes/${id}`);
  return response.data!;
};

/**
 * Create a new route
 */
export const create = async (data: Partial<Route>): Promise<ApiResponse<Route>> => {
  return client.post('/routes', data);
};

/**
 * Update an existing route
 */
export const update = async (id: string, data: Partial<Route>): Promise<ApiResponse<Route>> => {
  return client.put(`/routes/${id}`, data);
};

/**
 * Delete route(s)
 */
export const remove = async (ids: string | string[]): Promise<ApiResponse<void>> => {
  const idList = Array.isArray(ids) ? ids.join(',') : ids;
  return client.delete(`/routes/${idList}`);
};

/**
 * Update route status (enable/disable)
 */
export const updateRouteStatus = async (
  id: string,
  status: RouteStatus,
): Promise<ApiResponse<void>> => {
  return client.patch(`/routes/${id}`, { status });
};

/**
 * Check if route name is unique
 */
export const checkUniqueName = async (
  name: string,
  exclude?: string,
): Promise<ApiResponse<boolean>> => {
  const params: Record<string, string> = { name };
  if (exclude) {
    params.exclude = exclude;
  }

  return client.get('/notexist/routes', { params });
};

/**
 * Fetch route label list
 */
export const fetchLabelList = async (): Promise<Label[]> => {
  const response = await client.get<ApiResponse<PaginatedResponse<Label>>>('/labels/route');
  return response.data!.rows;
};

/**
 * Check if hosts have SSL certificates
 */
export const checkHostWithSSL = async (hosts: string[]): Promise<ApiResponse<any>> => {
  return client.post('/check_ssl_exists', { hosts });
};

/**
 * Debug route - test route forwarding
 */
export const debugRoute = async (
  headers: Record<string, string>,
  data: RouteDebugRequest,
): Promise<ApiResponse<any>> => {
  return client.post('/debug-request-forwarding', data, { headers });
};

/**
 * Fetch upstream by ID (for route configuration)
 */
export const fetchUpstreamItem = async (
  id: string,
): Promise<{
  upstreamHostList: any[];
  timeout: any;
  upstream_id: string;
}> => {
  const response = await client.get<any>(`/upstreams/${id}`);
  return {
    upstreamHostList: response.nodes || [],
    timeout: response.timeout,
    upstream_id: response.id,
  };
};

/**
 * Fetch service list (for route configuration)
 */
export const fetchServiceList = async () => {
  const response = await client.get<ApiResponse<PaginatedResponse<any>>>('/services');
  return {
    data: response.data!.rows,
    total: response.data!.total_size,
  };
};

/**
 * Import routes from file (OpenAPI, etc.)
 */
export const importRoutes = async (formData: FormData): Promise<ApiResponse<any>> => {
  return client.post('/import/routes', formData, { requestType: 'form' });
};

/**
 * Export routes
 */
export const exportRoutes = async (ids?: string[]): Promise<Blob> => {
  const params = ids ? { ids: ids.join(',') } : {};
  return client.get('/export/routes', { params });
};
