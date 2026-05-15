import { motion } from "framer-motion";
import type { Chip } from "./useChat";

type Props = {
  chips: Chip[];
  onPick: (chip: Chip) => void;
};

export function QuickReplies({ chips, onPick }: Props) {
  return (
    <div className="flex flex-wrap gap-2 px-1 pt-2">
      {chips.map((chip, i) => (
        <motion.button
          key={chip.label + i}
          type="button"
          onClick={() => onPick(chip)}
          initial={{ opacity: 0, scale: 0.95, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.25 }}
          className="text-[13px] font-medium px-3.5 py-1.5 rounded-full border transition-colors"
          style={{
            background: "var(--chat-chip-bg)",
            color: "var(--chat-chip-text)",
            borderColor: "var(--chat-chip-border)",
          }}
        >
          {chip.label}
        </motion.button>
      ))}
    </div>
  );
}
