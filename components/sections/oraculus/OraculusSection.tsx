'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OraculusMockup from './OraculusMockup';

gsap.registerPlugin(ScrollTrigger);

const GREEN  = '#10b981';
const GREEN2 = '#00ff88';
const DARK_GREEN = '#059669';

const CAPABILITIES = [
  'Detección de sesgos periodísticos',
  'Evaluación de fuentes (CRAAP)',
  'Scoring de objetividad',
  'Auditoría anti-bulos'
];

export function OraculusSection() {
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
      id="oraculus"
      data-section="oraculus"
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden py-32"
    >
      {/* Ambient glow - Green-themed */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: [
          `radial-gradient(circle at 50% 30%, rgba(16,185,129,0.06) 0%, transparent 60%)`,
          `radial-gradient(circle at 50% 80%, rgba(0,255,136,0.04) 0%, transparent 50%)`,
        ].join(', '),
      }} />
      
      {/* Subtle grid - Green-themed */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:`linear-gradient(rgba(16,185,129,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.03) 1px,transparent 1px)`,
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
              background:GREEN2, boxShadow:`0 0 10px ${GREEN2},0 0 20px ${GREEN2}66`,
              animation:'orc-s-dot 2s ease-in-out infinite',
            }}/>
            <span style={{
              fontFamily:'var(--font-display)', fontSize:'0.65rem', fontWeight:600,
              letterSpacing:'0.35em', textTransform:'uppercase' as const, color:`${GREEN2}aa`,
            }}>
              Oraculus · Auditoría de Información
            </span>
          </div>

          {/* Headline */}
          <h2 style={{
            margin:0, fontFamily:'var(--font-luxury)', fontWeight:300,
            lineHeight:1.1, letterSpacing:'-0.02em', color:'#fff',
            fontSize:'clamp(2.8rem, 5vw, 4.5rem)',
          }}>
            ¿Es fiable lo que{' '}
            <span style={{
              fontStyle:'italic', fontWeight:400,
              background:`linear-gradient(95deg,${GREEN2} 0%,${DARK_GREEN} 50%,#fff 100%)`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              backgroundClip:'text', backgroundSize:'200% 100%',
              animation:'orc-s-shimmer 5s ease-in-out infinite',
            }}>
              estás leyendo?
            </span>
          </h2>

          <p style={{
            marginTop:24, fontFamily:'var(--font-sans)',
            fontWeight:300, fontSize:'1.15rem',
            lineHeight:1.7, color:'rgba(255,255,255,0.5)', maxWidth:640,
          }}>
            La desinformación es sutil. Oraculus disecciona URLs y PDFs utilizando el <strong style={{color: '#fff', fontWeight: 500}}>método CRAAP</strong> para destapar la verdad: detecta sesgos cognitivos, audita la fiabilidad de cada fuente y evalúa la objetividad en segundos.
          </p>

          {/* Capability Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 32 }}>
            {CAPABILITIES.map((cap) => (
              <span key={cap} style={{
                padding: '8px 18px', borderRadius: 30,
                background: `linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.03))`,
                border: `1px solid ${GREEN}22`,
                color: GREEN2, fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
                boxShadow: `0 4px 12px rgba(0,0,0,0.2)`
              }}>
                {cap}
              </span>
            ))}
          </div>
        </div>

        {/* ── Bottom: interactive demo ── */}
        <div ref={demoRef} className="w-full flex flex-col items-center">
          
          <OraculusMockup />

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
              OpenAI · Supabase · Next.js · Vector DB
            </p>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orc-s-dot     { 0%,100%{opacity:1} 50%{opacity:0.25} }
        @keyframes orc-s-shimmer { 0%{background-position:100% 50%} 50%{background-position:0% 50%} 100%{background-position:100% 50%} }
      `}</style>
    </section>
  );
}
