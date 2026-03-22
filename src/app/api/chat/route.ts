import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAIResponse } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id, messages, model } = await req.json();
    const userId = (session.user as any).id;

    // The id is provided by the frontend useChat hook or generated below.
    const chatId = id || "chat_" + Math.random().toString(36).substring(7);

    return await getAIResponse(userId, model, messages, chatId);
  } catch (error: any) {
    console.error("CHAT_API_ERROR", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
