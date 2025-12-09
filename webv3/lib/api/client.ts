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

import { ApiResponse } from '@/types/api';

/**
 * HTTP Client Configuration
 */
interface RequestConfig extends RequestInit {
  params?: Record<string, any>;
  data?: any;
  requestType?: 'json' | 'form';
}

interface RequestInterceptor {
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  onResponse?: <T>(response: Response, data: T) => T | Promise<T>;
  onError?: (error: any) => void | Promise<void>;
}

/**
 * API Client Error
 */
export class ApiError extends Error {
  code: number;
  response?: Response;
  data?: any;

  constructor(message: string, code: number, response?: Response, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.response = response;
    this.data = data;
  }
}

/**
 * Core HTTP Client
 */
class HttpClient {
  private baseURL: string;
  private interceptors: RequestInterceptor[] = [];

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
  }

  /**
   * Add request/response interceptor
   */
  addInterceptor(interceptor: RequestInterceptor) {
    this.interceptors.push(interceptor);
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(url: string, params?: Record<string, any>): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    if (!params) return fullURL;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${fullURL}?${queryString}` : fullURL;
  }

  /**
   * Prepare request body
   */
  private prepareBody(data: any, requestType: 'json' | 'form' = 'json'): BodyInit | undefined {
    if (!data) return undefined;

    if (data instanceof FormData) {
      return data;
    }

    if (requestType === 'form') {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });
      return formData;
    }

    return JSON.stringify(data);
  }

  /**
   * Apply request interceptors
   */
  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let modifiedConfig = config;
    for (const interceptor of this.interceptors) {
      if (interceptor.onRequest) {
        modifiedConfig = await interceptor.onRequest(modifiedConfig);
      }
    }
    return modifiedConfig;
  }

  /**
   * Apply response interceptors
   */
  private async applyResponseInterceptors<T>(response: Response, data: T): Promise<T> {
    let modifiedData = data;
    for (const interceptor of this.interceptors) {
      if (interceptor.onResponse) {
        modifiedData = await interceptor.onResponse(response, modifiedData);
      }
    }
    return modifiedData;
  }

  /**
   * Apply error interceptors
   */
  private async applyErrorInterceptors(error: any): Promise<void> {
    for (const interceptor of this.interceptors) {
      if (interceptor.onError) {
        await interceptor.onError(error);
      }
    }
  }

  /**
   * Core request method
   */
  async request<T = any>(url: string, config: RequestConfig = {}): Promise<T> {
    try {
      // Apply request interceptors
      const modifiedConfig = await this.applyRequestInterceptors(config);

      const { params, data, requestType = 'json', ...fetchOptions } = modifiedConfig;

      // Build request
      const requestURL = this.buildURL(url, params);
      const body = this.prepareBody(data, requestType);

      const headers: HeadersInit = {
        ...(fetchOptions.headers || {}),
      };

      // Set Content-Type for JSON requests
      if (data && !(data instanceof FormData) && requestType === 'json') {
        headers['Content-Type'] = 'application/json';
      }

      // Make request
      const response = await fetch(requestURL, {
        ...fetchOptions,
        headers,
        body,
      });

      // Parse response
      let responseData: any;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Handle HTTP errors
      if (!response.ok) {
        const errorMessage = responseData?.message || response.statusText || 'Request failed';
        const error = new ApiError(errorMessage, response.status, response, responseData);
        await this.applyErrorInterceptors(error);
        throw error;
      }

      // Apply response interceptors
      const finalData = await this.applyResponseInterceptors(response, responseData);

      // Log in dev mode
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] ${config.method || 'GET'} ${url}`, {
          params,
          data,
          response: finalData,
        });
      }

      return finalData;
    } catch (error) {
      if (!(error instanceof ApiError)) {
        const apiError = new ApiError(
          error instanceof Error ? error.message : 'Unknown error',
          0,
        );
        await this.applyErrorInterceptors(apiError);
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'POST', data });
  }

  /**
   * PUT request
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'PUT', data });
  }

  /**
   * PATCH request
   */
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'PATCH', data });
  }

  /**
   * DELETE request
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }
}

/**
 * Create and configure the default HTTP client instance
 */
const client = new HttpClient();

/**
 * Add default interceptors
 */

// Request interceptor - Add auth token
client.addInterceptor({
  onRequest: async (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
});

// Response interceptor - Handle API response wrapper
client.addInterceptor({
  onResponse: async <T,>(response: Response, data: any): Promise<T> => {
    // If response has the standard ApiResponse wrapper, extract data
    if (data && typeof data === 'object' && 'code' in data && 'data' in data) {
      const apiResponse = data as ApiResponse;

      // Check for error codes
      if (apiResponse.code !== 0 && apiResponse.code !== 200) {
        throw new ApiError(
          apiResponse.message || 'API request failed',
          apiResponse.code,
          response,
          data,
        );
      }

      return apiResponse.data as T;
    }

    return data as T;
  },
});

// Error interceptor - Handle authentication and show notifications
client.addInterceptor({
  onError: async (error: ApiError) => {
    // Handle 401 - Redirect to login
    if (error.code === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    // Show error notification (if toast library is available)
    if (typeof window !== 'undefined' && error.message) {
      // TODO: Integrate with your toast/notification library
      console.error('[API Error]', error.message);
    }
  },
});

export default client;
export { HttpClient };
