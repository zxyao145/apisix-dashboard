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
 * Dashboard/Metrics API
 *
 * Note: The original implementation only had getGrafanaURL which reads from localStorage.
 * This module provides that functionality along with potential future dashboard metrics.
 */

/**
 * Get Grafana monitoring URL from local storage
 */
export const getGrafanaURL = async (): Promise<string> => {
  if (typeof window === 'undefined') {
    return '';
  }
  return localStorage.getItem('GLOBAL_SETTING_GRAFANA_URL') || '';
};

/**
 * Update Grafana monitoring URL in local storage
 */
export const updateGrafanaURL = async (url: string): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('GLOBAL_SETTING_GRAFANA_URL', url);
};

/**
 * Clear Grafana URL from local storage
 */
export const clearGrafanaURL = async (): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem('GLOBAL_SETTING_GRAFANA_URL');
};
