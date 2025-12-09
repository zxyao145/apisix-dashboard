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
import { Service } from '@/types/service';

/**
 * Service list request parameters
 */
export interface ServiceListParams extends ListParams {
  id?: string;
  desc?: string;
}

/**
 * Fetch paginated service list
 */
export const fetchList = async (params: ServiceListParams = {}) => {
  const { page = 1, page_size = 10, ...rest } = params;

  const response = await client.get<PaginatedResponse<Service>>('/services', {
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
 * Fetch single service by ID
 */
export const fetchItem = async (id: string | number): Promise<Service> => {
  const response = await client.get<ApiResponse<Service>>(`/services/${id}`);
  return response.data!;
};

/**
 * Create a new service
 */
export const create = async (data: Partial<Service>): Promise<ApiResponse<Service>> => {
  return client.post('/services', data);
};

/**
 * Update an existing service
 */
export const update = async (
  id: string,
  data: Partial<Service>,
): Promise<ApiResponse<Service>> => {
  return client.put(`/services/${id}`, data);
};

/**
 * Delete a service
 */
export const remove = async (id: string): Promise<ApiResponse<void>> => {
  return client.delete(`/services/${id}`);
};
