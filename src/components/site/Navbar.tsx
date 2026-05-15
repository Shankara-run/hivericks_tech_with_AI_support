import { useEffect, useState } from "react";
import { HivericksLogo } from "@/components/HivericksLogo";
import { chatStore } from "@/components/chatbot/chatStore";

const NAV = [
  { href: "#vision", label: "Vision" },
  { href: "#technology", label: "Technology" },
  { href: "#competency", label: "Competency" },
  { href: "#projects", label: "Projects" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center px-6 md:px-12 transition-all"
      style={{
        background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <a href="#" className="flex items-center">
        <HivericksLogo size={32} />
      </a>
      <div className="hidden md:flex items-center gap-8 mx-auto">
        {NAV.map((n) => (
          <a
            key={n.href}
            href={n.href}
            className="text-[14px] font-medium text-white/70 hover:text-white transition-colors"
          >
            {n.label}
          </a>
        ))}
      </div>
      <button
        type="button"
        onClick={() => chatStore.openInScopeCheck()}
        className="ml-auto md:ml-0 px-4 py-2.5 rounded-lg text-[14px] font-medium text-white transition-all hover:brightness-110"
        style={{
          background: "#48a0f8",
          boxShadow: "0 0 20px rgba(72,160,248,0.25)",
        }}
      >
        <span className="hidden sm:inline">Check If Your Concept Is Possible </span>
        <span className="sm:hidden">Check Concept </span>→
      </button>
    </nav>
  );
}
