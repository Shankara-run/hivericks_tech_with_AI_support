
# Hivericks Website + Hive Chatbot

Single-page marketing site replicating hivericks.com with all 4 content sections, plus a large ClickUp Brain–style slide-in AI chat panel powered by Lovable AI.

## Stack adaptations from your spec

Your spec calls for Create React App + Node/Express + OpenAI gpt-4.1-nano. This project is **TanStack Start + Lovable Cloud** (already set up). I will adapt:

- **Backend proxy** → TanStack server route at `src/routes/api/chat.ts` instead of Express. Same `POST /api/chat` shape, same system prompt, same error responses.
- **AI model** → Lovable AI Gateway (default `google/gemini-3-flash-preview`). It uses `LOVABLE_API_KEY` (auto-provisioned, server-only) — no OpenAI key needed, no `.env` setup, no exposed keys. Gateway 429/402 mapped to your friendly error messages.
- **Routing** → TanStack file routes (`src/routes/index.tsx`) instead of CRA.
- **Styling** → Tailwind v4 via `src/styles.css` with semantic tokens (your full palette ported to oklch-compatible hex tokens). Fonts loaded in `__root.tsx` head.
- Animations: Framer Motion. Icons: Lucide React.

Everything else (visual design, conversation flow, state machine, content) follows your spec exactly.

## Files to create

**Design system & shell**
- `src/styles.css` — replace tokens with Hivericks palette (bg, surface, blue #48A0F8, chat colors), DM Sans + Syne fonts, dot-grid utility, custom scrollbar
- `src/routes/__root.tsx` — add Google Fonts links, update meta
- `src/routes/index.tsx` — assemble Navbar + Hero + Vision + Technology + Competency + Projects + Footer + ChatBubble + ChatPanel

**Brand**
- `src/components/HivericksLogo.tsx` — inline SVG (hex icon split #2A2A2A / #48A0F8 + "HIVERICKS" wordmark), size + variant props

**Site sections** (`src/components/site/`)
- `Navbar.tsx` — sticky, blur on scroll, anchor links, CTA opens chat in SCOPE_CHECK
- `Hero.tsx` — badge, word-stagger heading, subheading, 2 CTAs, hexagon mesh SVG visual
- `Vision.tsx` — 3 stat cards (Leaf/Layers/Users)
- `Technology.tsx` — 2×3 grid of 6 tech cards
- `Competency.tsx` — 8 animated competency bars + Awards box
- `Projects.tsx` — Xoptimus featured card with 4 metrics + 2 half-width cards
- `Footer.tsx`
- `useScrollAnimation.ts` hook — IntersectionObserver

**Chatbot** (`src/components/chatbot/`)
- `ChatBubble.tsx` — 56px floating button, 2 pulse rings, 6s nudge tooltip
- `ChatPanel.tsx` — 480px / 100vw slide-in, layout shift on desktop, mobile overlay
- `ChatHeader.tsx`, `WelcomeBanner.tsx`, `MessageList.tsx`, `Message.tsx`, `ConceptSnapshotCard.tsx`, `TypingIndicator.tsx`, `QuickReplies.tsx`, `InputArea.tsx`
- `useChat.ts` — state machine (GREETING → FAQ → SCOPE_CHECK → IDEA_FUNNEL → LEAD_CAPTURE → CLOSING), funnel step tracking, snapshot parsing from `---CONCEPT SNAPSHOT---` markers, scope keyword detection, calls `/api/chat`
- `ChatContext.tsx` — global open/state so Navbar CTA can trigger SCOPE_CHECK
- `knowledgeBase.ts` + `systemPrompt.ts` — your full Section 6 system prompt

**Backend**
- `src/routes/api/chat.ts` — TanStack server route, POST handler, prepends system prompt, calls Lovable AI Gateway via `@ai-sdk/openai-compatible` + `generateText`, maps 429/402/500/timeout/empty to your 4 friendly error replies, returns `{ reply }`
- `src/lib/ai-gateway.ts` — gateway provider helper

**Assets**
- Copy `user-uploads://hivericks-logo.png` → `src/assets/hivericks-logo.png` as fallback (primary logo is inline SVG per spec)

## Visual & behavior fidelity
- Strictly `#48A0F8` / `#0A0A0A` / `#FFFFFF` — no purple, no green
- Word-by-word hero stagger, scroll-triggered card fades, competency bars fill on scroll
- Pulse rings (2 staggered, 5s loop), bubble float, typing dots, chip stagger-in
- Concept Snapshot rendered as styled card with `[✅ Looks right]` / `[✏️ Adjust]` chips
- Navbar CTA: `setOpen(true)` + `setState(SCOPE_CHECK)` + inject scope opener (skips greeting)
- "Check if my concept is possible" chip does NOT post as user message
- Funnel asks one question at a time (5 total), then auto-snapshot, then name → email → closing

## Open questions / confirmations
1. **Model**: I'll default to `google/gemini-3-flash-preview` via Lovable AI (no API key needed). Want me to use a different gateway model?
2. **Lead capture storage**: Spec says team gets the snapshot — should I (a) just keep the lead in the conversation transcript (no DB), or (b) enable Lovable Cloud and persist `{name, email, snapshot}` to a `leads` table? Default if no answer: (a), no DB.
3. The hero "interconnected hexagons" visual — I'll generate as a hand-built animated SVG (no image gen), matching the spec.

If those defaults are fine, hit Implement and I'll build it end-to-end.
