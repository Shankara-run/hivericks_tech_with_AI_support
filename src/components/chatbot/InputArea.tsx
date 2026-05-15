import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUp } from "lucide-react";

type Props = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export function InputArea({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled) ref.current?.focus();
  }, [disabled]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const v = value.trim();
    if (!v || disabled) return;
    onSend(v);
    setValue("");
  };

  return (
    <form
      onSubmit={submit}
      className="border-t flex items-end gap-2 px-4 py-3"
      style={{ borderColor: "var(--chat-divider)" }}
    >
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) submit(e);
        }}
        rows={1}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 resize-none max-h-32 text-[14px] leading-[1.5] px-3.5 py-2.5 rounded-lg outline-none transition-all"
        style={{
          background: "var(--chat-input-bg)",
          border: "1px solid var(--chat-input-border)",
          color: "#1a1a1a",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--chat-input-focus)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(72,160,248,0.2)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--chat-input-border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: "#48a0f8" }}
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.background = "#2a7ad4";
        }}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#48a0f8")}
        aria-label="Send"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </form>
  );
}
