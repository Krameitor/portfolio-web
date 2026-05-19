'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BrioxeMockup from './BrioxeMockup';

gsap.registerPlugin(ScrollTrigger);

const BLUE = '#3d8ef5';

const CAPABILITIES = [
  'Arquitectura Offline-First',
  'Twilio SMS API',
  'Base de datos local (Dexie.js)',
  'Shortcuts de teclado',
  'Sincronización en tiempo real'
];

export function BrioxeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef    = useRef<HTMLDivElement>(null);
  const demoRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: 'top 65%' };

      gsap.from(demoRef.current, {
        y: 40, opacity: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { ...trigger, start: 'top 58%' },
      });

      if (copyRef.current) {
        gsap.from(Array.from(copyRef.current.children), {
          y: 28, opacity: 0, stagger: 0.11, duration: 0.85, ease: 'power2.out',
          scrollTrigger: trigger,
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="brioxe"
      data-section="brioxe"
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden py-32"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: [
          `radial-gradient(circle at 50% 30%, rgba(61,142,245,0.06) 0%, transparent 60%)`,
          `radial-gradient(circle at 50% 80%, rgba(61,142,245,0.03) 0%, transparent 50%)`,
        ].join(', '),
      }} />
      
      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:`linear-gradient(rgba(61,142,245,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(61,142,245,0.03) 1px,transparent 1px)`,
        backgroundSize:'48px 48px',
        maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 0%, transparent 80%)',
      }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center">

        {/* ── Top: Centered Copy ── */}
        <div ref={copyRef} className="mb-20 flex flex-col items-center text-center max-w-3xl">
          {/* Eyebrow */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
            <span style={{
              display:'inline-block', width:6, height:6, borderRadius:'50%',
              background:BLUE, boxShadow:`0 0 10px ${BLUE},0 0 20px ${BLUE}66`,
              animation:'brx-s-dot 2s ease-in-out infinite',
            }}/>
            <span style={{
              fontFamily:'var(--font-display)', fontSize:'0.65rem', fontWeight:600,
              letterSpacing:'0.35em', textTransform:'uppercase' as const, color:`${BLUE}aa`,
            }}>
              Brioxé · Point of Sale
            </span>
          </div>

          {/* Headline */}
          <h2 style={{
            margin:0, fontFamily:'var(--font-luxury)', fontWeight:300,
            lineHeight:1.1, letterSpacing:'-0.02em', color:'#fff',
            fontSize:'clamp(2.8rem, 5vw, 4.5rem)',
          }}>
            Rendimiento bajo{' '}
            <span style={{
              fontStyle:'italic', fontWeight:400,
              background:`linear-gradient(95deg,${BLUE} 0%,#fff 100%)`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              backgroundClip:'text', backgroundSize:'200% 100%',
              animation:'brx-s-shimmer 5s ease-in-out infinite',
            }}>
              presión.
            </span>
          </h2>

          <p style={{
            marginTop:24, fontFamily:'var(--font-sans)',
            fontWeight:300, fontSize:'1.15rem',
            lineHeight:1.7, color:'rgba(255,255,255,0.5)', maxWidth:640,
          }}>
            Un sistema POS <strong style={{color: '#fff', fontWeight: 500}}>Offline-First</strong> diseñado para entornos de alta exigencia. Rapidez instantánea mediante base de datos local, notificaciones SMS automáticas e integración profunda de teclado para no soltar nunca el ritmo.
          </p>

          {/* Capability Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 32 }}>
            {CAPABILITIES.map((cap) => (
              <span key={cap} style={{
                padding: '8px 18px', borderRadius: 30,
                background: `linear-gradient(135deg, rgba(61,142,245,0.08), rgba(61,142,245,0.03))`,
                border: `1px solid ${BLUE}22`,
                color: BLUE, fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
                boxShadow: `0 4px 12px rgba(0,0,0,0.2)`
              }}>
                {cap}
              </span>
            ))}
          </div>
        </div>

        {/* ── Bottom: interactive demo ── */}
        <div ref={demoRef} className="w-full flex flex-col items-center">
          
          <BrioxeMockup />

          {/* Tech footnote */}
          <div style={{
            marginTop:40, padding: '8px 24px', borderRadius: 20,
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
            display: 'inline-flex', alignItems: 'center', gap: 12
          }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
            <p style={{
              margin:0, fontFamily:'var(--font-display)', fontSize:'0.55rem',
              fontWeight:600, letterSpacing:'0.25em', textTransform:'uppercase' as const,
              color:`rgba(255,255,255,0.3)`,
            }}>
              Next.js 15 · IndexedDB · Twilio API
            </p>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes brx-s-dot     { 0%,100%{opacity:1} 50%{opacity:0.25} }
        @keyframes brx-s-shimmer { 0%{background-position:100% 50%} 50%{background-position:0% 50%} 100%{background-position:100% 50%} }
      `}</style>
    </section>
  );
}
