import React from 'react';
import { motion } from 'motion/react';

interface AmbientDecorOverlayProps {
  effectType?: 'stars_and_rain' | 'sun_moon_glow' | 'golden_dust' | 'all';
}

export const AmbientDecorOverlay: React.FC<AmbientDecorOverlayProps> = ({
  effectType = 'all'
}) => {
  // Generate random positions for twinkling stars / golden rain particles
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 3
  }));

  const rainDrops = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
    length: Math.random() * 20 + 10
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* 1. SUN & MOON RADIAL AURA GLOW (Нар, сарны тансаг гэрэлтүүлэг) */}
      {(effectType === 'sun_moon_glow' || effectType === 'all') && (
        <>
          {/* Top-Right Golden Sun / Moon Radial Aura */}
          <motion.div
            animate={{
              opacity: [0.35, 0.6, 0.35],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-radial from-amber-300/25 via-amber-500/10 to-transparent blur-3xl"
          />

          {/* Bottom-Left Moonlight Ambient Glow */}
          <motion.div
            animate={{
              opacity: [0.2, 0.45, 0.2],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-gradient-radial from-amber-200/15 via-yellow-600/5 to-transparent blur-3xl"
          />
        </>
      )}

      {/* 2. TWINKLING STARS & GOLDEN DUST (Гэрэлтэгч од болон алтан нунтаг) */}
      {(effectType === 'stars_and_rain' || effectType === 'golden_dust' || effectType === 'all') && (
        <div className="absolute inset-0">
          {particles.map((p) => (
            <motion.div
              key={`particle-${p.id}`}
              className="absolute rounded-full bg-amber-200/80 shadow-[0_0_8px_rgba(212,175,55,0.8)]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
              }}
              animate={{
                opacity: [0.1, 0.9, 0.1],
                scale: [0.6, 1.4, 0.6],
                y: [0, -15, 0]
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      {/* 3. ANIMATED GOLDEN RAIN / GLITTER FALL (Алтан аялгуутай борооны эффектийн хөдөлгөөн) */}
      {(effectType === 'stars_and_rain' || effectType === 'all') && (
        <div className="absolute inset-0">
          {rainDrops.map((drop) => (
            <motion.div
              key={`rain-${drop.id}`}
              className="absolute w-[1px] bg-gradient-to-b from-transparent via-amber-300/60 to-transparent shadow-[0_0_6px_rgba(249,229,175,0.7)]"
              style={{
                left: `${drop.x}%`,
                height: `${drop.length}px`,
              }}
              initial={{ top: '-10%', opacity: 0 }}
              animate={{
                top: ['-10%', '110%'],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: drop.duration,
                repeat: Infinity,
                delay: drop.delay,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}

      {/* Subtle Light Rays / Shimmer overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/5 via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
};
