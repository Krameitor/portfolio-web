'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VeridianMockup from './VeridianMockup';

gsap.registerPlugin(ScrollTrigger);

const GREEN  = '#10b981';
const GREEN2 = '#34d399';
const VIOLET = '#8a2be2';

const FEATURES = [
  {
    num: '01',
    title: 'CRAAP Method',
    sub: 'Currency, Relevance, Authority, Accuracy, Purpose. Cada noticia verificada en 5 dimensiones.',
  },
  {
    num: '02',
    title: 'Feed Inteligente',
    sub: 'Algoritmo de recomendación personalizado. Las noticias que te importan, sin el ruido.',
  },
  {
    num: '03',
    title: 'IA Contextual',
    sub: 'Pregunta a la IA sobre cualquier artículo. Busca fuentes externas y contrasta información en tiempo real.',
  },
];

export function VeridianSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef    = useRef<HTMLDivElement>(null);
  const mockupRef  = useRef<HTMLDivElement>(null);
  const [isMockupVisible, setIsMockupVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: 'top 65%' };

      gsap.from(mockupRef.current, {
        x: 60, opacity: 0, duration: 1.4, ease: 'power3.out',
        scrollTrigger: { ...trigger, start: 'top 55%' },
      });

      if (copyRef.current) {
        gsap.from(Array.from(copyRef.current.children), {
          y: 30, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power2.out',
          scrollTrigger: trigger,
        });
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 65%',
        onEnter: () => setIsMockupVisible(true),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="veridian"
      data-section="veridian"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center overflow-hidden py-24"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: [
          `radial-gradient(ellipse 50% 55% at 78% 50%, rgba(16,185,129,0.09) 0%, transparent 65%)`,
          `radial-gradient(ellipse 30% 40% at 20% 46%, rgba(138,43,226,0.06) 0%, transparent 70%)`,
        ].join(', '),
      }} />

      {/* Grid lines faint */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 80% 70% at 75% 50%, black 0%, transparent 70%)',
      }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_1.1fr] gap-14 items-center">

        {/* ── Left — Narrative ── */}
        <div ref={copyRef} className="flex flex-col items-start text-left">

          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{
              display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
              background: GREEN, flexShrink: 0,
              boxShadow: `0 0 7px ${GREEN}, 0 0 14px ${GREEN}55`,
              animation: 'vrd-dot 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.6rem',
              fontWeight: 500,
              letterSpacing: '0.34em',
              textTransform: 'uppercase' as const,
              color: `${GREEN}99`,
            }}>
              Veridian News · Información Verificada
            </span>
          </div>

          {/* Headline */}
          <h2 style={{
            margin: 0,
            fontFamily: 'var(--font-luxury)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            color: '#fff',
            fontSize: 'clamp(2.6rem, 5.5vw, 5rem)',
          }}>
            Noticias reales.{' '}
            <span style={{
              fontStyle: 'italic',
              fontWeight: 400,
              background: `linear-gradient(95deg, ${GREEN2} 0%, ${GREEN} 55%, rgba(16,185,129,0.5) 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 100%',
              animation: 'vrd-shimmer 4s ease-in-out infinite',
            }}>
              IA verificada.
            </span>
          </h2>

          {/* Descriptor */}
          <p style={{
            marginTop: 16, marginBottom: 0,
            fontFamily: 'var(--font-luxury)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
            lineHeight: 1.65,
            color: 'rgba(200, 255, 235, 0.4)',
            maxWidth: 420,
          }}>
            Un feed de noticias que filtra la desinformación con el método CRAAP y un asistente IA contextual por artículo.
          </p>

          {/* Features list */}
          <div style={{ marginTop: 42, width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column' }}>
            {FEATURES.map((f) => (
              <div key={f.num} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 24,
                paddingTop: 20,
                paddingBottom: 24,
                borderTop: `1px solid rgba(255,255,255,0.06)`,
              }}>
                {/* Number */}
                <div style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.1rem',
                  fontWeight: 300,
                  color: `${GREEN}55`,
                  letterSpacing: '0.02em',
                  paddingTop: 5,
                  flexShrink: 0,
                }}>
                  {f.num}
                </div>

                {/* Content */}
                <div>
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.35rem',
                    fontWeight: 400,
                    color: 'rgba(200, 255, 235, 0.75)',
                    lineHeight: 1.2,
                    marginBottom: 6,
                  }}>
                    {f.title}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.87rem',
                    fontWeight: 300,
                    color: 'rgba(200, 255, 235, 0.35)',
                    lineHeight: 1.65,
                    maxWidth: 320,
                  }}>
                    {f.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tech footnote */}
          <p style={{
            marginTop: 32, marginBottom: 0,
            fontFamily: 'var(--font-display)',
            fontSize: '0.56rem',
            fontWeight: 500,
            letterSpacing: '0.20em',
            textTransform: 'uppercase' as const,
            color: `${GREEN}22`,
          }}>
            React · Supabase · OpenAI · CRAAP Method · TypeScript
          </p>
        </div>

        {/* ── Right — Mockup ── */}
        <div
          ref={mockupRef}
          className="flex items-center justify-center relative"
          style={{ minHeight: 560 }}
        >
          {/* Glow halo behind phone */}
          <div style={{
            position: 'absolute',
            width: 320, height: 400,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${GREEN}18 0%, ${VIOLET}08 50%, transparent 70%)`,
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }} />

          <VeridianMockup isVisible={isMockupVisible} />

          {/* Floating badge — "TikTok for news" */}
          <div style={{
            position: 'absolute',
            top: 24,
            left: '4%',
            padding: '8px 14px',
            borderRadius: 20,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${GREEN}33`,
            display: 'flex', alignItems: 'center', gap: 8,
            animation: isMockupVisible ? 'vrd-badge-in 0.6s 0.8s ease both' : 'none',
          }}>
            <span style={{ fontSize: 13 }}>📰</span>
            <span style={{ color: GREEN, fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4 }}>
              TikTok para noticias
            </span>
          </div>

          {/* Floating badge — waitlist */}
          <div style={{
            position: 'absolute',
            bottom: 28,
            right: '2%',
            padding: '8px 14px',
            borderRadius: 20,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${VIOLET}44`,
            display: 'flex', alignItems: 'center', gap: 8,
            animation: isMockupVisible ? 'vrd-badge-in 0.6s 1.1s ease both' : 'none',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: VIOLET,
              boxShadow: `0 0 6px ${VIOLET}`,
              animation: 'vrd-dot 2s ease-in-out infinite',
            }} />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9.5, fontWeight: 600, letterSpacing: 0.3 }}>
              Waitlist abierta
            </span>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes vrd-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
        }
        @keyframes vrd-shimmer {
          0%   { background-position: 100% 50%; }
          50%  { background-position:   0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes vrd-badge-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
