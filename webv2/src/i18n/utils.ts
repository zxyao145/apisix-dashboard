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
 * i18n Utilities
 *
 * Helper functions and utilities for internationalization
 */

import { type Locale, locales, defaultLocale } from './request';

/**
 * Validates if a locale is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Gets a valid locale from a string, falling back to default if invalid
 */
export function getValidLocale(locale: string | undefined): Locale {
  if (!locale || !isValidLocale(locale)) {
    return defaultLocale;
  }
  return locale;
}

/**
 * Gets the locale from a pathname
 * @param pathname - The URL pathname
 * @returns The locale extracted from the pathname, or default locale
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }

  return defaultLocale;
}

/**
 * Constructs a localized path
 * @param locale - The target locale
 * @param path - The path without locale prefix
 * @returns The full localized path
 */
export function getLocalizedPath(locale: Locale, path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${locale}/${cleanPath}`;
}

/**
 * Switches locale in a pathname
 * @param pathname - Current pathname
 * @param newLocale - Target locale
 * @returns Pathname with new locale
 */
export function switchLocaleInPathname(
  pathname: string,
  newLocale: Locale
): string {
  const currentLocale = getLocaleFromPathname(pathname);
  return pathname.replace(`/${currentLocale}`, `/${newLocale}`);
}

/**
 * Gets browser locale preference
 * Returns the first supported locale from browser preferences, or default
 */
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }

  const browserLocales = window.navigator.languages || [
    window.navigator.language,
  ];

  for (const browserLocale of browserLocales) {
    // Check exact match
    if (isValidLocale(browserLocale)) {
      return browserLocale;
    }

    // Check language code only (e.g., 'en' from 'en-GB')
    const languageCode = browserLocale.split('-')[0];
    const matchingLocale = locales.find((locale) =>
      locale.startsWith(languageCode)
    );

    if (matchingLocale) {
      return matchingLocale;
    }
  }

  return defaultLocale;
}

/**
 * Format a date according to locale
 */
export function formatDate(
  date: Date | string | number,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format a number according to locale
 */
export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format a relative time according to locale
 */
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: Locale,
  options?: Intl.RelativeTimeFormatOptions
): string {
  return new Intl.RelativeTimeFormat(locale, options).format(value, unit);
}
