"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  LogOut,
  User as UserIcon,
  Check,
  Trash2,
  ExternalLink,
  CreditCard,
  Key,
  Lock,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastNotifications";
import { getAvatarUrl } from "@/lib/avatar";
import { Avatar } from "@/components/ui/Avatar";

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

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "approvals" | "guardrails" | "system" | "documents";
  time: string;
  read: boolean;
  link?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  bio: string;
  timezone: string;
  avatarUrl: string;
  department: string;
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
  const { addToast } = useToast();
  const pathname = usePathname() || "";
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    workspace: true,
    create: true,
    optimize: true,
    manage: true
  });

  // Notifications State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [activeNotifTab, setActiveNotifTab] = useState<"all" | "guardrails" | "approvals" | "system">("all");
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Profile Popover State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: "user-1",
    name: "Devansh Gupta",
    email: "devanshgupta091@gmail.com",
    role: "Workspace Owner & Chief Architect",
    title: "Principal Engineer",
    bio: "Architecting governed multi-model content infrastructure.",
    timezone: "Asia/Kolkata (IST)",
    avatarUrl: getAvatarUrl("Devansh Gupta", "bottts"),
    department: "Core Platform Architecture"
  });
  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch Profile & Notifications on mount
  useEffect(() => {
    async function loadHeaderData() {
      try {
        const [profileRes, notifsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/notifications")
        ]);

        if (profileRes.ok) {
          const pData = await profileRes.json();
          if (pData.profile) setProfile(pData.profile);
        }

        if (notifsRes.ok) {
          const nData = await notifsRes.json();
          if (nData.notifications) {
            setNotifications(nData.notifications);
            setUnreadCount(nData.unreadCount ?? 0);
          }
        }
      } catch (err) {
        console.warn("Failed to load header profile/notifications:", err);
      }
    }

    loadHeaderData();
  }, [pathname]);

  // Click outside listener for notifications & profile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark single notification read
  const handleMarkRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  // Mark all read
  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read" })
      });

      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        addToast({ title: "Notifications cleared", message: "All notifications marked as read.", type: "success" });
      }
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  // Clear notifications
  const handleClearNotifications = async () => {
    try {
      const res = await fetch("/api/notifications", { method: "DELETE" });
      if (res.ok) {
        setNotifications([]);
        setUnreadCount(0);
        addToast({ title: "Inbox Cleared", message: "All alerts removed.", type: "info" });
      }
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeNotifTab === "all") return true;
    return n.category === activeNotifTab;
  });

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
            <div className="w-8 h-8 rounded-xl bg-[#020617] border border-[#1e293b] flex items-center justify-center shadow-md">
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
          <NavItem href="/settings" icon={Settings} label="Settings & RBAC" isActive={pathname.startsWith("/settings")} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex min-w-0 min-h-0 flex-1 flex-col bg-white relative z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] md:rounded-l-2xl border-l border-slate-200/50">
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-100 bg-white shrink-0 relative z-30">
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

            {/* NOTIFICATIONS BELL & DROPDOWN */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className={cn(
                  "relative p-2 rounded-full transition-colors",
                  isNotificationsOpen ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                )} 
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover Drawer */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-slate-900">Notifications</span>
                      {unreadCount > 0 ? (
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400">All caught up</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllRead}
                          className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Mark read
                        </button>
                      )}
                      <button 
                        onClick={handleClearNotifications}
                        title="Clear all"
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-white text-xs overflow-x-auto">
                    {[
                      { id: "all", label: "All" },
                      { id: "guardrails", label: "Alerts" },
                      { id: "approvals", label: "Approvals" },
                      { id: "system", label: "System" },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveNotifTab(tab.id as typeof activeNotifTab)}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap",
                          activeNotifTab === tab.id
                            ? "bg-[#020617] text-white"
                            : "text-slate-500 hover:bg-slate-100"
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {filteredNotifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 space-y-1">
                        <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500 mb-2" />
                        <p className="text-xs font-semibold text-slate-600">No notifications here</p>
                        <p className="text-[11px] text-slate-400">You are completely up to date.</p>
                      </div>
                    ) : (
                      filteredNotifications.map(notif => (
                        <div 
                          key={notif.id}
                          className={cn(
                            "p-3.5 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 text-left group",
                            !notif.read ? "bg-indigo-50/30" : "bg-white"
                          )}
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="mt-0.5 shrink-0">
                              {notif.category === "guardrails" && <AlertCircle className="w-4 h-4 text-amber-500" />}
                              {notif.category === "approvals" && <ClipboardCheck className="w-4 h-4 text-indigo-600" />}
                              {notif.category === "system" && <Sparkles className="w-4 h-4 text-emerald-500" />}
                              {notif.category === "documents" && <FileText className="w-4 h-4 text-slate-500" />}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className={cn("text-xs leading-snug truncate", !notif.read ? "font-bold text-slate-900" : "font-semibold text-slate-700")}>
                                  {notif.title}
                                </p>
                                {!notif.read && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                                {notif.message}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-medium">
                                <span>{notif.time}</span>
                                {notif.link && (
                                  <Link 
                                    href={notif.link}
                                    onClick={() => {
                                      handleMarkRead(notif.id);
                                      setIsNotificationsOpen(false);
                                    }}
                                    className="text-indigo-600 hover:underline flex items-center gap-0.5 font-bold"
                                  >
                                    View <ExternalLink className="w-2.5 h-2.5" />
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>

                          {!notif.read && (
                            <button
                              onClick={(e) => handleMarkRead(notif.id, e)}
                              title="Mark as read"
                              className="text-slate-300 hover:text-indigo-600 p-1 shrink-0 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <Link 
                      href="/dashboard/activity" 
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      View Full Activity Audit Trail →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* USER PROFILE AVATAR & DROPDOWN */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-200 transition-all focus:outline-none"
                aria-label="User Profile Menu"
              >
                <Avatar src={profile.avatarUrl} name={profile.name} size={32} />
              </button>

              {/* Profile Menu Popover */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Profile Card Header */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200/80">
                    <div className="flex items-center gap-3">
                      <Avatar src={profile.avatarUrl} name={profile.name} size={40} />
                      <div className="min-w-0">
                        <p className="font-heading font-bold text-sm text-slate-900 truncate">{profile.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono truncate">{profile.email}</p>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Node 01 (US-East) · Enterprise</span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="p-2 space-y-0.5 text-xs font-semibold text-slate-700">
                    <Link
                      href="/settings?tab=profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors group"
                    >
                      <span className="flex items-center gap-2.5">
                        <UserIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        Account Profile
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600" />
                    </Link>

                    <Link
                      href="/settings?tab=ai"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors group"
                    >
                      <span className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                        AI Models & LPUs
                      </span>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Groq 27B</span>
                    </Link>

                    <Link
                      href="/settings?tab=team"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors group"
                    >
                      <span className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        Team & RBAC
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600" />
                    </Link>

                    <Link
                      href="/settings?tab=billing"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors group"
                    >
                      <span className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        Billing & Usage
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">85k tokens</span>
                    </Link>

                    <Link
                      href="/settings?tab=integrations"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors group"
                    >
                      <span className="flex items-center gap-2.5">
                        <Key className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        API Keys & Webhooks
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600" />
                    </Link>

                    <Link
                      href="/settings?tab=security"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors group"
                    >
                      <span className="flex items-center gap-2.5">
                        <Lock className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        Security & Audit Logs
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600" />
                    </Link>
                  </div>

                  <div className="p-2 border-t border-slate-100 bg-slate-50">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        addToast({ title: "Session Protected", message: "Switching workspace or signing out...", type: "info" });
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out / Switch Workspace
                    </button>
                  </div>
                </div>
              )}
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
