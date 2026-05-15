import { Linkedin, Mail } from "lucide-react";
import { HivericksLogo } from "@/components/HivericksLogo";

export function Footer() {
  return (
    <footer
      className="px-6 md:px-12 py-14 border-t border-[#1e1e1e]"
      style={{ background: "#050505" }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        <div>
          <HivericksLogo size={28} />
          <p className="mt-4 text-[14px] text-[#8a8a8a] leading-relaxed">
            Engineering the Connected World.
          </p>
          <p className="mt-3 text-[13px] text-[#5a5a5a]">
            Hivericks Technologies Pvt. Ltd.
            <br />
            Chennai, Tamil Nadu, India
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-[14px] md:items-center">
          {[
            ["Vision", "#vision"],
            ["Technology", "#technology"],
            ["Competency", "#competency"],
            ["Projects", "#projects"],
          ].map(([l, h]) => (
            <a key={h} href={h} className="text-white/70 hover:text-white">
              {l}
            </a>
          ))}
        </nav>
        <div className="md:text-right">
          <div className="text-[12px] uppercase tracking-[0.12em] text-[#48a0f8] mb-3">
            Get in touch
          </div>
          <a
            href="mailto:team@hivericks.com"
            className="inline-flex items-center gap-2 text-white hover:text-[#48a0f8] transition-colors"
          >
            <Mail className="w-4 h-4" />
            team@hivericks.com
          </a>
          <div className="mt-4 md:flex md:justify-end">
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-full inline-flex items-center justify-center border border-[#2a2a2a] text-white/70 hover:text-[#48a0f8] hover:border-[#48a0f8]/40 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#1e1e1e] text-[12px] text-[#5a5a5a] flex flex-wrap gap-2 justify-between">
        <span>© 2025 Hivericks Technologies Pvt. Ltd. All rights reserved.</span>
        <span>Incubated by TREC-STEP · AIC RAISE · Microsoft for Startups</span>
      </div>
    </footer>
  );
}
