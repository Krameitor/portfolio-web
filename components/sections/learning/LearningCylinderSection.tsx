'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface Destination {
  id: string;
  name: string;
  x: number;
  y: number;
  progress: number;
  desc: string;
  badge?: string;
}

const DESTINATIONS: Destination[] = [
  { 
    id: 'es-start', 
    name: 'España (Inicio)', 
    x: 480, 
    y: 190, 
    progress: 0.0, 
    desc: 'Valencia / Madrid. El punto de partida de mi carrera emprendedora y de desarrollo de software.',
    badge: 'Origen'
  },
  { 
    id: 'berlin', 
    name: 'Berlín', 
    x: 540, 
    y: 150, 
    progress: 0.14, 
    desc: 'Berlín, Alemania. Inmersión en el ecosistema tech europeo, hackathons de desarrollo y metodologías ágiles en startups.',
    badge: 'Innovación'
  },
  { 
    id: 'es-return1', 
    name: 'España (Consolidación)', 
    x: 480, 
    y: 190, 
    progress: 0.28, 
    desc: 'Consolidación de las primeras ideas de startups y estructuración del equipo técnico local en Valencia.',
    badge: 'Desarrollo'
  },
  { 
    id: 'ny', 
    name: 'Nueva York', 
    x: 300, 
    y: 170, 
    progress: 0.45, 
    desc: 'Nueva York, EE.UU. Expansión comercial, ronda de contactos internacionales y validación del modelo de negocio de Rockefeller.',
    badge: 'Negocios'
  },
  { 
    id: 'es-return2', 
    name: 'España (Tracción)', 
    x: 480, 
    y: 190, 
    progress: 0.60, 
    desc: 'Implementación y despliegue real en locales de hostelería de la tecnología de precios dinámicos.',
    badge: 'Tracción'
  },
  { 
    id: 'korea', 
    name: 'Corea del Sur', 
    x: 820, 
    y: 200, 
    progress: 0.76, 
    desc: 'Seúl, Corea del Sur. Alianza tecnológica y estudio de sistemas de visualización de alta tecnología para restauración y POS.',
    badge: 'Hardware & IoT'
  },
  { 
    id: 'india', 
    name: 'India', 
    x: 710, 
    y: 240, 
    progress: 0.88, 
    desc: 'Nueva Delhi, India. Colaboración en infraestructura de datos a gran escala y optimización de latencia en la nube.',
    badge: 'Escalabilidad'
  },
  { 
    id: 'es-home', 
    name: 'España (Consolidación Global)', 
    x: 480, 
    y: 190, 
    progress: 0.96, 
    desc: 'Regreso a casa para centralizar el desarrollo de producto global y desplegar soluciones de Inteligencia Artificial.',
    badge: 'IA & Base'
  },
  { 
    id: 'next', 
    name: '¿Próximo Destino?', 
    x: 430, 
    y: 230, 
    progress: 1.0, 
    desc: '¿Cuál será el siguiente paso? La innovación y el código no tienen fronteras físicas.',
    badge: 'Futuro'
  }
];

const LESSONS = [
  {
    num: '01',
    title: 'Resiliencia & Pivote rápido',
    text: 'Aceptar que el primer plan fallará. Lo que importa es la velocidad para adaptarse y refinar la propuesta sin perder la visión.'
  },
  {
    num: '02',
    title: 'Obsesión por el producto',
    text: 'El mejor marketing es un producto extraordinario. Menos fuegos artificiales de comunicación y más valor tangible y medible.'
  },
  {
    num: '03',
    title: 'Liderazgo por Empatía',
    text: 'Un equipo brillante no necesita microgestión, necesita facilitadores de contexto, visión clara y eliminación de obstáculos.'
  }
];

