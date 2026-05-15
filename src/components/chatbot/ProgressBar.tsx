import { useEffect, useRef } from "react";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  count: number;
};

function barColor(pct: number) {
  if (pct <= 0) return "#e5e7eb";
  if (pct <= 0.25) return "#facc15";
  if (pct <= 0.5) return "#a3e635";
  if (pct <= 0.75) return "#4ade80";
  return "#22c55e";
}

export function ProgressBar({ count }: Props) {
  const pct = Math.min(count / 4, 1);
  const bulbShown = useRef(false);

  useEffect(() => {
    if (count >= 4 && !bulbShown.current) {
      bulbShown.current = true;
    }
  }, [count]);

  if (count <= 0 || (count >= 4 && bulbShown.current)) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="h-1.5 flex-1 rounded-full bg-[#e5e7eb] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ background: barColor(pct) }}
        />
      </div>
      {count >= 4 && !bulbShown.current && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
        >
          <Lightbulb className="w-5 h-5 text-[#facc15]" fill="#facc15" />
        </motion.div>
      )}
    </div>
  );
}
