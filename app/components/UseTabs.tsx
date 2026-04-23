"use client";

import { useState } from "react";

const TABS = ["Work", "Building", "AI workflow", "Opinions", "Research", "Personal"];

export default function UseTabs() {
  const [active, setActive] = useState("Work");

  return (
    <div className="use-tabs">
      {TABS.map((tab) => (
        <button
          key={tab}
          className={`t${active === tab ? " on" : ""}`}
          onClick={() => setActive(tab)}
        >
          <span className="dot" />
          {tab}
        </button>
      ))}
    </div>
  );
}
