import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const stats = await prisma.$transaction([
    prisma.user.count(),
    prisma.chat.count(),
    prisma.subscription.count(),
    prisma.user.aggregate({ _sum: { credits: true } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "completed" } }),
    prisma.usageLog.aggregate({ _sum: { promptTokens: true, completionTokens: true } })
  ]);

  const totalRevenue = (stats[4]._sum.amount || 0) / 100;
  const totalTokens = (stats[5]._sum.promptTokens || 0) + (stats[5]._sum.completionTokens || 0);

  return (
    <div className="p-8 pb-20">
      <h1 className="text-3xl font-bold mb-8 text-white">System Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <p className="text-slate-400 text-sm">Total Revenue (INR)</p>
          <p className="text-3xl font-bold text-green-400">₹{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <p className="text-slate-400 text-sm">Tokens Processed</p>
          <p className="text-3xl font-bold text-[#7f0df2]">{totalTokens.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <p className="text-slate-400 text-sm">Total Users</p>
          <p className="text-3xl font-bold text-white">{stats[0]}</p>
        </div>
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <p className="text-slate-400 text-sm">Credits in Circulation</p>
          <p className="text-3xl font-bold text-white">{stats[3]._sum.credits || 0}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
           <h2 className="text-xl font-bold text-white mb-6">Recent Usage</h2>
           <p className="text-slate-400 mb-4">You have {stats[1]} total chat sessions active.</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
           <h2 className="text-xl font-bold text-white mb-6">User Management</h2>
           <p className="text-slate-400 mb-4">Use the users tab to block/unblock accounts or adjust credits directly.</p>
        </div>
      </div>
    </div>
  );
}
