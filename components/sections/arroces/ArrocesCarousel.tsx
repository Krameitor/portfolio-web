'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import PaellaCard from './PaellaCard';

// Using a reduced set of paellas for a cleaner look
const PAELLAS = [
    {
        id: 'valenciana',
        src: '/images/paellas-nobg/valenciana.png',
        title: 'Paella Valenciana'
    },
    {
        id: 'entrecot',
        src: '/images/paellas-nobg/entrecot.png',
        title: 'Arroz de Entrecot y Calabaza'
    },
    {
        id: 'arroz-negro',
        src: '/images/paellas-nobg/arroz-negro-nuevo.png',
        title: 'Arroz Negro'
    },
    {
        id: 'torreznos',
        src: '/images/paellas-nobg/torreznos-nuevo.png',
        title: 'Arroz de Torreznos'
    },
    {
        id: 'vegetariana',
        src: '/images/paellas-nobg/vegetariana-nuevo.png',
        title: 'Paella Vegetariana'
    }
];

export default function ArrocesCarousel() {
    const rotation = useMotionValue(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [selectedPaella, setSelectedPaella] = useState<(typeof PAELLAS)[number] | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Giro continuo por tiempo — no depende del scroll de la página
    useEffect(() => {
        if (!isAutoPlaying || selectedPaella) return;

        const controls = animate(rotation, rotation.get() + PAELLAS.length, {
            duration: 25,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
        });

        return () => controls.stop();
    }, [isAutoPlaying, selectedPaella, rotation]);

    const handlePan = (_: unknown, info: { delta: { x: number } }) => {
        if (selectedPaella) return;
        setIsAutoPlaying(false);
        rotation.stop();
        const current = rotation.get();
        rotation.set(current - info.delta.x * 0.005);
    };

    const handlePanEnd = () => snapToNearest();

    const snapToNearest = () => {
        const finalP = rotation.get();
        const target = Math.round(finalP);
        animate(rotation, target, { 
            type: "spring", 
            stiffness: 150, 
            damping: 20,
            onComplete: () => {
                setIsAutoPlaying(true);
            }
        });
    };

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center overflow-visible">
            {/* Carousel Container */}
            <motion.div
                className="relative w-full flex-grow flex items-center justify-center perspective-1000 z-30 touch-pan-x"
                onPan={handlePan}
                onPanEnd={handlePanEnd}
            >
                <div className="relative w-full h-[300px] md:h-[500px] flex items-center justify-center pointer-events-none">
                    {PAELLAS.map((paella, index) => (
                        <PaellaCard
                            key={paella.id}
                            item={paella}
                            index={index}
                            rotation={rotation}
                            count={PAELLAS.length}
                            radiusX={isMobile ? 120 : 200}
                            radiusY={isMobile ? 35 : 60}
                            onSelect={() => setSelectedPaella(paella)}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Detail Modal (Optional, just to show info if clicked) */}
            <AnimatePresence>
                {selectedPaella && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedPaella(null)}
                    >
                        <motion.div
                            className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-lg w-full relative overflow-hidden pointer-events-auto"
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            transition={{ type: 'spring', damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedPaella(null)}
                                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10 text-black"
                            >
                                ✕
                            </button>

                            <div className="flex flex-col items-center gap-5">
                                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-white flex items-center justify-center p-4">
                                    <img
                                        src={selectedPaella.src}
                                        alt={selectedPaella.title}
                                        className="w-full h-full object-contain drop-shadow-xl"
                                    />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 font-display">{selectedPaella.title}</h2>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
