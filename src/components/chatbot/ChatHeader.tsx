import { Minus, X } from "lucide-react";
import { HivericksLogo } from "@/components/HivericksLogo";

type Props = {
  onClose: () => void;
};

export function ChatHeader({ onClose }: Props) {
  return (
    <header
      className="h-16 flex items-center justify-between px-4 shrink-0"
      style={{ background: "var(--chat-header-bg)" }}
    >
      <div className="flex items-center gap-2.5">
        <HivericksLogo size={28} showWordmark={false} />
        <div className="flex items-baseline gap-2">
          <span className="text-white font-semibold text-[15px]">Hive</span>
          <span className="text-[13px] text-[#48a0f8] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#48a0f8] inline-block" />
            Online
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Minimize"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
