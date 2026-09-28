import React from "react";
import { cn } from "@/lib/utils";

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: "Admin" | "Editor" | "Viewer";
  color?: string;
}

export interface AvatarGroupProps {
  users: User[];
  maxCount?: number;
  className?: string;
}

export function AvatarGroup({ users, maxCount = 3, className }: AvatarGroupProps) {
  const visibleUsers = users.slice(0, maxCount);
  const remaining = users.length - maxCount;

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {visibleUsers.map((user, i) => {
        const zIndexMap: Record<number, string> = { 1: "z-10", 2: "z-20", 3: "z-30", 4: "z-40", 5: "z-50", 6: "z-[60]", 7: "z-[70]" };
        const zIndexClass = zIndexMap[visibleUsers.length - i] || "z-0";
        return (
        <div
          key={user.id}
          className={cn("relative group hover:z-50 hover:-translate-y-1 transition-transform duration-200", zIndexClass)}
          title={user.name}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className={cn(
                "w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover bg-slate-100",
                user.role === "Admin" && "ring-2 ring-purple-500 ring-offset-1",
                user.role === "Editor" && "ring-2 ring-indigo-500 ring-offset-1"
              )}
            />
          ) : (
            <div className={cn(
              "w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white uppercase",
              user.color || "bg-indigo-500"
            )}>
              {user.name.substring(0, 2)}
            </div>
          )}
        </div>
        );
      })}
      {remaining > 0 && (
        <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 z-0">
          +{remaining}
        </div>
      )}
    </div>
  );
}
