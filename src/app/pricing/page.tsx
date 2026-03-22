import Link from "next/link";
import PaymentButton from "@/components/dashboard/PaymentButton";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function PricingPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-[#0d0a13] text-white">
      <nav className="flex justify-between items-center p-6 lg:px-12 backdrop-blur-md border-b border-white/5 top-0 sticky z-50 bg-[#0d0a13]/80">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-[#7f0df2] flex items-center justify-center text-white">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">NeuroSweep</h1>
        </Link>
        <div className="flex gap-4 items-center">
          {session ? (
            <Link href="/dashboard" className="text-sm font-semibold hover:text-[#7f0df2]">Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold hover:text-[#7f0df2]">Login</Link>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Simple, Transparent Pricing</h1>
        <p className="text-slate-400 text-lg mb-20 max-w-2xl mx-auto">Get Neural access tailored to your project. Credits allow you to choose between OpenAI and Gemini models seamlessly.</p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#191022]/80 border border-white/10 rounded-3xl p-8 hover:border-[#7f0df2]/50 transition-all text-left">
            <h3 className="text-2xl font-bold mb-2 text-slate-100">Starter</h3>
            <p className="text-slate-500 text-sm mb-6">Perfect for trying out</p>
            <div className="text-5xl font-black mb-6">Free<span className="text-lg text-slate-500 font-medium"></span></div>
            <ul className="space-y-4 mb-8 text-sm text-slate-300">
              <li className="flex gap-3"><span className="material-symbols-outlined text-[#7f0df2]">check_circle</span> 10 Free Credits</li>
              <li className="flex gap-3"><span className="material-symbols-outlined text-[#7f0df2]">check_circle</span> Basic GPT-3.5 Access</li>
              <li className="flex gap-3"><span className="material-symbols-outlined text-[#7f0df2]">check_circle</span> Community Support</li>
            </ul>
            <Link href="/register" className="w-full bg-white/5 hover:bg-white/10 text-white rounded-xl py-4 font-bold text-center block transition-colors">Get Started</Link>
          </div>

          <div className="bg-gradient-to-b from-[#7f0df2]/20 to-[#191022]/80 border border-[#7f0df2] rounded-3xl p-8 transform md:-translate-y-4 shadow-2xl shadow-[#7f0df2]/20 text-left relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#7f0df2] text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>
            <h3 className="text-2xl font-bold mb-2 text-slate-100">Pro</h3>
            <p className="text-slate-500 text-sm mb-6">For regular creators</p>
            <div className="text-5xl font-black mb-6">₹500<span className="text-lg text-slate-500 font-medium"> / top-up</span></div>
            <ul className="space-y-4 mb-8 text-sm text-slate-300">
              <li className="flex gap-3"><span className="material-symbols-outlined text-[#7f0df2]">check_circle</span> 1000 Premium Credits</li>
              <li className="flex gap-3"><span className="material-symbols-outlined text-[#7f0df2]">check_circle</span> Full GPT-4o & Gemini 1.5 Pro Access</li>
              <li className="flex gap-3"><span className="material-symbols-outlined text-[#7f0df2]">check_circle</span> Export & History</li>
              <li className="flex gap-3"><span className="material-symbols-outlined text-[#7f0df2]">check_circle</span> Priority Support</li>
            </ul>
            {session ? (
               <PaymentButton planKey="pro" className="w-full bg-[#7f0df2] hover:bg-purple-600 text-white rounded-xl py-4 font-bold transition-colors">Buy 1000 Credits</PaymentButton>
            ) : (
               <Link href="/login" className="w-full bg-[#7f0df2] hover:bg-purple-600 text-white rounded-xl py-4 font-bold text-center block transition-colors">Login to Buy</Link>
            )}
          </div>

          <div className="bg-[#191022]/80 border border-white/10 rounded-3xl p-8 hover:border-[#7f0df2]/50 transition-all text-left">
            <h3 className="text-2xl font-bold mb-2 text-slate-100">Enterprise</h3>
            <p className="text-slate-500 text-sm mb-6">Custom scale solutions</p>
            <div className="text-5xl font-black mb-6">Custom</div>
            <ul className="space-y-4 mb-8 text-sm text-slate-300">
              <li className="flex gap-3"><span className="material-symbols-outlined text-[#7f0df2]">check_circle</span> Unlimited Credits</li>
              <li className="flex gap-3"><span className="material-symbols-outlined text-[#7f0df2]">check_circle</span> Dedicated Infrastructure</li>
              <li className="flex gap-3"><span className="material-symbols-outlined text-[#7f0df2]">check_circle</span> 24/7 SLA Support</li>
            </ul>
            <Link href="mailto:contact@neurosweep.ai" className="w-full bg-white/5 hover:bg-white/10 text-white rounded-xl py-4 font-bold text-center block transition-colors">Contact Sales</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
