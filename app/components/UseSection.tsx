"use client";

import { useState, useRef, type ReactNode } from "react";

type Card = {
  tab: string;
  prompt: string;
  files: { name: string; size: string }[];
  replyHead: ReactNode;
  replyBody: string[];
  kb: ReactNode;
  footSection: string;
  footHead: string;
  footBody: string;
  exploreLabel: string;
  exploreHref: string;
  exploreExternal?: boolean;
};

const CARDS: Card[] = [
  {
    tab: "Work",
    prompt: "What did you actually build at Thriving Center? Walk me through the two biggest wins.",
    files: [{ name: "WORK.md", size: "34 kb" }, { name: "RESUME.pdf", size: "120 kb" }],
    replyHead: <>Thriving Center of Psychology <em>— 2023 → 2025</em></>,
    replyBody: [
      "Joined at $5M ARR as Head of Product. Rebuilt the patient onboarding flow, provider ops tools, and the data warehouse. By the time I left we'd hit $20M with the same headcount.",
      "Two biggest wins — contractor payroll automation saved $100K/yr (Rippling + Airtable bridge), and AI-assisted patient intake in Tellescope cut onboarding admin by 40%, time-to-first-session by 25%.",
    ],
    kb: <><b>WORK.md → thriving-center-of-psychology</b></>,
    footSection: "Delegate · work",
    footHead: "Ask about a specific role.",
    footBody: "The knowledge base is grounded in real work. The model answers only from verified facts, cites sources, and refuses to invent detail it doesn't have.",
    exploreLabel: "Explore work →",
    exploreHref: "#work",
  },
  {
    tab: "AI & Automation",
    prompt: "How do you actually use AI day-to-day as a PM?",
    files: [{ name: "OPINIONS.md", size: "18 kb" }],
    replyHead: <>Less &ldquo;prompt engineering,&rdquo; <em>more workflow design.</em></>,
    replyBody: [
      "I don't use AI to skip the thinking — I use it to compress the surface area between me and a clear answer. Three places it shows up every day:",
      "Drafting onboarding copy & state-machines next to Figma. Turning customer-interview transcripts into themes + counter-examples + follow-ups. Shipping working prototypes instead of PRDs, so eng has something concrete to react to.",
    ],
    kb: <><b>OPINIONS.md</b> · <b>BUILDING.md</b></>,
    footSection: "Learn · ai & automation",
    footHead: "See how I think, not just what I've done.",
    footBody: "The interesting work right now is wiring LLMs into real workflows — not wrapping them in a chat UI and calling it a feature.",
    exploreLabel: "Connect on LinkedIn →",
    exploreHref: "https://linkedin.com/in/nateholt",
    exploreExternal: true,
  },
  {
    tab: "Building",
    prompt: "Tell me about PowSignal.",
    files: [{ name: "BUILDING.md", size: "22 kb" }],
    replyHead: <>PowSignal — <em>real-time powder, planned trips.</em></>,
    replyBody: [
      "AI-driven platform for tracking fresh snow and planning ski trips around it. Public beta this season. Next.js + Supabase + a lightweight ingestion job that reads resort weather feeds and summarizes conditions in plain English.",
      "Claude writes the summaries and helps fix the scraper when a resort quietly changes their feed format, which happens more often than you'd think.",
    ],
    kb: <><b>BUILDING.md → powsignal</b></>,
    footSection: "Create · building",
    footHead: "What I'm shipping right now.",
    footBody: "Building in public is the best way to stay honest about what I actually know how to do. PowSignal is the current focus; Dosable advising is the counter-balance.",
    exploreLabel: "Visit powsignal.com →",
    exploreHref: "https://powsignal.com",
    exploreExternal: true,
  },
  {
    tab: "Ask Me Anything",
    prompt: "What's a take you'd actually defend in a room full of PMs?",
    files: [{ name: "OPINIONS.md", size: "18 kb" }],
    replyHead: <>Most roadmaps are <em>just backlogs with a Gantt chart on top.</em></>,
    replyBody: [
      "The roadmap theater thing drives me nuts. A date on a slide isn't a strategy. If your roadmap can't explain why you're not doing the thing right below it on the list, it's not a roadmap — it's a prioritized wish list.",
      "The PMs I respect most spend more time saying no than writing specs. Sequencing is the job. Everything else is execution support.",
    ],
    kb: <><b>OPINIONS.md → product-philosophy</b></>,
    footSection: "Explore · ask me anything",
    footHead: "Don't be polite about it.",
    footBody: "Ask about hiring philosophy, what I got wrong, how I think about AI replacing PMs, what I'd do differently — whatever's actually on your mind.",
    exploreLabel: "Ask Nathan →",
    exploreHref: "#hero-chat",
  },
];

export default function UseSection() {
  const [active, setActive] = useState(0);
  const touchStart = useRef(0);
  const touchDelta = useRef(0);

  const go = (i: number) => setActive(Math.max(0, Math.min(CARDS.length - 1, i)));

  return (
    <section className="usewrap">
      <div className="use-head">
        <svg className="ico" width="30" height="26" viewBox="0 0 30 26" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
          <path d="M6 20 C 10 12, 18 10, 22 14 C 26 18, 26 20, 26 20" />
          <path d="M20 6 L24 10 L18 14 Z" fill="currentColor" />
        </svg>
        <h2>How you can use <em>this chat</em></h2>
        <div className="use-tabs" role="tablist">
          {CARDS.map((c, i) => (
            <button
              key={c.tab}
              className={`t${active === i ? " on" : ""}`}
              role="tab"
              aria-selected={active === i}
              onClick={() => go(i)}
            >
              <span className="dot" />{c.tab}
            </button>
          ))}
        </div>
      </div>

      <div className="use-slider">
        <div
          className="use-track"
          style={{ transform: `translateX(-${active * 100}%)` }}
          onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
          onTouchMove={(e) => { touchDelta.current = e.touches[0].clientX - touchStart.current; }}
          onTouchEnd={() => {
            if (touchDelta.current < -50) go(active + 1);
            if (touchDelta.current > 50) go(active - 1);
            touchDelta.current = 0;
          }}
        >
          {CARDS.map((c) => (
            <div className="use-card" key={c.tab}>
              <div>
                <div className="prompt-label">Prompt</div>
                <div className="prompt-body">{c.prompt}</div>
                <div className="attach">
                  {c.files.map((f) => (
                    <span key={f.name} className="file">
                      <span className="ic" />{f.name}<span className="sz">{f.size}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="reply">
                <div className="h">{c.replyHead}</div>
                {c.replyBody.map((p, i) => <p key={i}>{p}</p>)}
                <div className="kb">Sources — {c.kb}</div>
              </div>
              <div className="use-foot">
                <div className="foot-label">{c.footSection}</div>
                <div>
                  <h4>{c.footHead}</h4>
                  <p>{c.footBody}</p>
                </div>
                {c.exploreExternal ? (
                  <a className="explore" href={c.exploreHref} target="_blank" rel="noopener noreferrer">{c.exploreLabel}</a>
                ) : (
                  <a className="explore" href={c.exploreHref}>{c.exploreLabel}</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="use-dots">
        {CARDS.map((c, i) => (
          <button
            key={c.tab}
            className={`use-dot${active === i ? " on" : ""}`}
            aria-label={c.tab}
            onClick={() => go(i)}
          />
        ))}
      </div>

      <div className="use-nav">
        <button aria-label="Previous" onClick={() => go(active - 1)} disabled={active === 0}>‹</button>
        <button aria-label="Next" onClick={() => go(active + 1)} disabled={active === CARDS.length - 1}>›</button>
      </div>
    </section>
  );
}
