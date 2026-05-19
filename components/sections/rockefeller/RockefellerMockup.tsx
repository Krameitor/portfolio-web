'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const G  = '#ffda00';
const G2 = '#c9a227';
const GR = '#00ff88';
const DR = '#ff3366';
const BG = '#080800';

interface C {
  id: string; name: string; short: string; emoji: string;
  base: number; price: number; change: number;
  trend: 'up' | 'down' | 'stable'; sales: number;
}

const SEED: C[] = [
  { id:'of',  name:'OLD FASHIONED',   short:'Old Fashioned', emoji:'🥃', base:11, price:13.00, change:+18, trend:'up',     sales:28 },
  { id:'neg', name:'NEGRONI',         short:'Negroni',       emoji:'🍊', base:10, price: 8.50, change:-15, trend:'down',   sales:19 },
  { id:'em',  name:'ESP. MARTINI',    short:'Esp. Martini',  emoji:'☕', base:11, price:12.50, change:+14, trend:'up',     sales:22 },
  { id:'apr', name:'APEROL SPRITZ',   short:'Aperol Spritz', emoji:'🥂', base: 9, price: 9.00, change:  0, trend:'stable', sales:15 },
  { id:'ws',  name:'WHISKY SOUR',     short:'Whisky Sour',   emoji:'🍋', base:10, price: 8.00, change:-20, trend:'down',   sales: 9 },
  { id:'dm',  name:'DRY MARTINI',     short:'Dry Martini',   emoji:'🍸', base:12, price:14.40, change:+20, trend:'up',     sales:17 },
  { id:'mar', name:'MARGARITA',       short:'Margarita',     emoji:'🍹', base:10, price:10.50, change: +5, trend:'up',     sales:14 },
];

export type Phase = 'idle' | 'pre-select' | 'select' | 'send' | 'pre-receive' | 'receive';

const tc  = (t: string) => t === 'up' ? GR : t === 'down' ? DR : G;
const ta  = (t: string) => t === 'up' ? '↗' : t === 'down' ? '↘' : '→';
const tbg = (t: string) =>
  t === 'up'   ? 'rgba(0,255,136,0.07)'  :
  t === 'down' ? 'rgba(255,51,102,0.07)' : 'rgba(255,218,0,0.04)';

interface Props {
  onPhaseChange?: (phase: Phase) => void;
  hoveredStep?: number | null;
}

