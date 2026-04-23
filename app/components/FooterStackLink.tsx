"use client";

export default function FooterStackLink() {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("nh:open-stack"));
      }}
    >
      Stack
    </a>
  );
}
