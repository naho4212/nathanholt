const HERO_INPUT_ID = "heroAskInput";
const FOCUS_DELAY_MS = 400;

export function scrollToChat(opts: { focus?: boolean; delayMs?: number } = {}) {
  const el = document.getElementById(HERO_INPUT_ID);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  if (opts.focus !== false) {
    setTimeout(() => el.focus(), opts.delayMs ?? FOCUS_DELAY_MS);
  }
}

export function scrollToTopAndPrefill(prompt: string, delayMs = FOCUS_DELAY_MS) {
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(() => window.__nhPrefill?.(prompt), delayMs);
}
