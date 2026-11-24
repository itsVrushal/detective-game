import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { soundscape } from '../audio/soundscape';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export const FlashlightCanvas: React.FC = () => {
  const [state, actions] = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<{ x: number; y: number }>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [lightningActive, setLightningActive] = useState<boolean>(false);
  const lastChimeTimeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  // Initialize floating dust motes
  useEffect(() => {
    const particles: Particle[] = [];
    const count = 70;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.3, // slow upward drift like smoke
        size: 1 + Math.random() * 2,
        alpha: 0.15 + Math.random() * 0.4,
      });
    }
    particlesRef.current = particles;
  }, []);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse move handler
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        cursorRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  // Keyboard shortcut listener: Space to shake filament, F for UV mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        actions.tapFilament();
      } else if (e.code === 'KeyF') {
        actions.toggleLightMode();
      } else if (e.code === 'KeyN') {
        actions.openDossier();
      } else if (e.code === 'KeyA') {
        actions.openAccusation();
      } else if (e.code === 'Escape') {
        actions.closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions]);

  // Periodic distant thunder & lightning flash
  useEffect(() => {
    const thunderTimer = setInterval(() => {
      // 30% chance every 40s
      if (Math.random() < 0.35 && !state.soundMuted) {
        soundscape.playThunder();
        // Delay flash slightly after first rumble
        setTimeout(() => {
          setLightningActive(true);
          setTimeout(() => setLightningActive(false), 90);
          setTimeout(() => {
            setLightningActive(true);
            setTimeout(() => setLightningActive(false), 50);
          }, 140);
        }, 400);
      }
    }, 45000);

    return () => clearInterval(thunderTimer);
  }, [state.soundMuted]);

  // Proximity sound calculation
  const checkProximityChime = useCallback((cx: number, cy: number) => {
    const now = Date.now();
    if (now - lastChimeTimeRef.current < 2200) return;

    const undiscoveredHotspots = state.currentCase.hotspots.filter(
      h => !state.inspectedHotspotIds.includes(h.id)
    );

    for (const h of undiscoveredHotspots) {
      const hx = (h.xPercent / 100) * window.innerWidth;
      const hy = (h.yPercent / 100) * window.innerHeight;
      const dist = Math.hypot(cx - hx, cy - hy);

      if (dist < 180) {
        const proximityNormalized = 1 - dist / 180;
        soundscape.playProximityChime(proximityNormalized);
        lastChimeTimeRef.current = now;
        break;
      }
    }
  }, [state.currentCase.hotspots, state.inspectedHotspotIds]);

  // Main 60fps render loop
  useEffect(() => {
    let animationFrameId: number;
    let flickerPhase = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const { x: cx, y: cy } = cursorRef.current;

      flickerPhase += 0.05;

      // Calculate organic flicker
      let flickerMod = 1.0;
      // Random micro-stutters
      if (Math.sin(flickerPhase * 3.7) > 0.94) {
        flickerMod = 0.65 + Math.random() * 0.3;
      }
      // Decay mod
      const healthFactor = Math.max(0.4, state.filamentHealth / 100);
      const baseRadius = (state.lightMode === 'uv' ? 220 : 250) * healthFactor * flickerMod;

      checkProximityChime(cx, cy);

      // Clear
      ctx.clearRect(0, 0, w, h);

      if (lightningActive) {
        // Lightning flash fills the room with brief high-contrast silver light
        ctx.fillStyle = 'rgba(230, 240, 255, 0.12)';
        ctx.fillRect(0, 0, w, h);
      } else {
        // 1. Draw solid darkness background
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = state.lightMode === 'uv' ? '#06070f' : '#06070a';
        ctx.fillRect(0, 0, w, h);

        // 2. Cut out flashlight beam (destination-out)
        ctx.globalCompositeOperation = 'destination-out';
        const cutoutGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, baseRadius);
        cutoutGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
        cutoutGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.88)');
        cutoutGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.45)');
        cutoutGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = cutoutGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
        ctx.fill();

        // 3. Add atmospheric colored beam tint overlay
        ctx.globalCompositeOperation = 'source-over';

        // Colored light aura inside the beam
        const tintGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 0.95);
        if (state.lightMode === 'uv') {
          // Forensic UV blacklight: purple/indigo glow with bright core
          tintGrad.addColorStop(0, 'rgba(199, 210, 254, 0.22)');
          tintGrad.addColorStop(0.45, 'rgba(99, 102, 241, 0.25)');
          tintGrad.addColorStop(0.85, 'rgba(79, 70, 229, 0.08)');
          tintGrad.addColorStop(1, 'rgba(67, 56, 202, 0)');
        } else {
          // Vintage Tungsten filament: warm amber
          tintGrad.addColorStop(0, 'rgba(254, 243, 199, 0.18)');
          tintGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.16)');
          tintGrad.addColorStop(0.85, 'rgba(217, 119, 6, 0.05)');
          tintGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
        }
        ctx.fillStyle = tintGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
        ctx.fill();

        // 4. Render illuminated dust particles floating within the light cone
        const particles = particlesRef.current;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;

          const dist = Math.hypot(p.x - cx, p.y - cy);
          if (dist < baseRadius * 0.85) {
            // Particle caught in the beam of light
            const beamFalloff = 1 - dist / (baseRadius * 0.85);
            ctx.fillStyle = state.lightMode === 'uv'
              ? `rgba(165, 180, 252, ${p.alpha * beamFalloff * 1.2})`
              : `rgba(254, 243, 199, ${p.alpha * beamFalloff * 1.1})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 5. Light beam edge ring (tactile lens rim)
        ctx.strokeStyle = state.lightMode === 'uv'
          ? 'rgba(129, 140, 248, 0.08)'
          : 'rgba(245, 158, 11, 0.07)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius * 0.85, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [state.lightMode, state.filamentHealth, lightningActive, checkProximityChime]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-30 pointer-events-none"
      style={{ touchAction: 'none' }}
    />
  );
};
