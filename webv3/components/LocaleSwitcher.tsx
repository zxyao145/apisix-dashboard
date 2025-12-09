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
 * Locale Switcher Component
 *
 * A reusable component for switching between supported locales.
 * Displays locale options in a select dropdown and updates the URL path.
 */

'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, localeLabels, type Locale } from '@/i18n/request';

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;

  const switchLocale = (newLocale: Locale) => {
    // Replace current locale in pathname
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
    const newPathname = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPathname);
  };

  return (
    <select
      onChange={(e) => switchLocale(e.target.value as Locale)}
      value={currentLocale}
      className="rounded border border-gray-300 px-2 py-1 text-sm"
      aria-label="Select language"
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {localeLabels[locale]}
        </option>
      ))}
    </select>
  );
}
