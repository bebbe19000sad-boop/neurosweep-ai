import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { prisma } from "@/lib/prisma";
import PaymentButton from "@/components/dashboard/PaymentButton";
import Link from "next/link";

export default async function BillingDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { id: true, email: true, name: true, role: true, credits: true }
  });

  const payments = await prisma.payment.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: 'desc' }
  });

  const activePlan = user?.credits && user.credits > 20 ? "Pro" : "Free";

  return (
    <div className="flex h-screen w-full bg-[#0d0a13] text-white">
      <Sidebar user={user} />
      <main className="flex-1 flex flex-col relative overflow-y-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#191022]/80 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-300 mb-2">Current Plan</h2>
            <div className="text-4xl font-black mb-4">{activePlan}</div>
            <p className="text-slate-400 text-sm mb-6">You have {user?.credits || 0} credits remaining.</p>
            {activePlan === "Free" ? (
              <PaymentButton planKey="pro" className="bg-[#7f0df2] hover:bg-purple-600 text-white rounded-xl py-3 px-6 font-bold transition-colors">Top up 1000 Credits (₹500)</PaymentButton>
            ) : (
               <Link href="/pricing" className="bg-white/10 hover:bg-white/20 text-white rounded-xl py-3 px-6 font-bold transition-colors">Buy more credits</Link>
            )}
          </div>

          <div className="bg-[#191022]/80 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-300 mb-4">Payment Methods</h2>
            <div className="flex items-center gap-4 p-4 border border-white/10 rounded-xl mb-4">
               <span className="material-symbols-outlined text-3xl text-slate-400">credit_card</span>
               <div>
                 <p className="font-semibold">Razorpay Checkout</p>
                 <p className="text-xs text-slate-500">Secured via UPI/Cards</p>
               </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Billing History</h2>
        <div className="bg-[#191022]/80 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4 font-semibold text-slate-400">Date</th>
                <th className="p-4 font-semibold text-slate-400">Amount</th>
                <th className="p-4 font-semibold text-slate-400">Status</th>
                <th className="p-4 font-semibold text-slate-400">Invoice ID</th>
                <th className="p-4 font-semibold text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No payment history found.</td>
                </tr>
              ) : payments.map((payment: any) => (
                <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">{payment.createdAt.toLocaleDateString()}</td>
                  <td className="p-4">₹{(payment.amount / 100).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${payment.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-400">{payment.razorpayOrderId}</td>
                  <td className="p-4 text-right">
                    <button className="text-[#7f0df2] hover:text-purple-400 font-semibold text-sm">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
