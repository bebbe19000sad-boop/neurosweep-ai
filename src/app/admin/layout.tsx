import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#191022] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <nav className="flex gap-6 mb-8 border-b border-white/10 pb-4">
          <a href="/admin" className="hover:text-[#7f0df2] transition-colors">Dashboard</a>
          <a href="/admin/users" className="hover:text-[#7f0df2] transition-colors">Users</a>
          <a href="/admin/api-keys" className="hover:text-[#7f0df2] transition-colors">API Keys</a>
        </nav>
        {children}
      </div>
    </div>
  );
}
