import { groq } from "@ai-sdk/groq";
import {
  streamText,
  convertToModelMessages,
  tool,
  isStepCount,
  createUIMessageStreamResponse,
  toUIMessageStream,
  UIMessage,
} from "ai";
import { z } from "zod";
import { retrieve } from "@/lib/rag";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const last = messages[messages.length - 1];
  const q = last.parts.filter((p) => p.type === "text").map((p: any) => p.text).join(" ");
  const ctx = q ? await retrieve(q) : [];

  const result = streamText({
    model: groq("qwen/qwen3.8-27b"),
    system: `You are StudyBuddy, a friendly tutor. Use this context when relevant and say so if it's not covered:\n\n${ctx.map((c) => c.text).join("\n---\n")}\n\nIf the user uploads an image, explain what's in it step by step. If they ask for a quiz, call createQuiz.`,
    messages: await convertToModelMessages(messages),
    stopWhen: isStepCount(3),
    tools: {
      createQuiz: tool({
        description: "Create a multiple-choice quiz on a topic",
        inputSchema: z.object({
          topic: z.string(),
          questions: z.array(z.object({
            question: z.string(),
            options: z.array(z.string()).length(4),
            answerIndex: z.number(),
          })),
        }),
        execute: async (input) => input,
      }),
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}