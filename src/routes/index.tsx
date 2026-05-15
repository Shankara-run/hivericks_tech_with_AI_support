import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Vision } from "@/components/site/Vision";
import { Technology } from "@/components/site/Technology";
import { Competency } from "@/components/site/Competency";
import { Projects } from "@/components/site/Projects";
import { Footer } from "@/components/site/Footer";
import { ChatBubble } from "@/components/chatbot/ChatBubble";
import { ChatPanel } from "@/components/chatbot/ChatPanel";
import { chatStore, useChatStore } from "@/components/chatbot/chatStore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hivericks Technologies — Engineering the Connected World" },
      {
        name: "description",
        content:
          "Hivericks builds smart IoT, CleanTech, and embedded solutions — from concept and PCB through firmware, app, and manufactured product.",
      },
      {
        property: "og:title",
        content: "Hivericks Technologies — Engineering the Connected World",
      },
      {
        property: "og:description",
        content:
          "Smart IoT, CleanTech & embedded systems built in Chennai. Talk to Hive to check if your concept is possible.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { open } = useChatStore();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <motion.div
        layout
        animate={{
          paddingRight:
            open && typeof window !== "undefined" && window.innerWidth >= 1024
              ? 480
              : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
      >
        <Navbar />
        <main>
          <Hero />
          <Vision />
          <Technology />
          <Competency />
          <Projects />
        </main>
        <Footer />
      </motion.div>
      <ChatBubble />
      <ChatPanel open={open} onClose={() => chatStore.setOpen(false)} />
    </div>
  );
}
