"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AlertCircle, Lock, Mail, User, Building, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, workspaceName })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred during account creation";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-5 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl"
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-heading font-bold text-base shadow-xs group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="font-heading text-xl font-bold text-slate-900 tracking-tight">Nexus</span>
          </Link>
          <Link 
            href="/" 
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors group"
          >
            <span>Landing Page</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <h1 className="font-heading text-3xl font-bold text-slate-900">Start your workspace</h1>
        <p className="mt-1.5 text-xs text-slate-500">
          Backend validated session with dedicated Groq LPU inference.
        </p>

        {/* 1-Click Social SSO OAuth */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <a
            href="/api/auth/oauth/google"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            Google SSO
          </a>
          <a
            href="/api/auth/oauth/github"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            GitHub SSO
          </a>
        </div>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400 font-medium">Or create with work email</span>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Devansh Gupta" 
                type="text" 
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-2xs" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com" 
                type="email" 
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-2xs" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Workspace Name</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Acme Growth Hub" 
                type="text" 
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-2xs" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password (6+ chars)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                type="password" 
                minLength={6}
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-2xs" 
              />
            </div>
          </div>

          <Button 
            type="submit" 
            isLoading={loading}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 py-3 font-bold text-white shadow-md shadow-indigo-600/20 text-sm mt-3"
          >
            Create Workspace Account <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