export default function RockefellerMockup({ onPhaseChange, hoveredStep }: Props) {
  const [cocktails,  setCocktails]  = useState<C[]>(SEED);
  const [phase,      _setPhase]     = useState<Phase>('idle');
  const [activeId,   setActiveId]   = useState<string | null>(null);
  const [sigPct,     setSigPct]     = useState(0);
  const [priceDelta, setPriceDelta] = useState(0);
  const [time,       setTime]       = useState('21:47:03');
  const [hasEntered, setHasEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const timers  = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sigIv   = useRef<ReturnType<typeof setInterval> | null>(null);
  const busy    = useRef(false);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseCallbackRef = useRef(onPhaseChange);
  phaseCallbackRef.current = onPhaseChange;

  const setPhase = useCallback((p: Phase) => {
    _setPhase(p);
    phaseCallbackRef.current?.(p);
  }, []);

  /* clock */
  useEffect(() => {
    const d = new Date(); d.setHours(21, 47, 3, 0);
    const iv = setInterval(() => { d.setSeconds(d.getSeconds() + 1); setTime(d.toLocaleTimeString('es-ES')); }, 1000);
    return () => clearInterval(iv);
  }, []);

  /* core animation trigger */
  const trigger = useCallback((cid: string, alwaysUp = false) => {
    if (busy.current) return;
    busy.current = true;
    if (autoRef.current) clearTimeout(autoRef.current);

    // 1. Phone pops out
    setPhase('pre-select'); setActiveId(cid);

    const t0 = setTimeout(() => {
      // 2. Product highlights
      setPhase('select');

      const t1 = setTimeout(() => {
        // 3. Signal sends
        setPhase('send'); setSigPct(0);
        let p = 0;
        sigIv.current = setInterval(() => {
          p = Math.min(p + 5, 100); setSigPct(p);
          if (p >= 100) clearInterval(sigIv.current!);
        }, 40);

        const t2 = setTimeout(() => {
          // 4. TV pops out
          setPhase('pre-receive');

          const t3 = setTimeout(() => {
            // 5. Price updates and TV product flashes
            const delta = alwaysUp
              ? +(Math.random() * 0.8 + 0.3).toFixed(2)
              : (Math.random() > 0.4 ? +(Math.random() * 0.8 + 0.3).toFixed(2) : -(Math.random() * 0.5 + 0.2).toFixed(2));
            setPriceDelta(delta);
            setPhase('receive');

            setCocktails(prev => prev.map(c => {
              if (c.id !== cid) return c;
              const np  = Math.max(5.5, +(c.price + delta).toFixed(2));
              const pct = +((np - c.base) / c.base * 100).toFixed(1);
              return { ...c, price: np, change: pct, trend: pct > 1 ? 'up' : pct < -1 ? 'down' : 'stable' };
            }));

            const t4 = setTimeout(() => {
              setPhase('idle'); setActiveId(null); setSigPct(0);
              busy.current = false;
              autoRef.current = setTimeout(() => {
                trigger(SEED[Math.floor(Math.random() * SEED.length)].id);
              }, 3600);
            }, 2800);
            timers.current.push(t4);
          }, 800); // Wait 800ms after TV pops out to update price
          timers.current.push(t3);
        }, 1800); // Signal travel time
        timers.current.push(t2);
      }, 1200); // Time looking at highlighted product
      timers.current.push(t1);
    }, 600); // Wait 600ms after phone pops out to highlight product
    timers.current.push(t0);
  }, []);

  /* auto loop */
  useEffect(() => {
    // Only run the auto loop if the user is not actively hovering over the steps narrative!
    if (hoveredStep === null || hoveredStep === undefined) {
      autoRef.current = setTimeout(() => trigger(SEED[0].id), 3000);
    }
    return () => {
      timers.current.forEach(clearTimeout);
      if (sigIv.current) clearInterval(sigIv.current);
      if (autoRef.current) clearTimeout(autoRef.current);
    };
  }, [trigger, hoveredStep]);

  /* dynamic mock-up feedback when hovering over narrative steps */
  const effectiveHoveredStep = hoveredStep !== undefined ? hoveredStep : null;
  const isPhoneHovered = effectiveHoveredStep === 0;
  const isSignalHovered = effectiveHoveredStep === 1;
  const isTvHovered = effectiveHoveredStep === 2;

  // Phone is visually active if step 1 is hovered, step 2 is hovered (signal traveling), or phone phases are active
  const phoneActive = isPhoneHovered || isSignalHovered || phase === 'pre-select' || phase === 'select' || phase === 'send';
  // TV is visually active if step 3 is hovered, step 2 is hovered, or TV phases are active
  const tvActive    = isTvHovered || isSignalHovered || phase === 'pre-receive' || phase === 'receive';
  const tvFlash     = phase === 'receive' || isTvHovered;

  /* entrance detection — fire once when the mockup scrolls into view */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHasEntered(true); io.disconnect(); } },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const featured = cocktails[0];
  const rest     = cocktails.slice(1);

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div ref={containerRef} style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>

      {/* ══ PHONE ENTRANCE WRAPPER ══ */}
      <div
        className={hasEntered ? 'rk-entered' : ''}
        style={{
          opacity: hasEntered ? 1 : 0,
          animation: hasEntered
            ? 'rk-spin-in-phone 2.4s cubic-bezier(0.16,1,0.3,1) forwards, rk-float 4s ease-in-out 2.6s infinite'
            : 'none',
          /* Subtle pop when phone is the focus */
          filter: phoneActive ? `drop-shadow(0 0 18px rgba(255,218,0,0.25))` : 'none',
        }}
      >
      <div style={{
        width: 142, height: 310, borderRadius: 22, flexShrink: 0,
        background: BG,
        border: `1.5px solid ${phoneActive ? 'rgba(255,218,0,0.78)' : 'rgba(255,218,0,0.32)'}`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: phoneActive 
          ? 'perspective(800px) rotateY(-18deg) rotateX(2deg) scale(1.05) translateZ(30px) translateY(-10px)' 
          : 'perspective(800px) rotateY(-22deg) rotateX(5deg)',
        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease',
        boxShadow: [
          /* Right-edge stepped depth — gold highlight at top, fades to black */
          `2px  0 0 0 rgba(255,228,60,0.92)`,
          `4px  0 0 0 rgba(210,165,10,0.82)`,
          `7px  0 0 0 rgba(130,100,0,0.68)`,
          `10px 0 0 0 rgba(62,47,0,0.54)`,
          `14px 0 0 0 rgba(22,17,0,0.40)`,
          `18px 0 0 0 rgba(6,4,0,0.25)`,
          `22px 0 0 0 rgba(1,1,0,0.14)`,
          /* Bottom-edge depth */
          `0 3px 0 0 rgba(130,100,0,0.42)`,
          `0 6px 0 0 rgba(30,23,0,0.28)`,
          /* Cast shadow */
          `26px 40px 80px rgba(0,0,0,0.96)`,
          `-8px 10px 24px rgba(0,0,0,0.58)`,
        ].join(', '),
      }}>

        {/* notch */}
        <div style={{ height: 18, background: '#030300', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
          <div style={{ width: 38, height: 5, borderRadius: 3, background: '#1a1800' }} />
        </div>

        {/* header */}
        <div style={{
          height: 30, background: '#0d0b00', borderBottom: `1px solid ${G}22`,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding: '0 8px', flexShrink: 0,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius:'50%', background: G, boxShadow:`0 0 6px ${G}`, animation:'rk-pulse 2s infinite' }} />
            <span style={{ fontFamily:'monospace', fontSize: 7.5, fontWeight: 800, color: G, letterSpacing:'0.08em' }}>ROCKEFELLER</span>
          </div>
          <span style={{ fontFamily:'monospace', fontSize: 6.5, color:`${G}66` }}>Admin</span>
        </div>

        {/* cocktail rows */}
        <div style={{ flex: 1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {cocktails.slice(0, 6).map((c) => {
            const isActive = c.id === activeId || (isPhoneHovered && c.id === 'of');
            const isSending = isActive && (phase === 'select' || phase === 'send' || isPhoneHovered);
            return (
              <div key={c.id} style={{
                flex: 1, display:'flex', alignItems:'center', padding:'0 6px', gap: 4,
                borderBottom: `1px solid ${G}10`,
                background: isSending ? `${G}15` : 'transparent',
                borderLeft: isSending ? `2px solid ${G}` : '2px solid transparent',
                transform: isSending ? 'scale(1.04)' : 'none',
                zIndex: isSending ? 10 : 1,
                boxShadow: isSending ? `0 0 12px rgba(0,0,0,0.5)` : 'none',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
                {/* emoji + name */}
                <span style={{ fontSize: 9, flexShrink: 0 }}>{c.emoji}</span>
                <span style={{
                  fontFamily:'monospace', fontSize: 6.5, flex: 1,
                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                  color: isSending ? G : `${G}70`,
                  fontWeight: isSending ? 700 : 400, transition:'color 0.3s',
                }}>{c.short}</span>

                {/* price */}
                <span style={{ 
                  fontFamily:'monospace', fontSize: 7.5, fontWeight: 700, color: tc(c.trend), flexShrink: 0,
                  transform: isSending ? 'scale(1.15)' : 'none',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                  {c.price.toFixed(2)}€
                </span>

                {/* ▲ BUTTON */}
                <button
                  onClick={() => trigger(c.id, true)}
                  disabled={phase !== 'idle'}
                  style={{
                    background: isSending ? G : `${G}1a`,
                    border: `1px solid ${isSending ? G : G + '55'}`,
                    color: isSending ? '#000' : G,
                    borderRadius: 4, fontSize: 8, fontFamily:'monospace', fontWeight: 900,
                    padding: '2px 5px', cursor: phase === 'idle' ? 'pointer' : 'default',
                    lineHeight: 1, transition:'all 0.2s', flexShrink: 0,
                    animation: isSending && (phase === 'send' || isPhoneHovered) ? 'rk-btn-pulse 0.5s ease-in-out infinite' : 'none',
                  }}
                >▲</button>
              </div>
            );
          })}
        </div>

        {/* status footer */}
        <div style={{
          height: 26, background: '#0d0b00', borderTop: `1px solid ${G}18`,
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0,
        }}>
          {isPhoneHovered && <span style={{ fontFamily:'monospace', fontSize: 6.5, color: G, letterSpacing:'0.05em' }}>● SELECCIONANDO BEBIDA</span>}
          {!isPhoneHovered && phase === 'send'    && <span style={{ fontFamily:'monospace', fontSize: 6.5, color: G, animation:'rk-pulse 0.5s infinite', letterSpacing:'0.1em' }}>ENVIANDO...</span>}
          {!isPhoneHovered && phase === 'receive' && <span style={{ fontFamily:'monospace', fontSize: 6.5, color: GR }}>✓ PRECIO ACTUALIZADO</span>}
          {!isPhoneHovered && (phase === 'idle' || phase === 'select') && (
            <span style={{ fontFamily:'monospace', fontSize: 6.5, color:`${G}3a` }}>
              {phase === 'select' ? 'Procesando...' : 'Sistema activo · Toca ▲ para subir'}
            </span>
          )}
        </div>
      </div>
      </div>

      {/* ══════════════ SIGNAL ══════════════ */}
      <div style={{ width: 40, flexShrink: 0, position:'relative', display:'flex', alignItems:'center' }}>
        {/* static track */}
        <div style={{ width:'100%', height: 1, background:`${G}18`, borderRadius: 1 }} />
        {/* animated fill */}
        {(phase === 'send' || phase === 'receive' || isSignalHovered) && (
          <div style={{
            position:'absolute', left: 0, top:'50%', transform:'translateY(-50%)',
            width: isSignalHovered ? '100%' : `${sigPct}%`, height: 2,
            background:`linear-gradient(90deg, ${G2}66, ${G})`,
            borderRadius: 1, transition: isSignalHovered ? 'width 0.4s ease' : 'width 0.03s linear',
          }} />
        )}
        {/* traveling dot */}
        {(phase === 'send' || isSignalHovered) && (
          <div style={{
            position:'absolute', 
            left: isSignalHovered ? '50%' : `calc(${sigPct}% - 3px)`, 
            top:'50%', transform:'translateY(-50%)',
            width: 7, height: 7, borderRadius:'50%',
            background: G, boxShadow:`0 0 10px ${G}, 0 0 22px ${G}88`,
            animation: isSignalHovered ? 'rk-pulse 1s infinite' : 'none',
          }} />
        )}
      </div>

      {/* ══ TV ENTRANCE WRAPPER ══ */}
      <div
        className={hasEntered ? 'rk-entered' : ''}
        style={{
          opacity: hasEntered ? 1 : 0,
          animation: hasEntered
            ? 'rk-spin-in-tv 2.4s cubic-bezier(0.16,1,0.3,1) 0.3s forwards, rk-float-tv 5s ease-in-out 2.9s infinite'
            : 'none',
          /* Subtle pop when TV is the focus */
          filter: tvActive ? `drop-shadow(0 0 22px rgba(255,218,0,0.25))` : 'none',
        }}
      >
      <div style={{
        width: 370, height: 300, borderRadius: 10, flexShrink: 0,
        background: '#060600',
        border: `1.5px solid ${tvFlash ? G + 'aa' : 'rgba(255,218,0,0.30)'}`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: tvActive
          ? 'perspective(900px) rotateY(14deg) rotateX(2deg) rotateZ(0deg) scale(1.03) translateZ(30px) translateY(-10px)'
          : 'perspective(900px) rotateY(18deg) rotateX(5deg) rotateZ(1deg)',
        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease',
        boxShadow: [
          /* Left-edge stepped depth — gold highlight, fades to black */
          `-2px  0 0 0 rgba(255,228,60,0.90)`,
          `-4px  0 0 0 rgba(210,165,10,0.80)`,
          `-7px  0 0 0 rgba(130,100,0,0.66)`,
          `-10px 0 0 0 rgba(62,47,0,0.52)`,
          `-14px 0 0 0 rgba(22,17,0,0.38)`,
          `-18px 0 0 0 rgba(6,4,0,0.24)`,
          `-22px 0 0 0 rgba(1,1,0,0.13)`,
          /* Bottom-edge depth */
          `0 3px 0 0 rgba(130,100,0,0.40)`,
          `0 6px 0 0 rgba(30,23,0,0.26)`,
          /* Cast shadow */
          tvFlash
            ? `-26px 40px 80px rgba(0,0,0,0.96), 8px 10px 24px rgba(0,0,0,0.58), 0 0 40px rgba(255,218,0,0.22)`
            : `-26px 40px 80px rgba(0,0,0,0.96), 8px 10px 24px rgba(0,0,0,0.58)`,
        ].join(', '),
      }}>
        {/* flash overlay */}
        {tvFlash && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
            background: `rgba(255,218,0,0.06)`, animation: 'rk-flash 0.9s ease-out forwards',
          }} />
        )}

        {/* TV HEADER */}
        <div style={{
          height: 30, background: '#0a0900', borderBottom: `1px solid rgba(255,218,0,0.14)`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 10px', flexShrink: 0, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg,transparent,rgba(255,218,0,0.05),transparent)`, animation: 'rk-sweep 4s linear infinite' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, zIndex: 1 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: G, boxShadow: `0 0 8px ${G}`, animation: 'rk-pulse 2s infinite' }} />
            <span style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 800, color: G, letterSpacing: '0.12em', textShadow: `0 0 8px ${G}` }}>ROCKEFELLER</span>
            <span style={{ fontFamily: 'monospace', fontSize: 6.5, color: `${G}77` }}>PRECIOS EN VIVO</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, zIndex: 1 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 6.5, color: `${G}66` }}>{time}</span>
            <span style={{
              fontFamily: 'monospace', fontSize: 6.5, padding: '1px 5px', borderRadius: 3,
              background: tvFlash ? `${G}22` : `${GR}12`,
              color: tvFlash ? G : GR,
              border: `1px solid ${tvFlash ? G + '55' : GR + '33'}`,
              transition: 'all 0.2s',
            }}>{tvFlash ? '⟳ UPDATE' : '● LIVE'}</span>
          </div>
        </div>

        {/* TV BODY */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.6fr', minHeight: 0, overflow: 'hidden' }}>
          {/* featured */}
          <div style={{
            background: `linear-gradient(160deg, #100e00 0%, #080700 100%)`,
            borderRight: `1px solid rgba(255,218,0,0.08)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '6px', position: 'relative', overflow: 'hidden',
          }}>
            {featured.id === activeId && tvFlash && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', background: `${G}20`, animation: 'rk-flash 0.9s ease-out forwards' }} />
            )}
            <div style={{ zIndex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 6.5, fontFamily: 'monospace', color: G, marginBottom: 3, textShadow: `0 0 8px ${G}` }}>★ DESTACADO ★</div>
              <div style={{ fontSize: 18, marginBottom: 3 }}>{featured.emoji}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 6.5, fontWeight: 700, color: `${G}dd`, marginBottom: 5 }}>{featured.name}</div>
              <div style={{
                fontFamily: 'monospace', fontSize: 16, fontWeight: 900,
                color: tc(featured.trend), textShadow: `0 0 12px ${tc(featured.trend)}`,
                lineHeight: 1, marginBottom: 2, 
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: featured.id === activeId && tvFlash ? 'scale(1.15)' : 'none',
              }}>{featured.price.toFixed(2)}€</div>
              <div style={{ fontFamily: 'monospace', fontSize: 7, color: tc(featured.trend) }}>
                {ta(featured.trend)} {featured.change > 0 ? '+' : ''}{featured.change.toFixed(1)}%
              </div>
              {(featured.id === activeId && tvFlash) && (
                <div style={{
                  marginTop: 4, fontFamily: 'monospace', fontSize: 7, fontWeight: 800,
                  color: '#000', background: G, padding: '1px 6px', borderRadius: 3, display: 'inline-block',
                  animation: 'rk-badge 0.4s ease-out',
                }}>▲ +{Math.abs(priceDelta).toFixed(2)}€</div>
              )}
              <div style={{ marginTop: 6, display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'flex-end', height: 14 }}>
                {[0.4,0.55,0.45,0.7,0.65,0.85,1,0.8].map((h, i) => (
                  <div key={i} style={{ width: 3, height: `${h*100}%`, background: `linear-gradient(180deg,${G},${G}33)`, opacity: 0.4 + h * 0.6, borderRadius: 1 }} />
                ))}
              </div>
            </div>
          </div>

          {/* cocktail grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3,1fr)', overflow: 'hidden' }}>
            {rest.map((c, i) => {
              const cellActive = c.id === activeId && tvFlash;
              return (
                <div key={c.id} style={{
                  borderRight:  i % 2 === 0 ? `1px solid rgba(255,218,0,0.06)` : 'none',
                  borderBottom: i < 4       ? `1px solid rgba(255,218,0,0.06)` : 'none',
                  padding: '4px 6px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  background: cellActive ? `${G}18` : tbg(c.trend),
                  outline: cellActive ? `1px solid ${G}66` : 'none',
                  transform: cellActive ? 'scale(1.03)' : 'none',
                  zIndex: cellActive ? 10 : 1,
                  boxShadow: cellActive ? `0 0 16px rgba(0,0,0,0.6)` : 'none',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {cellActive && (
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `${G}20`, animation: 'rk-flash 0.8s ease-out forwards', zIndex: 2 }} />
                  )}
                  {cellActive && (
                    <div style={{
                      position: 'absolute', top: 2, right: 2, zIndex: 3,
                      fontFamily: 'monospace', fontSize: 6, fontWeight: 900,
                      color: '#000', background: G, padding: '1px 3px', borderRadius: 2,
                      animation: 'rk-badge 0.4s ease-out',
                    }}>▲+{Math.abs(priceDelta).toFixed(2)}€</div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 9 }}>{c.emoji}</span>
                    <span style={{ fontSize: 8, fontFamily: 'monospace', fontWeight: 700, color: tc(c.trend) }}>{ta(c.trend)}</span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 6.5, fontWeight: 700, color: `${G}bb`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <span style={{
                      fontFamily: 'monospace', fontSize: 11, fontWeight: 900,
                      color: tc(c.trend), textShadow: `0 0 7px ${tc(c.trend)}`,
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: cellActive ? 'scale(1.15)' : 'none',
                      animation: cellActive ? 'rk-pop 0.5s ease-out' : 'none',
                    }}>{c.price.toFixed(2)}€</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 6, color: `${G}44` }}>
                      {c.change > 0 ? '+' : ''}{c.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ticker */}
        <div style={{ height: 20, background: '#050400', borderTop: `1px solid rgba(255,218,0,0.10)`, display: 'flex', alignItems: 'center', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 20, fontFamily: 'monospace', fontSize: 6.5, whiteSpace: 'nowrap', animation: 'rk-ticker 22s linear infinite', paddingLeft: '100%' }}>
            {[...cocktails, ...cocktails].map((c, i) => (
              <span key={i} style={{ color: tc(c.trend) }}>
                {c.emoji} {c.name} {c.price.toFixed(2)}€ ({c.change > 0 ? '+' : ''}{c.change.toFixed(1)}%)
                <span style={{ color: `rgba(255,218,0,0.16)`, marginLeft: 8 }}>·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes rk-pulse    { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes rk-sweep    { 0%{transform:translateX(-120%)} 100%{transform:translateX(220%)} }
        @keyframes rk-flash    { 0%{opacity:1} 100%{opacity:0} }
        @keyframes rk-ticker   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes rk-pop      { 0%{transform:scale(1.25)} 60%{transform:scale(0.97)} 100%{transform:scale(1)} }
        @keyframes rk-badge    { 0%{transform:translateY(-4px);opacity:0} 100%{transform:translateY(0);opacity:1} }
        @keyframes rk-btn-pulse{ 0%,100%{box-shadow:0 0 0 0 rgba(255,218,0,0.40)} 50%{box-shadow:0 0 0 4px rgba(255,218,0,0.20)} }

        /* ── PHONE entrance: 2 full turns, smooth landing ── */
        @keyframes rk-spin-in-phone {
          0%   { opacity:0; transform: perspective(800px) rotateY(720deg)  scale(0.5) translateY(40px); }
          15%  { opacity:1; }
          100% { opacity:1; transform: perspective(800px) rotateY(0deg)   scale(1)    translateY(0); }
        }

        /* ── TV entrance: 2 full turns opposite, smooth landing ── */
        @keyframes rk-spin-in-tv {
          0%   { opacity:0; transform: perspective(900px) rotateY(-720deg) scale(0.5) translateY(40px); }
          15%  { opacity:1; }
          100% { opacity:1; transform: perspective(900px) rotateY(0deg)   scale(1)    translateY(0); }
        }

        /* ── Gentle floating — subtle Y bob + micro-rotate ── */
        @keyframes rk-float {
          0%,100% { transform: translateY(0) rotate(0deg); }
          25%     { transform: translateY(-5px) rotate(0.3deg); }
          50%     { transform: translateY(-3px) rotate(-0.2deg); }
          75%     { transform: translateY(-7px) rotate(0.15deg); }
        }
        @keyframes rk-float-tv {
          0%,100% { transform: translateY(0) rotate(0deg); }
          25%     { transform: translateY(-4px) rotate(-0.25deg); }
          50%     { transform: translateY(-6px) rotate(0.2deg); }
          75%     { transform: translateY(-2px) rotate(-0.1deg); }
        }
      `}</style>
    </div>
  );
}
