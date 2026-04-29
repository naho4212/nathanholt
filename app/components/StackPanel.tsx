"use client";

import { useEffect, useRef } from "react";

export default function StackPanel() {
  const panelRef = useRef<HTMLElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  const open = () => {
    scrimRef.current?.classList.add("open");
    requestAnimationFrame(() => panelRef.current?.classList.add("open"));
    panelRef.current?.setAttribute("aria-hidden", "false");
    document.body.classList.add("stack-open");
  };

  const close = () => {
    panelRef.current?.classList.remove("open");
    scrimRef.current?.classList.remove("open");
    panelRef.current?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("stack-open");
  };

  useEffect(() => {
    const onOpen = () => open();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panelRef.current?.classList.contains("open")) close();
    };
    window.addEventListener("nh:open-stack", onOpen);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("nh:open-stack", onOpen);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
      <div className="stack-scrim" ref={scrimRef} onClick={close} />
      <aside className="stack-panel" ref={panelRef} aria-hidden="true">
        <div className="stack-head">
          <h3>The <em>stack</em></h3>
          <span className="sub">What I read · 2026</span>
          <button className="stack-close" aria-label="Close" onClick={close}>×</button>
        </div>
        <div className="stack-body">
          <p className="stack-intro">
            Not a reading list — the stuff I actually return to. Updated quarterly.
            If something falls off, it means I stopped citing it in conversation.
          </p>

          <div className="stack-group">
            <div className="g-head"><h4>Books</h4><span className="ct">6 · re-reading 2</span></div>
            <div className="stack-list">
              <div className="stack-item"><div><div className="t">High Output Management</div><div className="by">Andy Grove</div><div className="note">The one I keep handing to new managers. The output equation is the whole job.</div></div><span className="meta">RE-READ</span></div>
              <div className="stack-item"><div><div className="t">The Design of Everyday Things</div><div className="by">Don Norman</div><div className="note">Affordances and signifiers. Still the best vocabulary for talking about why a UI is bad.</div></div><span className="meta">2019</span></div>
              <div className="stack-item"><div><div className="t">Working Backwards</div><div className="by">Bryar &amp; Carr</div><div className="note">PR/FAQ is the only planning doc I still use unchanged from someone else&apos;s template.</div></div><span className="meta">2021</span></div>
              <div className="stack-item"><div><div className="t">The Mom Test</div><div className="by">Rob Fitzpatrick</div><div className="note">Shortest book that changes how you interview users. Read it in a flight.</div></div><span className="meta">2018</span></div>
              <div className="stack-item"><div><div className="t">Shape Up</div><div className="by">Ryan Singer</div><div className="note">Not dogma — but the appetite/bet distinction ended my quarterly-roadmap anxiety.</div></div><span className="meta">2020</span></div>
              <div className="stack-item"><div><div className="t">Seeing Like a State</div><div className="by">James C. Scott</div><div className="note">Makes you suspicious of every dashboard you build.</div></div><span className="meta">RE-READ</span></div>
            </div>
          </div>

          <div className="stack-group">
            <div className="g-head"><h4>Podcasts</h4><span className="ct">4 · weekly</span></div>
            <div className="stack-list">
              <div className="stack-item"><div><div className="t">Lenny&apos;s Podcast</div><div className="by">Lenny Rachitsky</div></div><span className="meta">PM</span></div>
              <div className="stack-item"><div><div className="t">Acquired</div><div className="by">Ben Gilbert &amp; David Rosenthal</div></div><span className="meta">STRATEGY</span></div>
              <div className="stack-item"><div><div className="t">How I Built This</div><div className="by">Guy Raz</div></div><span className="meta">FOUNDERS</span></div>
              <div className="stack-item"><div><div className="t">The Changelog</div><div className="by">Jerod Santo</div></div><span className="meta">ENG</span></div>
            </div>
          </div>

          <div className="stack-group">
            <div className="g-head"><h4>Newsletters</h4><span className="ct">5</span></div>
            <div className="stack-list">
              <div className="stack-item"><div><div className="t">Stratechery</div><div className="by">Ben Thompson</div></div><span className="meta">DAILY</span></div>
              <div className="stack-item"><div><div className="t">Not Boring</div><div className="by">Packy McCormick</div></div><span className="meta">WEEKLY</span></div>
              <div className="stack-item"><div><div className="t">Every</div><div className="by">Dan Shipper &amp; co</div></div><span className="meta">DAILY</span></div>
              <div className="stack-item"><div><div className="t">Platformer</div><div className="by">Casey Newton</div></div><span className="meta">WEEKLY</span></div>
              <div className="stack-item"><div><div className="t">The Generalist</div><div className="by">Mario Gabriele</div></div><span className="meta">WEEKLY</span></div>
            </div>
          </div>

          <div className="stack-group">
            <div className="g-head"><h4>Tools I lean on</h4><span className="ct">6</span></div>
            <div className="stack-list">
              <div className="stack-item"><div><div className="t">Linear</div><div className="by">Team + my own side projects</div></div><span className="meta">DAILY</span></div>
              <div className="stack-item"><div><div className="t">Figma</div><div className="by">Including FigJam for roadmaps</div></div><span className="meta">DAILY</span></div>
              <div className="stack-item"><div><div className="t">Claude</div><div className="by">Planning, drafting, code review</div></div><span className="meta">DAILY</span></div>
              <div className="stack-item"><div><div className="t">Cursor</div><div className="by">Prototyping on weekends</div></div><span className="meta">WEEKLY</span></div>
              <div className="stack-item"><div><div className="t">Notion</div><div className="by">Personal OS + shared briefs</div></div><span className="meta">DAILY</span></div>
              <div className="stack-item"><div><div className="t">Granola</div><div className="by">Meeting notes without hating myself</div></div><span className="meta">DAILY</span></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
