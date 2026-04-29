"use client";

import posthog from "posthog-js";
import { scrollToTopAndPrefill } from "@/lib/scrollToChat";
import "@/lib/window.d";

const PRESETS = [
  { category: "Work", text: "What did you actually ship at Thriving Center?", prompt: "What did you actually build at Thriving Center? Walk me through the two biggest wins." },
  { category: "Workflow", text: "How do you use AI day-to-day as a PM?", prompt: "How do you use AI day-to-day as a PM? I want specifics, not vibes." },
  { category: "Hiring", text: "I'm hiring — are you the right fit?", prompt: "I'm hiring a senior PM for a healthtech startup. Are you the right fit?" },
  { category: "Building", text: "Tell me about PowSignal.", prompt: "Tell me about PowSignal. What's the actual product, and who is it for?" },
  { category: "Availability", text: "What roles are you open to?", prompt: "What kinds of roles are you open to, and what would make you say no?" },
  { category: "Opinions", text: "What's a take you'd defend the hardest?", prompt: "What's a take you'd defend the hardest? Something you'd argue with a skeptic." },
];

export default function PresetGrid() {
  const handlePreset = (category: string, text: string, prompt: string) => {
    posthog.capture("chat_preset_clicked", { preset_category: category, preset_text: text });
    scrollToTopAndPrefill(prompt);
  };

  return (
    <div className="preset-grid">
      {PRESETS.map(({ category, text, prompt }) => (
        <button key={category} className="preset" onClick={() => handlePreset(category, text, prompt)}>
          <span className="pk">{category}</span>
          <span className="pt">{text}</span>
        </button>
      ))}
    </div>
  );
}
