"use client";

import posthog from "posthog-js";

export default function KeepGoButton() {
  return (
    <button
      onClick={() => {
        posthog.capture("keep_go_button_clicked");
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => (document.getElementById("heroAskInput") as HTMLInputElement)?.focus(), 420);
      }}
    >
      Ask Nathan <span>→</span>
    </button>
  );
}
