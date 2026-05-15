import { Cpu, Microchip, Leaf, Home, BatteryCharging, Factory } from "lucide-react";
import { Section } from "./Section";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CARDS = [
  {
    icon: Cpu,
    title: "IoT Architecture",
    body: "End-to-end IoT system design covering sensors, edge devices, cloud connectivity, and real-time dashboards. Protocols: MQTT, LoRa, Wi-Fi, BLE, 4G/LTE, AWS IoT Core, Azure IoT Hub.",
  },
  {
    icon: Microchip,
    title: "Embedded Systems Engineering",
    body: "Custom firmware and microcontroller programming — STM32, ESP32, Arduino, FreeRTOS — along with PCB design and hardware bring-up for production devices.",
  },
  {
    icon: Leaf,
    title: "CleanTech & Green Electronics",
    body: "Environmentally responsible product design: energy-efficient circuits, sustainable materials, and engineering choices that cut carbon footprint from the circuit board up.",
  },
  {
    icon: Home,
    title: "Smart Home & Building Automation",
    body: "End-to-end smart environments — intelligent lighting, climate control, security systems, and energy management, all IoT-connected.",
  },
  {
    icon: BatteryCharging,
    title: "Battery & Power Management",
    body: "AI-enabled battery management systems (BMS), smart charging algorithms, Li-Ion protection circuits, and real-time energy optimization firmware.",
  },
  {
    icon: Factory,
    title: "Industry 4.0 Solutions",
    body: "Industrial IoT for manufacturing: predictive maintenance, real-time machine monitoring, data acquisition, and process automation for smart factories.",
  },
];

type TechProps = {
  dark?: boolean;
};

export function Technology({ dark }: TechProps) {
  const { ref, visible } = useScrollAnimation<HTMLDivElement>(0.08);
  return (
    <Section
      id="technology"
      label="02 / TECHNOLOGY"
      heading="The Stack Behind the Solutions"
      dark={dark}
      intro={
        <p>
          We operate at the intersection of hardware intelligence and software
          connectivity — building products that are smart, efficient, and built to last.
        </p>
      }
    >
      <div ref={ref} className="grid md:grid-cols-2 gap-5">
        {CARDS.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="p-7 rounded-xl"
              style={{
                background: dark ? "#141414" : "#f9fafb",
                border: dark ? "1px solid #2a2a2a" : "1px solid #e5e7eb",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(72,160,248,0.4)";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(72,160,248,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = dark ? "#2a2a2a" : "#e5e7eb";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                style={{ background: "rgba(72,160,248,0.1)" }}
              >
                <Icon className="w-5 h-5 text-[#48a0f8]" />
              </div>
              <h3 className={`text-[20px] font-semibold font-display mb-2 ${dark ? "text-white" : "text-black"}`}>
                {c.title}
              </h3>
              <p className={`text-[14.5px] leading-relaxed ${dark ? "text-[#8a8a8a]" : "text-black/60"}`}>
                {c.body}
              </p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
