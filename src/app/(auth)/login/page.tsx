"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#7f0df2]/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#7f0df2]/10 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#7f0df2]/20 p-3 rounded-xl mb-4 border border-[#7f0df2]/30 backdrop-blur-md">
            <span className="material-symbols-outlined text-[#7f0df2] text-4xl">psychology</span>
          </div>
          <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold tracking-tight">NeuroSweep AI</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Access your neural workspace</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</div>}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-white/5 dark:bg-slate-900/50 border border-slate-200 dark:border-[#7f0df2]/20 rounded-lg focus:ring-2 focus:ring-[#7f0df2] focus:border-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-500 transition-all outline-none" 
                  placeholder="name@company.com" 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium">Password</label>
                <Link className="text-xs text-[#7f0df2] hover:text-[#7f0df2]/80 font-semibold transition-colors" href="/forgot-password">Forgot Password?</Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-white/5 dark:bg-slate-900/50 border border-slate-200 dark:border-[#7f0df2]/20 rounded-lg focus:ring-2 focus:ring-[#7f0df2] focus:border-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-500 transition-all outline-none" 
                  placeholder="••••••••" 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button 
              disabled={loading}
              className="w-full bg-[#7f0df2] hover:bg-[#7f0df2]/90 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-[#7f0df2]/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50" 
              type="submit"
            >
              {loading ? "Signing In..." : "Sign In"}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-slate-500 dark:text-slate-400 backdrop-blur-md">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-slate-300">
              <img alt="Google Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC03_L8e3khwVLI-hhwTC0KC1CFXUAX25DgiZWQfCQIF4v_xcjswqMbezUgzSEDeXMDK0arPYLW8xNvnP5aMJ4TOPJ3fuHKAttnZm6Lehc6lzmWLtSaVky36_CCKx0ONtLTLSunFSdYCtsOE5OSgYKrqf2-WFnxjKADggfx9_F8-CotLkIw8AZ8T6DgNm7OsvBJ6lcAIpQO9o2HDu8q56Jh7VUa26bPneVIu6YrxYfLeuADCKzBwkvAA66RePdQgGtnreYTrMAGGhnu"/>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-slate-300">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
              </svg>
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>
        </div>
        <p className="text-center mt-8 text-slate-600 dark:text-slate-400 text-sm">
          Don't have an account? 
          <Link className="text-[#7f0df2] font-bold hover:underline underline-offset-4" href="/signup">Create workspace</Link>
        </p>
      </div>
    </div>
  );
}
