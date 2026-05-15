import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { HIVE_SYSTEM_PROMPT } from "@/components/chatbot/systemPrompt";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

const ERROR_REPLIES = {
  rate: "I'm fielding lots of questions — try again in 30s!",
  generic: "Something went wrong on my end. Try again in a moment?",
  timeout: "I'm having a slow moment. Send that again?",
  empty: "Hmm, couldn't form a reply. Could you try rephrasing?",
  credits:
    "We've used up our AI credits for now — please ping the team at team@hivericks.com and they'll follow up.",
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        let body: { messages?: ChatMessage[] };
        try {
          body = (await request.json()) as { messages?: ChatMessage[] };
        } catch {
          return Response.json({ reply: ERROR_REPLIES.generic }, { status: 200 });
        }

        const incoming = Array.isArray(body.messages) ? body.messages : [];
        if (incoming.length === 0) {
          return Response.json({ reply: ERROR_REPLIES.empty }, { status: 200 });
        }

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return Response.json(
            {
              reply:
                "Lovable AI isn't configured yet. Enable Lovable AI in Cloud settings to power Hive.",
            },
            { status: 200 },
          );
        }

        const messages = [
          { role: "system" as const, content: HIVE_SYSTEM_PROMPT },
          ...incoming.filter((m) => m && (m.role === "user" || m.role === "assistant")),
        ];

        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 25_000);

          const upstream = await fetch(
            "https://ai.gateway.lovable.dev/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "X-Lovable-AIG-SDK": "fetch",
              },
              body: JSON.stringify({
                model: "google/gemini-3-flash-preview",
                messages,
                temperature: 0.72,
                max_tokens: 600,
              }),
              signal: controller.signal,
            },
          );
          clearTimeout(timeout);

          if (upstream.status === 429) {
            return Response.json({ reply: ERROR_REPLIES.rate }, { status: 200 });
          }
          if (upstream.status === 402) {
            return Response.json({ reply: ERROR_REPLIES.credits }, { status: 200 });
          }
          if (!upstream.ok) {
            return Response.json({ reply: ERROR_REPLIES.generic }, { status: 200 });
          }

          const data = (await upstream.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (!reply) {
            return Response.json({ reply: ERROR_REPLIES.empty }, { status: 200 });
          }
          return Response.json({ reply }, { status: 200 });
        } catch (err) {
          if ((err as Error)?.name === "AbortError") {
            return Response.json({ reply: ERROR_REPLIES.timeout }, { status: 200 });
          }
          console.error("[/api/chat] error", err);
          return Response.json({ reply: ERROR_REPLIES.generic }, { status: 200 });
        }
      },
    },
  },
});
