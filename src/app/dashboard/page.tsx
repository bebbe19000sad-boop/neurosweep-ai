import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import ChatInterface from "@/components/dashboard/ChatInterface";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage({ searchParams }: { searchParams: { chatId?: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { id: true, email: true, name: true, role: true, credits: true }
  });

  const chats = await prisma.chat.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, updatedAt: true, messages: { orderBy: { createdAt: 'asc' } } }
  });

  const currentChat = searchParams?.chatId ? chats.find((c: any) => c.id === searchParams.chatId) : null;
  const initialMessages = currentChat?.messages || [];

  return (
    <div className="flex h-screen w-full bg-[#0d0a13] text-white">
      <Sidebar user={user} chats={chats} />
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <ChatInterface 
          credits={user?.credits || 0} 
          initialChatId={currentChat?.id}
          initialMessages={initialMessages}
        />
      </main>
    </div>
  );
}
