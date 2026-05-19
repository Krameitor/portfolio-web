'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const GREEN  = '#10b981';
const GREEN2 = '#00ff88';
const DARK_GREEN = '#059669';
const AMBER = '#f59e0b';
const RED   = '#ef4444';

const HOAX_TITLE = 'Descubren la "enzima milagrosa" que revierte el envejecimiento y cura la diabetes en 14 días';
const HOAX_FILE  = 'informe-enzima-milagrosa-2024.pdf';

const CRAAP = [
  { label: 'Actualidad',  score: 5, color: AMBER },
  { label: 'Relevancia',  score: 7, color: GREEN  },
  { label: 'Autoridad',   score: 2, color: RED   },
  { label: 'Exactitud',   score: 2, color: RED   },
  { label: 'Propósito',   score: 3, color: AMBER },
];

const BIASES = [
  { label: 'Sensacionalismo médico',       severity: 'Alta',  color: RED   },
  { label: 'Falsa autoridad (doctor falso)', severity: 'Alta',  color: RED   },
  { label: 'Evidencia anecdótica',         severity: 'Alta',  color: RED   },
  { label: 'Apelación a la emoción',       severity: 'Media', color: AMBER },
];

type Stage = 'idle' | 'scanning' | 'craap' | 'biases' | 'done';
function delay(ms: number) { return new Promise<void>(r => setTimeout(r, ms)); }

function Bar({ score, color, go }: { score: number; color: string; go: boolean }) {
  return (
    <div style={{ flex:1, height:6, background:'rgba(255,255,255,0.06)', borderRadius:3, overflow:'hidden' }}>
      <div style={{
        height:'100%', width: go ? `${score*10}%` : '0%',
        background: color, borderRadius:3,
        transition:'width 1s cubic-bezier(0.4,0,0.2,1)',
        boxShadow:`0 0 10px ${color}55`,
      }}/>
    </div>
  );
}

