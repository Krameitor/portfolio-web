'use client';

import { useState, useEffect, useRef } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const GREEN  = '#10b981';
const RED    = '#fe2c55';
const VIOLET = '#8a2be2';

interface NewsCard {
  id: number;
  title: string;
  summary: string;
  source: string;
  category: string;
  gradient: string;
  icon: string;
  time: string;
  likes: number;
}

const NEWS_CARDS: NewsCard[] = [
  {
    id: 1,
    title: 'IA detecta cáncer con 97% de precisión en nuevo estudio',
    summary: 'Investigadores del MIT desarrollan un modelo de visión computacional que supera a radiólogos expertos en la detección temprana de tumores pulmonares.',
    source: 'Veridian Science',
    category: 'Ciencia',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: '🔬',
    time: 'Hace 3 min',
    likes: 847,
  },
  {
    id: 2,
    title: 'OpenAI anuncia GPT-5 con razonamiento multimodal',
    summary: 'El nuevo modelo puede procesar texto, imágenes, audio y video simultáneamente, marcando un hito en inteligencia artificial general.',
    source: 'Veridian Tech',
    category: 'Tecnología',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: '💻',
    time: 'Hace 12 min',
    likes: 1203,
  },
  {
    id: 3,
    title: 'España bate récord de energía solar en primavera',
    summary: 'La energía fotovoltaica cubrió el 45% de la demanda eléctrica nacional durante el pasado fin de semana, un máximo histórico.',
    source: 'Veridian Green',
    category: 'Medioambiente',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: '🌱',
    time: 'Hace 28 min',
    likes: 562,
  },
];

