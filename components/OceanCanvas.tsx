'use client';

import { useEffect, useRef } from 'react';

export type WaveIntensity = 'calm' | 'lively';

interface Bubble {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  alpha: number;
  wobblePhase: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface OceanCanvasProps {
  intensity: WaveIntensity;
  burstTrigger: number;
}

export default function OceanCanvas({
  intensity,
  burstTrigger,
}: OceanCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intensityRef = useRef<WaveIntensity>(intensity);
  const ripplesRef = useRef<Ripple[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);

  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  useEffect(() => {
    if (burstTrigger === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < 14; i += 1) {
      bubblesRef.current.push({
        x: w * 0.25 + Math.random() * (w * 0.5),
        y: h * (0.55 + Math.random() * 0.35),
        r: 3 + Math.random() * 7,
        vy: 1.3 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.9,
        alpha: 0.45 + Math.random() * 0.35,
        wobblePhase: Math.random() * Math.PI * 2,
      });
    }
    ripplesRef.current.push({
      x: w * 0.5,
      y: h * 0.45,
      radius: 16,
      maxRadius: 210,
      alpha: 0.45,
    });
  }, [burstTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    if (bubblesRef.current.length === 0) {
      for (let i = 0; i < 22; i += 1) {
        bubblesRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: 2.2 + Math.random() * 6.5,
          vy: 0.35 + Math.random() * 0.75,
          vx: (Math.random() - 0.5) * 0.2,
          alpha: 0.16 + Math.random() * 0.28,
          wobblePhase: Math.random() * Math.PI * 2,
        });
      }
    }

    const handlePointerDown = (e: PointerEvent) => {
      if (prefersReduced) return;
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 6,
        maxRadius: 110,
        alpha: 0.42,
      });
      for (let i = 0; i < 4; i += 1) {
        bubblesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 26,
          y: e.clientY + (Math.random() - 0.5) * 16,
          r: 2.5 + Math.random() * 4.5,
          vy: 0.9 + Math.random() * 1.1,
          vx: (Math.random() - 0.5) * 0.6,
          alpha: 0.42,
          wobblePhase: Math.random() * Math.PI * 2,
        });
      }
      if (bubblesRef.current.length > 56) {
        bubblesRef.current.splice(0, bubblesRef.current.length - 44);
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointerdown', handlePointerDown);

    let rafId = 0;
    let tick = 0;

    const drawFrame = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const speedFactor = intensityRef.current === 'lively' ? 1.75 : 1;
      tick += 0.014 * speedFactor;

      // Soft bottom ocean wave ribbons
      const waveConfigs = [
        {
          amp: intensityRef.current === 'lively' ? 22 : 13,
          freq: 0.0045,
          yOffset: h - 78,
          phase: tick,
          color: 'rgba(0, 56, 168, 0.055)',
        },
        {
          amp: intensityRef.current === 'lively' ? 18 : 10,
          freq: 0.006,
          yOffset: h - 52,
          phase: tick * 1.25 + 1.4,
          color: 'rgba(29, 92, 229, 0.07)',
        },
      ];

      for (const wave of waveConfigs) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 24) {
          const y =
            wave.yOffset + Math.sin(x * wave.freq + wave.phase) * wave.amp;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();
      }

      // Rising ocean bubbles
      for (let i = 0; i < bubblesRef.current.length; i += 1) {
        const b = bubblesRef.current[i];
        if (!prefersReduced) {
          b.y -= b.vy * speedFactor;
          b.wobblePhase += 0.03;
          b.x += b.vx + Math.sin(b.wobblePhase) * 0.25;
        }
        if (b.y < -20) {
          b.y = h + 15;
          b.x = Math.random() * w;
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(194, 214, 255, ${b.alpha})`;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(0, 56, 168, ${b.alpha * 0.7})`;
        ctx.stroke();

        // Pearl highlight
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.9, b.alpha * 1.5)})`;
        ctx.fill();
      }

      // Click ripple rings
      for (let i = ripplesRef.current.length - 1; i >= 0; i -= 1) {
        const rp = ripplesRef.current[i];
        rp.radius += 2.2 * speedFactor;
        rp.alpha *= 0.96;

        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = `rgba(0, 56, 168, ${rp.alpha})`;
        ctx.stroke();

        if (rp.radius >= rp.maxRadius || rp.alpha <= 0.02) {
          ripplesRef.current.splice(i, 1);
        }
      }

      if (!prefersReduced && !document.hidden) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();

    const handleVisibility = () => {
      if (!document.hidden && !prefersReduced) {
        window.cancelAnimationFrame(rafId);
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="ocean-canvas"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
