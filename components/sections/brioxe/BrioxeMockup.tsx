'use client';

import { useState, useEffect } from 'react';

const BLUE = '#3d8ef5';
const SLATE = '#0f172a';
const GREEN = '#10b981';

const PRODUCTS = [
  { id: '1', name: 'El Clásico', price: 10.00, emoji: '🥪', color: '#fcd34d' },
  { id: '2', name: 'Honey Pork', price: 10.50, emoji: '🥪', color: '#fdba74' },
  { id: '3', name: 'Patatas Fritas', price: 3.50, emoji: '🍟', color: '#fde047' },
  { id: '4', name: 'Zumo Natural', price: 3.00, emoji: '🍊', color: '#bef264' },
];

export default function BrioxeMockup() {
  const [step, setStep] = useState(1); // 1: Caja, 2: Cocina, 3: Dashboard
  
  // Caja state
  const [cajaState, setCajaState] = useState<'idle' | 'add-sandwich' | 'add-patatas' | 'type-client' | 'send'>('idle');
  const [cart, setCart] = useState<{ id: string, name: string, price: number }[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [cajaStatus, setCajaStatus] = useState<'idle'|'sending'|'success'>('idle');
  const [cursorCaja, setCursorCaja] = useState({ x: '80%', y: '110%', active: false, opacity: 0 });

  // Cocina state
  const [cocinaState, setCocinaState] = useState<'idle' | 'completing' | 'done'>('idle');
  const [cursorCocina, setCursorCocina] = useState({ x: '80%', y: '110%', active: false, opacity: 0 });

  // Dash state
  const [dashState, setDashState] = useState<'idle' | 'updating'>('idle');

  useEffect(() => {
    let active = true;

    const runSim = async () => {
      const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
      
      while (active) {
        // --- STEP 1: CAJA ---
        setStep(1);
        setCart([]); setClientName(''); setClientPhone(''); setCajaStatus('idle');
        setCajaState('idle');
        setCursorCaja({ x: '50%', y: '90%', active: false, opacity: 1 });
        await wait(1000);
        
        // Add Sandwich
        setCursorCaja({ x: '20%', y: '30%', active: false, opacity: 1 }); // Move to Sandwich
        await wait(600);
        setCursorCaja({ x: '20%', y: '30%', active: true, opacity: 1 }); // Click
        setCajaState('add-sandwich');
        setCart(c => [...c, PRODUCTS[0]]);
        await wait(200);
        setCursorCaja({ x: '20%', y: '30%', active: false, opacity: 1 });
        await wait(400);

        // Add Patatas
        setCursorCaja({ x: '20%', y: '45%', active: false, opacity: 1 }); // Move to Patatas
        await wait(500);
        setCursorCaja({ x: '20%', y: '45%', active: true, opacity: 1 }); // Click
        setCajaState('add-patatas');
        setCart(c => [...c, PRODUCTS[2]]);
        await wait(200);
        setCursorCaja({ x: '20%', y: '45%', active: false, opacity: 1 });
        await wait(500);

        // Type client
        setCursorCaja({ x: '50%', y: '20%', active: false, opacity: 1 }); // Move to Input
        await wait(500);
        setCursorCaja({ x: '50%', y: '20%', active: true, opacity: 1 }); // Click
        setCajaState('type-client');
        await wait(200);
        setCursorCaja({ x: '50%', y: '20%', active: false, opacity: 1 });
        setClientName('A'); await wait(100);
        setClientName('Ana G'); await wait(150);
        setClientPhone('6'); await wait(100);
        setClientPhone('600 123 456'); await wait(400);

        // Send
        setCursorCaja({ x: '85%', y: '85%', active: false, opacity: 1 }); // Move to Send
        await wait(600);
        setCursorCaja({ x: '85%', y: '85%', active: true, opacity: 1 }); // Click
        setCajaState('send');
        setCajaStatus('sending');
        await wait(600);
        setCajaStatus('success');
        setCursorCaja(p => ({ ...p, opacity: 0 })); // Hide cursor
        await wait(1500);

        // --- STEP 2: FLIP TO COCINA ---
        setStep(2);
        setCocinaState('idle');
        setCursorCocina({ x: '50%', y: '90%', active: false, opacity: 0 });
        await wait(1200);
        setCursorCocina({ x: '50%', y: '90%', active: false, opacity: 1 });
        await wait(500);

        // Complete Order (Clicking "Completar" on Ticket #143 in the middle column)
        setCursorCocina({ x: '50%', y: '78%', active: false, opacity: 1 }); // Move to center ticket button
        await wait(600);
        setCursorCocina({ x: '50%', y: '78%', active: true, opacity: 1 }); // Click
        setCocinaState('completing');
        await wait(200);
        setCursorCocina({ x: '50%', y: '78%', active: false, opacity: 1 });
        await wait(400);
        setCocinaState('done');
        await wait(1000);
        setCursorCocina(p => ({ ...p, opacity: 0 })); // Hide cursor
        await wait(800);

        // --- STEP 3: FLIP TO DASHBOARD ---
        setStep(3);
        setDashState('idle');
        await wait(1200);
        setDashState('updating');
        await wait(4000);

        // Loop
      }
    };

    runSim();
    return () => { active = false; };
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // Reusable Sleek Premium Dark Cursor
  const RenderCursor = ({ opacity, x, y, active }: { opacity: number, x: string, y: string, active: boolean }) => (
    <div style={{
      position: 'absolute', left: x, top: y, opacity: opacity,
      width: 24, height: 24, zIndex: 100, pointerEvents: 'none',
      transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
      transform: `translate(-50%, -50%) ${active ? 'scale(0.85)' : 'scale(1)'}`,
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(2px 3px 4px rgba(0, 0, 0, 0.35))' }}>
        <path d="M4.5 3V20.2L9.6 15.1H16.2L4.5 3Z" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    </div>
  );

  return (
    <div style={{
      width: '100%', maxWidth: 1040, margin: '0 auto', height: 640,
      perspective: 2000,
      fontFamily: 'var(--font-sans)',
      color: SLATE,
    }}>
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        transition: 'transform 1.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
        transform: `rotateY(${step === 1 ? 0 : step === 2 ? -180 : -360}deg)`,
      }}>

        {/* ─── FRONT FACE: CAJA (Step 1) OR DASHBOARD (Step 3) ─── */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: '#f8fafc', borderRadius: 24, border: '8px solid #1e293b',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.5)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}>
          
          {/* ----- CAJA SCREEN ----- */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', opacity: step === 3 ? 0 : 1, pointerEvents: step === 3 ? 'none' : 'auto', transition: 'opacity 0.3s' }}>
            {/* Header */}
            <header style={{ padding: '20px 24px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: SLATE }}>Brioxé <span style={{ color: BLUE }}>Caja</span></h1>
                <div style={{ width: 1, height: 24, background: '#cbd5e1' }} />
                <div style={{ display: 'flex', gap: 16, fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                  <span style={{ color: '#64748b' }}>En cocina: <span style={{ color: BLUE }}>{cajaStatus === 'sending' ? 5 : 4}</span></span>
                  <span style={{ color: '#64748b' }}>Listos: <span style={{ color: GREEN }}>42</span></span>
                </div>
              </div>
            </header>

            {/* Body */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 280px 300px', gap: 24, padding: 24 }}>
              {/* Menu */}
              <section>
                <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: 1, marginBottom: 16 }}>Menú Rápido</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {PRODUCTS.map(p => (
                    <div key={p.id} style={{
                      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 16,
                      display: 'flex', flexDirection: 'column', gap: 12,
                      transform: ((cajaState === 'add-sandwich' && p.id === '1') || (cajaState === 'add-patatas' && p.id === '3')) ? 'scale(0.96)' : 'scale(1)',
                      boxShadow: ((cajaState === 'add-sandwich' && p.id === '1') || (cajaState === 'add-patatas' && p.id === '3')) ? `0 0 0 2px ${BLUE}` : '0 4px 6px -1px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s',
                    }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{p.emoji}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: SLATE, marginBottom: 4 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{p.price.toFixed(2)}€</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Client & Mostrador (populated with waiting orders) */}
              <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Client Form */}
                <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>Nombre del cliente</label>
                  <div style={{
                    width: '100%', padding: '12px 16px', background: '#f8fafc', border: `1px solid ${cajaState === 'type-client' ? BLUE : '#cbd5e1'}`,
                    borderRadius: 12, fontSize: 14, fontWeight: 600, color: SLATE, marginBottom: 16, minHeight: 46,
                  }}>
                    {clientName}
                    {cajaState === 'type-client' && <span style={{ display: 'inline-block', width: 2, height: 14, background: BLUE, animation: 'brx-blink 1s infinite' }} />}
                  </div>
                  
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>Notificación SMS</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 12, padding: '12px', fontSize: 13, fontWeight: 600, color: '#64748b' }}>+34</div>
                    <div style={{
                      flex: 1, padding: '12px 16px', background: '#f8fafc', border: `1px solid ${cajaState === 'type-client' ? BLUE : '#cbd5e1'}`,
                      borderRadius: 12, fontSize: 14, fontWeight: 600, color: SLATE, minHeight: 46,
                    }}>
                      {clientPhone}
                    </div>
                  </div>
                </div>

                {/* Mostrador List */}
                <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: 16, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: 0.5, marginBottom: 12 }}>Mostrador (Esperando)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, fontSize: 12 }}>
                      <span style={{ fontWeight: 700, color: '#065f46' }}>#141 - Carlos R.</span>
                      <span style={{ fontSize: 10, background: GREEN, color: '#fff', padding: '2px 6px', borderRadius: 12, fontWeight: 700 }}>Listo</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, fontSize: 12 }}>
                      <span style={{ fontWeight: 700, color: '#92400e' }}>#142 - David M.</span>
                      <span style={{ fontSize: 10, background: '#f59e0b', color: '#fff', padding: '2px 6px', borderRadius: 12, fontWeight: 700 }}>Cocina</span>
                    </div>
                    {cajaStatus === 'success' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#eff6ff', border: `1px solid ${BLUE}44`, borderRadius: 8, fontSize: 12, animation: 'brx-pop 0.3s ease-out' }}>
                        <span style={{ fontWeight: 700, color: '#1e40af' }}>#143 - Ana G.</span>
                        <span style={{ fontSize: 10, background: BLUE, color: '#fff', padding: '2px 6px', borderRadius: 12, fontWeight: 700 }}>Cocina</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Ticket */}
              <section style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: 1, marginBottom: 16 }}>Ticket Actual</h2>
                <div style={{ flex: 1, background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {cart.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: 8, fontSize: 13, fontWeight: 600, animation: 'brx-slide-in 0.2s ease-out' }}>
                        <span>{item.name}</span>
                        <span>{item.price.toFixed(2)}€</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: 20, background: '#f1f5f9', borderTop: '1px dashed #cbd5e1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 20 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total</span>
                      <span style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>{total.toFixed(2)}€</span>
                    </div>
                    <div style={{
                      width: '100%', padding: 18, borderRadius: 12, textAlign: 'center',
                      background: cajaStatus === 'success' ? GREEN : cart.length > 0 && clientName ? BLUE : '#cbd5e1',
                      color: '#fff', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1,
                      transform: cajaState === 'send' && cajaStatus === 'idle' ? 'scale(0.96)' : 'scale(1)',
                      transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
                    }}>
                      {cajaStatus === 'success' ? '¡Enviado a Cocina!' : 'Enviar a Cocina'}
                    </div>
                  </div>
                </div>
              </section>
            </div>
            {/* Fake Cursor for Caja */}
            <RenderCursor opacity={cursorCaja.opacity} x={cursorCaja.x} y={cursorCaja.y} active={cursorCaja.active} />
          </div>

          {/* ----- DASHBOARD SCREEN ----- */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', opacity: step === 3 ? 1 : 0, pointerEvents: step === 3 ? 'auto' : 'none', transition: 'opacity 0.3s', background: '#0f172a' }}>
            <header style={{ padding: '20px 24px', background: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>Brioxé <span style={{ color: BLUE }}>Manager</span></h1>
            </header>
            <div style={{ padding: 32, flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Row 1: KPI Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                <div style={{ background: '#1e293b', padding: 24, borderRadius: 16, border: '1px solid #334155' }}>
                  <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 }}>Ventas Hoy</div>
                  <div style={{ fontSize: 36, color: '#fff', fontWeight: 900 }}>
                    {dashState === 'updating' ? '1.433,50€' : '1.420,00€'}
                    <span style={{ fontSize: 14, color: GREEN, marginLeft: 8, fontWeight: 700 }}>+15%</span>
                  </div>
                </div>
                <div style={{ background: '#1e293b', padding: 24, borderRadius: 16, border: '1px solid #334155' }}>
                  <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 }}>Ticket Medio</div>
                  <div style={{ fontSize: 36, color: '#fff', fontWeight: 900 }}>
                    {dashState === 'updating' ? '14,10€' : '13,50€'}
                  </div>
                </div>
                <div style={{ background: '#1e293b', padding: 24, borderRadius: 16, border: '1px solid #334155' }}>
                  <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 }}>Tiempo Prep.</div>
                  <div style={{ fontSize: 36, color: '#fff', fontWeight: 900 }}>
                    5m 12s
                  </div>
                </div>
              </div>

              {/* Row 2: Charts and secondary stats (Reduced chart horizontally) */}
              <div style={{ flex: 1, display: 'flex', gap: 24 }}>
                {/* 1. Hourly Chart (50% Width) */}
                <div style={{ flex: 1, background: '#1e293b', borderRadius: 16, border: '1px solid #334155', padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 20, letterSpacing: 0.5 }}>Rendimiento Horario</div>
                  
                  <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 12, paddingBottom: 8 }}>
                    {[
                      { val: 40, label: '10h' },
                      { val: 55, label: '11h' },
                      { val: 30, label: '12h' },
                      { val: 80, label: '13h' },
                      { val: 100, label: '14h' },
                      { val: 60, label: '15h' },
                      { val: 85, label: '16h' }
                    ].map((bar, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ 
                          width: '100%', 
                          background: i === 6 && dashState === 'updating' ? BLUE : '#475569', 
                          height: `${bar.val}%`, 
                          borderRadius: '4px 4px 0 0', 
                          transition: 'all 0.5s',
                          boxShadow: i === 6 && dashState === 'updating' ? `0 0 10px ${BLUE}88` : 'none',
                          animation: `brx-grow 0.6s ${i*0.08}s ease-out backwards`
                        }} />
                        <span style={{ fontSize: 9, color: '#64748b', marginTop: 8, fontWeight: 700 }}>{bar.label}</span>
                      </div>
                    ))}
                  </div>

                  {dashState === 'updating' && (
                    <div style={{ position: 'absolute', top: 20, right: 24, background: `${GREEN}22`, color: GREEN, padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, animation: 'brx-pop 0.3s ease-out' }}>
                      Sincronizado
                    </div>
                  )}
                </div>

                {/* 2. Top Products list (50% Width) */}
                <div style={{ flex: 1, background: '#1e293b', borderRadius: 16, border: '1px solid #334155', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 20, letterSpacing: 0.5 }}>Top Ventas (Hoy)</div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
                    {[
                      { name: 'El Clásico', qty: 46, pct: 78 },
                      { name: 'Honey Pork', qty: 32, pct: 54 },
                      { name: 'Patatas Trufadas', qty: 28, pct: 47 }
                    ].map((prod, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>
                          <span>{prod.name}</span>
                          <span style={{ color: '#94a3b8' }}>{i === 0 && dashState === 'updating' ? prod.qty + 1 : prod.qty} uds</span>
                        </div>
                        <div style={{ width: '100%', height: 6, background: '#334155', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ 
                            width: i === 0 && dashState === 'updating' ? `${prod.pct + 2}%` : `${prod.pct}%`, 
                            height: '100%', 
                            background: i === 0 && dashState === 'updating' ? BLUE : '#64748b', 
                            borderRadius: 3,
                            transition: 'all 0.5s',
                            boxShadow: i === 0 && dashState === 'updating' ? `0 0 6px ${BLUE}66` : 'none'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ─── BACK FACE: COCINA (Step 2 - Busy KDS layout with multiple active tickets) ─── */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
          background: '#0f172a', borderRadius: 24, border: '8px solid #1e293b',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.5)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}>
          <header style={{ padding: '20px 24px', background: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>Brioxé <span style={{ color: '#f59e0b' }}>Cocina</span></h1>
            <div style={{ padding: '6px 12px', background: '#f59e0b22', color: '#f59e0b', borderRadius: 20, fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>
              Modo KDS
            </div>
          </header>
          
          <div style={{ padding: 24, display: 'flex', gap: 20, flex: 1, overflowX: 'auto' }}>
            {/* Ticket #142 - David M. (Active in queue) */}
            <div style={{
              width: 280, background: '#1e293b', borderRadius: 16, border: '1px solid #334155', display: 'flex', flexDirection: 'column',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}>
              <div style={{ background: '#475569', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontSize: 15, fontWeight: 800 }}>#142 - David M.</span>
                <span style={{ color: '#cbd5e1', fontSize: 12, fontWeight: 600 }}>4 min</span>
              </div>
              <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: '#e2e8f0' }}>
                <div>1x Honey Pork</div>
                <div>1x Patatas Trufadas</div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{
                  width: '100%', padding: 10, borderRadius: 8, textAlign: 'center',
                  background: '#334155', color: '#94a3b8', fontSize: 12, fontWeight: 800
                }}>
                  EN PREPARACIÓN
                </div>
              </div>
            </div>

            {/* Ticket #143 - Ana G (Target of the simulation click) */}
            <div style={{
              width: 280, background: '#1e293b', borderRadius: 16, border: `1px solid ${cocinaState === 'done' ? '#334155' : BLUE}`, display: 'flex', flexDirection: 'column',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden',
              transform: cocinaState === 'done' ? 'scale(0.95)' : 'scale(1)',
              opacity: cocinaState === 'done' ? 0.4 : 1, transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
            }}>
              <div style={{ background: cocinaState === 'done' ? '#475569' : '#f59e0b', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontSize: 15, fontWeight: 800 }}>#143 - Ana G.</span>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, animation: cocinaState !== 'done' ? 'brx-blink 1s infinite' : 'none' }}>
                  {cocinaState === 'done' ? 'Listo' : 'NUEVO'}
                </span>
              </div>
              <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: '#cbd5e1' }}>
                <div style={{ color: '#fff', fontWeight: 600 }}>1x El Clásico</div>
                <div style={{ color: '#fff', fontWeight: 600 }}>1x Patatas Fritas</div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{
                  width: '100%', padding: 12, borderRadius: 8, textAlign: 'center',
                  background: cocinaState === 'completing' ? '#047857' : cocinaState === 'done' ? '#334155' : GREEN,
                  color: '#fff', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1,
                  transform: cocinaState === 'completing' ? 'scale(0.96)' : 'scale(1)', transition: 'all 0.1s'
                }}>
                  {cocinaState === 'done' ? 'Completado' : 'Completar'}
                </div>
              </div>
            </div>

            {/* Ticket #144 - Lucas P. (Active in queue) */}
            <div style={{
              width: 280, background: '#1e293b', borderRadius: 16, border: '1px solid #334155', display: 'flex', flexDirection: 'column',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}>
              <div style={{ background: '#475569', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontSize: 15, fontWeight: 800 }}>#144 - Lucas P.</span>
                <span style={{ color: '#cbd5e1', fontSize: 12, fontWeight: 600 }}>1 min</span>
              </div>
              <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: '#cbd5e1' }}>
                <div>1x Kroqueta Ed.</div>
                <div>1x Zumo Natural</div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{
                  width: '100%', padding: 10, borderRadius: 8, textAlign: 'center',
                  background: '#334155', color: '#94a3b8', fontSize: 12, fontWeight: 800
                }}>
                  EN PREPARACIÓN
                </div>
              </div>
            </div>
          </div>

          {/* Success SMS Toast (SMS Alert) */}
          {cocinaState === 'done' && (
            <div style={{
              position: 'absolute', bottom: 40, right: 40, background: '#10b981', color: '#fff',
              padding: '16px 24px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)', animation: 'brx-slide-left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              zIndex: 100
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>SMS Enviado</div>
                <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.9 }}>Ana G. avisada de que su pedido está listo</div>
              </div>
            </div>
          )}
          
          {/* Fake Cursor for Cocina */}
          <RenderCursor opacity={cursorCocina.opacity} x={cursorCocina.x} y={cursorCocina.y} active={cursorCocina.active} />
        </div>

      </div>

      <style>{`
        @keyframes brx-slide-in { from { opacity: 0; transform: translateX(-10px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes brx-blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
        @keyframes brx-slide-left { from { opacity: 0; transform: translateX(40px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes brx-grow { from { transform: scaleY(0) } to { transform: scaleY(1) } }
        @keyframes brx-pop { 0% { transform: scale(0.8); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>
  );
}
