import {
  FileText,
  Gauge,
  Info,
  Puzzle,
  Server,
  ShieldCheck,
  Shuffle,
  Users,
  Workflow,
} from "lucide-react";

import type { NavItem } from "@/types/menu";

export const menuItems: NavItem[] = [
  { name: "dashboard", path: "/dashboard", icon: Gauge },
  { name: "routes", path: "/routes/list", icon: Workflow },
  { name: "upstream", path: "/upstream/list", icon: Server },
  { name: "service", path: "/service/list", icon: Shuffle },
  { name: "consumer", path: "/consumer/list", icon: Users },
  { name: "proto", path: "/proto/list", icon: FileText },
  { name: "plugin", path: "/plugin/list", icon: Puzzle },
  { name: "ssl", path: "/ssl/list", icon: ShieldCheck },
  { name: "serverinfo", path: "/serverinfo", icon: Info },
];

export const findMenuItem = (path: string) => menuItems.find((item) => path.startsWith(item.path));
