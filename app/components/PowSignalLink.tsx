"use client";

import posthog from "posthog-js";

export default function PowSignalLink() {
  return (
    <a
      className="proj"
      href="https://powsignal.com"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => posthog.capture("powsignal_link_clicked")}
    >
      <div className="proj-status active">In beta</div>
      <h3 className="proj-title">PowSignal</h3>
      <p className="proj-desc">AI-powered ski trip planner. Watches storms across 6,000+ resorts and books the window.</p>
      <div className="proj-tags"><span className="ptag">Claude</span><span className="ptag">Next.js</span><span className="ptag">Supabase</span></div>
    </a>
  );
}
