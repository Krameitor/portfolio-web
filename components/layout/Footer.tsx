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

        <a
          href="mailto:hola@pedro.dev"
          className="group mt-12 flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-black transition-transform hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #6e6eff, #b06eff)' }}
        >
          hola@pedro.dev
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>

        <p className="mt-16 text-white/15 text-xs">
          © {new Date().getFullYear()} Pedro · Diseñado & Construido de cero
        </p>
      </div>
    </footer>
  );
}
