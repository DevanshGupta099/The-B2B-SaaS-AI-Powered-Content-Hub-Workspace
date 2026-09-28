"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#020617] text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] animate-[spin_180s_linear_infinite]" />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center font-heading text-xl shadow-lg">
              N
            </div>
            <span className="font-heading text-2xl tracking-tight">NEXUS</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-heading text-5xl leading-tight mb-6">
              The Intelligent Workspace for B2B Teams.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Create, collaborate, and scale your content with advanced AI workflows designed for modern enterprises.
            </p>
          </motion.div>
          
          <div className="mt-12 flex items-center gap-4 text-sm font-medium text-slate-400">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/150?u=sarah" alt="User" className="w-10 h-10 rounded-full border-2 border-[#020617]" />
              <img src="https://i.pravatar.cc/150?u=michael" alt="User" className="w-10 h-10 rounded-full border-2 border-[#020617]" />
              <img src="https://i.pravatar.cc/150?u=devansh" alt="User" className="w-10 h-10 rounded-full border-2 border-[#020617]" />
            </div>
            <p>Join 10,000+ top teams</p>
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 lg:hidden text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white font-heading text-xl mb-4 shadow-sm">
              N
            </div>
          </div>
          
          <div className="mb-10">
            <h2 className="font-heading text-4xl text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500">Enter your details to access your workspace.</p>
          </div>

          <div className="space-y-4">
            <Button variant="secondary" className="w-full gap-3 py-3 rounded-xl font-semibold border-slate-200 hover:border-slate-300 hover:bg-white shadow-sm bg-white">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
            <Button variant="secondary" className="w-full gap-3 py-3 rounded-xl font-semibold border-slate-200 hover:border-slate-300 hover:bg-white shadow-sm bg-white">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </Button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-slate-50 text-slate-400 font-medium">Or continue with email</span></div>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href='/dashboard'; }}>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Work Email</label>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm shadow-sm"
                  required
                />
              </div>
              <Button className="w-full py-3 rounded-xl gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold">
                Send Magic Link <Sparkles className="w-4 h-4 text-slate-300" />
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-500 mt-10">
            By continuing, you agree to our <Link href="#" className="text-slate-900 font-medium hover:underline">Terms of Service</Link> and <Link href="#" className="text-slate-900 font-medium hover:underline">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
