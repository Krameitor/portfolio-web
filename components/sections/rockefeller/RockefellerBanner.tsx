'use client';

import { useEffect, useRef } from 'react';

const G  = '#c9a227';
const GR = '#00ff88';
const RE = '#ff3366';

const ITEMS = [
  { emoji: '🥃', name: 'Old Fashioned', price: '13.82', trend: 'up'   },
  { emoji: '🍸', name: 'Negroni',       price: '8.50',  trend: 'up'   },
  { emoji: '🍹', name: 'Margarita',     price: '10.50', trend: 'down' },
  { emoji: '🥂', name: 'Aperol Spritz', price: '8.60',  trend: 'up'   },
  { emoji: '🍺', name: 'Whisky Sour',   price: '8.00',  trend: 'down' },
  { emoji: '🍸', name: 'Dry Martini',   price: '15.86', trend: 'up'   },
  { emoji: '🍹', name: 'Esp. Martini',  price: '12.50', trend: 'up'   },
];

const tc = (t: string) => t === 'up' ? G : t === 'down' ? RE : GR;
const ta = (t: string) => t === 'up' ? '▲' : t === 'down' ? '▼' : '●';

interface Props {
  sectionRef: React.RefObject<HTMLElement | null>;
}

export default function RockefellerBanner({ sectionRef }: Props) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    // Start hidden above viewport
    banner.style.transform = 'translateY(-100%) rotateX(-8deg)';
    banner.style.opacity   = '0';

    let visible = false;

    const check = () => {
      const section = sectionRef.current;
      if (!section) return;

      const { top, bottom } = section.getBoundingClientRect();
      const vh = window.innerHeight;

      // Show when the section top has passed 65% of the viewport from the top
      // (the section is well into view) AND the section is still on screen
      const shouldShow = top < vh * 0.35 && bottom > 0;

      if (shouldShow && !visible) {
        visible = true;
        banner.style.transform = 'translateY(0) rotateX(0deg)';
        banner.style.opacity   = '1';
      } else if (!shouldShow && visible) {
        visible = false;
        banner.style.transform = 'translateY(-100%) rotateX(-8deg)';
        banner.style.opacity   = '0';
      }
    };

    // Check immediately (in case page loads mid-scroll)
    // Small delay to ensure sectionRef is mounted
    const init = requestAnimationFrame(check);

    window.addEventListener('scroll', check, { passive: true });
    return () => {
      cancelAnimationFrame(init);
      window.removeEventListener('scroll', check);
    };
  }, [sectionRef]);

  const track = [...ITEMS, ...ITEMS, ...ITEMS]; // triple for seamless loop

  return (
    <div
      ref={bannerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 52,
        /* Dark warm black, almost opaque */
        background: 'rgba(5,4,0,0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'visible',          /* allow bottom shadow to bleed below */
        /* ── 3D DEPTH EFFECT ──
           Same stepped box-shadow trick as the phone and TV mocks,
           but on the BOTTOM edge (this panel drops from the ceiling).
           Gold highlight at front, fades to black as it recedes. */
        boxShadow: [
          /* Top border line — subtle gold seam at ceiling join */
          `inset 0 1px 0 rgba(255,228,60,0.35)`,
          /* Bottom edge stepped depth */
          `0 2px  0 0 rgba(255,228,60,0.88)`,
          `0 4px  0 0 rgba(210,165,10,0.76)`,
          `0 7px  0 0 rgba(130,100,0,0.62)`,
          `0 10px 0 0 rgba(62,47,0,0.48)`,
          `0 14px 0 0 rgba(22,17,0,0.34)`,
          `0 18px 0 0 rgba(6,4,0,0.22)`,
          `0 22px 0 0 rgba(1,1,0,0.12)`,
          /* Cast shadow below the panel */
          `0 28px 40px rgba(0,0,0,0.85)`,
          `0 8px  16px rgba(255,218,0,0.10)`,
        ].join(', '),
        /* Slide + very subtle downward tilt while entering */
        transition: 'transform 0.60s cubic-bezier(0.34,1.22,0.64,1), opacity 0.48s ease',
        transformOrigin: 'top center',
        willChange: 'transform, opacity',
        perspectiveOrigin: '50% 0',
        perspective: '600px',
      }}
    >
      {/* ─ Left brand badge ─ */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 18px',
        borderRight: `1px solid rgba(201,162,39,0.25)`,
        height: '100%',
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: G, boxShadow: `0 0 8px ${G}, 0 0 18px ${G}55`,
          animation: 'rkb-pulse 2s infinite',
        }} />
        <span style={{
          fontFamily: 'monospace', fontSize: 11, fontWeight: 800,
          color: G, letterSpacing: '0.16em',
          textShadow: `0 0 10px ${G}88`,
        }}>
          ROCKEFELLER
        </span>
        <span style={{
          fontFamily: 'monospace', fontSize: 9, color: `rgba(201,162,39,0.50)`,
          letterSpacing: '0.06em',
        }}>
          PRECIOS EN VIVO
        </span>
      </div>

      {/* ─ Scrolling ticker ─ */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%' }}>
        {/* Fade masks */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 48, zIndex: 2,
          background: 'linear-gradient(90deg, rgba(5,4,0,0.97), transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 48, zIndex: 2,
          background: 'linear-gradient(270deg, rgba(5,4,0,0.97), transparent)',
          pointerEvents: 'none',
        }} />

        {/* The scrolling row */}
        <div style={{
          display: 'flex', alignItems: 'center', height: '100%',
          whiteSpace: 'nowrap',
          animation: 'rkb-scroll 30s linear infinite',
        }}>
          {track.map((item, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '0 26px',
                borderRight: `1px solid rgba(201,162,39,0.14)`,
                fontFamily: 'monospace',
                fontSize: 11,
              }}
            >
              <span style={{ fontSize: 14 }}>{item.emoji}</span>
              <span style={{ color: 'rgba(255,230,140,0.80)', fontWeight: 600, letterSpacing: '0.04em' }}>
                {item.name}
              </span>
              <span style={{ color: tc(item.trend), fontWeight: 800, fontSize: 12 }}>
                {ta(item.trend)} {item.price}€
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ─ Right LIVE badge ─ */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 16px',
        borderLeft: `1px solid rgba(201,162,39,0.25)`,
        height: '100%',
      }}>
        <span style={{
          fontFamily: 'monospace', fontSize: 9.5, padding: '3px 10px', borderRadius: 4,
          background: `rgba(0,255,136,0.10)`, color: GR,
          border: `1px solid rgba(0,255,136,0.35)`,
          letterSpacing: '0.08em', fontWeight: 700,
        }}>● LIVE</span>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes rkb-scroll {
          0%   { transform: translateX(0) }
          100% { transform: translateX(-33.333%) }
        }
        @keyframes rkb-pulse {
          0%, 100% { opacity: 1 }
          50%       { opacity: 0.30 }
        }
      `}</style>
    </div>
  );
}
