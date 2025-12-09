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
import { ApiResponse, PaginatedResponse } from '@/types/api';

/**
 * APISIX Server Node Information
 */
export interface ServerNode {
  id: string;
  hostname: string;
  up_time: number;
  boot_time: number;
  etcd_version: string;
  version: string;
  [key: string]: any;
}

/**
 * Dashboard Version Information
 */
export interface DashboardInfo {
  version: string;
  hash?: string;
  [key: string]: any;
}

/**
 * Fetch list of APISIX server nodes
 */
export const fetchInfoList = async (): Promise<ServerNode[]> => {
  const response = await client.get<ApiResponse<PaginatedResponse<ServerNode>>>('/server_info');
  return response.data!.rows;
};

/**
 * Fetch dashboard version information
 */
export const fetchVersion = async (): Promise<DashboardInfo> => {
  const response = await client.get<ApiResponse<DashboardInfo>>('/tool/version');
  return response.data!;
};

/**
 * Fetch combined server information (nodes + version)
 */
export const fetchServerInfo = async (): Promise<{
  nodes: ServerNode[];
  dashboard: DashboardInfo;
}> => {
  const [nodes, dashboard] = await Promise.all([fetchInfoList(), fetchVersion()]);

  return {
    nodes,
    dashboard,
  };
};
