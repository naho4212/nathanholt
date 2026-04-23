"use client";

import { useRef } from "react";

export default function AboutChips() {
  const referralRef = useRef<HTMLAnchorElement>(null);
  const referralSubRef = useRef<HTMLDivElement>(null);

  const handleReferral = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = window.location.href.split("#")[0] + "?ref=forwarded";
    const done = () => {
      referralRef.current?.classList.add("copied");
      if (referralSubRef.current) {
        const prev = referralSubRef.current.textContent;
        referralSubRef.current.textContent = "Link copied — forward it";
        setTimeout(() => {
          if (referralSubRef.current) referralSubRef.current.textContent = prev;
          referralRef.current?.classList.remove("copied");
        }, 2000);
      }
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(done);
    } else {
      done();
    }
  };

  return (
    <div className="about-chips">
      <button
        className="about-chip"
        data-cal-namespace="meeting"
        data-cal-link="nateholt/meeting"
        data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"dark"}'
      >
        <div className="chip-ic">◐</div>
        <div className="chip-body">
          <div className="chip-t">Hiring a senior PM?</div>
          <div className="chip-s">Schedule a call</div>
        </div>
        <div className="chip-arrow">→</div>
      </button>
      <a className="about-chip" href="#" ref={referralRef} onClick={handleReferral}>
        <div className="chip-ic">◉</div>
        <div className="chip-body">
          <div className="chip-t">Pass it along.</div>
          <div className="chip-s" ref={referralSubRef}>Copy referral link · forward it</div>
        </div>
        <div className="chip-arrow">→</div>
      </a>
      <a className="about-chip" href="mailto:nathanholt925@gmail.com?subject=Reaching%20out%20from%20your%20site">
        <div className="chip-ic">◑</div>
        <div className="chip-body">
          <div className="chip-t">Need help on a project?</div>
          <div className="chip-s">Contract + advisory welcome</div>
        </div>
        <div className="chip-arrow">→</div>
      </a>
    </div>
  );
}
