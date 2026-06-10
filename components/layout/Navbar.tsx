'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: 'Inicio',       href: '#hero' },
  { label: 'Rockefeller',  href: '#rockefeller' },
  { label: 'Arroces',      href: '#arroces' },
  { label: 'Oraculus',     href: '#oraculus' },
  { label: 'Brioxé',       href: '#brioxe' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 'top -80',
      onUpdate: (self) => setScrolled(self.progress > 0),
    });
    return () => st.kill();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-xl bg-black/30 border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      {/* Logo */}
      <a href="#hero" className="font-display font-bold text-lg tracking-tight text-white/50">
        Tu marca<span className="text-[#c9a227]">.</span>
      </a>

      {/* Links */}
      <ul className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              onClick={(e) => handleClick(e, href)}
              className="text-sm font-medium text-white/50 hover:text-white/90 transition-colors duration-300"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="mailto:pedrolm0211@gmail.com"
        className="hidden md:flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
      >
        Contacto
      </a>
    </nav>
  );
}