export default function LearningCylinderSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  const flightPathRef = useRef<SVGPathElement>(null);

  // States
  const [rotation, setRotation] = useState<number>(0);
  const [activeFace, setActiveFace] = useState<'yo' | 'map'>('yo');
  const [flightProgress, setFlightProgress] = useState<number>(0);
  const [planePos, setPlanePos] = useState({ x: 480, y: 190 });
  const [planeAngle, setPlaneAngle] = useState(0);
  const [currentDestIndex, setCurrentDestIndex] = useState(0);
  const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);

  // For Dragging interaction
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startRotation = useRef(0);

  // Plane animation control
  const animationTween = useRef<gsap.core.Tween | null>(null);

  // Initialize flight path animation with GSAP
  useEffect(() => {
    const obj = { progress: 0 };
    animationTween.current = gsap.to(obj, {
      progress: 1,
      duration: 25,
      ease: 'none',
      repeat: -1,
      onUpdate: () => {
        const p = obj.progress;
        setFlightProgress(p);
        updatePlanePosition(p);
      }
    });

    return () => {
      if (animationTween.current) animationTween.current.kill();
    };
  }, []);

  // Update plane coordinates and angle based on progress along the path
  const updatePlanePosition = (progress: number) => {
    if (!flightPathRef.current) return;
    try {
      const path = flightPathRef.current;
      const totalLength = path.getTotalLength();
      const currentLen = progress * totalLength;
      
      const pt = path.getPointAtLength(currentLen);
      
      // Calculate angle by looking slightly ahead
      const aheadLen = Math.min(totalLength, currentLen + 2);
      const ptAhead = path.getPointAtLength(aheadLen);
      const angleRad = Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x);
      let angleDeg = (angleRad * 180) / Math.PI;

      setPlanePos({ x: pt.x, y: pt.y });
      setPlaneAngle(angleDeg);

      // Determine active destination based on proximity in progress
      let activeIndex = 0;
      let minDiff = 1;
      
      DESTINATIONS.forEach((dest, idx) => {
        const diff = Math.abs(progress - dest.progress);
        if (diff < minDiff) {
          minDiff = diff;
          activeIndex = idx;
        }
      });
      
      setCurrentDestIndex(activeIndex);
    } catch (e) {
      // Fallback if path methods fail
    }
  };

  // Turn cylinder to specific face
  const rotateTo = (face: 'yo' | 'map') => {
    setActiveFace(face);
    gsap.to(cylinderRef.current, {
      rotateY: face === 'yo' ? 0 : 180,
      duration: 1.0,
      ease: 'power3.out',
      onUpdate: function() {
        // Track the current rotation degree
        const val = gsap.getProperty(cylinderRef.current, 'rotateY') as number;
        setRotation(val);
      }
    });
  };

  // Custom node click jumps the plane to that progress point
  const handleNodeClick = (index: number) => {
    if (!animationTween.current) return;
    
    // Pause auto animation temporary
    animationTween.current.pause();
    
    const dest = DESTINATIONS[index];
    const targetProgress = dest.progress;
    
    const obj = { progress: flightProgress };
    gsap.to(obj, {
      progress: targetProgress,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        setFlightProgress(obj.progress);
        updatePlanePosition(obj.progress);
      },
      onComplete: () => {
        // Resume after 4 seconds
        setTimeout(() => {
          if (animationTween.current) {
            gsap.killTweensOf(obj);
            animationTween.current.play();
          }
        }, 4000);
      }
    });
  };

  // Drag handlers for turning the cylinder
  const handleStart = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    // Get currently applied rotation from GSAP or inline styles
    const currRot = gsap.getProperty(cylinderRef.current, 'rotateY') as number || rotation;
    startRotation.current = currRot;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging.current || !cylinderRef.current) return;
    const deltaX = clientX - startX.current;
    // Multiplier determines drag sensitivity
    const currentRot = startRotation.current + deltaX * 0.45;
    gsap.set(cylinderRef.current, { rotateY: currentRot });
    setRotation(currentRot);
  };

  const handleEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    // Normalize rotation angle to determine nearest snap target (0 or 180)
    // We calculate based on mod 360 to snap properly
    const normalized = ((rotation % 360) + 360) % 360;
    let target = 0;
    
    if (normalized > 90 && normalized <= 270) {
      target = 180;
      setActiveFace('map');
    } else {
      target = 0;
      setActiveFace('yo');
    }
    
    // Smoothly snap to target
    gsap.to(cylinderRef.current, {
      rotateY: target,
      duration: 0.8,
      ease: 'power3.out',
      onUpdate: function() {
        const val = gsap.getProperty(cylinderRef.current, 'rotateY') as number;
        setRotation(val);
      }
    });
  };

  // SVG Flight path d-attribute (interpolated smooth bezier curve)
  // España (480, 190) -> Berlín (540, 150) -> España -> NY (300, 170) -> España -> Seúl (820, 200) -> India (710, 240) -> España -> Próximo (430, 230)
  const pathD = `
    M 480 190 
    Q 510 160, 540 150 
    Q 510 180, 480 190
    Q 390 150, 300 170
    Q 390 200, 480 190
    Q 650 140, 820 200
    Q 770 230, 710 240
    Q 600 200, 480 190
    Q 450 210, 430 230
  `.replace(/\s+/g, ' ').trim();

  return (
    <section
      id="aprendizaje"
      className="relative w-full min-h-screen py-24 bg-[#030206] text-white overflow-hidden flex flex-col justify-center items-center"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[120px]" />
      </div>

      {/* Title & Navigation */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 mb-16 text-center">
        <span className="font-sans text-xs tracking-[0.4em] uppercase text-purple-400/60 block mb-3">
          Trayectoria & Habilidades
        </span>
        <h2 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none mb-6">
          Mi camino de <span className="italic bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">aprendizaje</span>
        </h2>
        
        {/* Face Toggles (Interactive Segmented Control) */}
        <div className="inline-flex p-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 gap-1 mt-4">
          <button
            onClick={() => rotateTo('yo')}
            className={`px-6 py-2.5 rounded-full text-xs tracking-wider uppercase font-medium transition-all duration-300 ${
              activeFace === 'yo'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            El Yo & Aprendizajes
          </button>
          <button
            onClick={() => rotateTo('map')}
            className={`px-6 py-2.5 rounded-full text-xs tracking-wider uppercase font-medium transition-all duration-300 ${
              activeFace === 'map'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Ruta Internacional
          </button>
        </div>
      </div>

      {/* 3D Viewport */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-6xl h-[680px] md:h-[620px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none perspective-container z-20"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => isDragging.current && handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => isDragging.current && handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {/* Rotator Cylinder */}
        <div
          ref={cylinderRef}
          className="cylinder-3d"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transform: 'rotateY(0deg)',
          }}
        >
          {/* FACE A: BIO & LESSONS */}
          <div
            className="cylinder-face face-yo"
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg) translateZ(min(320px, 45vw))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="w-[92%] max-w-5xl bg-[#09080e]/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl grid lg:grid-cols-[1.2fr_1.8fr] gap-10 items-center">
              {/* Left Column: Yo */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-glow" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-amber-400/80 font-medium">
                    Perfil del Fundador
                  </span>
                </div>
                <h3 className="font-serif font-light text-3xl md:text-4xl text-white leading-tight">
                  Pedro <span className="font-normal italic text-amber-300">García</span>
                </h3>
                <p className="font-sans font-light text-sm md:text-base text-white/70 leading-relaxed">
                  Emprendedor tecnológico apasionado por crear interfaces inmersivas y arquitecturas digitales eficientes. Conectando hardware interactivo, desarrollo ágil de software e Inteligencia Artificial predictiva.
                </p>
                <div className="pt-4 border-t border-white/5">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2 font-medium">Valores clave</div>
                  <div className="flex flex-wrap gap-2">
                    {['Iteración veloz', 'Alineación de visión', 'Obsesión de interfaz', 'Simplicidad'].map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-xs text-white/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Lessons */}
              <div className="space-y-4">
                <h4 className="font-serif text-lg text-white/50 mb-2 italic">Aprendizajes fundamentales:</h4>
                
                <div className="flex flex-col gap-4">
                  {LESSONS.map((lesson, idx) => {
                    const isHovered = hoveredLesson === idx;
                    return (
                      <div
                        key={idx}
                        className="group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden"
                        style={{
                          background: isHovered ? 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(147,51,234,0.04) 100%)' : 'rgba(255,255,255,0.01)',
                          borderColor: isHovered ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.05)',
                        }}
                        onMouseEnter={() => setHoveredLesson(idx)}
                        onMouseLeave={() => setHoveredLesson(null)}
                      >
                        {/* Golden hover gradient sweep */}
                        {isHovered && (
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                        )}

                        <div className="flex gap-4 items-start">
                          <span className={`font-mono text-sm ${isHovered ? 'text-amber-400' : 'text-white/20'} transition-colors duration-300 pt-0.5`}>
                            {lesson.num}
                          </span>
                          <div>
                            <h5 className={`font-serif text-base md:text-lg mb-1 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-white/80'}`}>
                              {lesson.title}
                            </h5>
                            <p className="font-sans font-light text-xs md:text-sm text-white/60 leading-relaxed">
                              {lesson.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* FACE B: WORLD MAP & INTERNATIONAL TRAVELS */}
          <div
            className="cylinder-face face-map"
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg) translateZ(min(320px, 45vw))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="w-[92%] max-w-5xl bg-[#09080e]/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl flex flex-col items-center">
              
              {/* Top info panel matching the active flight location */}
              <div className="w-full text-center mb-6 min-h-[96px] flex flex-col justify-center items-center">
                <span className="inline-block px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-300 rounded-full text-[10px] uppercase tracking-wider font-semibold mb-2">
                  {DESTINATIONS[currentDestIndex].badge}
                </span>
                <h4 className="font-serif text-xl md:text-2xl text-white font-medium mb-1.5 transition-all duration-300">
                  {DESTINATIONS[currentDestIndex].name}
                </h4>
                <p className="font-sans font-light text-xs md:text-sm text-white/60 max-w-2xl mx-auto leading-relaxed transition-all duration-300">
                  {DESTINATIONS[currentDestIndex].desc}
                </p>
              </div>

              {/* Map SVG container */}
              <div className="relative w-full h-[280px] md:h-[320px] bg-white/2 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-2">
                
                {/* World Map Wireframe / Background Graticule */}
                <svg
                  viewBox="0 0 1000 350"
                  className="w-full h-full text-white/10"
                  style={{ pointerEvents: 'auto' }}
                >
                  <defs>
                    <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Abstract continent shapes representation */}
                  {/* North America */}
                  <path d="M 120 70 Q 230 40, 270 120 T 320 220 T 260 260 T 150 150 Z" fill="currentColor" opacity="0.12" />
                  {/* South America */}
                  <path d="M 280 230 Q 340 230, 320 310 T 340 340 T 290 320 Z" fill="currentColor" opacity="0.12" />
                  {/* Europe / Asia */}
                  <path d="M 440 60 Q 550 40, 680 70 T 880 120 T 920 220 T 800 240 T 700 180 T 600 130 T 470 120 Z" fill="currentColor" opacity="0.12" />
                  {/* Africa */}
                  <path d="M 440 180 Q 510 170, 560 210 T 570 290 T 510 320 Z" fill="currentColor" opacity="0.12" />
                  {/* Australia */}
                  <path d="M 800 250 Q 890 250, 870 300 T 800 300 Z" fill="currentColor" opacity="0.12" />

                  {/* Grid Lines */}
                  <g stroke="currentColor" strokeWidth="0.5" opacity="0.15" strokeDasharray="3 3">
                    <line x1="0" y1="100" x2="1000" y2="100" />
                    <line x1="0" y1="200" x2="1000" y2="200" />
                    <line x1="0" y1="300" x2="1000" y2="300" />
                    
                    <line x1="250" y1="0" x2="250" y2="350" />
                    <line x1="500" y1="0" x2="500" y2="350" />
                    <line x1="750" y1="0" x2="750" y2="350" />
                  </g>

                  {/* Flight Route Line (Dashed Glow Trail) */}
                  <path
                    ref={flightPathRef}
                    d={pathD}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                    strokeDasharray="4 4"
                  />

                  {/* Flight Trail Progress Glow */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="1000"
                    strokeDashoffset={1000 - flightProgress * 1000}
                    strokeOpacity="0.8"
                    className="transition-all duration-300"
                  />

                  {/* Interactive Target Nodes */}
                  {DESTINATIONS.map((dest, i) => {
                    const isActive = i === currentDestIndex;
                    const isNext = dest.id === 'next';
                    return (
                      <g 
                        key={dest.id} 
                        transform={`translate(${dest.x}, ${dest.y})`}
                        className="cursor-pointer group/node"
                        onClick={() => handleNodeClick(i)}
                      >
                        {/* Glow back ring */}
                        <circle
                          r="18"
                          fill="url(#node-glow)"
                          className={`transition-all duration-500 ${
                            isActive ? 'scale-125 opacity-100' : 'scale-75 opacity-0 group-hover/node:opacity-60'
                          }`}
                        />
                        {/* Base node circle */}
                        <circle
                          r={isNext ? "7" : "5"}
                          fill={isNext ? "#ef4444" : isActive ? "#fbbf24" : "rgba(255,255,255,0.4)"}
                          stroke={isNext ? "#fff" : isActive ? "#fff" : "rgba(255,255,255,0.15)"}
                          strokeWidth="1.5"
                          className="transition-all duration-300"
                        />
                        {/* Label tooltip */}
                        <text
                          y="-12"
                          textAnchor="middle"
                          fill="#fff"
                          fontSize="9"
                          fontWeight={isActive ? "600" : "400"}
                          className={`font-sans tracking-wider pointer-events-none transition-all duration-300 ${
                            isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-90 group-hover/node:opacity-80 group-hover/node:translate-y-0'
                          }`}
                        >
                          {dest.name}
                        </text>
                      </g>
                    );
                  })}

                  {/* The Flying Plane */}
                  <g
                    transform={`translate(${planePos.x}, ${planePos.y}) rotate(${planeAngle})`}
                    className="transition-transform duration-75"
                  >
                    {/* Pulsing engine glow */}
                    <circle r="6" fill="#f59e0b" opacity="0.6" className="animate-ping" />
                    
                    {/* Plane SVG Icon */}
                    <path
                      d="M-7,-5 L-4,-5 L1,-2 L5,-2 C6,-2 7,-1.5 7,0 C7,1.5 6,2 5,2 L1,2 L-4,5 L-7,5 L-5,2 L-8,0 Z"
                      fill="#fbbf24"
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                  </g>
                </svg>
              </div>

              {/* Timeline Indicator dots */}
              <div className="flex gap-2.5 mt-5">
                {DESTINATIONS.map((dest, i) => (
                  <button
                    key={dest.id}
                    onClick={() => handleNodeClick(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === currentDestIndex 
                        ? 'w-6 bg-amber-400' 
                        : 'w-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                    title={dest.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .perspective-container {
          perspective: 1500px;
        }
        .cylinder-face {
          transform-style: preserve-3d;
          width: 100%;
          height: 100%;
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
