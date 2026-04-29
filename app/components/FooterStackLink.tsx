"use client";

export default function FooterStackLink() {
  return (
    <button
      type="button"
      className="footer-link-button"
      onClick={() => window.dispatchEvent(new CustomEvent("nh:open-stack"))}
    >
      Stack
    </button>
  );
}
