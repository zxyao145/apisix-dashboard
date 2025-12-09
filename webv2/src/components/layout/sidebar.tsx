"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

import { menuItems } from "@/lib/menu";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="relative flex w-64 flex-col border-r border-border/70 bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border/70 px-4">
        <Image
          src="/logo.svg"
          alt="APISIX"
          width={32}
          height={32}
          className="h-8 w-8"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">APISIX Dashboard</span>
          <span className="text-[11px] text-muted-foreground">Cloud-Native API Gateway</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={twMerge(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground",
                  )}
                >
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                  <span className="capitalize">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
