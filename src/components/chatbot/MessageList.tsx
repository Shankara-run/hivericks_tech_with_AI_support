import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { Message } from "./Message";
import { QuickReplies } from "./QuickReplies";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage, Chip } from "./useChat";

type Props = {
  messages: ChatMessage[];
  loading: boolean;
  onChip: (chip: Chip) => void;
};

export function MessageList({ messages, loading, onChip }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const lastChips = messages.length > 0 ? messages[messages.length - 1].chips : undefined;

  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto chat-scroll bg-white"
    >
      {/* Welcome banner */}
      <div
        className="px-5 py-4 text-center"
        style={{ background: "#f0f6ff" }}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-[#48a0f8]" />
          <span className="text-[15px] font-medium text-[#1a1a1a]">
            Ask anything or explore with AI
          </span>
        </div>
        <p className="text-[13px] text-[#6b7280]">
          I can answer questions about Hivericks, or check if your concept is a good fit.
        </p>
      </div>

      <div className="p-5 space-y-4">
        {messages.map((m) => (
          <Message key={m.id} message={m} />
        ))}
        {loading && (
          <div className="flex gap-2.5 items-start">
            <div className="w-8 h-8 rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#48a0f8]" />
            </div>
            <TypingIndicator />
          </div>
        )}
        {!loading && lastChips && lastChips.length > 0 && (
          <div className="pl-10">
            <QuickReplies chips={lastChips} onPick={onChip} />
          </div>
        )}
      </div>
    </div>
  );
}
