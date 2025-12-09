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
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MENU_DATA } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations('menu');

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-background transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-center border-b px-4">
        {collapsed ? (
          <div className="text-xl font-bold text-primary">A</div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold text-primary">APISIX</div>
            <div className="text-sm text-muted-foreground">Dashboard</div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {MENU_DATA.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);
            const menuLabel = t(item.name);

            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    collapsed && 'justify-center px-2',
                    isActive && 'bg-primary/10 font-medium text-primary'
                  )}
                  title={collapsed ? menuLabel : undefined}
                >
                  {typeof Icon === 'string' ? (
                    <span className="h-5 w-5">{Icon}</span>
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                  {!collapsed && <span className="ml-3">{menuLabel}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Collapse Toggle Button */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          className={cn('w-full', collapsed && 'justify-center px-2')}
          onClick={() => onCollapse(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span className="ml-3">{t('close')}</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;
