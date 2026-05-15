import { Section } from "./Section";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const BARS: { label: string; value: number }[] = [
  { label: "Embedded Firmware Development", value: 95 },
  { label: "CleanTech Product Engineering", value: 95 },
  { label: "IoT System Architecture", value: 90 },
  { label: "Battery Management Systems", value: 90 },
  { label: "Hardware Prototyping & PCB Design", value: 85 },
  { label: "Smart Home & Industrial IoT", value: 85 },
  { label: "AI-Enabled Product Development", value: 80 },
  { label: "Concept to Manufactured Product", value: 75 },
];

const AWARDS = [
  "Top 5 — Chennai-Next Startup Challenge 2018-19 (CI-TIC / TREC-STEP)",
  "Grant Recipient — IIIT Sri City (7 Lakhs INR)",
  "Featured in Forbes India (Xoptimus)",
  "Winner — Propel Pitchfest22, BML Munjal University",
  "Selected — T-Hub Semiconductor Programme",
  "Incubated: TREC-STEP · AIC RAISE · NSRCEL · Microsoft for Startups · AWS",
];

export function Competency() {
  const { ref, visible } = useScrollAnimation<HTMLDivElement>(0.1);
  return (
    <Section
      id="competency"
      label="03 / COMPETENCY"
      heading="What We're Exceptionally Good At"
      intro={
        <p>
          Our team brings together hardware engineers, firmware developers, IoT
          architects, and product designers who have shipped real products from idea to
          market.
        </p>
      }
    >
      <div ref={ref} className="grid lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-5">
          {BARS.map((b, i) => (
            <div key={b.label}>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[14.5px] text-white/85 font-medium">{b.label}</span>
                <span className="text-[13px] text-[#48a0f8] font-mono">{b.value}%</span>
              </div>
              <div className="h-1.5 bg-[#1c1c1c] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={visible ? { width: `${b.value}%` } : {}}
                  transition={{ duration: 1.1, delay: i * 0.08, ease: "easeOut" }}
                  className="h-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #2a7ad4, #48a0f8)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="p-7 rounded-xl h-fit"
          style={{
            background: "rgba(72,160,248,0.06)",
            border: "1px solid rgba(72,160,248,0.25)",
          }}
        >
          <h3 className="text-white font-semibold text-[18px] mb-4">
            Recognition & Awards
          </h3>
          <ul className="space-y-3">
            {AWARDS.map((a) => (
              <li key={a} className="text-[14px] text-white/80 leading-relaxed flex gap-2">
                <span className="text-[#48a0f8] mt-1">·</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Section>
  );
}
