"use client";

import { useEffect, useRef } from "react";

function scrollToChat() {
  const el = document.getElementById('heroAskInput');
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => el.focus(), 400);
}

export default function Nav() {
  const sheetRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mnavSheetRef = useRef<HTMLElement>(null);
  const mnavScrimRef = useRef<HTMLDivElement>(null);
  const mnavActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    let isScrolled = false;
    const onScroll = () => {
      if (!isScrolled && window.scrollY > 80) {
        isScrolled = true;
        sheet.classList.add("scrolled");
      } else if (isScrolled && window.scrollY < 60) {
        isScrolled = false;
        sheet.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Mega menus
    const navItems = document.querySelectorAll<HTMLElement>(".nav-item");
    let closeTimer: ReturnType<typeof setTimeout> | null = null;

    const openMega = (item: HTMLElement) => {
      if (closeTimer) clearTimeout(closeTimer);
      navItems.forEach((i) => i !== item && i.classList.remove("open"));
      item.classList.add("open");
    };

    const scheduleClose = (item: HTMLElement) => {
      closeTimer = setTimeout(() => item.classList.remove("open"), 140);
    };

    const handlers: Array<() => void> = [];
    navItems.forEach((item) => {
      const trig = item.querySelector<HTMLButtonElement>(".nav-trigger");
      const onEnter = () => openMega(item);
      const onLeave = () => scheduleClose(item);
      const onTriggerClick = (e: Event) => {
        e.stopPropagation();
        if (item.classList.contains("open")) item.classList.remove("open");
        else openMega(item);
      };
      item.addEventListener("mouseenter", onEnter);
      item.addEventListener("mouseleave", onLeave);
      trig?.addEventListener("click", onTriggerClick);
      handlers.push(() => {
        item.removeEventListener("mouseenter", onEnter);
        item.removeEventListener("mouseleave", onLeave);
        trig?.removeEventListener("click", onTriggerClick);
      });
    });

    const onDocClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".nav-item"))
        navItems.forEach((i) => i.classList.remove("open"));
    };
    const onDocKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") navItems.forEach((i) => i.classList.remove("open"));
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onDocKey);

    return () => {
      handlers.forEach((fn) => fn());
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onDocKey);
    };
  }, []);

  const openMnav = () => {
    mnavSheetRef.current?.classList.add("open");
    mnavScrimRef.current?.classList.add("open");
    mnavActionsRef.current?.classList.add("open");
    mnavSheetRef.current?.removeAttribute("inert");
    hamburgerRef.current?.setAttribute("aria-expanded", "true");
    document.body.classList.add("mnav-open");
  };

  const closeMnav = () => {
    mnavSheetRef.current?.classList.remove("open");
    mnavScrimRef.current?.classList.remove("open");
    mnavActionsRef.current?.classList.remove("open");
    mnavSheetRef.current?.setAttribute("inert", "");
    hamburgerRef.current?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("mnav-open");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mnavSheetRef.current?.classList.contains("open"))
        closeMnav();
    };
    const onResize = () => {
      if (window.innerWidth > 900 && mnavSheetRef.current?.classList.contains("open"))
        closeMnav();
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleStackOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("nh:open-stack"));
  };

  const handleMnavLinkClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "A" || target.closest("a")) closeMnav();
  };

  const handleMnavStackOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMnav();
    window.dispatchEvent(new CustomEvent("nh:open-stack"));
  };

  return (
    <>
      <div className="nav-sheet" id="navSheet" ref={sheetRef}>
        <header className="nav">
          <a className="brand" href="/">Nathan Holt</a>
          <a className="status-pill" href="#about">Open to senior roles</a>
          <nav className="nav-links">
            <div className="nav-item" data-menu="work">
              <button className="nav-trigger">Work <span className="ch">▾</span></button>
              <div className="mega mega-work" role="menu">
                <div className="mega-col">
                  <h6>Roles</h6>
                  <a href="#work"><b>Thriving Center of Psychology</b><span>Head of Product · 2023→25</span></a>
                  <a href="#work"><b>Thorsun</b><span>Head of Digital · 2018→23</span></a>
                  <a href="#work"><b>Barneys New York</b><span>Digital Manager · 2014→16</span></a>
                  <a href="#work"><b>Dosable</b><span>Advisor · 2025→now</span></a>
                  <a href="#work" className="see-all">See all roles →</a>
                </div>
                <div className="mega-col">
                  <h6>Building now</h6>
                  <a href="#building"><b>PowSignal</b><span>Powder trip AI · Public beta &#39;26</span></a>
                  <a href="#building"><b>Side projects</b><span>Weekend prototypes</span></a>
                </div>
                <div className="mega-col mega-feat">
                  <div className="feat-label">Most recent win</div>
                  <div className="feat-title">4×&#39;d revenue at flat headcount.</div>
                  <div className="feat-body">At Thriving Center, rebuilt patient onboarding and cut time-to-first-session by 25%. Two years, one team.</div>
                  <a className="feat-cta" href="#work">Read the case →</a>
                </div>
              </div>
            </div>

            <div className="nav-item" data-menu="thinking">
              <button className="nav-trigger">Thinking <span className="ch">▾</span></button>
              <div className="mega mega-thinking" role="menu">
                <div className="mega-col">
                  <h6>Sources</h6>
                  <a href="#" onClick={handleStackOpen}><b>Stack</b><span>Books, podcasts, tools</span></a>
                  <a href="https://linkedin.com/in/nateholt" target="_blank" rel="noopener noreferrer"><b>Opinions</b><span>Updated monthly</span></a>
                </div>
                <div className="mega-col mega-feat">
                  <div className="feat-label">From OPINIONS.md</div>
                  <div className="feat-title">&ldquo;Less prompt engineering, more workflow design.&rdquo;</div>
                  <div className="feat-body">The interesting AI work right now isn&#39;t in the prompt. It&#39;s in the state machine around it.</div>
                  <a className="feat-cta" href="https://linkedin.com/in/nateholt" target="_blank" rel="noopener noreferrer">Read more →</a>
                </div>
              </div>
            </div>

            <div className="nav-item" data-menu="about">
              <button className="nav-trigger">About <span className="ch">▾</span></button>
              <div className="mega mega-about" role="menu">
                <div className="mega-col">
                  <h6>Profile</h6>
                  <a href="#about"><b>Bio</b><span>The short version</span></a>
                  <a href="#about"><b>Now</b><span>What I&#39;m working on this week</span></a>
                </div>
                <div className="mega-col">
                  <h6>Get in touch</h6>
                  <a href="mailto:nathanholt925@gmail.com?subject=Reaching%20out%20from%20your%20site"><b>Email</b><span>nathanholt925@gmail.com</span></a>
                  <button
                    className="mega-cal-link"
                    data-cal-namespace="meeting"
                    data-cal-link="nateholt/meeting"
                    data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"dark"}'
                  ><b>Meeting</b><span>Schedule a call</span></button>
                </div>
                <div className="mega-col mega-feat">
                  <div className="feat-label">Hire or refer</div>
                  <div className="feat-title">Download the PDF.</div>
                  <div className="feat-body">One-pager with my last five roles. Forward it, don&#39;t ask permission.</div>
                  <a className="feat-cta" href="/nathan_holt_cv.pdf" download>Resume (PDF) ↓</a>
                </div>
              </div>
            </div>
          </nav>
          <div className="nav-right">
            <a className="cta-ghost" href="https://linkedin.com/in/nateholt" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <button className="cta-solid" onClick={scrollToChat}>Start a chat</button>
            <button
              className="nav-hamburger"
              ref={hamburgerRef}
              aria-label="Open menu"
              aria-expanded="false"
              aria-controls="mnavSheet"
              onClick={() =>
                hamburgerRef.current?.getAttribute("aria-expanded") === "true"
                  ? closeMnav()
                  : openMnav()
              }
            >
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <line className="bar bar-1" x1="2" y1="2" x2="16" y2="2" />
                <line className="bar bar-2" x1="2" y1="7" x2="16" y2="7" />
                <line className="bar bar-3" x1="2" y1="12" x2="16" y2="12" />
              </svg>
            </button>
          </div>
        </header>
      </div>

      {/* Mobile nav */}
      <div className="mnav-scrim" ref={mnavScrimRef} onClick={closeMnav} />
      <aside
        className="mnav-sheet"
        ref={mnavSheetRef}
        id="mnavSheet"
        inert={true}
        onClick={handleMnavLinkClick}
      >
        <div className="mnav-header">
          <a className="brand" href="/">Nathan Holt</a>
          <a className="status-pill mnav-status" href="#about">Open to senior roles</a>
        </div>
        <button className="mnav-close" aria-label="Close menu" onClick={closeMnav}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <line x1="3" y1="3" x2="13" y2="13" />
            <line x1="13" y1="3" x2="3" y2="13" />
          </svg>
        </button>
        <h6>Work</h6>
        <a href="#work"><b>Roles &amp; case studies</b><span>Thriving Center, Thorsun, Barneys, Dosable</span></a>
        <a href="#building"><b>Building now</b><span>PowSignal · side projects</span></a>
        <h6>Thinking</h6>
        <a href="#" onClick={handleMnavStackOpen}><b>Stack</b><span>Books, podcasts, tools</span></a>
        <h6>About</h6>
        <a href="#about"><b>Bio + Now</b><span>The short version + this week</span></a>
        <a href="mailto:nathanholt925@gmail.com?subject=Reaching%20out%20from%20your%20site"><b>Email</b><span>nathanholt925@gmail.com</span></a>
        <button
          className="mnav-cal-link"
          data-cal-namespace="meeting"
          data-cal-link="nateholt/meeting"
          data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"dark"}'
        ><b>Meeting</b><span>Schedule a call</span></button>
      </aside>
      <div className="mnav-actions" ref={mnavActionsRef}>
        <a className="cta-ghost" href="https://linkedin.com/in/nateholt" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <button className="cta-solid" onClick={() => { closeMnav(); setTimeout(scrollToChat, 350); }}>Start a chat</button>
      </div>
    </>
  );
}
