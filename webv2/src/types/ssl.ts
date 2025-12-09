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

import { BaseEntity, EntityStatus } from './common';

/**
 * SSL certificate entity for API request
 */
export interface SSLRequest extends BaseEntity {
  snis: string[];
  cert: string;
  key: string;
  certs?: string[];
  keys?: string[];
}

/**
 * SSL certificate entity for API response
 */
export interface SSLResponse extends BaseEntity {
  id: string;
  cert: string;
  snis: string[];
  status: EntityStatus;
  create_time: number;
  update_time: number;
  validity_start?: number;
  validity_end?: number;
}

/**
 * SSL certificate with validity information
 */
export interface SSLCertificate extends SSLResponse {
  validity_start?: number;
  validity_end?: number;
}

/**
 * Public key upload success response
 */
export interface SSLPublicKeyUploadResponse {
  cert: string;
  publicKeyList: string[];
}

/**
 * Private key upload success response
 */
export interface SSLPrivateKeyUploadResponse {
  key: string;
  privateKeyList: string[];
}

/**
 * Key pair verification response from API
 */
export interface SSLKeyPairVerificationResponse {
  code: string;
  msg: string;
  data: {
    id: string;
    create_time: number;
    update_time: number;
    validity_start: number;
    validity_end: number;
    snis: string[];
    status: EntityStatus;
  };
}

/**
 * SSL certificate form data for UI
 */
export interface SSLFormData {
  id?: string;
  snis: string[];
  cert: string;
  key: string;
}

/**
 * Certificate information extracted from cert
 */
export interface CertificateInfo {
  subject: string;
  issuer: string;
  notBefore: Date;
  notAfter: Date;
  validityStart: number;
  validityEnd: number;
  isValid: boolean;
  daysUntilExpiry: number;
  serialNumber: string;
  fingerprint: string;
}

/**
 * SSL upload file type
 */
export interface SSLUploadFile {
  name: string;
  url: string;
  status: 'done' | 'error' | 'uploading';
  response?: {
    cert?: string;
    key?: string;
  };
}

/**
 * SSL verification result
 */
export interface SSLVerifyResult {
  validity_start: number;
  validity_end: number;
  snis: string[];
}

/**
 * Type alias for SSL entity (combines request and response)
 */
export type SSL = SSLRequest | SSLResponse | SSLCertificate;
