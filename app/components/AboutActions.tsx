"use client";

import posthog from "posthog-js";

export default function AboutActions() {
  return (
    <div className="about-actions">
      <a className="cta-solid" href="#heroAskInput">Start a chat</a>
      <a
        className="cta-ghost"
        href="/nathan_holt_cv.pdf"
        download
        onClick={() => posthog.capture("resume_downloaded", { source: "about_section" })}
      >
        Resume (PDF) ↓
      </a>
    </div>
  );
}
