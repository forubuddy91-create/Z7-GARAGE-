import { useEffect, useRef } from "react";

/** Floating purple/white dust + occasional slash streaks. Pure canvas, very light. */
export default function Embers() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; r: number; vy: number; vx: number; a: number; purple: boolean; ph: number };
    const mk = (init = false): P => ({
      x: Math.random() * w,
      y: init ? Math.random() * h : h + 10,
      r: Math.random() * 1.8 + 0.4,
      vy: Math.random() * 0.6 + 0.15,
      vx: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.7 + 0.2,
      purple: Math.random() > 0.35,
      ph: Math.random() * 6.28,
    });
    const count = w < 640 ? 45 : 90;
    const ps: P[] = Array.from({ length: count }, () => mk(true));

    type Slash = { x: number; y: number; len: number; life: number };
    const slashes: Slash[] = [];
    let nextSlash = performance.now() + 2500;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y -= p.vy;
        p.x += p.vx + Math.sin(t / 900 + p.ph) * 0.25;
        if (p.y < -10) Object.assign(p, mk());
        const tw = 0.6 + Math.sin(t / 400 + p.ph) * 0.4;
        ctx.beginPath();
        ctx.fillStyle = p.purple ? `rgba(168,85,247,${p.a * tw})` : `rgba(230,230,240,${p.a * tw * 0.7})`;
        ctx.shadowColor = p.purple ? "#a855f7" : "#fff";
        ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, 6.28);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      if (t > nextSlash) {
        slashes.push({ x: Math.random() * w, y: Math.random() * h * 0.7, len: 120 + Math.random() * 220, life: 1 });
        nextSlash = t + 3000 + Math.random() * 5000;
      }
      for (let i = slashes.length - 1; i >= 0; i--) {
        const s = slashes[i];
        s.life -= 0.045;
        if (s.life <= 0) {
          slashes.splice(i, 1);
          continue;
        }
        const prog = 1 - s.life;
        const g = ctx.createLinearGradient(s.x, s.y, s.x + s.len, s.y + s.len * 0.35);
        g.addColorStop(0, "rgba(168,85,247,0)");
        g.addColorStop(0.5, `rgba(255,255,255,${s.life})`);
        g.addColorStop(1, "rgba(168,85,247,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5 + s.life * 2;
        ctx.beginPath();
        ctx.moveTo(s.x + prog * 30, s.y + prog * 10);
        ctx.lineTo(s.x + s.len, s.y + s.len * 0.35);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
