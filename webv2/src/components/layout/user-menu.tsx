"use client";

import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const initials = (name?: string) =>
  name
    ?.split(" ")
    .map((piece) => piece[0])
    .join("")
    .toUpperCase() || "A";

const UserMenu = () => {
  const { user, signOut } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full px-2 py-1 outline-none transition hover:bg-muted">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
          <AvatarFallback>{initials(user?.name)}</AvatarFallback>
        </Avatar>
        <div className="hidden text-left leading-tight md:block">
          <p className="text-sm font-semibold">{user?.name ?? "APISIX User"}</p>
          <p className="text-xs text-muted-foreground">{user?.access ?? "admin"}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Signed in
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex w-full items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => {
            signOut();
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
