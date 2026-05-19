'use client';

import { useState, useEffect } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

interface PaellaItem {
  id: string;
  src: string;
  title: string;
  P25?: number;
  blend?: boolean;
}

interface PaellaCardProps {
  item: PaellaItem;
  index: number;
  rotation: MotionValue<number>;
  count: number;
  radiusX: number;
  radiusY: number;
  onSelect: () => void;
}

const PaellaCard = ({ item, index, rotation, count, radiusX, radiusY, onSelect }: PaellaCardProps) => {
    const angleStep = 360 / count;

    const angle = useTransform(rotation, (r) => {
        return 90 + (index - r) * angleStep;
    });

    const x = useTransform(angle, (a) => Math.cos((a * Math.PI) / 180) * radiusX);
    const y = useTransform(angle, (a) => Math.sin((a * Math.PI) / 180) * radiusY);

    const scale = useTransform(angle, (a) => {
        const sinVal = Math.sin((a * Math.PI) / 180);
        return 0.5 + ((sinVal + 1) / 2) * 0.55;
    });

    const zIndex = useTransform(scale, (s) => Math.round(s * 100));
    const opacity = useTransform(scale, (s) => (s - 0.5) / 0.55 * 0.7 + 0.3);
    const dynamicFilter = useTransform(scale, s => `drop-shadow(0 10px 15px rgba(0,0,0,0.15)) brightness(0.6) blur(${Math.max(0, (1.05 - s) * 8)}px)`);

    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const unsubscribe = rotation.on("change", (latest) => {
            const normalizedR = Math.round(latest) % count;
            const indexCheck = (normalizedR + count) % count;
            setIsActive(indexCheck === index);
        });
        return unsubscribe;
    }, [rotation, count, index]);

    const handleClick = () => {
        if (isActive) onSelect();
    };

    return (
        <motion.div
            className="absolute flex flex-col items-center justify-center pointer-events-auto"
            style={{
                x, y, scale, zIndex, opacity,
                transformOrigin: "center center",
                width: 'fit-content',
                height: 'fit-content'
            }}
            onClick={handleClick}
        >
            <div className={`flex flex-col items-center gap-2 md:gap-4 relative transition-all duration-300 ${isActive ? 'cursor-pointer' : ''}`}>
                <div className="w-44 h-44 md:w-64 md:h-64 flex items-center justify-center">
                    <motion.div
                        className="w-full h-full relative"
                        style={{ filter: isActive ? 'drop-shadow(0 30px 30px rgba(0,0,0,0.5)) brightness(1) blur(0px)' : dynamicFilter }}
                        animate={{ y: isActive ? -15 : 0 }}
                        transition={{ 
                            duration: 2, 
                            repeat: isActive ? Infinity : 0, 
                            repeatType: "reverse", 
                            ease: "easeInOut" 
                        }}
                    >
                        <img
                            src={item.src}
                            alt={item.title}
                            className={`w-[95%] h-[95%] object-contain pointer-events-none select-none drop-shadow-2xl ${item.blend ? 'mix-blend-multiply' : ''}`}
                        />
                    </motion.div>
                </div>

                {/* Premium Designer Title Label */}
                <div 
                    className={`absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95 pointer-events-none'}`}
                >
                    {/* Elegant connecting line */}
                    <div className="w-[1px] h-6 md:h-10 bg-gradient-to-b from-[#ffb347]/80 to-transparent mb-3" />
                    
                    {/* Typography */}
                    <span style={{ fontFamily: 'var(--font-display)' }} className="text-[0.55rem] md:text-[0.65rem] uppercase tracking-[0.4em] text-[#ffb347]/70 mb-1.5">
                        Selección
                    </span>
                    <span style={{ fontFamily: 'var(--font-luxury)' }} className="text-white text-lg md:text-2xl font-light tracking-wide whitespace-nowrap drop-shadow-2xl">
                        {item.title}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default PaellaCard;
