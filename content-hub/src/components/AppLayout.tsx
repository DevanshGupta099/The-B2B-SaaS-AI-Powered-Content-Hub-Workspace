"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  LayoutDashboard as Home,
  Users,
  Settings,
  FileText,
  X,
  FolderOpen,
  BarChart,
  Link as LinkIcon,
  LayoutTemplate,
  Menu,
  Bell,
  Library,
  Bot,
  CalendarDays,
  BookOpen,
  ClipboardCheck,
  ChevronDown,
  Sparkles,
  SearchCode,
  Send,
  Radio,
  Globe,
  Building2,
  Cpu,
  Layers,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface WorkspaceFolder {
  id: string;
  name: string;
  files: { id: string; name: string }[];
}

export interface AppLayoutProps {
  children: React.ReactNode;
  rightSidebarContent?: React.ReactNode;
  folders?: WorkspaceFolder[];
}

function NavItem({ icon: Icon, label, shortcut, href = "#", isActive }: { icon: React.ElementType, label: string, shortcut?: string, href?: string, isActive?: boolean }) {
  return (
    <Link href={href} className={cn(
      "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 active:scale-95 focus:outline-none group border",
      isActive 
        ? "bg-white shadow-sm text-slate-900 border-slate-200" 
        : "text-slate-600 hover:bg-white hover:shadow-sm hover:text-slate-900 border-transparent hover:border-slate-200"
    )}>
      <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-600")} />
      <span className="truncate">{label}</span>
      {shortcut && (
        <span className="ml-auto text-[10px] font-bold tracking-widest text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
          {shortcut}
        </span>
      )}
    </Link>
  );
}

export function AppLayout({ children, rightSidebarContent, folders = [] }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    workspace: true,
    create: true,
    optimize: true,
    manage: true
  });
  const pathname = usePathname() || "";
  
  const groups = [
    {
      id: "workspace",
      label: "Workspace",
      items: [
        { href: "/dashboard", icon: Home, label: "Overview", active: pathname === "/dashboard" },
        { href: "/dashboard/documents", icon: FileText, label: "Documents", active: pathname.startsWith("/dashboard/documents") },
        { href: "/dashboard/content-hub", icon: Library, label: "Content Hub", active: pathname.startsWith("/dashboard/content-hub") },
        { href: "/dashboard/planner", icon: CalendarDays, label: "Planner", active: pathname.startsWith("/dashboard/planner") },
      ]
    },
    {
      id: "create",
      label: "Create & AI",
      items: [
        { href: "/dashboard/ai-studio", icon: Bot, label: "AI Studio", active: pathname.startsWith("/dashboard/ai-studio") },
        { href: "/dashboard/dam", icon: ImageIcon, label: "DAM & Media", active: pathname.startsWith("/dashboard/dam") },
        { href: "/dashboard/repurpose", icon: Layers, label: "Atomizer (Repurpose)", active: pathname.startsWith("/dashboard/repurpose") },
        { href: "/dashboard/agents", icon: Cpu, label: "Custom Agents", active: pathname.startsWith("/dashboard/agents") },
        { href: "/dashboard/brand-kit", icon: BookOpen, label: "Brand Kit", active: pathname.startsWith("/dashboard/brand-kit") },
        { href: "/dashboard/templates", icon: LayoutTemplate, label: "Templates", active: pathname.startsWith("/dashboard/templates") },
      ]
    },
    {
      id: "optimize",
      label: "Optimize & Distribute",
      items: [
        { href: "/dashboard/seo", icon: SearchCode, label: "SEO Intelligence", active: pathname.startsWith("/dashboard/seo") },
        { href: "/dashboard/publish", icon: Send, label: "Publishing Hub", active: pathname.startsWith("/dashboard/publish") },
        { href: "/dashboard/radar", icon: Radio, label: "Competitor Radar", active: pathname.startsWith("/dashboard/radar") },
        { href: "/dashboard/localization", icon: Globe, label: "Localization", active: pathname.startsWith("/dashboard/localization") },
      ]
    },
    {
      id: "manage",
      label: "Govern & Manage",
      items: [
        { href: "/dashboard/approvals", icon: ClipboardCheck, label: "Approvals", active: pathname.startsWith("/dashboard/approvals") },
        { href: "/dashboard/client-portal", icon: Building2, label: "Client Portal", active: pathname.startsWith("/dashboard/client-portal") },
        { href: "/dashboard/team", icon: Users, label: "Team", active: pathname.startsWith("/dashboard/team") },
        { href: "/dashboard/analytics", icon: BarChart, label: "Analytics & ROI", active: pathname.startsWith("/dashboard/analytics") },
        { href: "/dashboard/activity", icon: Bell, label: "Activity", active: pathname.startsWith("/dashboard/activity") },
        { href: "/dashboard/integrations", icon: LinkIcon, label: "Integrations", active: pathname.startsWith("/dashboard/integrations") },
      ]
    },
  ];

  return (
    <div className="flex h-dvh bg-slate-50 overflow-hidden text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Left Sidebar - Navigation */}
      <aside className={cn(
        "w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 relative z-20 transition-transform duration-300",
        isMobileMenuOpen ? "absolute inset-y-0 left-0 transform-none shadow-2xl" : "hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
      )}>
        <div className="p-5 flex items-center justify-between border-b border-slate-200/60 shrink-0 h-16">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#020617] flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-slate-900 leading-none">Nexus</span>
              <span className="text-[10px] font-semibold text-indigo-600 tracking-wider uppercase mt-0.5">Content OS</span>
            </div>
          </Link>
          {isMobileMenuOpen && (
            <button className="md:hidden p-2 text-slate-400 hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.id} className="space-y-1">
                <button 
                  onClick={() => setOpenGroups((current) => ({ ...current, [group.id]: !current[group.id] }))} 
                  className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-100/70"
                >
                  <span>{group.label}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${openGroups[group.id] ? "rotate-0" : "-rotate-90"}`} />
                </button>
                {openGroups[group.id] && (
                  <div className="space-y-0.5 pl-0.5">
                    {group.items.map((item) => (
                      <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} isActive={item.active} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200/60">
            <div className="px-3 mb-2 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Workspaces</span>
              <Link href="/dashboard/workspaces" className="hover:text-indigo-600 transition-colors text-xs font-semibold">View All</Link>
            </div>
            <div className="space-y-0.5">
              {folders.map(folder => (
                <div key={folder.id}>
                  <Link href={`/workspace/${folder.id}`} className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors",
                    pathname.includes(`/workspace/${folder.id}`) ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-200/50"
                  )}>
                    <FolderOpen className={cn("w-3.5 h-3.5", pathname.includes(`/workspace/${folder.id}`) ? "text-indigo-600" : "text-slate-400")} /> 
                    {folder.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-slate-200/60 shrink-0">
          <NavItem href="/settings" icon={Settings} label="Settings" isActive={pathname.startsWith("/settings")} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex min-w-0 min-h-0 flex-1 flex-col bg-white relative z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] md:rounded-l-2xl border-l border-slate-200/50">
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Nexus... (Cmd+K)" 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium placeholder-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard/repurpose" 
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-full transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Quick Atomizer
            </Link>
            <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white cursor-pointer hover:scale-105 transition-transform">
              SC
            </div>
          </div>
        </header>

        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </main>

      {/* Right Sidebar (Intelligence / Context) */}
      {rightSidebarContent && <aside className="w-80 bg-white border-l border-slate-200 hidden lg:flex flex-col shrink-0 relative z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">{rightSidebarContent}</aside>}
    </div>
  );
}
