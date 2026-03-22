"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <div className="bg-[#f7f5f8] dark:bg-[#191022] font-sans text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden min-h-screen">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-[#7f0df2]/10 bg-[#f7f5f8]/80 dark:bg-[#191022]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#7f0df2] text-white">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">NeuroSweep AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a className="hover:text-[#7f0df2] transition-colors" href="#models">Models</a>
              <a className="hover:text-[#7f0df2] transition-colors" href="#pricing">Pricing</a>
              {session?.user && (session.user as any).role === "ADMIN" && (
                <Link className="hover:text-[#7f0df2] transition-colors" href="/admin">Admin</Link>
              )}
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <Link href="/dashboard" className="text-sm font-semibold hover:text-[#7f0df2] transition-colors">Dashboard</Link>
                  <button 
                    onClick={() => signOut()}
                    className="rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-semibold hover:text-[#7f0df2] transition-colors">Log in</Link>
                  <Link href="/signup" className="rounded-full bg-[#7f0df2] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[#7f0df2]/20 hover:bg-[#7f0df2]/90 transition-all">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(127,13,242,0.15)_0%,rgba(25,16,34,0)_70%)] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#7f0df2]/20 bg-[#7f0df2]/5 px-3 py-1 text-xs font-medium text-[#7f0df2] mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7f0df2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7f0df2]"></span>
            </span>
            v2.0 Now Live with Gemini 1.5 Pro
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight text-slate-900 dark:text-white md:text-7xl mb-6">
            Unlock All AI Models in <span className="text-[#7f0df2]">One Place</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400 mb-10">
            Access GPT-4o and Gemini Pro through a single premium interface. One subscription, zero friction, infinite possibilities.
          </p>

          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -top-12 -left-12 size-64 bg-[#7f0df2]/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-12 -right-12 size-64 bg-[#7f0df2]/10 blur-[100px] rounded-full"></div>
            <div className="bg-[#7f0df2]/5 backdrop-blur-xl border border-[#7f0df2]/20 rounded-2xl p-4 md:p-8 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#7f0df2]/10 pb-4 mb-6">
                <div className="flex gap-2">
                  <div className="size-3 rounded-full bg-red-500/50"></div>
                  <div className="size-3 rounded-full bg-yellow-500/50"></div>
                  <div className="size-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="text-xs font-mono text-[#7f0df2]/60">Unified Workspace Engine</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="models">
                <div className="bg-[#7f0df2]/5 border border-[#7f0df2]/10 rounded-xl p-6 text-left group hover:border-[#7f0df2]/40 transition-all">
                  <div className="size-12 rounded-lg bg-slate-900 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white">bolt</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">GPT-4o</h3>
                  <p className="text-xs text-slate-400">OpenAI's latest multimodal powerhouse for reasoning.</p>
                </div>
                <div className="bg-[#7f0df2]/5 border border-[#7f0df2]/10 rounded-xl p-6 text-left group hover:border-[#7f0df2]/40 transition-all">
                  <div className="size-12 rounded-lg bg-[#4285F4] flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white">temp_preferences_custom</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">Gemini Pro</h3>
                  <p className="text-xs text-slate-400">Google's massive context window for deep analysis.</p>
                </div>
              </div>
              <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="w-full md:w-auto flex items-center justify-center gap-2 rounded-lg bg-[#7f0df2] h-12 px-8 text-white font-bold hover:scale-[1.02] transition-transform">
                  <span className="material-symbols-outlined text-xl">rocket_launch</span>
                  Start Free Trial
                </Link>
                <button className="w-full md:w-auto rounded-lg bg-slate-800 h-12 px-8 text-white font-bold hover:bg-slate-700 transition-colors">
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Users", val: "120k+" },
            { label: "Models Integrated", val: "2+" },
            { label: "API Uptime", val: "99.9%" },
            { label: "Tokens / Sec", val: "500M" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1 rounded-2xl bg-[#7f0df2]/5 border border-[#7f0df2]/10 p-6 text-center">
              <p className="text-slate-400 text-sm font-medium">{s.label}</p>
              <p className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">{s.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <section className="py-24" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white md:text-5xl">Simple, Transparent Pricing</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-[#7f0df2]/10 bg-[#7f0df2]/5 p-8 flex flex-col hover:border-[#7f0df2]/30 transition-all">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-black mb-4">$0</div>
              <p className="text-sm text-slate-400 mb-8">10 Credits / month</p>
              <button className="mt-auto w-full rounded-xl bg-slate-800 py-3 text-sm font-bold text-white">Current Plan</button>
            </div>
            <div className="relative rounded-2xl border-2 border-[#7f0df2] bg-[#7f0df2]/10 p-8 flex flex-col shadow-2xl scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#7f0df2] px-4 py-1 text-xs font-bold text-white uppercase">Most Popular</div>
              <h3 className="text-xl font-bold mb-2">Pro Workspace</h3>
              <div className="text-4xl font-black mb-4">₹9.99</div>
              <p className="text-sm text-slate-400 mb-8">100 Credits</p>
              <Link href="/dashboard?upgrade=pro" className="mt-auto w-full rounded-xl bg-[#7f0df2] py-3 text-sm font-bold text-white text-center">Go Pro Now</Link>
            </div>
            <div className="rounded-2xl border border-[#7f0df2]/10 bg-[#7f0df2]/5 p-8 flex flex-col hover:border-[#7f0df2]/30 transition-all">
              <h3 className="text-xl font-bold mb-2">Unlimited</h3>
              <div className="text-4xl font-black mb-4">₹29.99</div>
              <p className="text-sm text-slate-400 mb-8">1000 Credits</p>
              <Link href="/dashboard?upgrade=unlimited" className="mt-auto w-full rounded-xl bg-slate-800 py-3 text-sm font-bold text-white text-center">Buy Unlimited</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#7f0df2]/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <span className="text-lg font-bold">NeuroSweep AI</span>
          <div className="text-sm text-slate-500">© 2024 NeuroSweep AI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
