import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { InputArea } from "./InputArea";
import { useChat } from "./useChat";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ChatPanel({ open, onClose }: Props) {
  // Render the panel contents only while open so useChat resets between sessions
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Mobile overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-[999] md:hidden"
            onClick={onClose}
          />
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed top-0 right-0 h-screen w-full md:w-[480px] z-[1000] flex flex-col"
            style={{
              background: "var(--chat-panel-bg)",
              boxShadow: "-4px 0 40px rgba(0,0,0,0.5)",
            }}
          >
            <PanelInner onClose={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function PanelInner({ onClose }: { onClose: () => void }) {
  const { messages, sendUserMessage, clickChip, loading } = useChat();
  return (
    <>
      <ChatHeader onClose={onClose} />
      <MessageList messages={messages} loading={loading} onChip={clickChip} />
      <InputArea onSend={sendUserMessage} disabled={loading} />
      <div
        className="text-center text-[11px] py-1.5 border-t"
        style={{ color: "#9ca3af", borderColor: "var(--chat-divider)" }}
      >
        Powered by Hivericks AI
      </div>
    </>
  );
}
