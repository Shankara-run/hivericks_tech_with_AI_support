import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { HIVE_SYSTEM_PROMPT } from "@/components/chatbot/systemPrompt";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

const ERROR_REPLIES = {
  rate: "I'm fielding lots of questions — try again in 30s!",
  generic: "Something went wrong on my end. Try again in a moment?",
  timeout: "I'm having a slow moment. Send that again?",
  empty: "Hmm, couldn't form a reply. Could you try rephrasing?",
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

        let apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          try {
            const fs = await import("fs");
            const path = await import("path");
            const varsPath = path.resolve(process.cwd(), ".dev.vars");
            const content = fs.readFileSync(varsPath, "utf-8");
            for (const line of content.split("\n")) {
              const trimmed = line.trim();
              if (trimmed && !trimmed.startsWith("#")) {
                const eqIdx = trimmed.indexOf("=");
                if (eqIdx > 0) {
                  const key = trimmed.slice(0, eqIdx).trim();
                  const val = trimmed.slice(eqIdx + 1).trim();
                  if (key === "OPENAI_API_KEY") apiKey = val;
                }
              }
            }
          } catch {}
        }
        if (!apiKey) {
          return Response.json(
            {
              reply:
                "AI isn't configured yet. Set OPENAI_API_KEY in your environment to power Hive.",
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
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "gpt-5-nano",
                messages,
                max_completion_tokens: 4096,
              }),
              signal: controller.signal,
            },
          );
          clearTimeout(timeout);

          if (upstream.status === 429) {
            return Response.json({ reply: ERROR_REPLIES.rate }, { status: 200 });
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
