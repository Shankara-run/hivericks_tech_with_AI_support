import { useCallback, useEffect, useRef, useState } from "react";
import { chatStore } from "./chatStore";

export type ChatMessageId = string;

export type ChatMessage = {
  id: ChatMessageId;
  role: "user" | "assistant";
  content: string;
  chips?: Chip[];
  ts: number;
};

export type Chip = {
  label: string;
  silent?: boolean;
  action?: "scope_check" | "close";
};

type Phase = "greeting" | "scope_check" | "contact_form_fname" | "contact_form_lname" | "contact_form_email" | "contact_form_phone" | "contact_form_subject" | "contact_form_message" | "closing";

const GOODBYE_KEYWORDS = [
  "thanks", "thank you", "goodbye", "bye", "that's all", "thats all",
  "i'm good", "im good", "all good", "okay", "ok", "no", "nah", "nope",
  "nothing else", "that's it", "thats it", "i'm done", "im done",
];

const GREETING_CONTENT = `Hey there! 👋 I'm Hive — Hivericks' virtual teammate.

I can answer questions about what we build, the tech we work with, and projects we've shipped.

Or if you have a concept in mind, I can help you explore whether it's something we could build together.

What would you like to know?`;

const GREETING_CHIPS: Chip[] = [
  { label: "About Hivericks" },
  { label: "Technologies we use" },
  { label: "Past projects" },
  { label: "Check project feasibility", silent: true, action: "scope_check" },
];

const SCOPE_OPENER = `A few quick questions to understand your idea.

What's the core idea or problem you're thinking about?`;

const CLOSING_CONTENT = `It was great chatting! If you ever want to explore more — about our work, our tech, or another concept — I'm right here. Have a great day! ⚡`;

const CONTACT_FORM_OPENER = `We'd love to hear from you! Please share your details below.

What's your first name?`;

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function detectGoodbye(text: string) {
  const lower = text.toLowerCase().trim();
  return GOODBYE_KEYWORDS.some((k) => {
    if (k === lower) return true;
    if (k.includes(" ") && lower.startsWith(k)) return true;
    return false;
  });
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<Phase>("greeting");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const initialized = useRef(false);
  const leadName = useRef<string | null>(null);

  const apiHistory = useRef<{ role: "user" | "assistant"; content: string }[]>([]);

  const addBot = useCallback((content: string, chips?: Chip[]) => {
    const msg: ChatMessage = {
      id: uid(),
      role: "assistant",
      content,
      chips,
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

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const wantsScope = chatStore.consumePendingScopeCheck();
    const wantsContact = chatStore.consumePendingContactForm();
    if (wantsScope) {
      setPhase("scope_check");
      setQuestionCount(0);
      apiHistory.current.push({ role: "user", content: "I'd like to check project feasibility." });
      apiHistory.current.push({ role: "assistant", content: SCOPE_OPENER });
      setTimeout(() => {
        setMessages([
          {
            id: uid(),
            role: "user",
            content: "Check my project feasibility",
            ts: Date.now(),
          },
          {
            id: uid(),
            role: "assistant",
            content: SCOPE_OPENER,
            ts: Date.now(),
          },
        ]);
      }, 400);
    } else if (wantsContact) {
      setPhase("contact_form_fname");
      apiHistory.current.push({ role: "assistant", content: CONTACT_FORM_OPENER });
      setTimeout(() => {
        setMessages([
          {
            id: uid(),
            role: "assistant",
            content: CONTACT_FORM_OPENER,
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

  const callAi = useCallback(async () => {
    setLoading(true);
    try {
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

      if (detectGoodbye(trimmed) && !phase.startsWith("contact_form")) {
        setPhase("closing");
        setTimeout(() => addBot(CLOSING_CONTENT), 400);
        return;
      }

      // Contact form flow handled locally
      if (phase === "contact_form_fname") {
        leadName.current = trimmed;
        setPhase("contact_form_lname");
        setTimeout(() => addBot(`Thanks, ${trimmed}! What's your last name?`), 400);
        return;
      }
      if (phase === "contact_form_lname") {
        setPhase("contact_form_email");
        setTimeout(() => addBot(`Got it. What's your email address?`), 400);
        return;
      }
      if (phase === "contact_form_email") {
        setPhase("contact_form_phone");
        setTimeout(() => addBot(`Great. And your phone number?`), 400);
        return;
      }
      if (phase === "contact_form_phone") {
        setPhase("contact_form_subject");
        setTimeout(() => addBot(`Thanks! What's the subject or type of inquiry you'd like to discuss?`), 400);
        return;
      }
      if (phase === "contact_form_subject") {
        setPhase("contact_form_message");
        setTimeout(() => addBot(`Almost done! Please share your message or describe what you need help with.`), 400);
        return;
      }
      if (phase === "contact_form_message") {
        setPhase("closing");
        setTimeout(
          () => addBot(`Thank you! Your message has been received. Our team will review it and get back to you within 2-3 working days.\n\nWe appreciate you reaching out to Hivericks!`),
          500,
        );
        return;
      }

      // Increment bar when user submits an answer in scope_check
      if (phase === "scope_check" && questionCount < 4) {
        setQuestionCount((c) => c + 1);
      }

      // Let the AI respond
      const reply = await callAi();
      let cleanReply = reply || "";
      let chips: Chip[] | undefined;

      // After FAQ about Hivericks, append Q1 to the same message
      if (phase === "greeting") {
        const lower = trimmed.toLowerCase();
        const askedFaq = lower.includes("about hivericks") || lower.includes("technologies we use") || lower.includes("past projects");
        if (askedFaq) {
          setPhase("scope_check");
          setQuestionCount(0);
          cleanReply = cleanReply + "\n\n" + SCOPE_OPENER;
        }
      }

      addBot(cleanReply, chips);
    },
    [addBot, addUser, callAi, loading, phase, questionCount],
  );

  const clickChip = useCallback(
    (chip: Chip) => {
      if (chip.action === "scope_check") {
        setPhase("scope_check");
        setQuestionCount(0);
        setMessages((m) =>
          m.map((msg, i) => (i === m.length - 1 ? { ...msg, chips: undefined } : msg)),
        );
        apiHistory.current.push({
          role: "user",
          content: "I'd like to check feasibility.",
        });
        apiHistory.current.push({ role: "assistant", content: SCOPE_OPENER });
        setTimeout(
          () =>
            setMessages((m) => [
              ...m,
              {
                id: uid(),
                role: "user",
                content: "Check my project feasibility",
                ts: Date.now(),
              },
              { id: uid(), role: "assistant", content: SCOPE_OPENER, ts: Date.now() },
            ]),
          400,
        );
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
      void sendUserMessage(chip.label);
    },
    [addBot, sendUserMessage],
  );

  return { messages, sendUserMessage, clickChip, loading, questionCount };
}
