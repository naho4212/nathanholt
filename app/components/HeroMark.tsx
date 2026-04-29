"use client";

import { useState, useRef, useEffect } from "react";

const ACCENT = "#D97757";
const FILL   = "#EFEAE1";
const BUILD  = 18; // seconds

const STROKES = [
  { d: "M 124 116 C 122 144 122 196 122 256",                            len: 130, label: "DISCOVERY", lx: 80,  ly: 96,  shimmer: 0   },
  { d: "M 122 158 C 124 130 148 116 174 122 C 198 128 208 152 208 178",  len: 160, label: "DEFINE",    lx: 162, ly: 88,  shimmer: 0.7 },
  { d: "M 208 178 C 208 200 208 230 210 256",                            len: 100, label: "BUILD",     lx: 295, ly: 316, shimmer: 1.4 },
  { d: "M 246 56 C 244 100 244 180 246 256",                             len: 200, label: "VALIDATE",  lx: 290, ly: 60,  shimmer: 2.1 },
  { d: "M 246 158 C 248 130 272 116 298 122 C 322 128 332 152 332 178",  len: 160, label: "LAUNCH",    lx: 360, ly: 88,  shimmer: 2.8 },
  { d: "M 332 178 C 332 200 332 230 334 256",                            len: 100, label: "ITERATE",   lx: 408, ly: 316, shimmer: 3.5 },
] as const;

const CONN_X = [122, 175, 210, 246, 290, 334];
const CONN_Y = [180, 130, 252, 130, 130, 252];

export default function HeroMark() {
  const svgRef     = useRef<SVGSVGElement>(null);
  const [key, setKey] = useState(0);
  const wasVisible = useRef(true);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !wasVisible.current) setKey((k) => k + 1);
        wasVisible.current = e.isIntersecting;
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const delay = (i: number) =>
    `calc(var(--build-dur) * ${(i * 0.14).toFixed(3)})`;

  return (
    <svg
      ref={svgRef}
      key={key}
      className="hero-mark"
      viewBox="10 -40 440 420"
      aria-hidden="true"
      style={{ "--build-dur": `${BUILD}s` } as React.CSSProperties}
    >
      <defs>
        <radialGradient id={`jj-halo-${key}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={ACCENT} stopOpacity="0.5" />
          <stop offset="55%"  stopColor={ACCENT} stopOpacity="0.16" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* halo blooms with build, breathes forever */}
      <g className="ii-halo">
        <ellipse cx="228" cy="180" rx="190" ry="140" fill={`url(#jj-halo-${key})`} />
      </g>

      {/* monogram — gentle idle breath after build */}
      <g className="jj-mono-breath">
        {STROKES.map((s, i) => (
          <g key={i}>
            <line
              className="jj-connector"
              style={{ "--scene-delay": delay(i) } as React.CSSProperties}
              x1={s.lx} y1={s.ly}
              x2={CONN_X[i]} y2={CONN_Y[i]}
              stroke={ACCENT} strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <g className="jj-shimmer" style={{ "--shimmer-delay": `${s.shimmer}s` } as React.CSSProperties}>
              <path
                className="jj-stroke"
                style={{ "--scene-delay": delay(i), "--len": s.len } as React.CSSProperties}
                d={s.d}
                fill="none" stroke={FILL} strokeWidth="13"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </g>
            <circle
              className="jj-dot"
              style={{ "--scene-delay": delay(i) } as React.CSSProperties}
              cx={s.lx} cy={s.ly} r="3.5" fill={ACCENT}
            />
            <text
              className="jj-label"
              style={{ "--scene-delay": delay(i) } as React.CSSProperties}
              x={s.lx} y={s.ly - 10} textAnchor="middle"
              fontFamily="var(--mono)"
              fontSize="9" letterSpacing="2" fill={ACCENT}
            >
              0{i + 1} {s.label}
            </text>
          </g>
        ))}

        <circle className="jj-period-halo" cx="358" cy="252" r="14" fill={ACCENT} opacity="0" />
        <circle className="jj-period"      cx="358" cy="252" r="10" fill={ACCENT} />
      </g>
    </svg>
  );
}
