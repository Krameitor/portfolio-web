'use client';

import { useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@/components/layout/SmoothScrollProvider';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS_SECTION = '#rockefeller';

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const epicTitleRef = useRef<HTMLDivElement>(null);
  const { lenis } = useLenis();

  const scrollToProjects = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(PROJECTS_SECTION, { duration: 1.35, offset: 0 });
      return;
    }

    document.querySelector(PROJECTS_SECTION)?.scrollIntoView({ behavior: 'smooth' });
  }, [lenis]);

  useEffect(() => {
    // ─── HYPER-OPTIMIZED 3D CANVAS RENDERING ENGINE (EXACT REFERENCE REPLICATION) ───
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.25);

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth - 0.5;
      targetMouseY = e.clientY / window.innerHeight - 0.5;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    let time = 0;
    const horizonRatio = 0.58;
    const speed = 0.08;

    const stars: { x: number; y: number; size: number; baseAlpha: number; phase: number; speed: number }[] = [];
    const numStars = 145;
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random() * horizonRatio,
        size: 0.7 + Math.random() * 1.3,
        baseAlpha: 0.25 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2,
        speed: 0.012 + Math.random() * 0.026,
      });
    }

    const render = () => {
      time += speed;

      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      const horizon = height * horizonRatio + mouseY * 35;
      const centerX = width / 2 + mouseX * 70;
      const smoothMouseX = (mouseX + 0.5) * width;

      const staticSunX = width / 2;
      const staticSunY = height * horizonRatio;
      const sunRadius = Math.min(width, height) * 0.24;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];
        const alpha = star.baseAlpha + Math.sin(time * star.speed + star.phase) * 0.25;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.12, Math.min(1, alpha))})`;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      const sunGrad = ctx.createLinearGradient(0, staticSunY - sunRadius, 0, staticSunY);
      sunGrad.addColorStop(0, '#ffe74c');
      sunGrad.addColorStop(0.35, '#ff7e3c');
      sunGrad.addColorStop(0.75, '#ff217c');
      sunGrad.addColorStop(1, '#b5007d');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.moveTo(staticSunX - sunRadius - 1, staticSunY);
      ctx.arc(staticSunX, staticSunY, sunRadius, Math.PI, 0, false);
      ctx.lineTo(staticSunX + sunRadius + 1, staticSunY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Synthwave slices — only in the lower band (never near the apex, avoids top seam)
      const numSlices = 7;
      const sliceTopLimit = staticSunY - sunRadius * 0.52;
      const startSliceY = staticSunY - sunRadius * 0.44;
      const totalSliceHeight = staticSunY - startSliceY;
      const sliceSky = '#190333';

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(staticSunX - sunRadius, staticSunY);
      ctx.arc(staticSunX, staticSunY, sunRadius, Math.PI, 0, false);
      ctx.closePath();
      ctx.clip();

      for (let i = 0; i < numSlices; i++) {
        const ratio = i / (numSlices - 1);
        const slitY = startSliceY + ratio * totalSliceHeight;
        if (slitY < sliceTopLimit) continue;
        const slitHeight = 2.2 + ratio * 7.5;
        ctx.clearRect(staticSunX - sunRadius - 30, slitY, sunRadius * 2 + 60, slitHeight);
      }
      ctx.restore();

      const fogGrad = ctx.createLinearGradient(0, horizon - 22, 0, horizon + 5);
      fogGrad.addColorStop(0, 'rgba(25, 3, 51, 0)');
      fogGrad.addColorStop(0.65, 'rgba(25, 3, 51, 0.90)');
      fogGrad.addColorStop(1, 'rgba(7, 1, 15, 1)');
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, horizon - 22, width, 27);

      ctx.strokeStyle = 'rgba(176, 0, 255, 0.45)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();

      const maxLines = 20;
      for (let i = 1; i <= maxLines; i++) {
        const z = i - (time % 1);
        const y = horizon + (height - horizon) * Math.pow(z / maxLines, 2.2);
        if (y > horizon) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
      }

      const numRays = 28;
      for (let i = 0; i <= numRays; i++) {
        const angleRatio = i / numRays;
        const bottomX = (angleRatio - 0.5) * width * 4.2 + centerX;
        ctx.moveTo(centerX, horizon);
        ctx.lineTo(bottomX, height);
      }
      ctx.stroke();

      const drawMountains = (isLeft: boolean) => {
        const rows = 12;
        const cols = 10;
        const scale = Math.min(width, height) * 0.72;

        const px = new Float32Array((rows + 1) * (cols + 1));
        const py = new Float32Array((rows + 1) * (cols + 1));
        const pOpacity = new Float32Array((rows + 1) * (cols + 1));

        const spacing = 0.85;
        const zTravel = (time * 0.085) % spacing;

        const zNear = 1.0;
        const zFar = rows * spacing + zNear;

        for (let r = 0; r <= rows; r++) {
          const z = (rows - r) * spacing + zNear + zTravel;
          const idxRow = r * (cols + 1);

          const depthFade = Math.sin(((z - zNear) / (zFar - zNear)) * Math.PI);
          const smoothDepthFade = Math.pow(Math.max(0, Math.min(1, depthFade)), 1.5);

          for (let c = 0; c <= cols; c++) {
            const colRatio = c / cols;
            const worldX = isLeft ? -1.55 + colRatio * 1.05 : 0.5 + colRatio * 1.05;

            const distFromCenter = Math.abs(worldX);
            const terrainProfile = Math.sin(worldX * 7.5) * Math.cos((rows - r) * 0.65) * 0.18;
            let heightVal = terrainProfile - Math.pow(distFromCenter - 0.35, 2) * 0.48;

            heightVal *= smoothDepthFade;

            const idx = idxRow + c;
            px[idx] = centerX + (worldX * scale) / z;
            py[idx] = horizon + (heightVal * scale) / z;
            pOpacity[idx] = 0.48 * smoothDepthFade;
          }
        }

        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const idxRow = r * (cols + 1);
          const nextIdxRow = (r + 1) * (cols + 1);

          for (let c = 0; c < cols; c++) {
            const i1 = idxRow + c;
            const i2 = idxRow + c + 1;
            const i3 = nextIdxRow + c;

            const opacity = (pOpacity[i1] + pOpacity[i2] + pOpacity[i3]) / 3;
            ctx.strokeStyle = `rgba(176, 0, 255, ${opacity * 0.38})`;

            ctx.moveTo(px[i1], py[i1]);
            ctx.lineTo(px[i2], py[i2]);
            ctx.moveTo(px[i1], py[i1]);
            ctx.lineTo(px[i3], py[i3]);
          }
        }
        ctx.stroke();
      };

      drawMountains(true);
      drawMountains(false);

      ctx.save();
      const spotGlow = ctx.createRadialGradient(smoothMouseX, horizon, 2, smoothMouseX, horizon, 260);
      spotGlow.addColorStop(0, 'rgba(255, 170, 30, 0.62)');
      spotGlow.addColorStop(0.35, 'rgba(255, 90, 0, 0.32)');
      spotGlow.addColorStop(0.75, 'rgba(255, 0, 127, 0.14)');
      spotGlow.addColorStop(1, 'rgba(176, 0, 255, 0)');

      ctx.fillStyle = spotGlow;
      ctx.beginPath();
      ctx.ellipse(smoothMouseX, horizon, 280, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const horizonGlow = ctx.createLinearGradient(0, horizon - 10, 0, horizon + 10);
      horizonGlow.addColorStop(0, 'rgba(255, 0, 127, 0)');
      horizonGlow.addColorStop(0.5, 'rgba(255, 119, 0, 0.20)');
      horizonGlow.addColorStop(1, 'rgba(176, 0, 255, 0)');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, horizon - 10, width, 20);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.from('.hero-badge', { y: 14, opacity: 0, duration: 0.65 })
        .from('.hero-epic-name', { y: 400, opacity: 0, duration: 2.2, ease: 'power4.out' }, '-=0.4')
        .from('.hero-headline-line', { y: 24, opacity: 0, duration: 0.9, stagger: 0.1 }, '-=0.65')
        .from('.hero-divider', { scaleX: 0, opacity: 0, duration: 0.6 }, '-=0.45')
        .from('.hero-subtitle', { y: 18, opacity: 0, duration: 0.8 }, '+=0.15')
        .from('.hero-btn', { y: 22, opacity: 0, duration: 0.85, stagger: 0.12 }, '-=0.5');

      gsap.to([uiRef.current, epicTitleRef.current], {
        y: -56,
        opacity: 0.12,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('.hero-projects-arrow', {
        y: 5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        duration: 1.1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      data-section="hero"
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden"
      style={{ perspective: 1000, background: 'linear-gradient(to bottom, #0d021c 0%, #190333 35%, #27084f 50%, #420a75 58%, #07010f 62%, #020004 100%)' }}
    >
      {/* 1. Epic Title behind canvas */}
      <div
        ref={epicTitleRef}
        className="absolute inset-0 z-[1] mx-auto flex min-h-screen w-full max-w-[90rem] flex-col items-center px-5 pb-8 pt-24 sm:px-8 sm:pb-10 sm:pt-28 md:px-12 transform-gpu pointer-events-none"
      >
        <div className="hero-ui hero-copy w-full opacity-0 pointer-events-none" aria-hidden>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span className="hero-eyebrow">Disponible</span>
          </div>
          <p className="hero-eyebrow mb-2">Desarrollador</p>
        </div>
        <h1 className="hero-epic-name" aria-label="Pedro López">
          Pedro López
        </h1>
      </div>

      {/* 2. Canvas with Sun and Grid */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[2] filter drop-shadow-[0_0_12px_rgba(176,0,255,0.25)]"
      />

      <div className="absolute top-0 bottom-0 left-[15%] w-px bg-white/[0.01] pointer-events-none hidden md:block z-[3]" />
      <div className="absolute top-0 bottom-0 right-[15%] w-px bg-white/[0.01] pointer-events-none hidden md:block z-[3]" />

      {/* 3. Front UI */}
      <div
        ref={uiRef}
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-[90rem] flex-col items-center px-5 pb-8 pt-24 sm:px-8 sm:pb-10 sm:pt-28 md:px-12 transform-gpu pointer-events-none"
      >
        <div className="hero-ui hero-copy w-full">
          <div className="hero-badge pointer-events-auto">
            <span className="hero-badge-dot" aria-hidden />
            <span className="hero-eyebrow">Disponible · 2026</span>
          </div>

          <p className="hero-eyebrow mb-2 tracking-[0.35em] text-white/35 pointer-events-auto">Desarrollador & diseñador</p>

          <div className="h-[clamp(4.25rem,13vw,10.2rem)] mb-[20px]" /> {/* Spacer for title */}

          <p className="hero-headline pointer-events-auto">
            <span className="hero-headline-line block">
              Creo <span className="hero-headline-accent">experiencias digitales</span>
            </span>
            <span className="hero-headline-line block">que dejan huella.</span>
          </p>

          <div className="hero-divider pointer-events-auto" aria-hidden />
        </div>

        <div className="hero-sun-spacer w-full pointer-events-none" aria-hidden />

        <div className="hero-ui hero-below-sun w-full pointer-events-auto">
          <p className="hero-subtitle">
            <strong>Web, interfaces y productos</strong> a medida — con código limpio, animaciones
            cuidadas y un ojo obsesivo por el detalle.
          </p>

          <div className="hero-actions">
            <a href="mailto:pedrolm0211@gmail.com" className="hero-btn hero-btn-contact">
              Contacto
            </a>

            <button
              type="button"
              onClick={scrollToProjects}
              className="hero-btn hero-btn-projects"
            >
              Ver proyectos
              <span className="hero-btn-icon" aria-hidden>
                <svg
                  className="hero-projects-arrow h-[1.125rem] w-[1.125rem]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
