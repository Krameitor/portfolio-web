import HeroSection from '@/components/sections/HeroSection';
import RockefellerSection from '@/components/sections/rockefeller/RockefellerSection';
import { ArrocesSection, OraculusSection, BrioxeSection } from '@/components/sections/ProjectSections';
import Footer from '@/components/layout/Footer';
export default function Home() {
  return (
    <>
      {/* Sección 0 — Hero */}
      <HeroSection />

      {/* Sección 1 — Rockefeller (3D / WebGL) */}
      <RockefellerSection />

      {/* Sección 2 — Arroces Masía */}
      <ArrocesSection />

      {/* Sección 4 — Oraculus (Predictive IA) */}
      <OraculusSection />

      {/* Sección 5 — Brioxé (POS) */}
      <BrioxeSection />

      {/* Footer — CTA */}
      <Footer />
    </>
  );
}
