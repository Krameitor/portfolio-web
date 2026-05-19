'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ArrocesCarousel from './ArrocesCarousel';

gsap.registerPlugin(ScrollTrigger);

const ORANGE = '#ff6b35';
const GOLD = '#ffb347';

export function ArrocesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: 'top 65%' };

      if (copyRef.current) {
        gsap.from(Array.from(copyRef.current.children), {
          y: 30, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power2.out',
          scrollTrigger: trigger,
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="arroces"
      data-section="arroces"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center overflow-hidden py-24"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: [
          'radial-gradient(ellipse 45% 50% at 85% 50%, rgba(255, 107, 53, 0.12) 0%, transparent 65%)',
          'radial-gradient(ellipse 25% 35% at 15% 46%, rgba(255, 179, 71, 0.05) 0%, transparent 70%)',
        ].join(', '),
      }} />

      {/* Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">

        {/* Left — Narrative */}
        <div ref={copyRef} className="flex flex-col items-start text-left z-20">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{
              display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
              background: ORANGE, flexShrink: 0,
              boxShadow: `0 0 7px ${ORANGE}, 0 0 14px ${ORANGE}55`,
            }} />
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '0.6rem', fontWeight: 500,
              letterSpacing: '0.34em', textTransform: 'uppercase', color: `${GOLD}88`,
            }}>
              Arroces Masía · E-Commerce Sensorial
            </span>
          </div>

          <h2 style={{
            margin: 0, fontFamily: 'var(--font-luxury)', fontWeight: 300,
            lineHeight: 1.05, letterSpacing: '-0.01em', color: '#fff',
            fontSize: 'clamp(2.6rem, 5.5vw, 5rem)',
          }}>
            Una experiencia inmersiva para un{' '}
            <span style={{
              fontStyle: 'italic', fontWeight: 400,
              background: `linear-gradient(95deg, ${GOLD} 0%, ${ORANGE} 55%, rgba(255,107,53,0.6) 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', backgroundSize: '200% 100%',
            }}>
              clásico valenciano.
            </span>
          </h2>

          <p style={{
            marginTop: 16, marginBottom: 0, fontFamily: 'var(--font-luxury)',
            fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
            lineHeight: 1.65, color: 'rgba(255, 230, 200, 0.5)', maxWidth: 460,
          }}>
            Un escaparate digital diseñado para abrir el apetito. Elevamos el tradicional servicio a domicilio convirtiéndolo en un viaje sensorial y magnético.
          </p>

          <div style={{ marginTop: 42, display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 480 }}>
            {/* Feature 1 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, paddingTop: 20, borderTop: `1px solid rgba(255,255,255,0.06)` }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 300, color: `${GOLD}55` }}>01</div>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'rgba(255, 230, 200, 0.8)' }}>Interacción Orgánica</div>
                <div style={{ marginTop: 6, fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: 'rgba(255, 230, 200, 0.4)' }}>
                  Las paellas giran en una órbita fluida que invita al usuario a explorar la carta como si tuviera el producto frente a él, maximizando el deseo.
                </div>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, paddingTop: 20, borderTop: `1px solid rgba(255,255,255,0.06)` }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 300, color: `${GOLD}55` }}>02</div>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'rgba(255, 230, 200, 0.8)' }}>Proceso sin Fricciones</div>
                <div style={{ marginTop: 6, fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: 'rgba(255, 230, 200, 0.4)' }}>
                  Desde el impacto visual inicial hasta la confirmación final, cada paso fluye de manera natural para ofrecer una experiencia premium y sin esperas.
                </div>
              </div>
            </div>
          </div>

          <p style={{
            marginTop: 48, fontFamily: 'var(--font-display)', fontSize: '0.56rem',
            fontWeight: 500, letterSpacing: '0.20em', textTransform: 'uppercase', color: `${ORANGE}44`,
          }}>
            E-Commerce · Diseño Interactivo · Experiencia de Usuario
          </p>
        </div>

        {/* Right — Carousel */}
        <div className="flex items-center justify-center relative w-full h-[500px] pointer-events-none md:pointer-events-auto" style={{ zIndex: 10 }}>
           <ArrocesCarousel />
        </div>

      </div>
    </section>
  );
}
