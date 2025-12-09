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
import { Upstream } from '@/types/upstream';

/**
 * Upstream list request parameters
 */
export interface UpstreamListParams extends ListParams {
  id?: string;
  desc?: string;
}

/**
 * Fetch paginated upstream list
 */
export const fetchList = async (params: UpstreamListParams) => {
  const { page = 1, page_size = 10, ...rest } = params;

  const response = await client.get<PaginatedResponse<Upstream>>('/upstreams', {
    params: {
      id: rest.id || '',
      desc: rest.desc || '',
      name: rest.name,
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
 * Fetch single upstream by ID
 */
export const fetchItem = async (id: string): Promise<Upstream> => {
  const response = await client.get<ApiResponse<Upstream>>(`/upstreams/${id}`);
  return response.data!;
};

/**
 * Create a new upstream
 */
export const create = async (data: Partial<Upstream>): Promise<ApiResponse<Upstream>> => {
  return client.post('/upstreams', data);
};

/**
 * Update an existing upstream
 */
export const update = async (
  id: string,
  data: Partial<Upstream>,
): Promise<ApiResponse<Upstream>> => {
  return client.put(`/upstreams/${id}`, data);
};

/**
 * Delete an upstream
 */
export const remove = async (id: string): Promise<ApiResponse<void>> => {
  return client.delete(`/upstreams/${id}`);
};
