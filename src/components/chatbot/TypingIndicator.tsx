import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-[#f0f6ff] rounded-2xl rounded-tl-none w-fit">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-[#48a0f8]/60"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}
