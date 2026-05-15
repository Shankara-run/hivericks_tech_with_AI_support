import { useCallback, useEffect, useRef, useState } from "react";
import { chatStore } from "./chatStore";

export type ChatMessageId = string;

export type SnapshotData = {
  idea: string;
  domain: string;
  problem: string;
  status: string;
  scale: string;
  tech: string;
};

export type ChatMessage = {
  id: ChatMessageId;
  role: "user" | "assistant";
  content: string;
  snapshot?: SnapshotData;
  chips?: Chip[];
  ts: number;
};

export type Chip = {
  label: string;
  /** if true, do not echo the chip as a user message — handle silently */
  silent?: boolean;
  action?: "scope_check" | "snapshot_confirm" | "snapshot_adjust" | "close";
};

type Phase =
  | "greeting"
  | "faq"
  | "scope_check"
  | "idea_funnel"
  | "lead_capture_name"
  | "lead_capture_email"
  | "closing";

const SCOPE_KEYWORDS = [
  "idea",
  "concept",
  "build",
  "create",
  "possible",
  "can you make",
  "thinking of",
  "i have",
  "startup",
  "develop",
  "prototype",
  "want to",
];

const GOODBYE_KEYWORDS = ["thanks", "thank you", "goodbye", "bye", "that's all", "i'm good", "im good", "all good"];

const GREETING_CONTENT = `Hey there! 👋 I'm Hive — Hivericks' virtual teammate.

I can answer questions about what we build, the tech we work with, and projects we've shipped.

Or if you have a concept in mind, I can help you explore whether it's something we could build together.

What would you like to know?`;

const GREETING_CHIPS: Chip[] = [
  { label: "💡 What does Hivericks do?" },
  { label: "⚡ What tech do you work with?" },
  { label: "🏆 Show me your projects" },
  { label: "🔍 Check if my concept is possible", silent: true, action: "scope_check" },
];

const SCOPE_OPENER = `Great — let's explore this together! 🔍

Think of this as a quick capability check, not a pitch. I'll ask you a few questions, and we'll figure out together if what you have in mind is something Hivericks could bring to life.

Completely no pressure — just here to help you find out!

First question: in a sentence or two, what's the core idea or problem you're thinking about?`;

const CLOSING_CONTENT = `It was great chatting! If you ever want to explore more — about our work, our tech, or another concept — I'm right here. Have a great day! ⚡`;

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function detectScopeKeywords(text: string) {
  const lower = text.toLowerCase();
  return SCOPE_KEYWORDS.some((k) => lower.includes(k));
}

function detectGoodbye(text: string) {
  const lower = text.toLowerCase().trim();
  return GOODBYE_KEYWORDS.some((k) => lower === k || lower.startsWith(k));
}

function parseSnapshot(text: string): SnapshotData | null {
  const m = text.match(/---CONCEPT SNAPSHOT---([\s\S]*?)---END SNAPSHOT---/);
  if (!m) return null;
  const block = m[1];
  const get = (label: string) => {
    const re = new RegExp(`${label}\\s*:\\s*(.+)`, "i");
    const r = block.match(re);
    return r ? r[1].trim() : "";
  };
  return {
    idea: get("Idea"),
    domain: get("Domain"),
    problem: get("Problem"),
    status: get("Current status"),
    scale: get("Scale"),
    tech: get("Tech direction"),
  };
}

