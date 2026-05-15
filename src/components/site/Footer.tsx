import { HivericksLogo } from "@/components/HivericksLogo";
import { chatStore } from "@/components/chatbot/chatStore";

export function Footer() {
  return (
    <footer
      className="px-6 md:px-12 py-14 border-t border-[#1e1e1e]"
      style={{ background: "#050505" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <HivericksLogo size={32} />
          <h2 className="font-display font-bold text-white text-[36px] md:text-[52px] leading-[1.1] mt-8 mb-14">
            Let's build<br />the future.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-14">
          <div>
            <div className="text-[12px] uppercase tracking-[0.12em] text-[#48a0f8] font-medium mb-3">
              Visit us
            </div>
            <p className="text-[14px] text-[#8a8a8a] leading-relaxed">
              5th Floor, BLOCK-B,<br />
              IITM RESEARCH PARK, Kanagam,<br />
              Tharamani, Chennai,<br />
              Tamil Nadu 600113
            </p>
          </div>

          <div>
            <div className="text-[12px] uppercase tracking-[0.12em] text-[#48a0f8] font-medium mb-3">
              Email
            </div>
            <p className="text-[14px] text-[#8a8a8a] leading-relaxed">
              support@xoptimus.in
            </p>
          </div>

          <div>
            <div className="text-[12px] uppercase tracking-[0.12em] text-[#48a0f8] font-medium mb-3">
              Phone
            </div>
            <p className="text-[14px] text-[#8a8a8a] leading-relaxed">
              +91 (917) 683-1334
            </p>
          </div>
        </div>

        <div className="flex justify-center mb-14">
          <button
            type="button"
            onClick={() => chatStore.openInContactForm()}
            className="px-8 py-3.5 rounded-lg text-[15px] font-medium text-white transition-all hover:brightness-110"
            style={{
              background: "#48a0f8",
              boxShadow: "0 0 24px rgba(72,160,248,0.35)",
            }}
          >
            Send a Message →
          </button>
        </div>

        <div className="pt-6 border-t border-[#1e1e1e] text-[12px] text-[#5a5a5a] flex flex-wrap gap-2 justify-between">
          <span>© 2025 Hivericks Technologies Pvt. Ltd. All rights reserved.</span>
          <span>Incubated by TREC-STEP · AIC RAISE · Microsoft for Startups</span>
        </div>
      </div>
    </footer>
  );
}
