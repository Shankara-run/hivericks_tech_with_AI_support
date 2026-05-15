import { motion } from "framer-motion";
import { useMemo } from "react";

const PHRASES = [
  "Wiring things up",
  "Brewing some IoT",
  "Charging the idea",
  "Connecting sensors",
  "Soldering thoughts",
];

export function TypingIndicator() {
  const phrase = useMemo(() => PHRASES[Math.floor(Math.random() * PHRASES.length)], []);

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-[#f0f6ff] rounded-2xl rounded-tl-none w-fit">
      <span className="text-[13px] text-[#48a0f8] font-medium">{phrase}</span>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#48a0f8]/60"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}
