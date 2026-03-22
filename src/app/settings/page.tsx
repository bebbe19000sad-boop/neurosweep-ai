import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { id: true, email: true, name: true, role: true, credits: true }
  });

  const usageStats = await prisma.usageLog.aggregate({
    _sum: { promptTokens: true, completionTokens: true },
    where: { userId: user?.id }
  });

  const totalTokens = (usageStats._sum.promptTokens || 0) + (usageStats._sum.completionTokens || 0);

  return (
    <div className="flex h-screen w-full bg-[#0d0a13] text-white">
      <Sidebar user={user} />
      <main className="flex-1 flex flex-col overflow-y-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Profile Settings */}
          <div className="bg-[#191022]/80 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7f0df2]">person</span>
              Profile Information
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Full Name</label>
                <input type="text" defaultValue={user?.name || ""} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#7f0df2] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Email Address</label>
                <input type="email" defaultValue={user?.email || ""} disabled className="w-full bg-black/60 border border-white/5 text-slate-500 rounded-xl px-4 py-3 outline-none cursor-not-allowed" />
                <p className="text-[10px] text-slate-500 mt-1">Email cannot be changed.</p>
              </div>
              <button type="button" className="mt-4 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all text-sm">Save Changes</button>
            </form>
          </div>

          {/* Usage Meter */}
          <div className="bg-[#191022]/80 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7f0df2]">data_usage</span>
              API Usage Meter
            </h2>
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-semibold text-slate-400">Total Tokens Generated</span>
                <span className="text-2xl font-black text-[#7f0df2]">{totalTokens.toLocaleString()}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                 <div className="bg-gradient-to-r from-[#7f0df2] to-purple-500 h-3" style={{ width: `${Math.min((totalTokens / 500000) * 100, 100)}%` }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-right">Progress towards 500k milestone</p>
            </div>

            <div className="p-4 rounded-xl bg-[#7f0df2]/10 border border-[#7f0df2]/20">
              <p className="text-sm text-slate-300">
                You have <span className="font-bold text-white">{user?.credits} Credits</span> remaining.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
