import { useEffect, useMemo, useState } from "react";
import { SITE, formatINR, resolveImage, type Design } from "../data/designs";

const USER_RE = /^[A-Za-z0-9._]{1,30}$/;

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export default function Bag({
  open,
  onClose,
  items,
  onRemove,
  onClear,
  username,
  setUsername,
}: {
  open: boolean;
  onClose: () => void;
  items: Design[];
  onRemove: (id: string) => void;
  onClear: () => void;
  username: string;
  setUsername: (v: string) => void;
}) {
  const [sent, setSent] = useState<null | boolean>(null);
  const [touched, setTouched] = useState(false);

  const total = useMemo(() => items.reduce((s, d) => s + d.price, 0), [items]);
  const clean = username.trim().replace(/^@+/, "");
  const valid = USER_RE.test(clean);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    setSent(null);
  }, [items.length, open]);

  if (!open) return null;

  const message = [
    `🖤 Z7 GARAGE — NEW ORDER`,
    ``,
    `Instagram: @${clean}`,
    ``,
    ...items.map((d, i) => `${i + 1}. ${d.title} (${d.category}) — ${formatINR(d.price)}`),
    ``,
    `Total: ${formatINR(total)}`,
    `Payment: ${SITE.payment}`,
  ].join("\n");

  const send = () => {
    setTouched(true);
    if (!valid || items.length === 0) return;
    const p = copyText(message);
    window.open(SITE.dmUrl, "_blank", "noopener");
    p.then((ok) => setSent(ok));
  };

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="fade-in absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <aside className="slide-in absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-violet-500/30 bg-[#08080b] shadow-[-30px_0_80px_-20px_rgba(124,58,237,0.5)]">
        {/* header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-violet-400">Z7 Garage</div>
            <h2 className="font-display text-2xl font-bold">Your bag</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close bag"
            className="flex h-10 w-10 items-center justify-center border border-white/15 text-zinc-300 transition hover:border-violet-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-zinc-500">
              <div className="outline-text font-display text-7xl font-black">Z7</div>
              <p className="mt-4 text-sm uppercase tracking-[0.25em]">Bag is empty</p>
              <button
                onClick={onClose}
                className="cut mt-6 border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white hover:border-violet-400"
              >
                Browse designs
              </button>
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {items.map((d) => {
                  const img = resolveImage(d.image);
                  return (
                    <li key={d.id} className="flex items-center gap-4 border border-white/10 bg-white/[0.03] p-3">
                      <div className="art-stripes flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden">
                        {img ? (
                          <img src={img} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="outline-text font-display text-2xl font-black">Z7</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold">{d.title}</div>
                        <div className="text-xs uppercase tracking-widest text-zinc-500">{d.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatINR(d.price)}</div>
                        <button
                          onClick={() => onRemove(d.id)}
                          className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-violet-400"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* instagram username */}
              <div className="mt-7">
                <label htmlFor="ig" className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">
                  Your Instagram username
                </label>
                <div
                  className={`mt-2 flex items-center border bg-black px-4 transition focus-within:border-violet-400 ${
                    touched && !valid ? "border-red-500/70" : "border-white/15"
                  }`}
                >
                  <span className="text-lg text-violet-400">@</span>
                  <input
                    id="ig"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className="w-full bg-transparent px-2 py-4 text-white outline-none placeholder:text-zinc-600"
                  />
                </div>
                {touched && !valid && (
                  <p className="mt-2 text-xs text-red-400">Enter a valid Instagram username (letters, numbers, . and _).</p>
                )}
              </div>

              {/* payment */}
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">Payment method</div>
                <div className="mt-2 flex items-center gap-4 border border-violet-500/50 bg-violet-500/10 p-4">
                  <div className="flex h-10 w-10 items-center justify-center bg-white text-lg text-black">▶</div>
                  <div className="flex-1">
                    <div className="font-semibold">{SITE.payment}</div>
                    <div className="text-xs text-zinc-400">Send the code in Instagram DM</div>
                  </div>
                  <div className="h-4 w-4 rounded-full border-4 border-violet-400 bg-white" />
                </div>
              </div>

              {sent !== null && (
                <div
                  className={`fade-in mt-6 border p-4 text-sm ${
                    sent ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200" : "border-amber-500/40 bg-amber-500/10 text-amber-200"
                  }`}
                >
                  {sent ? (
                    <>
                      <b>Order copied ✓</b> — Instagram DM opened. Just <b>paste</b> and send it to @{SITE.instagramUser}.
                    </>
                  ) : (
                    <>
                      Couldn't copy automatically. Copy this manually:
                      <pre className="mt-2 whitespace-pre-wrap text-xs text-white">{message}</pre>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 bg-black/60 px-6 py-5">
            <div className="mb-4 flex items-end justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">Total</span>
              <span className="font-display text-3xl font-black">{formatINR(total)}</span>
            </div>
            <button
              onClick={send}
              className="btn-glow flex w-full items-center justify-center gap-3 px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition active:scale-[0.98]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              Send order on Instagram
            </button>
            <p className="mt-3 text-center text-[11px] text-zinc-500">
              Copies your order, then opens Instagram DM to @{SITE.instagramUser}.
            </p>
            <button
              onClick={onClear}
              className="mt-2 w-full text-center text-[10px] uppercase tracking-[0.3em] text-zinc-600 hover:text-zinc-300"
            >
              Clear bag
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
