import { Sparkles } from "lucide-react";
import type { ChatMessage } from "./useChat";
import { ConceptSnapshotCard } from "./ConceptSnapshotCard";

type Props = {
  message: ChatMessage;
};

export function Message({ message }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[78%] px-4 py-2.5 rounded-[12px] rounded-br-[2px] text-[14px] leading-[1.55] whitespace-pre-wrap break-words"
          style={{
            background: "var(--chat-msg-user-bg)",
            color: "var(--chat-msg-user-text)",
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 items-start">
      <div className="w-8 h-8 rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4 text-[#48a0f8]" />
      </div>
      <div className="max-w-[82%]">
        <div
          className="px-4 py-2.5 rounded-[12px] rounded-tl-[2px] text-[14px] leading-[1.6] whitespace-pre-wrap break-words"
          style={{
            background: "var(--chat-msg-bot-bg)",
            color: "var(--chat-msg-bot-text)",
          }}
        >
          {message.content}
        </div>
        {message.snapshot && <ConceptSnapshotCard snapshot={message.snapshot} />}
        <div className="text-[11px] text-[#9ca3af] mt-1 px-1">
          Hive ·{" "}
          {new Date(message.ts).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
