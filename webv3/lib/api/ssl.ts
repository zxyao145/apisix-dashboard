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
import { SSL, SSLVerifyResult } from '@/types/ssl';

/**
 * SSL list request parameters
 */
export interface SSLListParams extends ListParams {
  sni?: string;
  status?: number;
}

/**
 * Fetch paginated SSL certificate list
 */
export const fetchList = async (params: SSLListParams = {}) => {
  const { page = 1, page_size = 10, ...rest } = params;

  const response = await client.get<PaginatedResponse<SSL>>('/ssl', {
    params: {
      page,
      page_size,
      ...rest,
    },
  });

  return {
    data: response.rows,
    total: response.total_size,
  };
};

/**
 * Fetch single SSL certificate by ID
 */
export const fetchItem = async (id: string): Promise<SSL> => {
  const response = await client.get<ApiResponse<SSL>>(`/ssl/${id}`);
  return response.data!;
};

/**
 * Create a new SSL certificate
 */
export const create = async (data: Partial<SSL>): Promise<ApiResponse<SSL>> => {
  return client.post('/ssl', data);
};

/**
 * Update an existing SSL certificate
 */
export const update = async (id: string, data: Partial<SSL>): Promise<ApiResponse<SSL>> => {
  return client.put(`/ssl/${id}`, data);
};

/**
 * Delete an SSL certificate
 */
export const remove = async (id: string): Promise<ApiResponse<void>> => {
  return client.delete(`/ssl/${id}`);
};

/**
 * Verify SSL certificate and key pair
 */
export const verifyKeyPair = async (
  cert: string,
  key: string,
): Promise<ApiResponse<SSLVerifyResult>> => {
  return client.post('/check_ssl_cert', { cert, key });
};
