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

import { BaseEntity } from './common';

/**
 * Protocol Buffer message definition for gRPC services
 * Used to define message types for gRPC transcoding
 */
export interface ProtoMessage {
  name: string;
  fields: ProtoField[];
}

/**
 * Protocol Buffer field definition
 */
export interface ProtoField {
  name: string;
  number: number;
  type: string;
  label?: 'optional' | 'required' | 'repeated';
}

/**
 * Protocol Buffer RPC service definition
 */
export interface ProtoService {
  name: string;
  methods: ProtoMethod[];
}

/**
 * Protocol Buffer RPC method definition
 */
export interface ProtoMethod {
  name: string;
  input_type: string;
  output_type: string;
}

/**
 * Protocol definition entity for API request
 */
export interface ProtoRequest extends BaseEntity {
  content: string;
  desc?: string;
}

/**
 * Protocol definition entity for API response
 */
export interface ProtoResponse extends BaseEntity {
  id: string;
  content: string;
  desc?: string;
  create_time: number;
  update_time: number;
}

/**
 * Proto form data for UI
 */
export interface ProtoFormData {
  id?: string;
  content: string;
  desc?: string;
}

/**
 * Edit mode for proto drawer
 */
export type ProtoEditMode = 'create' | 'update';

/**
 * Parsed proto content
 */
export interface ParsedProto {
  syntax: string;
  package?: string;
  imports?: string[];
  messages: ProtoMessage[];
  services: ProtoService[];
  enums?: ProtoEnum[];
}

/**
 * Protocol Buffer enum definition
 */
export interface ProtoEnum {
  name: string;
  values: ProtoEnumValue[];
}

/**
 * Protocol Buffer enum value definition
 */
export interface ProtoEnumValue {
  name: string;
  number: number;
}
