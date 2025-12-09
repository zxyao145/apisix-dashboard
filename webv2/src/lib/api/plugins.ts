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
import { ApiResponse } from '@/types/api';
import { Plugin, PluginSchema } from '@/types/plugin';

/**
 * Plugin schema type
 */
export type SchemaType = 'route' | 'consumer' | 'global_rule';

/**
 * Plugin cache for list and schemas
 */
const pluginCache: {
  list: Plugin[] | null;
  schemas: Record<string, Record<string, PluginSchema>>;
} = {
  list: null,
  schemas: {
    route: {},
    consumer: {},
    global_rule: {},
  },
};

/**
 * Fetch all available plugins
 */
export const fetchList = async (skipCache = false): Promise<Plugin[]> => {
  if (pluginCache.list && !skipCache) {
    return pluginCache.list;
  }

  const response = await client.get<ApiResponse<Plugin[]>>('/plugins', {
    params: { all: true },
  });

  const plugins = response.data!;
  pluginCache.list = plugins;

  return plugins;
};

/**
 * Fetch plugin schema by name and schema type
 */
export const fetchSchema = async (
  name: string,
  schemaType: SchemaType = 'route',
): Promise<PluginSchema> => {
  // Check cache
  if (pluginCache.schemas[schemaType][name]) {
    return pluginCache.schemas[schemaType][name];
  }

  // Build query string
  const queryString = schemaType !== 'route' ? `?schema_type=${schemaType}` : '';

  const response = await client.get<ApiResponse<PluginSchema>>(
    `/schema/plugins/${name}${queryString}`,
  );

  let schema = response.data!;

  // Fix empty properties array issue
  if (schema.properties && JSON.stringify(schema.properties) === '[]') {
    const { properties, ...rest } = schema;
    schema = rest as PluginSchema;
  }

  // Cache schema
  pluginCache.schemas[schemaType][name] = schema;

  return schema;
};

/**
 * Clear plugin cache
 */
export const clearCache = () => {
  pluginCache.list = null;
  pluginCache.schemas = {
    route: {},
    consumer: {},
    global_rule: {},
  };
};

/**
 * Fetch all plugin schemas for a specific type
 */
export const fetchAllSchemas = async (schemaType: SchemaType = 'route'): Promise<Record<string, PluginSchema>> => {
  const plugins = await fetchList();

  const schemas: Record<string, PluginSchema> = {};

  await Promise.all(
    plugins.map(async (plugin) => {
      try {
        schemas[plugin.name] = await fetchSchema(plugin.name, schemaType);
      } catch (error) {
        console.warn(`Failed to fetch schema for plugin ${plugin.name}:`, error);
      }
    })
  );

  return schemas;
};
