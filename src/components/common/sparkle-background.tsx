'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Sparkle {
  x: number;
  y: number;
  size: number;
  life: number;
  maxLife: number;
}

const SparkleBackground: React.FC<React.HTMLAttributes<HTMLCanvasElement>> = ({ className, ...props }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let sparkles: Sparkle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      sparkles = []; // Clear sparkles on resize
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createSparkles = () => {
      const count = Math.floor(Math.random() * 3) + 1; // 1 to 3 new sparkles per frame
      for (let i = 0; i < count; i++) {
        if (sparkles.length < 150) { // Limit total number of sparkles
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 2 + 0.5;
            const maxLife = Math.random() * 120 + 60; // Life in frames
            sparkles.push({ x, y, size, life: maxLife, maxLife });
        }
      }
    };

    const render = () => {
      createSparkles();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparkles = sparkles.filter(sparkle => {
        sparkle.life--;
        if (sparkle.life <= 0) {
          return false;
        }

        const opacity = Math.sin((1 - (sparkle.life / sparkle.maxLife)) * Math.PI) ; // Fade in and out
        ctx.fillStyle = `hsla(45, 100%, 70%, ${opacity * 0.7})`; // Use lighter primary color with fade
        ctx.beginPath();
        ctx.rect(sparkle.x, sparkle.y, sparkle.size, sparkle.size);
        ctx.fill();
        return true;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={cn("fixed top-0 left-0 -z-10 pointer-events-none", className)} {...props} />;
};

export default SparkleBackground;
