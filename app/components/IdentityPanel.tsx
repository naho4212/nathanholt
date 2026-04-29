"use client";

import { useEffect, useRef } from "react";

export default function IdentityPanel() {
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
    window.addEventListener("nh:open-identity", onOpen);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("nh:open-identity", onOpen);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
      <div className="stack-scrim" ref={scrimRef} onClick={close} />
      <aside className="stack-panel" ref={panelRef} aria-hidden="true">
        <div className="stack-head">
          <h3>Outside <em>work</em></h3>
          <span className="sub">Who I am when I&apos;m not shipping</span>
          <button className="stack-close" aria-label="Close" onClick={close}>×</button>
        </div>
        <div className="stack-body">
          <div className="placeholder-banner">Placeholder — content coming soon.</div>
          <p className="stack-intro">
            This panel will eventually cover the things that don&apos;t fit on a résumé:
            where I spend weekends, what I&apos;m reading outside of work, and a few
            personal projects that don&apos;t belong in the building section.
          </p>
        </div>
      </aside>
    </>
  );
}