function stripSnapshotMarkers(text: string) {
  return text.replace(/---CONCEPT SNAPSHOT---[\s\S]*?---END SNAPSHOT---/g, "").trim();
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<Phase>("greeting");
  const [loading, setLoading] = useState(false);
  const initialized = useRef(false);
  const faqCount = useRef(0);
  const leadName = useRef<string | null>(null);

  const apiHistory = useRef<{ role: "user" | "assistant"; content: string }[]>([]);

  const addBot = useCallback((content: string, chips?: Chip[], snapshot?: SnapshotData) => {
    const msg: ChatMessage = {
      id: uid(),
      role: "assistant",
      content,
      chips,
      snapshot,
      ts: Date.now(),
    };
    setMessages((m) => [...m, msg]);
    apiHistory.current.push({ role: "assistant", content });
  }, []);

  const addUser = useCallback((content: string) => {
    const msg: ChatMessage = { id: uid(), role: "user", content, ts: Date.now() };
    setMessages((m) => [...m, msg]);
    apiHistory.current.push({ role: "user", content });
  }, []);

  // greeting on first open OR scope-check direct
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const wantsScope = chatStore.consumePendingScopeCheck();
    if (wantsScope) {
      setPhase("scope_check");
      apiHistory.current.push({ role: "assistant", content: SCOPE_OPENER });
      setTimeout(() => {
        setMessages([
          {
            id: uid(),
            role: "assistant",
            content: SCOPE_OPENER,
            ts: Date.now(),
          },
        ]);
      }, 400);
    } else {
      apiHistory.current.push({ role: "assistant", content: GREETING_CONTENT });
      setTimeout(() => {
        setMessages([
          {
            id: uid(),
            role: "assistant",
            content: GREETING_CONTENT,
            chips: GREETING_CHIPS,
            ts: Date.now(),
          },
        ]);
      }, 600);
    }
  }, []);

  const callAi = useCallback(async (extraSystemNudge?: string) => {
    setLoading(true);
    try {
      const messagesPayload = [...apiHistory.current];
      if (extraSystemNudge) {
        messagesPayload.unshift({ role: "assistant", content: extraSystemNudge });
      }
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiHistory.current }),
      });
      const data = (await res.json()) as { reply?: string };
      return data.reply ?? "Hmm, couldn't form a reply. Could you try rephrasing?";
    } catch {
      return "Something went wrong on my end. Try again in a moment?";
    } finally {
      setLoading(false);
    }
  }, []);

  const sendUserMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      addUser(trimmed);

      // Closing keyword check
      if (detectGoodbye(trimmed) && phase !== "lead_capture_name" && phase !== "lead_capture_email") {
        setPhase("closing");
        setTimeout(() => addBot(CLOSING_CONTENT), 400);
        return;
      }

      // Lead capture flow handled locally (no AI needed)
      if (phase === "lead_capture_name") {
        leadName.current = trimmed;
        setPhase("lead_capture_email");
        setTimeout(
          () =>
            addBot(
              `Nice to meet you, ${trimmed}! 😊\n\nAnd your email address — so the team can reach you directly?`,
            ),
          500,
        );
        return;
      }
      if (phase === "lead_capture_email") {
        const name = leadName.current ?? "there";
        setPhase("closing");
        setTimeout(
          () =>
            addBot(
              `You're all set, ${name}! ✅\n\nHere's what happens next:\n\n  1. Our team reviews your Concept Snapshot\n  2. They assess it against our full tech capabilities in detail\n  3. They come back to you with honest thoughts — what's feasible, what might need rethinking, and how we could work together\n\nWe'll reach you at ${trimmed} within 2-3 working days.\n\nThank you for exploring this with us — concepts like yours are exactly why we love building things. 🌱\n\nIs there anything else you'd like to know about Hivericks?`,
              [
                { label: "💡 Tell me about your tech" },
                { label: "🏆 Show me past projects" },
                { label: "✅ I'm all good!", silent: true, action: "close" },
              ],
            ),
          500,
        );
        return;
      }

      // Detect scope keywords from FAQ/greeting → switch to scope check
      if ((phase === "greeting" || phase === "faq") && detectScopeKeywords(trimmed)) {
        setPhase("scope_check");
      }

      // Otherwise — let the AI respond
      const reply = await callAi();
      const snapshot = parseSnapshot(reply);
      const cleanReply = snapshot ? stripSnapshotMarkers(reply) : reply;

      let chips: Chip[] | undefined;
      if (snapshot) {
        chips = [
          { label: "✅ Looks right — send it!", silent: true, action: "snapshot_confirm" },
          { label: "✏️ Let me adjust something", silent: true, action: "snapshot_adjust" },
        ];
      }

      addBot(cleanReply || (snapshot ? "Here's what I've put together:" : ""), chips, snapshot ?? undefined);

      if (phase === "faq") faqCount.current += 1;
    },
    [addBot, addUser, callAi, loading, phase],
  );

  const clickChip = useCallback(
    (chip: Chip) => {
      if (chip.action === "scope_check") {
        setPhase("scope_check");
        // remove chips from previous bot message
        setMessages((m) =>
          m.map((msg, i) => (i === m.length - 1 ? { ...msg, chips: undefined } : msg)),
        );
        apiHistory.current.push({
          role: "user",
          content: "I'd like to check if my concept is possible.",
        });
        apiHistory.current.push({ role: "assistant", content: SCOPE_OPENER });
        setTimeout(
          () =>
            setMessages((m) => [
              ...m,
              { id: uid(), role: "assistant", content: SCOPE_OPENER, ts: Date.now() },
            ]),
          400,
        );
        return;
      }
      if (chip.action === "snapshot_confirm") {
        setPhase("lead_capture_name");
        setMessages((m) =>
          m.map((msg, i) => (i === m.length - 1 ? { ...msg, chips: undefined } : msg)),
        );
        const botText = `Brilliant! Our team would love to review this.\n\nJust two quick things so they can reach you:\n\nWhat's your name?`;
        apiHistory.current.push({ role: "user", content: "Looks right — send it!" });
        apiHistory.current.push({ role: "assistant", content: botText });
        setTimeout(() => addBot(botText), 400);
        return;
      }
      if (chip.action === "snapshot_adjust") {
        setMessages((m) =>
          m.map((msg, i) => (i === m.length - 1 ? { ...msg, chips: undefined } : msg)),
        );
        const botText = `No problem! What would you like to tweak? Just tell me what to change and I'll update the snapshot.`;
        apiHistory.current.push({ role: "user", content: "Let me adjust something." });
        apiHistory.current.push({ role: "assistant", content: botText });
        setTimeout(() => addBot(botText), 400);
        return;
      }
      if (chip.action === "close") {
        setMessages((m) =>
          m.map((msg, i) => (i === m.length - 1 ? { ...msg, chips: undefined } : msg)),
        );
        setPhase("closing");
        setTimeout(() => addBot(CLOSING_CONTENT), 300);
        return;
      }
      // Default — send chip label as user message
      void sendUserMessage(chip.label);
    },
    [addBot, sendUserMessage],
  );

  return { messages, sendUserMessage, clickChip, loading };
}
