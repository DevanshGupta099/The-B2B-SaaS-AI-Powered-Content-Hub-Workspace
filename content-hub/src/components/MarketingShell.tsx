"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown,
  Cpu, 
  Layers, 
  SearchCode, 
  Send,
  Building2,
  Globe,
  Radio,
  CheckCircle2,
  LayoutTemplate,
  Bot,
  Wand2,
  Image as ImageIcon,
  Flame,
  FileText,
  Lock,
  Activity,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const productFeatures = [
    {
      title: "Content Atomizer",
      desc: "Repurpose 1 core brief into 6+ multi-channel formats",
      icon: Layers,
      href: "/dashboard/repurpose",
      badge: "Popular",
      color: "text-indigo-600 bg-indigo-50"
    },
    {
      title: "Brand Voice Linter",
      desc: "Deterministic rule engine to prevent brand drift",
      icon: ShieldCheck,
      href: "/dashboard/brand-kit",
      badge: "Zero Drift",
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      title: "AI Studio & Copilot",
      desc: "Block document editor with sub-second Groq LPUs",
      icon: Bot,
      href: "/dashboard/ai-studio",
      badge: "New",
      color: "text-purple-600 bg-purple-50"
    },
    {
      title: "Custom AI Agents",
      desc: "Autonomous specialized ghostwriters and copywriters",
      icon: Cpu,
      href: "/dashboard/agents",
      color: "text-cyan-600 bg-cyan-50"
    },
    {
      title: "1-Click Publishing Hub",
      desc: "Native syndication to Webflow, HubSpot, and LinkedIn",
      icon: Send,
      href: "/dashboard/publish",
      color: "text-sky-600 bg-sky-50"
    },
    {
      title: "Digital Asset Management",
      desc: "Semantic visual search and generative image studio",
      icon: ImageIcon,
      href: "/dashboard/dam",
      color: "text-amber-600 bg-amber-50"
    },
    {
      title: "SEO & Search Intelligence",
      desc: "Real-time content scoring and SERP comparison",
      icon: SearchCode,
      href: "/dashboard/seo",
      color: "text-rose-600 bg-rose-50"
    },
    {
      title: "Client & Stakeholder Portal",
      desc: "Magic link review hubs with digital approval stamps",
      icon: Building2,
      href: "/dashboard/client-portal",
      color: "text-violet-600 bg-violet-50"
    }
  ];

  const solutions = [
    {
      title: "For Enterprise CMOs",
      desc: "Scale global brand consistency across 50+ regional teams",
      href: "/solutions"
    },
    {
      title: "For DevRel & Technical Teams",
      desc: "Convert specs and RFCs into high-engagement tech blogs",
      href: "/solutions"
    },
    {
      title: "For Demand Generation",
      desc: "High-converting ad copy, landing pages, and email nurture",
      href: "/solutions"
    },
    {
      title: "For Content Agencies",
      desc: "Zero-seat client portals and multi-tenant brand kits",
      href: "/solutions"
    }
  ];

  const resources = [
    {
      title: "Template Gallery",
      desc: "50+ pre-built workflow prompt blueprints",
      href: "/templates",
      icon: LayoutTemplate,
      badge: "50+ Free"
    },
    {
      title: "Free AI Headline Generator",
      desc: "Instant viral hook & CTR scoring tool",
      href: "/free-tools/headline-generator",
      icon: Flame,
      badge: "Free Tool"
    },
    {
      title: "Brand Voice Checker",
      desc: "Free buzzword and corporate jargon linter",
      href: "/free-tools/brand-voice-checker",
      icon: ShieldCheck,
      badge: "Free Tool"
    },
    {
      title: "System Status",
      desc: "Real-time edge telemetry and latency reports",
      href: "/status",
      icon: Activity,
      badge: "Live"
    },
    {
      title: "Security & Trust Center",
      desc: "SOC2 Type II, zero AI retention policy, and SAML",
      href: "/security",
      icon: Lock
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Announcement Bar */}
      <div className="bg-[#020617] text-white px-4 py-2 text-center text-xs font-medium flex items-center justify-center gap-2 relative z-50">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>
          <strong>Nexus 3.0 is live</strong> — The Governed Multi-Channel AI Content Operating System
        </span>
        <Link href="/templates" className="inline-flex items-center gap-1 text-indigo-300 hover:text-white font-bold ml-1 transition-colors">
          Explore 50+ Free Templates <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Floating Modern Header */}
      <header className="sticky top-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3.5 transition-all duration-200">
        <div ref={navRef} className="mx-auto max-w-7xl">
          <div className={cn(
            "rounded-2xl border transition-all duration-300 px-4 sm:px-5 py-2.5 flex items-center justify-between",
            isScrolled 
              ? "bg-white/90 backdrop-blur-xl border-slate-200 shadow-lg shadow-slate-900/5" 
              : "bg-white/80 backdrop-blur-lg border-slate-200/80 shadow-sm"
          )}>
            
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-xl bg-[#020617] flex items-center justify-center text-white font-heading font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform">
                  N
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading text-xl font-extrabold tracking-tight text-slate-950">Nexus</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Content OS
                  </span>
                </div>
              </Link>

              {/* Center: Desktop Navigation with Mega Menus */}
              <nav className="hidden lg:flex items-center gap-1">
                
                {/* 1. Product Mega Menu */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === "product" ? null : "product")}
                    onMouseEnter={() => setActiveDropdown("product")}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1",
                      activeDropdown === "product" || pathname.startsWith("/features") || pathname.startsWith("/dashboard")
                        ? "text-slate-950 bg-slate-100"
                        : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                    )}
                  >
                    <span>Product</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", activeDropdown === "product" ? "rotate-180 text-indigo-600" : "text-slate-400")} />
                  </button>

                  {/* Mega Menu Dropdown */}
                  {activeDropdown === "product" && (
                    <div 
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute top-full left-0 mt-2 w-[560px] p-4 rounded-2xl bg-white border border-slate-200 shadow-2xl shadow-slate-900/10 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      {productFeatures.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-start gap-3 group"
                        >
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", item.color)}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      ))}

                      <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs px-2">
                        <Link href="/features" onClick={() => setActiveDropdown(null)} className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                          View All 12 Core Modules <ArrowRight className="w-3 h-3" />
                        </Link>
                        <span className="text-slate-400 text-[11px]">SOC2 Type II Certified</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Solutions Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === "solutions" ? null : "solutions")}
                    onMouseEnter={() => setActiveDropdown("solutions")}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1",
                      activeDropdown === "solutions" || pathname.startsWith("/solutions")
                        ? "text-slate-950 bg-slate-100"
                        : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                    )}
                  >
                    <span>Solutions</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", activeDropdown === "solutions" ? "rotate-180 text-indigo-600" : "text-slate-400")} />
                  </button>

                  {activeDropdown === "solutions" && (
                    <div 
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute top-full left-0 mt-2 w-[340px] p-3 rounded-2xl bg-white border border-slate-200 shadow-2xl shadow-slate-900/10 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      {solutions.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="p-2.5 rounded-xl hover:bg-slate-50 block space-y-0.5 group border border-transparent hover:border-slate-200 transition-all"
                        >
                          <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {item.desc}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Templates (Direct Link) */}
                <Link
                  href="/templates"
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                    pathname === "/templates"
                      ? "text-slate-950 bg-slate-100"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                  )}
                >
                  <span>Templates</span>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    50+
                  </span>
                </Link>

                {/* 4. Pricing (Direct Link) */}
                <Link
                  href="/pricing"
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                    pathname === "/pricing"
                      ? "text-slate-950 bg-slate-100"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                  )}
                >
                  Pricing
                </Link>

                {/* 5. Resources & Free Tools Mega Menu */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === "resources" ? null : "resources")}
                    onMouseEnter={() => setActiveDropdown("resources")}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1",
                      activeDropdown === "resources" || pathname.startsWith("/free-tools") || pathname.startsWith("/status")
                        ? "text-slate-950 bg-slate-100"
                        : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                    )}
                  >
                    <span>Resources</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", activeDropdown === "resources" ? "rotate-180 text-indigo-600" : "text-slate-400")} />
                  </button>

                  {activeDropdown === "resources" && (
                    <div 
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute top-full left-0 mt-2 w-[360px] p-3 rounded-2xl bg-white border border-slate-200 shadow-2xl shadow-slate-900/10 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      {resources.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="p-2.5 rounded-xl hover:bg-slate-50 flex items-start gap-3 group border border-transparent hover:border-slate-200 transition-all"
                        >
                          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                            <item.icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* System Uptime Beacon (Desktop) */}
              <Link
                href="/status"
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>All Systems 100%</span>
              </Link>

              <Link
                href="/login"
                className="hidden sm:inline-flex px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors"
              >
                Sign In
              </Link>

              <Link
                href="/demo"
                className="hidden md:inline-flex px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-2xs transition-all"
              >
                Book Demo
              </Link>

              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#020617] hover:bg-slate-800 shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
              >
                <span>Launch App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-950 transition-colors"
                aria-label="Toggle Navigation"
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>

          {/* Mobile Drawer Menu */}
          {isMobileOpen && (
            <div className="lg:hidden mt-2 p-5 rounded-2xl border border-slate-200 bg-white shadow-2xl space-y-4 animate-in fade-in duration-150">
              
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">Main Navigation</p>
                <Link
                  href="/features"
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50"
                >
                  Features & Modules
                </Link>
                <Link
                  href="/solutions"
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50"
                >
                  Solutions by Role
                </Link>
                <Link
                  href="/templates"
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Template Gallery</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">50+ Recipes</span>
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50"
                >
                  Pricing & Packaging
                </Link>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">Free Tools</p>
                <Link
                  href="/free-tools/headline-generator"
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  ⚡ AI Headline Generator
                </Link>
                <Link
                  href="/free-tools/brand-voice-checker"
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  🛡️ Brand Voice Linter
                </Link>
                <Link
                  href="/status"
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  🟢 System Status (100% Uptime)
                </Link>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-slate-700 bg-slate-100"
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-white bg-[#020617]"
                >
                  Open Workspace →
                </Link>
              </div>

            </div>
          )}

        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Enterprise Light Footer */}
      <footer className="border-t border-slate-200 bg-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20 space-y-12">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            
            {/* Brand column */}
            <div className="col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#020617] flex items-center justify-center text-white font-heading font-extrabold text-lg shadow-sm">
                  N
                </div>
                <span className="font-heading text-2xl font-bold tracking-tight text-slate-950">Nexus</span>
              </Link>
              <p className="text-xs text-slate-700 max-w-sm leading-relaxed font-medium">
                The enterprise AI content operating system. Plan, generate, govern, approve, and distribute multi-channel content with zero compliance risk.
              </p>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 pt-2">
                <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> SOC2 Type II Certified
                </span>
                <span className="text-slate-400">·</span>
                <span>Zero AI Data Retention</span>
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-950 font-heading">Product</p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li><Link href="/dashboard/repurpose" className="hover:text-indigo-700 transition-colors">Content Atomizer</Link></li>
                <li><Link href="/dashboard/agents" className="hover:text-indigo-700 transition-colors">Custom AI Agents</Link></li>
                <li><Link href="/dashboard/seo" className="hover:text-indigo-700 transition-colors">SEO Intelligence</Link></li>
                <li><Link href="/dashboard/publish" className="hover:text-indigo-700 transition-colors">Publishing Hub</Link></li>
                <li><Link href="/dashboard/brand-kit" className="hover:text-indigo-700 transition-colors">Brand Kit & Linter</Link></li>
                <li><Link href="/dashboard/client-portal" className="hover:text-indigo-700 transition-colors">Client Portal</Link></li>
              </ul>
            </div>

            {/* Solutions Links */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-950 font-heading">Solutions</p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li><Link href="/solutions" className="hover:text-indigo-700 transition-colors">Enterprise Marketing</Link></li>
                <li><Link href="/solutions" className="hover:text-indigo-700 transition-colors">DevRel & Technical Teams</Link></li>
                <li><Link href="/solutions" className="hover:text-indigo-700 transition-colors">High-Growth Startups</Link></li>
                <li><Link href="/solutions" className="hover:text-indigo-700 transition-colors">Agencies & Content Hubs</Link></li>
                <li><Link href="/security" className="hover:text-indigo-700 transition-colors">Legal & Compliance</Link></li>
              </ul>
            </div>

            {/* Company & Resources */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-950 font-heading">Resources</p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li><Link href="/pricing" className="hover:text-indigo-700 transition-colors">Pricing & Plans</Link></li>
                <li><Link href="/templates" className="hover:text-indigo-700 transition-colors">Template Gallery (50+)</Link></li>
                <li><Link href="/security" className="hover:text-indigo-700 transition-colors">Trust Center</Link></li>
                <li><Link href="/demo" className="hover:text-indigo-700 transition-colors">Book a Live Demo</Link></li>
                <li><Link href="/status" className="hover:text-indigo-700 transition-colors">System Status (100%)</Link></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-medium">
            <p>© 2026 Nexus Systems Inc. Built for world-class B2B content operations.</p>
            <div className="flex items-center gap-6">
              <Link href="/security" className="hover:text-slate-950">Privacy Policy</Link>
              <Link href="/security" className="hover:text-slate-950">Terms of Service</Link>
              <Link href="/security" className="hover:text-slate-950">Security Whitepaper</Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

export function MarketingHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24">
      <div className="glow-mesh absolute inset-0 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-5 text-center space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-bold text-indigo-700 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          {eyebrow}
        </div>
        <h1 className="mx-auto max-w-4xl font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 leading-tight">
          {title}
        </h1>
        <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
          {description}
        </p>
      </div>
    </section>
  );
}
