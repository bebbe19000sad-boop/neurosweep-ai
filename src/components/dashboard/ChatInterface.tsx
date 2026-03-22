"use client";

import { useChat } from "ai/react";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

export default function ChatInterface({ credits, initialChatId, initialMessages }: { credits: number, initialChatId?: string, initialMessages?: any[] }) {
  const { data: session } = useSession();
  const [model, setModel] = useState("openai");
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    id: initialChatId,
    initialMessages: initialMessages || [],
    body: { model },
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    const data = JSON.stringify(messages, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[#0d0a13]">
      <header className="flex items-center justify-between px-6 py-4 bg-[#0d0a13]/80 backdrop-blur-md border-b border-white/5 z-20">
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-slate-100">AI Neural Workspace</h2>
          <span className="text-[10px] text-slate-500 font-medium">Credits: {credits} remaining</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleExport} disabled={messages.length === 0} className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors disabled:opacity-50">
            <span className="material-symbols-outlined text-sm">download</span>
            Export
          </button>
          <div className="relative">
            <select 
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="appearance-none bg-slate-800/80 border border-slate-700 text-slate-200 text-xs rounded-lg px-4 py-2 pr-10 focus:ring-1 focus:ring-[#7f0df2] outline-none cursor-pointer"
            >
              <option value="openai">GPT-4o</option>
              <option value="gemini">Gemini 1.5 Pro</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-10">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="size-16 rounded-2xl bg-[#7f0df2]/10 flex items-center justify-center text-[#7f0df2] mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">psychology</span>
              </div>
              <h3 className="text-xl font-bold mb-2">How can I help you today?</h3>
              <p className="text-slate-500 text-sm">Select a model and start a conversation.</p>
            </div>
          )}
          
          {messages.map((m: any) => (
            <div key={m.id} className={`flex gap-4 md:gap-6 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`size-8 md:size-10 rounded-lg flex items-center justify-center shrink-0 mt-1 ${m.role === "user" ? "bg-slate-800" : "bg-[#7f0df2]/20 text-[#7f0df2]"}`}>
                {m.role === "user" ? (
                   <span className="material-symbols-outlined text-xl">person</span>
                ) : (
                  <span className="material-symbols-outlined text-xl">auto_awesome</span>
                )}
              </div>
              <div className={`flex-1 space-y-2 ${m.role === "user" ? "text-right" : ""}`}>
                <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">{m.role === "user" ? "You" : "NeuroSweep"}</p>
                <div className={`p-5 rounded-2xl relative group ${
                  m.role === "user" 
                  ? "bg-[#7f0df2] text-white rounded-tr-none inline-block text-left" 
                  : "bg-[#7f0df2]/10 border border-[#7f0df2]/20 text-slate-200 rounded-tl-none"
                }`}>
                  {m.content}
                  {m.role !== "user" && (
                    <button onClick={() => handleCopy(String(m.content))} className="absolute top-2 right-2 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex gap-4 md:gap-6">
                <div className="size-8 md:size-10 rounded-lg bg-[#7f0df2]/20 flex items-center justify-center text-[#7f0df2] shrink-0 mt-1 animate-pulse">
                  <span className="material-symbols-outlined text-xl">auto_awesome</span>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-12 bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-[#7f0df2]/5 border border-[#7f0df2]/10 rounded-2xl animate-pulse"></div>
                </div>
             </div>
          )}
        </div>
      </div>

      <div className="w-full bg-gradient-to-t from-[#0d0a13] via-[#0d0a13] to-transparent pt-10 pb-6 px-4 md:px-8">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#7f0df2]/30 to-purple-600/30 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
          <div className="relative bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 flex flex-col shadow-2xl">
            <textarea 
              value={input}
              onChange={handleInputChange}
              className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 text-sm resize-none min-h-[60px] p-4 outline-none" 
              placeholder="Message NeuroSweep AI..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
            />
            <div className="flex items-center justify-between px-2 pb-2">
              <div className="flex items-center gap-1">
                <button type="button" className="p-2 text-slate-500 hover:text-slate-200 transition-colors">
                  <span className="material-symbols-outlined text-xl">attach_file</span>
                </button>
              </div>
              <button 
                type="submit"
                disabled={isLoading || !input.trim() || credits <= 0}
                className="size-10 bg-[#7f0df2] hover:bg-[#7f0df2]/90 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#7f0df2]/40 transition-all active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
          {credits <= 0 && <p className="text-center text-[10px] text-red-500 mt-2 font-bold">Out of credits. Please upgrade.</p>}
        </form>
      </div>
    </div>
  );
}
