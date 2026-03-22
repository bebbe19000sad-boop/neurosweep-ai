import { prisma } from "@/lib/prisma";
import APIKeyManager from "@/components/admin/APIKeyManager";

export default async function APIKeysPage() {
  const keys = await prisma.aPIKey.findMany();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage AI API Keys</h1>
      <div className="bg-white/5 p-8 rounded-xl border border-white/10 max-w-2xl">
        <APIKeyManager initialKeys={keys} />
      </div>
    </div>
  );
}
