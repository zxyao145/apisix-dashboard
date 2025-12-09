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
 * Settings API
 *
 * Settings are stored in localStorage for the dashboard configuration.
 */

export interface DashboardSettings {
  grafanaURL?: string;
  theme?: 'light' | 'dark' | 'auto';
  language?: 'en-US' | 'zh-CN' | 'tr-TR';
  [key: string]: any;
}

const SETTINGS_KEY = 'APISIX_DASHBOARD_SETTINGS';

/**
 * Get all dashboard settings
 */
export const getSettings = async (): Promise<DashboardSettings> => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const settingsStr = localStorage.getItem(SETTINGS_KEY);
    if (!settingsStr) {
      return {};
    }
    return JSON.parse(settingsStr);
  } catch (error) {
    console.error('Failed to parse settings:', error);
    return {};
  }
};

/**
 * Update dashboard settings
 */
export const updateSettings = async (settings: Partial<DashboardSettings>): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }

  const currentSettings = await getSettings();
  const newSettings = { ...currentSettings, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
};

/**
 * Get a specific setting value
 */
export const getSetting = async <T = any>(key: string, defaultValue?: T): Promise<T | undefined> => {
  const settings = await getSettings();
  return settings[key] !== undefined ? settings[key] : defaultValue;
};

/**
 * Set a specific setting value
 */
export const setSetting = async (key: string, value: any): Promise<void> => {
  await updateSettings({ [key]: value });
};

/**
 * Clear all dashboard settings
 */
export const clearSettings = async (): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(SETTINGS_KEY);
};

/**
 * Update monitoring URL (legacy compatibility)
 */
export const updateMonitorURL = async (url: string): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('GLOBAL_SETTING_GRAFANA_URL', url);
  await setSetting('grafanaURL', url);
};
