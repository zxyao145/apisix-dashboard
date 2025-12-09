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

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ name: string; path?: string }>;
  extra?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  extra,
  className,
}: PageHeaderProps) {
  const pathname = usePathname();
  const t = useTranslations('menu');

  // Auto-generate breadcrumbs from pathname if not provided
  const generatedBreadcrumbs = React.useMemo(() => {
    if (breadcrumbs) return breadcrumbs;

    const segments = pathname.split('/').filter(Boolean);
    const crumbs = [{ name: t('home'), path: '/' }];

    segments.forEach((segment, index) => {
      if (segment.match(/^[a-z]{2}-[A-Z]{2}$/)) return; // Skip locale segment

      const path = '/' + segments.slice(0, index + 1).join('/');
      crumbs.push({
        name: t(segment) || segment,
        path: index === segments.length - 1 ? undefined : path,
      });
    });

    return crumbs;
  }, [pathname, breadcrumbs, t]);

  return (
    <div className={cn('mb-6', className)}>
      {/* Breadcrumbs */}
      {generatedBreadcrumbs && generatedBreadcrumbs.length > 0 && (
        <nav className="mb-2 flex items-center space-x-2 text-sm text-muted-foreground">
          {generatedBreadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              {crumb.path ? (
                <Link
                  href={crumb.path}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.name}
                </Link>
              ) : (
                <span className="text-foreground font-medium">
                  {crumb.name}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title and Actions */}
      <div className="flex items-start justify-between">
        <div>
          {title && (
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          )}
          {description && (
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {extra && <div className="flex items-center gap-2">{extra}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
