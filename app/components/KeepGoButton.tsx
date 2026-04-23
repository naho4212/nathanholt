"use client";

export default function KeepGoButton() {
  return (
    <button
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => (document.getElementById("heroAskInput") as HTMLInputElement)?.focus(), 420);
      }}
    >
      Ask Nathan <span>→</span>
    </button>
  );
}
