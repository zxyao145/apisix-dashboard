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
import { Consumer } from '@/types/consumer';

/**
 * Consumer list request parameters
 */
export interface ConsumerListParams extends ListParams {
  username?: string;
}

/**
 * Fetch paginated consumer list
 */
export const fetchList = async (params: ConsumerListParams = {}) => {
  const { page = 1, page_size = 10, ...rest } = params;

  const response = await client.get<PaginatedResponse<Consumer>>('/consumers', {
    params: {
      username: rest.username,
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
 * Fetch single consumer by username
 */
export const fetchItem = async (username: string): Promise<Consumer> => {
  const response = await client.get<ApiResponse<Consumer>>(`/consumers/${username}`);
  return response.data!;
};

/**
 * Create a new consumer
 */
export const create = async (data: Partial<Consumer>): Promise<ApiResponse<Consumer>> => {
  return client.put('/consumers', data);
};

/**
 * Update an existing consumer
 */
export const update = async (
  username: string,
  data: Partial<Consumer>,
): Promise<ApiResponse<Consumer>> => {
  return client.put(`/consumers/${username}`, data);
};

/**
 * Delete a consumer
 */
export const remove = async (username: string): Promise<ApiResponse<void>> => {
  return client.delete(`/consumers/${username}`);
};
