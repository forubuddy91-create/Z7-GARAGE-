import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Hero from "./components/Hero";
import Reveal from "./components/Reveal";
import ProductCard from "./components/ProductCard";
import Bag from "./components/Bag";
import { DESIGNS, SITE, type Category, type Design } from "./data/designs";

const FILTERS: ("All" | Category)[] = ["All", "Car", "Bus", "Other"];

function useLocal<T>(key: string, init: T) {
  const [v, setV] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* ignore */
    }
  }, [key, v]);
  return [v, setV] as const;
}

const MARQUEE = ["Z7 GARAGE", "CUSTOM CLEAN BUILD", "1&1", "TRUST & SAFE", "MADE IN INDIA 🇮🇳", "ORIGINAL WORK"];

export default function App() {
  const [bagIds, setBagIds] = useLocal<string[]>("z7-bag", []);
  const [username, setUsername] = useLocal<string>("z7-ig", "");
  const [bagOpen, setBagOpen] = useState(false);
  const [filter, setFilter] = useState<"All" | Category>("All");
  const [toast, setToast] = useState<string | null>(null);
  const [bumpKey, setBumpKey] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const toastTimer = useRef<number>(0);

  const items = useMemo(() => bagIds.map((id) => DESIGNS.find((d) => d.id === id)).filter(Boolean) as Design[], [bagIds]);

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  };

  const buy = (d: Design) => {
    if (!bagIds.includes(d.id)) setBagIds([...bagIds, d.id]);
    setBumpKey((k) => k + 1);
    showToast(`${d.title} added to bag`);
  };

  const closeBag = useCallback(() => setBagOpen(false), []);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const shown = DESIGNS.filter((d) => filter === "All" || d.category === filter);

  return (
    <div className="relative min-h-screen bg-[#050507] text-white">
      {/* global grain */}
      <div className="noise pointer-events-none fixed -inset-10 z-[60]" />

      {/* NAV */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-white/10 bg-black/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="cut flex h-10 w-10 items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-500 font-display text-lg font-black text-black">
              Z7
            </span>
            <span className="hidden font-display text-lg font-bold tracking-[0.2em] sm:block">GARAGE</span>
          </a>

          <nav className="hidden items-center gap-10 text-xs font-medium uppercase tracking-[0.3em] text-zinc-400 md:flex">
            <a href="#shop" className="transition hover:text-white">Designs</a>
            <a href="#trust" className="transition hover:text-white">Trust</a>
            <a href="#how" className="transition hover:text-white">How to order</a>
          </nav>

          <button
            onClick={() => setBagOpen(true)}
            className="cut relative flex items-center gap-3 border border-white/20 bg-black/50 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur transition hover:border-violet-400"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 7h12l1 13H5L6 7z" />
              <path d="M9 7a3 3 0 016 0" />
            </svg>
            Bag
            <span
              key={bumpKey}
              className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] ${
                items.length ? "bump bg-violet-500 text-white shadow-[0_0_12px_#a855f7]" : "bg-white/10 text-zinc-400"
              }`}
            >
              {items.length}
            </span>
          </button>
        </div>
      </header>

      <Hero />

      {/* MARQUEE */}
      <div className="relative z-10 overflow-hidden border-y border-white/10 bg-gradient-to-r from-[#0b0614] via-[#12082a] to-[#0b0614] py-4">
        <div className="marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {MARQUEE.map((m, i) => (
                <span key={i} className="flex items-center whitespace-nowrap font-display text-lg font-bold tracking-[0.3em] text-zinc-300">
                  {m}
                  <span className="mx-8 text-violet-500">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* SHOP */}
      <section id="shop" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="pointer-events-none absolute left-0 top-10 h-96 w-96 rounded-full bg-violet-700/20 blur-[120px]" />
        <Reveal>
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="text-xs uppercase tracking-[0.5em] text-violet-400">— The collection</div>
              <h2 className="mt-4 font-display text-5xl font-black leading-none sm:text-7xl">
                <span className="bg-gradient-to-b from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent">DESIGNS</span>
              </h2>
              <p className="mt-4 max-w-md text-zinc-500">Original work. Tap Buy, it goes in your bag. Pay with a Google Play Redeem Code.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`cut px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] transition ${
                    filter === f ? "bg-white text-black" : "border border-white/15 text-zinc-400 hover:border-violet-400 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="relative mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((d, i) => (
            <Reveal key={d.id} delay={(i % 3) * 100}>
              <ProductCard design={d} inBag={bagIds.includes(d.id)} onBuy={buy} onOpenBag={() => setBagOpen(true)} />
            </Reveal>
          ))}
        </div>
        {shown.length === 0 && <p className="mt-14 text-center text-zinc-500">No designs here yet. Check back soon.</p>}
      </section>

      {/* TRUST */}
      <section id="trust" className="relative overflow-hidden border-y border-white/10 bg-[#07070a] py-24 sm:py-32">
        <div className="pointer-events-none absolute -right-40 top-0 h-[28rem] w-[28rem] rounded-full bg-violet-800/25 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.5em] text-violet-400">— Why Z7</div>
            <h2 className="mt-4 font-display text-4xl font-black sm:text-6xl">
              <span className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">BUILT CLEAN. BUILT SAFE.</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "1&1", "Every design is custom — one of one. No copy-paste work."],
              ["02", "Clean build", "Sharp, matte, detailed. Made with care in every pixel."],
              ["03", "Trust & safe", "Direct on Instagram with the creator. No middlemen."],
              ["04", "Made in India 🇮🇳", "Original work by ZX 4XE. Prices in ₹."],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 100} className="bg-[#07070a]">
                <div className="group h-full p-8 transition hover:bg-gradient-to-b hover:from-violet-950/50 hover:to-transparent">
                  <div className="outline-text font-display text-5xl font-black transition group-hover:text-violet-400">{n}</div>
                  <h3 className="mt-6 font-display text-xl font-bold">{t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.5em] text-violet-400">— Simple</div>
          <h2 className="mt-4 font-display text-4xl font-black sm:text-6xl">HOW TO ORDER</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {[
            ["Tap Buy", "Pick your design. It drops into your bag."],
            ["Add username", "Type your Instagram username in the bag."],
            ["Check total", "Total in ₹. Payment: Google Play Redeem Code."],
            ["Send order", "Tap Send order on Instagram — it copies your order and opens DM. Paste & send."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 120}>
              <div className="relative h-full border-l border-violet-500/50 pl-6">
                <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 bg-violet-500 shadow-[0_0_12px_#a855f7]" />
                <div className="font-display text-sm text-violet-400">STEP 0{i + 1}</div>
                <h3 className="mt-2 text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="relative mt-20 overflow-hidden border border-white/10 bg-gradient-to-br from-[#14092b] via-[#0a0a0f] to-black p-10 text-center sm:p-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.3),transparent_60%)]" />
            <h3 className="relative font-display text-3xl font-black sm:text-5xl">READY TO RIDE DARK?</h3>
            <p className="relative mx-auto mt-4 max-w-md text-zinc-400">Talk to the creator directly on Instagram.</p>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-glow relative mt-8 inline-block px-10 py-4 text-sm font-bold uppercase tracking-[0.2em]"
            >
              @{SITE.instagramUser} on Instagram
            </a>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <div className="font-display text-3xl font-black tracking-wider">Z7 GARAGE</div>
              <p className="mt-2 text-sm text-zinc-500">
                🇮🇳 India · 1&amp;1 · Custom clean build · Trust &amp; safe
              </p>
              <p className="mt-1 text-sm text-zinc-500">Brand: Z7 · Owner / Creator: {SITE.owner}</p>
            </div>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="self-start text-sm uppercase tracking-[0.25em] text-zinc-300 hover:text-violet-400"
            >
              Instagram · @{SITE.instagramUser} ↗
            </a>
          </div>
          <div className="mt-10 border-t border-white/10 pt-8 text-xs leading-relaxed text-zinc-600">
            <p className="font-semibold text-zinc-400">Copyright © 2026 Z7 GARAGE. All Rights Reserved.</p>
            <p className="mt-2 max-w-3xl">
              Original source code, designs, graphics, artwork and other original creative materials are protected by
              applicable copyright laws. Unauthorized copying, redistribution or republishing of this original work is
              prohibited without permission from the copyright owner.
            </p>
          </div>
        </div>
      </footer>

      <Bag
        open={bagOpen}
        onClose={closeBag}
        items={items}
        onRemove={(id) => setBagIds(bagIds.filter((x) => x !== id))}
        onClear={() => setBagIds([])}
        username={username}
        setUsername={setUsername}
      />

      {toast && (
        <div className="toast-in fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-4 border border-violet-500/50 bg-black/90 px-5 py-3 text-sm shadow-[0_0_30px_rgba(124,58,237,0.5)] backdrop-blur">
          <span className="text-violet-400">✦</span>
          {toast}
          <button
            onClick={() => {
              setToast(null);
              setBagOpen(true);
            }}
            className="text-xs font-bold uppercase tracking-widest text-white underline underline-offset-4"
          >
            View bag
          </button>
        </div>
      )}
    </div>
  );
}