export default function OraculusMockup() {
  const [stage, setStage]         = useState<Stage>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver]       = useState(false);
  const [barsGo, setBarsGo]       = useState(false);
  const [biasCount, setBiasCount] = useState(0);
  const [score, setScore]         = useState(0);

  const ghostRef  = useRef<HTMLDivElement>(null);
  const dropRef   = useRef<HTMLDivElement>(null);
  const dragging  = useRef(false);
  const analyzing = useRef(false);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const GRIP_X = 50;
  const GRIP_Y = 30;

  const runAnalysis = useCallback(async () => {
    if (analyzing.current) return;
    analyzing.current = true;
    setBarsGo(false); setBiasCount(0); setScore(0);
    setStage('scanning'); await delay(1300);
    setStage('craap');    await delay(200); setBarsGo(true); await delay(1200);
    setStage('biases');
    for (let i = 1; i <= BIASES.length; i++) { await delay(300); setBiasCount(i); }
    await delay(400);
    setStage('done');
    let s = 0;
    const tick = () => { s += 2; setScore(Math.min(s, 22)); if (s < 22) setTimeout(tick, 30); };
    tick();
    analyzing.current = false;
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (stage !== 'idle') return;
    dragging.current = true;
    setIsDragging(true);
    if (ghostRef.current) {
      ghostRef.current.style.left = `${e.clientX - GRIP_X}px`;
      ghostRef.current.style.top  = `${e.clientY - GRIP_Y}px`;
      ghostRef.current.style.display = 'block';
    }
  }, [stage]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current || !ghostRef.current) return;
      ghostRef.current.style.left = `${e.clientX - GRIP_X}px`;
      ghostRef.current.style.top  = `${e.clientY - GRIP_Y}px`;
      if (dropRef.current) {
        const r = dropRef.current.getBoundingClientRect();
        setIsOver(e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom);
      }
    };
    const up = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      setIsDragging(false);
      setIsOver(false);
      if (ghostRef.current) ghostRef.current.style.display = 'none';
      if (dropRef.current) {
        const r = dropRef.current.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          runAnalysis();
        }
      }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [runAnalysis]);

  const reset = () => { setStage('idle'); setBarsGo(false); setBiasCount(0); setScore(0); };

  const showCraap  = stage === 'craap'  || stage === 'biases' || stage === 'done';
  const showBiases = stage === 'biases' || stage === 'done';

  return (
    <div style={{ display:'flex', gap:28, alignItems:'stretch', width:'100%', maxWidth: 1100, margin: '0 auto' }}>

      {/* ── PDF Source Card ── */}
      <div
        onPointerDown={onPointerDown}
        style={{
          width: 300, flexShrink:0,
          background:'linear-gradient(145deg, rgba(20,20,20,0.95), rgba(5,5,5,0.95))',
          backdropFilter: 'blur(10px)',
          border:`1px solid ${stage !== 'idle' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius:16, padding:'28px 24px',
          cursor: stage === 'idle' ? 'grab' : 'default',
          userSelect:'none',
          opacity: stage !== 'idle' ? 0.6 : 1,
          filter: stage !== 'idle' ? 'grayscale(0.4) brightness(0.8)' : 'none',
          transition:'all 0.4s ease',
          boxShadow: stage === 'idle' ? '0 24px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)' : 'none',
          pointerEvents: stage !== 'idle' ? 'none' : 'auto',
          display:'flex', flexDirection:'column',
        }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
          <div style={{
            width:48, height:48, borderRadius:12, flexShrink:0,
            background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: '0 4px 12px rgba(239,68,68,0.1)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:RED, letterSpacing:0.6 }}>PDF DOCUMENT</div>
            <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.4)', fontWeight:500, marginTop:2 }}>2.3 MB</div>
          </div>
        </div>

        <div style={{ fontSize:16, fontWeight:500, color:'#fff', lineHeight:1.45, marginBottom:24, flex:1, fontFamily: 'var(--font-serif)' }}>
          "{HOAX_TITLE}"
        </div>

        <div style={{ padding: '14px', background: 'rgba(0,0,0,0.3)', borderRadius: 10, marginBottom: 24, border: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.5)', marginBottom:8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{HOAX_FILE}</span>
          </div>
          <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>Revista Salud Natural Alternativa · Mayo 2024</span>
          </div>
        </div>

        {/* Drag hint */}
        <div style={{
          padding:'12px', borderRadius:12,
          background: stage === 'idle' ? `rgba(16,185,129,0.08)` : 'transparent', 
          border: stage === 'idle' ? `1px dashed ${GREEN}55` : '1px dashed transparent',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          animation: stage === 'idle' ? 'orc-pulse 2s ease-in-out infinite' : 'none',
          opacity: stage === 'idle' ? 1 : 0,
          transition: 'opacity 0.3s'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN2} strokeWidth="2.5">
            <path d="M18 11V6a2 2 0 0 0-4 0v1M14 7V4a2 2 0 0 0-4 0v3M10 10.5V6a2 2 0 0 0-4 0v8l-1.8-1.8a1.5 1.5 0 0 0-2.1 2.1l4.3 5.1A6 6 0 0 0 12 22h2a6 6 0 0 0 6-6v-5a2 2 0 0 0-4 0"/>
          </svg>
          <span style={{ fontSize:11, fontWeight:700, color:GREEN2, letterSpacing:0.4, textTransform: 'uppercase' }}>Arrastrar para analizar</span>
        </div>
      </div>

      {/* ── Analysis Panel (Pure Deep Black Background) ── */}
      <div ref={dropRef} style={{
        flex:1,
        background:'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(20px)',
        border:`1px solid ${isOver ? GREEN : 'rgba(16,185,129,0.15)'}`,
        borderRadius:16,
        overflow:'hidden',
        transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: isOver
          ? `0 0 0 4px ${GREEN}22, 0 30px 60px rgba(16,185,129,0.15)`
          : '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
        display:'flex', flexDirection:'column',
        minHeight: 460,
      }}>

        {/* Panel header */}
        <div style={{
          padding:'18px 28px', borderBottom:'1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.01)',
          display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{
              width:30, height:30, borderRadius:8,
              background:`linear-gradient(135deg,${DARK_GREEN}44,${GREEN}33)`,
              border:`1px solid ${DARK_GREEN}66`,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow: `0 2px 10px ${GREEN}33`
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <span style={{ color:'#fff', fontWeight:700, fontSize:14, letterSpacing: 0.5 }}>Oraculus Analysis Engine</span>
          </div>
          <div style={{
            padding:'5px 14px', borderRadius:20, fontSize:10, fontWeight:700, letterSpacing:0.6, textTransform: 'uppercase',
            background: stage === 'done' ? `rgba(239,68,68,0.15)` : stage === 'idle' ? 'rgba(255,255,255,0.05)' : `rgba(16,185,129,0.12)`,
            border: stage === 'done' ? `1px solid ${RED}44` : stage === 'idle' ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${GREEN}44`,
            color: stage === 'done' ? RED : stage === 'idle' ? 'rgba(255,255,255,0.4)' : GREEN2,
            display:'flex', alignItems:'center', gap:7,
          }}>
            {stage !== 'idle' && stage !== 'done' && (
              <div style={{ width:6, height:6, borderRadius:'50%', background:GREEN2, animation:'orc-dot 1s ease-in-out infinite', boxShadow: `0 0 8px ${GREEN2}` }}/>
            )}
            {{ idle:'Esperando documento', scanning:'Extrayendo datos...', craap:'Evaluando fuentes...', biases:'Mapeando sesgos...', done:'Análisis finalizado' }[stage]}
          </div>
        </div>

        {/* Panel body */}
        <div style={{ padding:'32px', flex:1, display:'flex', flexDirection:'column', position: 'relative' }}>

          {/* Drop zone */}
          {stage === 'idle' && (
            <div style={{
              flex:1, border:`2px dashed ${isOver ? GREEN : 'rgba(16,185,129,0.15)'}`,
              borderRadius:14, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:18,
              transition:'all 0.3s ease',
              background: isOver ? `radial-gradient(circle at center, rgba(16,185,129,0.08) 0%, transparent 70%)` : 'transparent',
            }}>
              <div style={{
                width:68, height:68, borderRadius:16,
                background:`rgba(16,185,129,0.08)`, border:`1px solid ${DARK_GREEN}44`,
                display:'flex', alignItems:'center', justifyContent:'center',
                animation: isOver ? 'orc-bounce-fast 0.4s ease-in-out infinite' : 'orc-bounce 2.5s ease-in-out infinite',
                boxShadow: isOver ? `0 0 20px ${GREEN}33` : 'none'
              }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={isOver ? GREEN2 : `${GREEN2}88`} strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <div style={{ textAlign:'center' }}>
                <p style={{ margin:0, fontSize:16, fontWeight:600, color: isOver ? '#fff' : 'rgba(255,255,255,0.4)', transition:'color 0.2s', letterSpacing:0.3 }}>
                  {isOver ? 'Suelta el documento para analizar' : 'Arrastra un documento aquí'}
                </p>
                <p style={{ margin:'8px 0 0', fontSize:13, color:'rgba(255,255,255,0.2)' }}>
                  Oraculus evaluará fuentes, detectará sesgos y medirá la objetividad
                </p>
              </div>
            </div>
          )}

          {/* Scanning phase */}
          {stage === 'scanning' && (
            <div style={{ animation:'orc-fade 0.4s ease', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 500, margin: '0 auto', width: '100%' }}>
              <div style={{
                padding:'24px', background:'rgba(255,255,255,0.02)',
                border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, marginBottom:28,
                position:'relative', overflow:'hidden',
              }}>
                <div style={{ fontSize: 11, color: GREEN2, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 12 }}>Procesando Texto</div>
                <div style={{ fontSize:15, color:'rgba(255,255,255,0.8)', fontStyle:'italic', lineHeight:1.6, fontFamily: 'var(--font-serif)' }}>
                  "{HOAX_TITLE}"
                </div>
                <div style={{
                  position:'absolute', inset:0,
                  background:`linear-gradient(90deg,transparent,${GREEN}15,transparent)`,
                  backgroundSize:'200% 100%', animation:'orc-scan 1.2s ease-in-out infinite',
                }}/>
              </div>
              
              <div style={{ height:4, background:'rgba(255,255,255,0.08)', borderRadius:2, overflow:'hidden', marginBottom: 16 }}>
                <div style={{ height:'100%', background:`linear-gradient(90deg,${GREEN},${DARK_GREEN})`, animation:'orc-progress 1.5s ease-in-out infinite', borderRadius:2, boxShadow: `0 0 10px ${GREEN}` }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'rgba(255,255,255,0.4)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                <span>Extrayendo metadatos...</span>
                <span style={{ color: GREEN2 }}>45%</span>
              </div>
            </div>
          )}

          {/* Results phase */}
          {(showCraap || showBiases) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, flex: 1 }}>
              
              {/* Left Column: CRAAP */}
              {showCraap && (
                <div style={{ animation:'orc-fade 0.4s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: GREEN }} />
                    <div style={{ fontSize:12, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:`#fff` }}>
                      Método CRAAP
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    {CRAAP.map(({ label, score: s, color }) => (
                      <div key={label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize:11.5, color:'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 0.5 }}>{label}</span>
                          <span style={{ fontSize:11.5, fontWeight:800, color, opacity:barsGo ? 1 : 0, transition:'opacity 0.6s' }}>{s}/10</span>
                        </div>
                        <Bar score={s} color={color} go={barsGo}/>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Right Column: Biases */}
              {showBiases && (
                <div style={{ animation:'orc-fade 0.4s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: RED }} />
                    <div style={{ fontSize:12, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:`#fff` }}>
                      Sesgos Detectados
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    {BIASES.slice(0, biasCount).map(({ label, severity, color }) => (
                      <div key={label} style={{
                        display:'flex', alignItems:'center', justifyContent:'space-between',
                        padding:'12px 16px', background:`${color}11`, border:`1px solid ${color}33`, borderRadius:12,
                        animation:'orc-slide 0.3s ease',
                      }}>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{ width:6, height:6, borderRadius:'50%', background:color, boxShadow:`0 0 8px ${color}`, flexShrink:0 }}/>
                          <span style={{ fontSize:12, color:'rgba(255,255,255,0.9)', fontWeight:500 }}>{label}</span>
                        </div>
                        <span style={{ fontSize:9.5, fontWeight:800, color, padding:'4px 10px', borderRadius:8, background:`${color}1a`, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Final verdict */}
          {stage === 'done' && biasCount === BIASES.length && (
            <div style={{ 
              marginTop:32, padding:'24px 32px', borderRadius:16, 
              background:`linear-gradient(90deg, rgba(239,68,68,0.1), rgba(239,68,68,0.02))`, 
              border:`1px solid ${RED}44`, display:'flex', alignItems:'center', justifyContent:'space-between', 
              animation:'orc-fade-up 0.6s ease',
              boxShadow: `0 10px 40px rgba(239,68,68,0.08)`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ width:68, height:68, borderRadius:'50%', border:`2px solid ${RED}`, display:'flex', alignItems:'center', justifyContent:'center', background: 'rgba(239,68,68,0.1)', boxShadow:`0 0 24px ${RED}44, inset 0 0 12px ${RED}33` }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:1.5, color:`${RED}`, textTransform:'uppercase', marginBottom:6 }}>Score de Objetividad</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <div style={{ fontSize:46, fontWeight:800, color:'#fff', lineHeight:1 }}>{score}</div>
                    <div style={{ fontSize:18, fontWeight:500, color: 'rgba(255,255,255,0.3)' }}>/ 100</div>
                  </div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginTop:8, fontWeight: 500 }}>Contenido altamente manipulado · Bulo probable</div>
                </div>
              </div>
              
              <button onClick={reset} style={{
                padding:'12px 24px', borderRadius:10, fontSize:12, fontWeight:700, textTransform: 'uppercase', letterSpacing: 0.5,
                background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
                color:'#fff', cursor:'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 10
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Analizar otro
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Drag ghost ── */}
      {mounted && createPortal(
        <div ref={ghostRef} style={{
          position:'fixed', top:0, left:0, pointerEvents:'none', zIndex:99999,
          display:'none',
          rotate:'4deg',
          filter:'drop-shadow(0 30px 60px rgba(0,0,0,0.8))',
          width:300,
        }}>
          <div style={{
            background:'linear-gradient(145deg, rgba(20,20,20,0.95), rgba(5,5,5,0.95))',
            backdropFilter: 'blur(10px)',
            border:'1px solid rgba(255,255,255,0.15)',
            borderRadius:16, padding:'28px 24px',
            boxShadow:'0 24px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
              <div style={{ width:48, height:48, borderRadius:12, background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:800, color:RED, letterSpacing:0.6 }}>PDF DOCUMENT</div>
                <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.4)', fontWeight:500, marginTop:2 }}>2.3 MB</div>
              </div>
            </div>
            <div style={{ fontSize:16, fontWeight:500, color:'#fff', lineHeight:1.45, marginBottom:24, fontFamily: 'var(--font-serif)' }}>"{HOAX_TITLE}"</div>
            <div style={{ padding: '14px', background: 'rgba(0,0,0,0.3)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.5)', marginBottom:8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{HOAX_FILE}</span>
              </div>
              <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span>Revista Salud Natural Alternativa · Mayo 2024</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @keyframes orc-pulse      { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes orc-dot        { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes orc-bounce     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes orc-bounce-fast{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes orc-scan       { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes orc-progress   { 0%{width:0;margin-left:0} 50%{width:60%;margin-left:20%} 100%{width:0;margin-left:100%} }
        @keyframes orc-fade       { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes orc-fade-up    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes orc-slide      { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
    </div>
  );
}
