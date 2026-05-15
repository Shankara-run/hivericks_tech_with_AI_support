import { Section } from "./Section";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const METRICS = [
  { value: "38%", label: "Carbon footprint reduction" },
  { value: "40%", label: "Battery life improvement" },
  { value: "~40%", label: "E-waste reduction" },
  { value: "Forbes", label: "India Featured" },
];

const TECH_TAGS_X = ["Embedded AI", "BMS", "Power Electronics", "Firmware", "Mobile App"];

function Pill({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide"
      style={
        accent
          ? { background: "rgba(72,160,248,0.12)", color: "#48a0f8" }
          : { background: "#1c1c1c", color: "#8a8a8a", border: "1px solid #2a2a2a" }
      }
    >
      {children}
    </span>
  );
}

function TechTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[12px] text-white/60 px-2.5 py-1 rounded-md border border-[#2a2a2a]">
      {children}
    </span>
  );
}

export function Projects({ dark }: { dark?: boolean }) {
  const { ref, visible } = useScrollAnimation<HTMLDivElement>(0.05);
  return (
    <Section
      id="projects"
      label="04 / PROJECTS"
      heading="What We've Built"
      dark={dark}
      intro={
        <p>
          Every project we ship is proof of our belief: that smart technology and
          responsible design belong together.
        </p>
      }
    >
      <div ref={ref} className="space-y-6">
        {/* Xoptimus — featured */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="p-8 md:p-10 rounded-2xl"
          style={{
            background: "#141414",
            border: "1px solid rgba(72,160,248,0.25)",
          }}
        >
          <div className="flex flex-wrap gap-2 mb-4">
            <Pill accent>FEATURED</Pill>
            <Pill accent>PATENTED</Pill>
          </div>
          <div className="text-[12px] uppercase tracking-[0.12em] text-[#48a0f8] font-medium mb-3">
            CleanTech · Consumer Electronics · AI Hardware
          </div>
          <h3 className="font-display font-bold text-white text-[32px] md:text-[42px] leading-[1.1] mb-4">
            Xoptimus
          </h3>
          <p className="text-[17px] text-white/80 mb-2 italic">
            "The world's smartest charger for your smartest devices."
          </p>
          <p className="text-[15px] text-[#8a8a8a] leading-relaxed mb-8 max-w-3xl">
            Xoptimus is Hivericks' flagship AI-enabled smart charging solution for
            Li-Ion devices — smartphones and laptops. Unlike conventional chargers,
            Xoptimus creates unique charge programs tailored to each battery, eliminates
            harmful trickle charging, monitors battery temperature in real time, and
            includes smart call detection. Designed with a green-first philosophy, it
            reduces individual carbon footprint by 38%, extends battery life
            significantly, and cuts e-waste contribution by approximately 40%.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
            {METRICS.map((m) => (
              <div
                key={m.label}
                className="p-4 rounded-lg"
                style={{
                  background: "rgba(10,10,10,0.6)",
                  border: "1px solid #2a2a2a",
                }}
              >
                <div className="font-display font-bold text-[24px] text-[#48a0f8] mb-1">
                  {m.value}
                </div>
                <div className="text-[12px] text-[#8a8a8a] leading-snug">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {TECH_TAGS_X.map((t) => (
              <TechTag key={t}>{t}</TechTag>
            ))}
          </div>
        </motion.article>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="p-7 rounded-xl"
            style={{ background: "#141414", border: "1px solid #2a2a2a" }}
          >
            <div className="text-[12px] uppercase tracking-[0.12em] text-[#48a0f8] font-medium mb-3">
              Industrial IoT · Smart Home · Supply Chain
            </div>
            <h3 className="font-display font-bold text-white text-[24px] mb-3">
              Smart IoT Embedded Solutions
            </h3>
            <p className="text-[14.5px] text-[#8a8a8a] leading-relaxed mb-5">
              Custom end-to-end IoT systems for homes and industries — from sensor
              hardware and edge devices to cloud dashboards and mobile apps. Designed
              for real-time monitoring, automation, and actionable intelligence at any
              scale.
            </p>
            <div className="flex flex-wrap gap-2">
              {["ESP32", "LoRa", "MQTT", "AWS IoT", "React Dashboards"].map((t) => (
                <TechTag key={t}>{t}</TechTag>
              ))}
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="p-7 rounded-xl"
            style={{ background: "#141414", border: "1px solid #2a2a2a" }}
          >
            <div className="text-[12px] uppercase tracking-[0.12em] text-[#48a0f8] font-medium mb-3">
              CleanTech · Product Engineering
            </div>
            <h3 className="font-display font-bold text-white text-[24px] mb-3">
              Green Embedded Devices
            </h3>
            <p className="text-[14.5px] text-[#8a8a8a] leading-relaxed mb-5">
              Designing and manufacturing energy-efficient electronic devices with a
              green-first engineering philosophy — from initial concept and PCB design
              through prototyping and pilot manufacturing.
            </p>
            <div className="flex flex-wrap gap-2">
              {["PCB Design", "STM32", "Energy Harvesting", "Sustainable Materials"].map(
                (t) => (
                  <TechTag key={t}>{t}</TechTag>
                ),
              )}
            </div>
          </motion.article>
        </div>
      </div>
    </Section>
  );
}
