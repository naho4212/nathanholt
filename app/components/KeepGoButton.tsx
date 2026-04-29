"use client";

import posthog from "posthog-js";
import { scrollToChat } from "@/lib/scrollToChat";

export default function KeepGoButton() {
  return (
    <button
      onClick={() => {
        posthog.capture("keep_go_button_clicked");
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => scrollToChat(), 50);
      }}
    >
      Ask Nathan <span>→</span>
    </button>
  );
}
