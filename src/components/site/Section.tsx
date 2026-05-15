import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { ReactNode } from "react";

type Props = {
  id?: string;
  label: string;
  heading: string;
  intro?: ReactNode;
  children: ReactNode;
};

export function Section({ id, label, heading, intro, children }: Props) {
  const { ref, visible } = useScrollAnimation<HTMLDivElement>(0.1);
  return (
    <section id={id} className="py-24 md:py-32 px-6 md:px-12 border-t border-[#1e1e1e]">
      <div ref={ref} className="max-w-7xl mx-auto">
        <div className="section-label mb-4">{label}</div>
        <h2 className="font-display font-bold text-white text-[36px] md:text-[52px] leading-[1.1] max-w-3xl">
          {heading}
        </h2>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: visible ? 64 : 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="h-[3px] bg-[#48a0f8] mt-5"
        />
        {intro && (
          <div className="mt-8 max-w-2xl text-[16px] text-[#8a8a8a] leading-relaxed">
            {intro}
          </div>
        )}
        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  );
}
