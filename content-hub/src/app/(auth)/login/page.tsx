"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Sparkles, AlertCircle, CheckCircle2, Lock, Mail, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("devanshgupta091@gmail.com");
    setPassword("password123");
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] animate-[spin_180s_linear_infinite]" />
        </div>
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-heading text-xl shadow-lg font-bold">
              N
            </div>
            <span className="font-heading text-2xl tracking-tight font-bold">NEXUS</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-heading text-4xl lg:text-5xl leading-tight mb-6 font-bold">
              The Governed AI Workspace for Enterprise B2B.
            </h1>
            <p className="text-slate-300 text-base leading-relaxed">
              Sub-second Groq LPUs, Hugging Face 384d semantic vectors, and zero brand compliance drift.
            </p>
          </motion.div>
          
          <div className="mt-10 flex items-center gap-4 text-sm font-medium text-slate-400">
            <div className="flex -space-x-2">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" alt="Sarah" className="w-9 h-9 rounded-full border-2 border-slate-900" />
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" alt="Devansh" className="w-9 h-9 rounded-full border-2 border-slate-900" />
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" alt="Michael" className="w-9 h-9 rounded-full border-2 border-slate-900" />
            </div>
            <p className="text-xs">Active sessions authenticated via backend store</p>
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:hidden text-center">
            <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white font-heading text-xl mb-3 shadow-sm font-bold">
              N
            </Link>
          </div>
          
          <div className="mb-6">
            <h2 className="font-heading text-3xl font-bold text-slate-900 mb-1.5">Sign in to Nexus</h2>
            <p className="text-slate-500 text-sm">Credentials validated against secure backend authentication store.</p>
          </div>

          {/* Demo Credentials Quick-Fill Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-between text-xs">
            <div className="text-indigo-950">
              <span className="font-bold">Test Account:</span> devanshgupta091@gmail.com
            </div>
            <button 
              type="button"
              onClick={fillDemo}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs hover:bg-indigo-50 transition-colors"
            >
              Fill Demo
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </motion.div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-sm shadow-2xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-sm shadow-2xs"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit"
              isLoading={isLoading}
              className="w-full py-3 rounded-xl gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 text-sm mt-2"
            >
              Sign In to Workspace <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have a workspace?{" "}
            <Link href="/signup" className="font-bold text-indigo-600 hover:underline">
              Create an account
            </Link>
          </p>

          <p className="text-center text-[11px] text-slate-400 mt-8">
            Protected by SOC2 Type II compliance & zero-retention session storage.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
