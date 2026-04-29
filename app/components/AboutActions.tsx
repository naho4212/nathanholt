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
      <a className="email-link" href="mailto:nathanholt925@gmail.com?subject=Reaching%20out%20from%20your%20site">nathanholt925@gmail.com</a>
    </div>
  );
}