// ─── AI Chat Panel ────────────────────────────────────────────────────────────
function AIChatPanel({ card, onClose }: { card: NewsCard; onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([
    { role: 'bot', text: '¡Hola! Puedo responder preguntas sobre esta noticia. ¿Qué te gustaría saber?' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const aiResponses = [
    'Según fuentes verificadas, este descubrimiento es respaldado por tres estudios independientes publicados en Nature.',
    'Los expertos del sector consideran que esto podría tener un impacto significativo en los próximos 5 años.',
    'La información proviene de fuentes primarias de alta confiabilidad. Veridian ha verificado los datos con el CRAAP Method.',
    'Este hallazgo contrasta con estudios anteriores. La metodología utilizada ha sido revisada por pares.',
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    setTimeout(() => {
      const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.97)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 'inherit',
      overflow: 'hidden',
    }}>
      {/* Panel header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
      }}>
        <div style={{
          width: 28, height: 28,
          borderRadius: 8,
          background: `linear-gradient(135deg, ${VIOLET}55, ${VIOLET}22)`,
          border: `1px solid ${VIOLET}88`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={VIOLET} strokeWidth="2.5">
            <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" />
          </svg>
        </div>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, flex: 1 }}>IA Veridian</span>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
          width: 28, height: 28, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>×</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : ('flex-start' as string),
          }}>
            <div style={{
              maxWidth: '82%',
              padding: '9px 13px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user'
                ? `linear-gradient(135deg, ${VIOLET}cc, ${VIOLET}88)`
                : 'rgba(255,255,255,0.07)',
              border: msg.role !== 'user' ? '1px solid rgba(255,255,255,0.08)' : 'none',
              fontSize: 11.5,
              color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.55,
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: 'flex', gap: 4, padding: '9px 13px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: VIOLET,
                animation: `vrd-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '10px 12px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        gap: 8,
        flexShrink: 0,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Pregunta sobre esta noticia..."
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20,
            padding: '8px 14px',
            color: '#fff',
            fontSize: 11.5,
            outline: 'none',
          }}
        />
        <button onClick={handleSend} style={{
          width: 34, height: 34,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${VIOLET}, ${VIOLET}88)`,
          border: 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Main Mockup ──────────────────────────────────────────────────────────────
interface VeridianMockupProps {
  isVisible?: boolean;
}

export default function VeridianMockup({ isVisible = false }: VeridianMockupProps) {
  const [activeCard, setActiveCard] = useState(0);
  const [likedCards, setLikedCards] = useState<Set<number>>(new Set());
  const [showAI, setShowAI] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-cycle cards when visible
  useEffect(() => {
    if (!isVisible || showAI) return;
    const id = setInterval(() => {
      setActiveCard(prev => (prev + 1) % NEWS_CARDS.length);
    }, 3800);
    return () => clearInterval(id);
  }, [isVisible, showAI]);

  const goTo = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveCard(index);
    setShowAI(false);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const toggleLike = (cardId: number) => {
    setLikedCards(prev => {
      const next = new Set(prev);
      next.has(cardId) ? next.delete(cardId) : next.add(cardId);
      return next;
    });
  };

  const card = NEWS_CARDS[activeCard];
  const isLiked = likedCards.has(card.id);

  return (
    <div style={{
      width: 280,
      height: 500,
      borderRadius: 32,
      background: '#000',
      border: '2px solid rgba(255,255,255,0.12)',
      boxShadow: `
        0 0 0 6px rgba(16, 185, 129, 0.04),
        0 40px 80px rgba(0,0,0,0.8),
        0 0 60px rgba(16, 185, 129, 0.12),
        inset 0 1px 0 rgba(255,255,255,0.08)
      `,
      position: 'relative',
      overflow: 'hidden',
      animation: isVisible ? 'vrd-float 6s ease-in-out infinite' : 'none',
      flexShrink: 0,
    }}>

      {/* ── Header ── */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 52,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.85) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2"
            style={{ filter: `drop-shadow(0 0 6px ${GREEN}99)`, animation: 'vrd-shield 3s ease-in-out infinite' }}>
            <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" />
          </svg>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: 0.5 }}>Veridian</span>
        </div>
        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 4 }}>
          {NEWS_CARDS.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === activeCard ? 16 : 6,
              height: 6,
              borderRadius: 3,
              background: i === activeCard ? GREEN : 'rgba(255,255,255,0.2)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      </div>

      {/* ── Card area ── */}
      <div style={{
        position: 'absolute',
        top: 52, left: 0, right: 0, bottom: 0,
        overflow: 'hidden',
      }}>
        {/* Gradient header */}
        <div style={{
          width: '100%',
          height: 160,
          background: card.gradient,
          position: 'relative',
          transition: 'all 0.4s ease',
          flexShrink: 0,
        }}>
          {/* Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
          }} />
          {/* Theme icon */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 42,
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
          }}>{card.icon}</div>
          {/* Source badge */}
          <div style={{
            position: 'absolute',
            bottom: 12, left: 12,
            padding: '4px 10px',
            borderRadius: 20,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            fontSize: 9.5,
            fontWeight: 600,
            letterSpacing: 0.4,
          }}>📰 {card.source}</div>
          {/* Time badge */}
          <div style={{
            position: 'absolute',
            bottom: 12, right: 12,
            padding: '4px 10px',
            borderRadius: 20,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 9,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>🕐 {card.time}</div>
        </div>

        {/* Content */}
        <div style={{
          padding: '14px 14px 60px',
          background: 'linear-gradient(180deg, #0f0f0f 0%, #0a0a0a 100%)',
          height: 'calc(100% - 160px)',
          overflow: 'hidden',
        }}>
          <h3 style={{
            margin: 0,
            color: '#fff',
            fontSize: 13.5,
            fontWeight: 700,
            lineHeight: 1.4,
            marginBottom: 8,
            transition: 'opacity 0.3s ease',
          }}>{card.title}</h3>
          <p style={{
            margin: 0,
            color: 'rgba(255,255,255,0.5)',
            fontSize: 10.5,
            lineHeight: 1.6,
          }}>{card.summary}</p>
        </div>

        {/* ── Side action buttons (TikTok style) ── */}
        <div style={{
          position: 'absolute',
          right: 10,
          bottom: 70,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          zIndex: 10,
        }}>
          {/* AI Button */}
          <button
            onClick={() => setShowAI(true)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: `linear-gradient(135deg, ${VIOLET}ee, ${VIOLET}88)`,
              border: '2px solid rgba(255,255,255,0.25)',
              boxShadow: `0 4px 16px ${VIOLET}66, 0 0 24px ${VIOLET}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              animation: isVisible ? 'vrd-pulse-ring 2s ease-out infinite' : 'none',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" />
              </svg>
            </div>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: 0.3 }}>IA</span>
          </button>

          {/* Like Button */}
          <button
            onClick={() => toggleLike(card.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: isLiked
                ? `linear-gradient(135deg, ${RED}, #ff3d6a)`
                : `linear-gradient(135deg, ${RED}cc, ${RED}88)`,
              border: `2px solid ${isLiked ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)'}`,
              boxShadow: isLiked
                ? `0 4px 20px ${RED}, 0 0 40px ${RED}66`
                : `0 4px 16px ${RED}55, 0 0 24px ${RED}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s ease',
              transform: isLiked ? 'scale(1.05)' : 'scale(1)',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24"
                fill={isLiked ? 'white' : 'rgba(255,255,255,0.3)'}
                stroke="white" strokeWidth="2.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <span style={{
              fontSize: 8.5, fontWeight: 700,
              color: isLiked ? RED : 'rgba(255,255,255,0.9)',
              letterSpacing: 0.3,
              textShadow: isLiked ? `0 0 8px ${RED}` : 'none',
              transition: 'all 0.3s ease',
            }}>
              {((card.likes + (isLiked ? 1 : 0)) / 1000).toFixed(1)}k
            </span>
          </button>
        </div>

        {/* ── Footer nav ── */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: 52,
          background: 'linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
          zIndex: 10,
        }}>
          {/* Prev */}
          <button onClick={() => goTo((activeCard - 1 + NEWS_CARDS.length) % NEWS_CARDS.length)} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
            width: 32, height: 32, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
            fontSize: 12,
          }}>↑</button>

          {/* CRAAP badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 10px',
            borderRadius: 20,
            background: `rgba(16, 185, 129, 0.08)`,
            border: `1px solid ${GREEN}33`,
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: GREEN,
              boxShadow: `0 0 5px ${GREEN}`,
              animation: 'vrd-blink 2s ease-in-out infinite',
            }} />
            <span style={{ color: GREEN, fontSize: 8.5, fontWeight: 700, letterSpacing: 0.5 }}>CRAAP Verified</span>
          </div>

          {/* Next */}
          <button onClick={() => goTo((activeCard + 1) % NEWS_CARDS.length)} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
            width: 32, height: 32, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
            fontSize: 12,
          }}>↓</button>
        </div>

        {/* ── AI Panel overlay ── */}
        {showAI && <AIChatPanel card={card} onClose={() => setShowAI(false)} />}
      </div>

      {/* ── Keyframes (injected once) ── */}
      <style>{`
        @keyframes vrd-float {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          33%       { transform: translateY(-10px) rotateZ(0.3deg); }
          66%       { transform: translateY(-4px) rotateZ(-0.2deg); }
        }
        @keyframes vrd-shield {
          0%, 100% { filter: drop-shadow(0 0 6px ${GREEN}99); transform: scale(1); }
          50%       { filter: drop-shadow(0 0 10px ${GREEN}cc); transform: scale(1.06); }
        }
        @keyframes vrd-pulse-ring {
          0%   { box-shadow: 0 4px 16px ${VIOLET}66, 0 0 24px ${VIOLET}33; }
          50%  { box-shadow: 0 4px 24px ${VIOLET}aa, 0 0 36px ${VIOLET}55; }
          100% { box-shadow: 0 4px 16px ${VIOLET}66, 0 0 24px ${VIOLET}33; }
        }
        @keyframes vrd-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes vrd-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%            { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
