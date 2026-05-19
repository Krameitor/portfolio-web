'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PlaceholderSectionProps {
  id: string;
  sectionKey: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  accentVar: string;
}

function PlaceholderSection({
  id, sectionKey, index, title, subtitle, description, tags, accentVar,
}: PlaceholderSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current!.querySelectorAll('.animate-in'), {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 70%',
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id={id}
      data-section={sectionKey}
      ref={ref}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-32"
    >
      {/* Radial accent glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, color-mix(in srgb, ${accentVar} 10%, transparent) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Text column */}
        <div>
          <span className="animate-in block text-xs tracking-[0.3em] uppercase font-medium mb-4" style={{ color: `color-mix(in srgb, ${accentVar} 70%, white)` }}>
            {index} — {subtitle}
          </span>
          <h2 className="animate-in font-display font-bold text-white leading-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
            {title}
          </h2>
          <p className="animate-in mt-5 text-white/50 text-base md:text-lg leading-relaxed">
            {description}
          </p>
          <div className="animate-in mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs border font-medium"
                style={{
                  borderColor: `color-mix(in srgb, ${accentVar} 25%, transparent)`,
                  color: `color-mix(in srgb, ${accentVar} 80%, white)`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Visual placeholder */}
        <div
          className="animate-in rounded-2xl w-full"
          style={{
            height: 'clamp(250px, 40vw, 480px)',
            border: `1px solid color-mix(in srgb, ${accentVar} 20%, transparent)`,
            background: `color-mix(in srgb, ${accentVar} 4%, transparent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: `color-mix(in srgb, ${accentVar} 40%, transparent)` }}>
            UI Preview — próximamente
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── Exported sections ────────────────────────────────────────────────────────

export { ArrocesSection } from './arroces/ArrocesSection';
export { OraculusSection } from './oraculus/OraculusSection';

export { BrioxeSection } from './brioxe/BrioxeSection';
