import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap, ShieldCheck, Sparkles, ChevronRight, Laptop } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

// Particle interface for background light effects
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing Gadgetghor Core...');
  const [isExiting, setIsExiting] = useState(false);

  // Generate random particles for ambient background light effects
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 1.5,
      opacity: Math.random() * 0.7 + 0.3,
    }))
  );

  useEffect(() => {
    // Smooth progress animation over ~2.6 seconds
    const startTime = Date.now();
    const duration = 2600; // 2.6s total time

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      
      setProgress(currentProgress);

      if (currentProgress < 30) {
        setLoadingText('Initializing Neural Tech Engine...');
      } else if (currentProgress < 65) {
        setLoadingText('Loading Bangladesh\'s Premium Gadgets...');
      } else if (currentProgress < 90) {
        setLoadingText('Connecting Pathao Express Logistics...');
      } else {
        setLoadingText('Welcome to Gadgetghor BD!');
      }

      if (elapsed >= duration) {
        clearInterval(timer);
        handleFinish();
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  const handleFinish = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 500); // 500ms fade out transition
  };

  const handleSkip = () => {
    handleFinish();
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-black text-white overflow-hidden select-none"
        >
          {/* Background Layer: Deep Black with Premium Blue & Cyan Radial Glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Primary Deep Sapphire Blue Center Glow */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.8, 1.2, 1], opacity: [0.3, 0.6, 0.5] }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[320px] sm:h-[600px] bg-blue-600/30 rounded-full blur-[130px]"
            />

            {/* Secondary Cyan Electric Pulsing Halo */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.25, 0.5, 0.25],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[420px] h-[240px] sm:h-[420px] bg-cyan-400/20 rounded-full blur-[90px]"
            />

            {/* Top Right Corner Royal Blue Ambient Flare */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-700/20 rounded-full blur-[100px]" />

            {/* Bottom Left Corner Indigo Ambient Flare */}
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]" />

            {/* Tech Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-30" />

            {/* Floating Light Particles */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{
                  x: `${p.x}vw`,
                  y: `${p.y}vh`,
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  y: [`${p.y}vh`, `${(p.y - 15 + 100) % 100}vh`],
                  opacity: [0, p.opacity, 0],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
              />
            ))}
          </div>

          {/* Top Bar: Live Status & Skip Button */}
          <div className="w-full max-w-6xl px-6 py-6 flex items-center justify-between z-10 relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-[11px] font-bold tracking-wider uppercase backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Gadgetghor Official</span>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              onClick={handleSkip}
              className="group flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/80 hover:bg-blue-600/20 border border-cyan-500/30 hover:border-cyan-400/60 text-slate-300 hover:text-cyan-300 text-xs font-black tracking-wide transition-all shadow-lg backdrop-blur-md active:scale-95 cursor-pointer"
            >
              <span>Skip</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-cyan-400" />
            </motion.button>
          </div>

          {/* Central Section: Brand Emblem, Title & Subtitle */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 relative max-w-2xl mx-auto space-y-6">
            {/* Animated Logo Shield & Glowing Ring */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotate: -10 }}
              animate={{ scale: [0.4, 1.08, 1], opacity: 1, rotate: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center mb-2"
            >
              {/* External Rotating Tech Light Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-dashed border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.2)]"
              />

              {/* Pulsing Backlight Halo */}
              <div className="absolute w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-2xl blur-xl opacity-60 animate-pulse" />

              {/* High-End Gadgetghor Logo Emblem */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border-2 border-cyan-400/50 shadow-2xl shadow-blue-500/40 flex flex-col items-center justify-center p-3 backdrop-blur-xl group">
                <div className="relative flex items-center justify-center">
                  <Cpu className="w-10 h-10 sm:w-14 sm:h-14 text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 absolute -top-1 -right-1 animate-bounce" />
                </div>
                <div className="mt-1 text-[9px] sm:text-[10px] font-black tracking-widest text-cyan-300 uppercase font-mono">
                  BD TECH
                </div>
              </div>
            </motion.div>

            {/* Title: Welcome to Gadgetghor BD */}
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight"
              >
                Welcome to{' '}
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                  Gadgetghor BD
                </span>
              </motion.h1>

              {/* Subtitle: Your Premium Tech Destination */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                className="text-xs sm:text-base font-semibold tracking-[0.2em] uppercase text-cyan-200/80 max-w-md mx-auto"
              >
                Your Premium Tech Destination
              </motion.p>
            </div>

            {/* Feature Highlights Badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center justify-center gap-2 sm:gap-4 pt-2 text-[11px] font-bold text-slate-300"
            >
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/60 border border-slate-800 text-cyan-300">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>100% Genuine</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/60 border border-slate-800 text-blue-300">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span>Pathao Fast Delivery</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/60 border border-slate-800 text-indigo-300 hidden sm:flex">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Official Warranty</span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section: Progress Bar & Dynamic Status Indicator */}
          <div className="w-full max-w-md px-6 pb-10 z-10 relative space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-extrabold text-slate-300">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                {loadingText}
              </span>
              <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                {progress}%
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="relative w-full h-2.5 rounded-full bg-slate-900/90 border border-cyan-500/20 overflow-hidden shadow-inner">
              {/* Filled Track with Glow */}
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-400 relative"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              >
                {/* Glowing Leading Head Edge */}
                <div className="absolute right-0 top-0 bottom-0 w-3 bg-white blur-[2px] rounded-full shadow-[0_0_12px_#ffffff]" />
              </motion.div>
            </div>

            <div className="text-[10px] text-center text-slate-500 tracking-wider font-mono uppercase">
              Dhaka • Chittagong • Sylhet • All Bangladesh Express
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
