"use client";

import { useState } from "react";
import axios from "axios";

export default function APIKeyManager({ initialKeys }: { initialKeys: any[] }) {
  const [keys, setKeys] = useState(initialKeys);
  const [provider, setProvider] = useState("openai");
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/admin/keys", { provider, key });
      setKeys((prev) => [...prev.filter((k) => k.provider !== provider), res.data]);
      setKey("");
      alert("Key updated successfully");
    } catch (err) {
      alert("Error updating key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Provider</label>
          <select 
            value={provider} 
            onChange={(e) => setProvider(e.target.value)}
            className="w-full bg-[#191022] border border-white/10 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#7f0df2]"
          >
            <option value="openai">OpenAI</option>
            <option value="gemini">Google Gemini</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <input 
            type="password" 
            value={key} 
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-[#191022] border border-white/10 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#7f0df2]"
            required
          />
        </div>
        <button 
          disabled={loading}
          className="bg-[#7f0df2] px-6 py-2 rounded-lg font-bold hover:bg-[#7f0df2]/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Key"}
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Configured Keys</h3>
        {keys.map((k) => (
          <div key={k.id} className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10">
            <span className="capitalize">{k.provider}</span>
            <span className="text-slate-400 font-mono">••••••••{k.key.slice(-4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
