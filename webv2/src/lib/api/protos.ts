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
import { Proto } from '@/types/proto';

/**
 * Proto list request parameters
 */
export interface ProtoListParams extends ListParams {
  desc?: string;
}

/**
 * Fetch paginated proto list
 */
export const fetchList = async (params: ProtoListParams = {}) => {
  const { page = 1, page_size = 10, ...rest } = params;

  const response = await client.get<PaginatedResponse<Proto>>('/proto', {
    params: {
      desc: rest.desc,
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
 * Fetch single proto by ID
 */
export const fetchItem = async (id: string): Promise<Proto> => {
  const response = await client.get<ApiResponse<Proto>>(`/proto/${id}`);
  return response.data!;
};

/**
 * Create a new proto
 */
export const create = async (data: Partial<Proto>): Promise<ApiResponse<Proto>> => {
  return client.post('/proto', data);
};

/**
 * Update an existing proto
 */
export const update = async (id: string, data: Partial<Proto>): Promise<ApiResponse<Proto>> => {
  return client.put(`/proto/${id}`, data);
};

/**
 * Delete a proto
 */
export const remove = async (id: string): Promise<ApiResponse<void>> => {
  return client.delete(`/proto/${id}`);
};
