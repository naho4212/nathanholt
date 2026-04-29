"use client";

import posthog from "posthog-js";

export default function FooterLinks() {
  return (
    <div className="apps">
      <a
        href="/nathan_holt_cv.pdf"
        download
        onClick={() => posthog.capture("resume_downloaded", { source: "footer" })}
      >
        Resume
      </a>
      <a href="mailto:nathanholt925@gmail.com?subject=Reaching%20out%20from%20your%20site">Email</a>
      <a
        href="https://linkedin.com/in/nateholt"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => posthog.capture("linkedin_clicked", { source: "footer" })}
      >
        LinkedIn
      </a>
    </div>
  );
}
