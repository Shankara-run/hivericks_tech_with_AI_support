import { Leaf, Layers, Users } from "lucide-react";
import { Section } from "./Section";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CARDS = [
  {
    icon: Leaf,
    title: "Green First",
    body: "Every product is designed with environmental impact in mind from day one.",
  },
  {
    icon: Layers,
    title: "End-to-End",
    body: "From concept and PCB design through firmware, app, and market launch.",
  },
  {
    icon: Users,
    title: "Customer Partners",
    body: "We grow with you, not just for you. Your feedback shapes what we build.",
  },
];

export function Vision() {
  const { ref, visible } = useScrollAnimation<HTMLDivElement>(0.1);
  return (
    <Section
      id="vision"
      label="01 / VISION"
      heading="Partners, Not Just Clients"
      intro={
        <div className="space-y-4">
          <p>
            At Hivericks, we believe in more than building products — we believe in
            building partnerships. We are a company built by hardworking, passionate
            engineers united by a single mission: make processes simpler, data more
            accessible, and problem solving more manageable.
          </p>
          <p>
            We look at every customer as a partner — someone we want to build something
            revolutionary with. We welcome constant feedback, iterate relentlessly, and
            ensure every solution creates genuine excitement and delivers real value.
          </p>
          <p>
            We are committed to delivering world-class solutions that live at the
            intersection of technology and sustainability — a Connected World where
            smart innovation and responsible design are inseparable.
          </p>
        </div>
      }
    >
      <div ref={ref} className="grid md:grid-cols-3 gap-5">
        {CARDS.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="p-7 rounded-xl group transition-all"
              style={{
                background: "#141414",
                border: "1px solid #2a2a2a",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(72,160,248,0.4)";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(72,160,248,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2a2a2a";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                style={{ background: "rgba(72,160,248,0.1)" }}
              >
                <Icon className="w-5 h-5 text-[#48a0f8]" />
              </div>
              <h3 className="text-white text-[20px] font-semibold font-display mb-2">
                {c.title}
              </h3>
              <p className="text-[14.5px] text-[#8a8a8a] leading-relaxed">{c.body}</p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
