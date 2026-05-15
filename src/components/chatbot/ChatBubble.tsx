import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { chatStore, useChatStore } from "./chatStore";

export function ChatBubble() {
  const { open } = useChatStore();
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("hive_nudged")) return;
    const showT = setTimeout(() => {
      if (!chatStore.get().open) setShowNudge(true);
    }, 6000);
    const hideT = setTimeout(() => setShowNudge(false), 16000);
    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setShowNudge(false);
      sessionStorage.setItem("hive_nudged", "1");
    }
  }, [open]);

  if (open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[998] flex items-center gap-3">
      <AnimatePresence>
        {showNudge && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="px-3.5 py-2 rounded-full text-[13px] text-white"
            style={{
              background: "#0a0a0a",
              border: "1px solid rgba(72,160,248,0.4)",
            }}
            onClick={() => {
              setShowNudge(false);
              sessionStorage.setItem("hive_nudged", "1");
            }}
          >
            Ask me anything 💬
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => chatStore.setOpen(true)}
        aria-label="Open Hive chat"
        className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{ background: "#48a0f8" }}
      >
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full pointer-events-none">
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: "rgba(72,160,248,0.45)",
              animation: "hive-pulse 5s ease-out infinite",
            }}
          />
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: "rgba(72,160,248,0.45)",
              animation: "hive-pulse 5s ease-out infinite",
              animationDelay: "0.6s",
            }}
          />
        </span>
        <motion.span
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 flex items-center justify-center"
        >
          <Sparkles className="w-5 h-5" />
        </motion.span>
      </button>

      <style>{`
        @keyframes hive-pulse {
          0%   { transform: scale(1);   opacity: 0.45; }
          70%  { transform: scale(1.7); opacity: 0;    }
          100% { transform: scale(1.7); opacity: 0;    }
        }
      `}</style>
    </div>
  );
}
