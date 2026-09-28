"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Sparkles,
  Users,
  ShieldCheck
} from "lucide-react";
import { MarketingShell, MarketingHero } from "@/components/MarketingShell";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastNotifications";

const timeSlots = ["10:00 AM EST", "11:30 AM EST", "2:00 PM EST", "3:30 PM EST", "5:00 PM EST"];

export default function DemoPage() {
  const { addToast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[1]);
  const [selectedRole, setSelectedRole] = useState("Enterprise Content / Marketing Leader");
  const [teamSize, setTeamSize] = useState("10 - 25 Writers");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [isBooked, setIsBooked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !company.trim()) return;
    setIsBooked(true);
    addToast({
      title: "Demo Confirmed!",
      message: `We've sent calendar invite and customized brief to ${email}.`,
      type: "success"
    });
  };

  return (
    <MarketingShell>
      <main className="space-y-16 pb-28">
        
        <MarketingHero
          eyebrow="Interactive Executive Walkthrough"
          title="See Nexus Configured for Your Exact Brand Voice"
          description="Book a 20-minute guided session with a Content Operations Specialist to explore multi-channel atomization and live governance."
        />

        <section className="mx-auto max-w-5xl px-5">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl bg-white">
            
            {!isBooked ? (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Form: Details */}
                <div className="lg:col-span-7 space-y-5">
                  <h3 className="font-heading text-xl font-bold text-slate-950">Tell us about your team</h3>
                  
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 block">Work Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 block">Company Name</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Stripe, Snowflake, Acme Corp"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 block">Primary Role</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option>Enterprise Content / Marketing Leader</option>
                      <option>VP of Marketing / CMO</option>
                      <option>DevRel & Technical Content Lead</option>
                      <option>Demand Gen & Paid Acquisition</option>
                      <option>Agency / Studio Founder</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 block">Content Team Size</label>
                    <select
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option>1 - 5 Writers</option>
                      <option>6 - 10 Writers</option>
                      <option>10 - 25 Writers</option>
                      <option>25+ Writers / Global Org</option>
                    </select>
                  </div>
                </div>

                {/* Right Form: Slot Picker */}
                <div className="lg:col-span-5 space-y-5 lg:border-l lg:border-slate-100 lg:pl-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="font-heading text-xl font-bold text-slate-950 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600" /> Select Demo Slot
                    </h3>
                    <p className="text-xs text-slate-500">Choose a preferred time slot for your 20-minute tailored walkthrough.</p>

                    <div className="space-y-2 pt-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`w-full p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                            selectedSlot === slot
                              ? "bg-[#020617] border-[#020617] text-white shadow-md"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Clock className={`w-3.5 h-3.5 ${selectedSlot === slot ? "text-indigo-400" : "text-slate-400"}`} /> {slot}
                          </span>
                          {selectedSlot === slot && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-[#020617] hover:bg-slate-800 text-white font-bold text-sm shadow-md"
                  >
                    Confirm Walkthrough Slot →
                  </Button>
                </div>

              </form>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-3xl font-bold text-slate-950">Your Demo is Confirmed!</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                  We&apos;ve reserved <strong>{selectedSlot}</strong> for <strong>{company}</strong>. A calendar invite and pre-demo workspace link have been dispatched to <strong>{email}</strong>.
                </p>
                <div className="pt-4">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#020617] text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Explore Demo Workspace in the Meantime →
                  </Link>
                </div>
              </div>
            )}

          </div>
        </section>

      </main>
    </MarketingShell>
  );
}
