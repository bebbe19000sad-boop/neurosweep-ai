import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { prisma } from "./prisma";

export async function getAIResponse(userId: string, model: string, messages: any[], chatId: string) {
  // Check credits
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  if (!user || user.credits <= 0) {
    throw new Error("Insufficient credits");
  }

  // Deduct 1 credit
  await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: 1 } },
  });

  // Get API Keys from DB (Admin settings)
  const openaiKey = await prisma.aPIKey.findUnique({ where: { provider: "openai" } });
  const googleKey = await prisma.aPIKey.findUnique({ where: { provider: "gemini" } });

  const customGoogle = createGoogleGenerativeAI({
    apiKey: googleKey?.key || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
  });

  const customOpenai = createOpenAI({
    apiKey: openaiKey?.key || process.env.OPENAI_API_KEY || "",
  });

  const selectedModel = model === "gemini" 
    ? customGoogle("gemini-1.5-pro")
    : customOpenai("gpt-4o");

  const result = await streamText({
    model: selectedModel as any,
    messages,
    async onFinish({ text, usage }) {
      try {
        const finalMessages = [...messages, { role: "assistant", content: text }];
        
        await prisma.chat.upsert({
          where: { id: chatId },
          create: { 
             id: chatId, 
             userId, 
             model,
             messages: {
                create: finalMessages.map((m: any) => ({
                   role: m.role,
                   content: m.content
                }))
             }
          },
          update: { 
             messages: {
                deleteMany: {},
                create: finalMessages.map((m: any) => ({
                   role: m.role,
                   content: m.content
                }))
             }
          }
        });

        await prisma.usageLog.create({
          data: {
            userId,
            model,
            promptTokens: usage?.promptTokens || 0,
            completionTokens: usage?.completionTokens || 0,
            creditsDeducted: 1
          }
        });
      } catch (e) {
        console.error("Error saving chat history or usage log:", e);
      }
    }
  });

  return result.toTextStreamResponse();
}
