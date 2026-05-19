'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Each section declares its background color.
 * GSAP interpolates between them as the user scrolls.
 */
const SECTION_COLORS: Record<string, string> = {
  hero:        'var(--bg-hero)',
  rockefeller: 'var(--bg-rockefeller)',
  arroces:     'var(--bg-arroces)',
  oraculus:    'var(--bg-oraculus)',
  brioxe:      'var(--bg-brioxe)',
  footer:      'var(--bg-footer)',
};

export default function ScrollColorManager() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-section]');
    if (!sections.length) return;

    const triggers = Array.from(sections).map((section) => {
      const sectionKey = section.dataset.section as string;
      const color = SECTION_COLORS[sectionKey] ?? 'var(--bg-hero)';

      return ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => gsap.to('body', { backgroundColor: color, duration: 0.9, ease: 'power2.out' }),
        onEnterBack: () => gsap.to('body', { backgroundColor: color, duration: 0.9, ease: 'power2.out' }),
      });
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return null; // purely side-effect — no DOM output
}
