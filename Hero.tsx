import { useEffect, useRef, useState } from "react";
import character from "../assets/character.jpg";
import Embers from "./Embers";
import { SITE } from "../data/designs";

export default function Hero() {
  const wrap = useRef<HTMLDivElement>(null);
  const [strike, setStrike] = useState(false);

  // flashlight that follows the pointer (drifts on its own when idle / on touch)
  useEffect(() => {
    const el = wrap.current!;
    let raf = 0;
    let last = -1e9;
    const target = { x: 0.5, y: 0.6 };
    const cur = { x: 0.5, y: 0.6 };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width;
      target.y = (e.clientY - r.top) / r.height;
      last = performance.now();
    };
    window.addEventListener("pointermove", onMove);
    const tick = (t: number) => {
      if (t - last > 2500) {
        target.x = 0.5 + Math.sin(t / 1700) * 0.22;
        target.y = 0.5 + Math.cos(t / 2300) * 0.2 + 0.1;
      }
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      el.style.setProperty("--mx", cur.x * 100 + "%");
      el.style.setProperty("--my", cur.y * 100 + "%");
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // random lightning strikes
  useEffect(() => {
    let t1: number;
    let t2: number;
    const loop = () => {
      t1 = window.setTimeout(() => {
        setStrike(true);
        t2 = window.setTimeout(() => setStrike(false), 650);
        loop();
      }, 4500 + Math.random() * 6000);
    };
    loop();
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <section id="top" className={`relative flex min-h-[100svh] items-end overflow-hidden lg:items-center ${strike ? "strike" : ""}`}>
      {/* atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,#1b1030_0%,#08060d_45%,#050507_80%)]" />
      <div className="fog top-[10%]" />
      <div className="fog b" />

      {/* character */}
      <div
        ref={wrap}
        className="char-wrap absolute inset-x-0 bottom-0 top-[8%] lg:left-auto lg:right-0 lg:top-0 lg:w-[62%]"
      >
        <div className="char-shake breathe absolute inset-0">
          <img
            src={character}
            alt="Z7 Garage dark character"
            className="char-base absolute inset-0 h-full w-full object-cover object-[50%_75%] lg:object-[50%_85%]"
            draggable={false}
          />
          <img
            src={character}
            alt=""
            aria-hidden
            className="char-lit absolute inset-0 h-full w-full object-cover object-[50%_75%] lg:object-[50%_85%]"
            draggable={false}
          />
        </div>
        <div className="char-glow pointer-events-none absolute inset-0" />
      </div>

      <div className="flash pointer-events-none absolute inset-0" />
      <Embers />
      <div className="vignette pointer-events-none absolute inset-0" />
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050507] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050507] to-transparent" />

      {/* content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-32 sm:px-8 lg:pb-0">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-3 border border-white/15 bg-black/50 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.3em] text-zinc-300 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500 shadow-[0_0_10px_#a855f7]" />
            🇮🇳 India · 1&amp;1 · Custom
          </div>

          <h1 className="font-display text-[clamp(3.4rem,13vw,9rem)] font-black leading-[0.9] tracking-tight text-white">
            <span className="glitch" data-text="Z7">Z7</span>
            <br />
            <span className="glitch flicker" data-text="GARAGE">GARAGE</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
            Original game designs for <span className="text-white">cars</span> &amp; <span className="text-white">buses</span>.
            Custom. Clean build. <span className="text-violet-400">Trust &amp; safe.</span>
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#shop"
              className="btn-glow px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-transform hover:scale-105 active:scale-95"
            >
              Shop designs
            </a>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="cut border border-white/25 bg-black/40 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white backdrop-blur transition hover:border-violet-400 hover:text-violet-300"
            >
              @{SITE.instagramUser}
            </a>
          </div>

          <div className="mt-12 flex gap-8 text-xs uppercase tracking-[0.25em] text-zinc-500 sm:gap-12">
            {[
              ["1&1", "One of one"],
              ["100%", "Clean build"],
              ["Safe", "Trusted"],
            ].map(([a, b]) => (
              <div key={a}>
                <div className="font-display text-2xl font-bold text-white">{a}</div>
                <div className="mt-1">{b}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-zinc-500 sm:flex">
        Scroll
        <span className="scroll-line block h-10 w-px bg-violet-400" />
      </div>
    </section>
  );
}
