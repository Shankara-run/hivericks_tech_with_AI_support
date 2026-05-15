import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { chatStore } from "@/components/chatbot/chatStore";

const HEADING_LINES = ["Engineering the", "Connected World."];

function HexMesh() {
  // Decorative SVG: hex nodes with pulsing connection lines
  const nodes = [
    { x: 80, y: 80 },
    { x: 220, y: 60 },
    { x: 360, y: 130 },
    { x: 140, y: 200 },
    { x: 300, y: 240 },
    { x: 80, y: 320 },
    { x: 240, y: 360 },
    { x: 380, y: 320 },
  ];
  const lines: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 3],
    [1, 3],
    [3, 4],
    [2, 4],
    [3, 5],
    [4, 6],
    [5, 6],
    [4, 7],
    [6, 7],
  ];
  return (
    <svg
      viewBox="0 0 460 420"
      className="w-full h-full max-w-[520px] mx-auto opacity-90"
      fill="none"
    >
      {lines.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="#48a0f8"
          strokeWidth="1"
          strokeOpacity="0.35"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, opacity: [0.15, 0.45, 0.15] }}
          transition={{
            pathLength: { duration: 1.2, delay: i * 0.08 },
            opacity: { duration: 3, repeat: Infinity, delay: i * 0.2 },
          }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.g
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        >
          <motion.circle
            cx={n.x}
            cy={n.y}
            r="22"
            fill="rgba(72,160,248,0.08)"
            stroke="#48a0f8"
            strokeOpacity="0.5"
            animate={{ r: [22, 26, 22], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
          />
          <polygon
            points={hexPoints(n.x, n.y, 10)}
            fill="#48a0f8"
            opacity="0.85"
          />
        </motion.g>
      ))}
    </svg>
  );
}

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-[68px] dot-grid">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center w-full">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px]"
            style={{
              border: "1px solid rgba(72,160,248,0.4)",
              background: "rgba(72,160,248,0.08)",
              color: "#48a0f8",
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            IoT · CleanTech · Smart Embedded
          </motion.div>

          <h1 className="font-display font-extrabold text-white mt-6 text-[44px] md:text-[64px] lg:text-[72px] leading-[1.05]">
            {HEADING_LINES.map((line, li) => (
              <div key={li} className="overflow-hidden">
                {line.split(" ").map((w, wi) => (
                  <motion.span
                    key={`${li}-${wi}`}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.1 + (li * 3 + wi) * 0.06,
                      duration: 0.5,
                      ease: [0.2, 0.8, 0.2, 1],
                    }}
                    className="inline-block mr-[0.25em]"
                  >
                    {w}
                  </motion.span>
                ))}
              </div>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-6 text-[17px] md:text-[18px] text-[#8a8a8a] max-w-[560px] leading-relaxed"
          >
            Hivericks is a team of passionate engineers creating solutions that make
            processes simpler, data more accessible, and complex problem solving more
            manageable — for a smarter, connected future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="px-5 py-3 rounded-lg text-[14px] font-medium transition-all"
              style={{
                border: "1px solid #48a0f8",
                color: "#48a0f8",
                background: "transparent",
              }}
            >
              Explore Our Work
            </a>
            <button
              type="button"
              onClick={() => chatStore.openInScopeCheck()}
              className="px-5 py-3 rounded-lg text-[14px] font-medium text-white transition-all hover:brightness-110"
              style={{
                background: "#48a0f8",
                boxShadow: "0 0 24px rgba(72,160,248,0.35)",
              }}
            >
              Check If Your Concept Is Possible →
            </button>
          </motion.div>
        </div>

        <div className="hidden lg:block">
          <HexMesh />
        </div>
      </div>
    </section>
  );
}
