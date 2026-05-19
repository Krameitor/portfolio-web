'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RockefellerMockup, { type Phase } from './RockefellerMockup';
import RockefellerBanner from './RockefellerBanner';

gsap.registerPlugin(ScrollTrigger);

const GOLD  = '#c9a227';
const GOLD2 = '#ffda00';
const GREEN = '#00ff88';

const STEPS = [
  {
    key: 'select',
    num: '01',
    title: 'El cliente elige',
    sub: 'Selecciona un cóctel y pulsa subir precio.',
    phases: ['pre-select', 'select'] as Phase[],
  },
  {
    key: 'send',
    num: '02',
    title: 'El precio viaja',
    sub: 'La señal llega al servidor en milisegundos.',
    phases: ['send'] as Phase[],
  },
  {
    key: 'receive',
    num: '03',
    title: 'La sala lo ve',
    sub: 'La pantalla del local actualiza todos los precios.',
    phases: ['pre-receive', 'receive'] as Phase[],
  },
];

export default function RockefellerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mockupRef  = useRef<HTMLDivElement>(null);
  const copyRef    = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  // States for Crono and Cursor Height Interaction
  const [activeStep, setActiveStep] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [hoverActiveStep, setHoverActiveStep] = useState<number | null>(null);

  // Automatic Cronómetro Timer (loops steps 0 -> 1 -> 2)
  useEffect(() => {
    if (isHovering) return; // Pause cronómetro when user is actively hovering/controlling with cursor Y!

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 4000); // Cycles every 4 seconds

    return () => clearInterval(interval);
  }, [isHovering]);

  // Synchronize mockup phase changes with activeStep when NOT hovering
  const handlePhaseChange = useCallback((phase: Phase) => {
    if (isHovering) return; // Keep cursor height override during active hover
    const idx = STEPS.findIndex(s => s.phases.includes(phase));
    if (idx >= 0) {
      setActiveStep(idx);
    }
  }, [isHovering]);

  // Cursor Y-position tracking and active step calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stepsContainerRef.current) return;
    const rect = stepsContainerRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    setMouseY(relativeY);
    setIsHovering(true);

    // Calculate active step based on vertical height partition (3 equal slices)
    const stepHeight = rect.height / STEPS.length;
    const stepIndex = Math.max(0, Math.min(STEPS.length - 1, Math.floor(relativeY / stepHeight)));
    setHoverActiveStep(stepIndex);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setHoverActiveStep(null);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: 'top 65%' };

      gsap.from(mockupRef.current, {
        x: -60, opacity: 0, duration: 1.4, ease: 'power3.out',
        scrollTrigger: { ...trigger, start: 'top 55%' },
      });

      if (copyRef.current) {
        gsap.from(Array.from(copyRef.current.children), {
          y: 30, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power2.out',
          scrollTrigger: trigger,
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const currentActiveStep = isHovering ? hoverActiveStep : activeStep;

  return (
    <>
      <RockefellerBanner sectionRef={sectionRef} />

      <section
        id="rockefeller"
        data-section="rockefeller"
        ref={sectionRef}
        className="relative w-full min-h-screen flex items-center overflow-hidden py-24 bg-[#050505]"
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: [
            'radial-gradient(ellipse 55% 60% at 18% 52%, rgba(201,162,39,0.12) 0%, transparent 65%)',
            'radial-gradient(ellipse 25% 35% at 75% 46%, rgba(255,218,0,0.03) 0%, transparent 70%)',
          ].join(', '),
        }} />

        {/* Grid */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-[3fr_2fr] gap-14 items-center">

          {/* Left — mockup with dynamic hoveredStep feedback */}
          <div ref={mockupRef} className="flex items-center justify-center" style={{ paddingLeft: '6%' }}>
            <RockefellerMockup 
              onPhaseChange={handlePhaseChange} 
              hoveredStep={isHovering ? hoverActiveStep : null}
            />
          </div>

          {/* Right — guided narrative */}
          <div ref={copyRef} className="flex flex-col items-start text-left">

            {/* Eyebrow */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: 20,
            }}>
              <span style={{
                display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
                background: GREEN, flexShrink: 0,
                boxShadow: `0 0 7px ${GREEN}, 0 0 14px ${GREEN}55`,
                animation: 'rks-dot 2s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.6rem',
                fontWeight: 500,
                letterSpacing: '0.34em',
                textTransform: 'uppercase' as const,
                color: `${GOLD}88`,
              }}>
                Rockefeller · Valencia
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
              El precio lo{' '}
              <span style={{
                fontStyle: 'italic',
                fontWeight: 400,
                background: `linear-gradient(95deg, ${GOLD2} 0%, ${GOLD} 55%, rgba(201,162,39,0.6) 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 100%',
                animation: 'rks-shimmer 4s ease-in-out infinite',
              }}>
                pone la noche.
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
              color: 'rgba(255,240,180,0.42)',
              maxWidth: 380,
            }}>
              Precios dinámicos para hostelería. Cada pedido mueve el mercado.
            </p>

            {/* ═══════════ INTERACTIVE GUIDED STEPS ═══════════ */}
            <div 
              ref={stepsContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="group/steps"
              style={{ 
                marginTop: 42, 
                width: '100%', 
                maxWidth: 440, 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              {/* Dynamic sliding golden neon spotlight that follows the exact cursor Y position */}
              {isHovering && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: mouseY - 65,
                  height: 130,
                  background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,218,0,0.12) 0%, rgba(255,218,0,0.03) 45%, transparent 70%)',
                  pointerEvents: 'none',
                  zIndex: 1,
                  transition: 'top 0.12s cubic-bezier(0.16, 1, 0.3, 1)', // ultra-smooth physical drag lag
                  mixBlendMode: 'screen',
                }} />
              )}

              {STEPS.map((step, i) => {
                const isActive = i === currentActiveStep;
                const isPast   = currentActiveStep !== null && currentActiveStep >= 0 && i < currentActiveStep;

                return (
                  <div
                    key={step.key}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 24,
                      paddingTop: 20,
                      paddingBottom: 24,
                      borderTop: `1px solid ${isActive ? GOLD : 'rgba(255,255,255,0.06)'}`,
                      boxShadow: isActive ? `inset 0 1px 0 rgba(255,218,0,0.16)` : 'none',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Active highlight background sweep */}
                    {isActive && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: `linear-gradient(180deg, rgba(201,162,39,0.06) 0%, transparent 100%)`,
                        pointerEvents: 'none',
                      }} />
                    )}

                    {/* ── High-Tech Number ── */}
                    <div style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '1.1rem',
                      fontWeight: 300,
                      color: isActive ? GOLD2 : isPast ? `${GOLD}55` : 'rgba(255,255,255,0.15)',
                      letterSpacing: '0.02em',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      textShadow: isActive ? `0 0 12px ${GOLD}66` : 'none',
                      paddingTop: 5, 
                      position: 'relative',
                      zIndex: 2,
                    }}>
                      {step.num}
                    </div>

                    {/* ── Step content ── */}
                    <div style={{
                      display: 'flex', flexDirection: 'column',
                      transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      opacity: isActive ? 1 : isPast ? 0.6 : 0.3,
                      position: 'relative',
                      zIndex: 2,
                    }}>
                      {/* Title */}
                      <div style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.4rem',
                        fontWeight: 400,
                        color: isActive ? '#fff' : 'rgba(255,240,180,0.5)',
                        letterSpacing: '0.02em',
                        lineHeight: 1.2,
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}>
                        {step.title}
                      </div>

                      {/* Subtitle */}
                      <div style={{
                        marginTop: 6,
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.88rem',
                        fontWeight: 300,
                        color: isActive ? 'rgba(255,240,180,0.65)' : 'rgba(255,240,180,0.3)',
                        lineHeight: 1.6,
                        maxWidth: 320,
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}>
                        {step.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tech footnote */}
            <p style={{
              marginTop: 36, marginBottom: 0,
              fontFamily: 'var(--font-display)',
              fontSize: '0.56rem',
              fontWeight: 500,
              letterSpacing: '0.20em',
              textTransform: 'uppercase' as const,
              color: `${GOLD}22`,
            }}>
              Next.js · WebSocket · Prisma · Redsys
            </p>

          </div>
        </div>

        {/* Keyframes */}
        <style>{`
          @keyframes rks-dot {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.25; }
          }
          @keyframes rks-shimmer {
            0%   { background-position: 100% 50%; }
            50%  { background-position:   0% 50%; }
            100% { background-position: 100% 50%; }
          }
        `}</style>
      </section>
    </>
  );
}
