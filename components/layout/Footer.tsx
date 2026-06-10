export default function Footer() {
  return (
    <footer
      id="footer"
      data-section="footer"
      className="relative w-full py-32 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 100%, rgba(110,110,255,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <p className="text-xs tracking-[0.3em] uppercase text-white/20 mb-6">¿Hablamos?</p>
        <h2
          className="font-display font-bold text-white leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
        >
          Construyamos<br />algo increíble.
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-12">
          <a
            href="mailto:pedrolm0211@gmail.com"
            className="group flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-black transition-transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6e6eff, #b06eff)' }}
          >
            pedrolm0211@gmail.com
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="tel:+34622163317"
            className="group flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
          >
            +34 622 16 33 17
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>

        <p className="mt-16 text-white/15 text-xs">
          © {new Date().getFullYear()} Pedro · Diseñado & Construido de cero
        </p>
      </div>
    </footer>
  );
}
