"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Sidebar({ user, chats }: { user: any, chats?: any[] }) {
  return (
    <aside className="hidden md:flex flex-col w-72 bg-[#191022]/60 backdrop-blur-xl border-r border-[#7f0df2]/10 h-full">
      <div className="p-6 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-[#7f0df2] flex items-center justify-center text-white">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">NeuroSweep</h1>
        </Link>
      </div>
      
      <div className="px-4 mb-4">
        <Link href="/dashboard" className="w-full flex items-center justify-center gap-3 bg-[#7f0df2]/10 hover:bg-[#7f0df2]/20 border border-[#7f0df2]/20 text-[#7f0df2] py-3 px-4 rounded-xl transition-all font-semibold text-sm">
          <span className="material-symbols-outlined text-lg">add_box</span>
          New Chat
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-6 py-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 px-2">History</p>
          <ul className="space-y-1">
            {chats?.map((c) => {
              let firstMsg = 'New Chat';
              if (c.messages && c.messages.length > 0) {
                 firstMsg = c.messages[0].content?.substring(0, 30) + '...';
              }
              return (
              <Link href={`/dashboard?chatId=${c.id}`} key={c.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#7f0df2]/20 border border-transparent hover:border-[#7f0df2]/30 text-slate-400 hover:text-slate-100 transition-colors">
                <span className="material-symbols-outlined text-sm">chat_bubble</span>
                <span className="text-sm font-medium truncate">
                   {firstMsg}
                </span>
              </Link>
            )})}
            {(!chats || chats.length === 0) && (
              <li className="text-xs text-slate-500 p-2 text-center">No history yet</li>
            )}
          </ul>
        </div>
        
        {user?.role === "ADMIN" && (
           <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 px-2">Admin</p>
            <ul className="space-y-1">
              <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-slate-400">
                <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
            </ul>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group">
          <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-xs font-bold">
            {user?.name?.[0] || user?.email?.[0]}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name || user?.email}</p>
            <p className="text-[10px] text-[#7f0df2] font-medium">{user?.role}</p>
          </div>
          <button onClick={() => signOut()} className="material-symbols-outlined text-slate-500 hover:text-red-400">logout</button>
        </div>
      </div>
    </aside>
  );
}
