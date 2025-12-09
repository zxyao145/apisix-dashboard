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

import {
  LayoutDashboard,
  Route,
  Network,
  Settings,
  Users,
  FileText,
  Plug,
  Shield,
  Info,
  type LucideIcon,
} from 'lucide-react';

export interface MenuItem {
  name: string;
  path: string;
  icon: LucideIcon | string;
  children?: MenuItem[];
}

export const MENU_DATA: MenuItem[] = [
  {
    name: 'dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'routes',
    path: '/routes/list',
    icon: Route,
  },
  {
    name: 'upstream',
    path: '/upstream/list',
    icon: Network,
  },
  {
    name: 'service',
    path: '/service/list',
    icon: Settings,
  },
  {
    name: 'consumer',
    path: '/consumer/list',
    icon: Users,
  },
  {
    name: 'proto',
    path: '/proto/list',
    icon: FileText,
  },
  {
    name: 'plugin',
    path: '/plugin/list',
    icon: Plug,
  },
  {
    name: 'ssl',
    path: '/ssl/list',
    icon: Shield,
  },
  {
    name: 'serverinfo',
    path: '/serverinfo',
    icon: Info,
  },
];

export const CODE_MESSAGE: Record<number, string> = {
  200: 'The server successfully returned the requested data.',
  201: 'New or modified data is successful.',
  202: 'A request has entered the background queue (asynchronous task).',
  204: 'Data deleted successfully.',
  400: 'There was an error in the request sent, and the server did not create or modify data.',
  401: 'User does not have permission (wrong token, username, password).',
  403: 'The user is authorized, but access is forbidden.',
  404: 'The request sent was for a record that did not exist.',
  406: 'The requested format is not available.',
  410: 'The requested resource is permanently deleted and will not be obtained again.',
  422: 'When creating an object, a validation error occurred.',
  500: 'An error occurred in the server, please check the server.',
  502: 'Gateway error.',
  503: 'The service is unavailable.',
  504: 'Gateway timeout.',
};

export const DEFAULT_GLOBAL_RULE_ID = '1';

export const DELETE_FIELDS = ['id', 'create_time', 'update_time'];
