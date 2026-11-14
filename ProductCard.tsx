import { formatINR, resolveImage, type Design } from "../data/designs";

export default function ProductCard({
  design,
  inBag,
  onBuy,
  onOpenBag,
}: {
  design: Design;
  inBag: boolean;
  onBuy: (d: Design) => void;
  onOpenBag: () => void;
}) {
  const img = resolveImage(design.image);

  return (
    <article className="card group flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        {img ? (
          <img
            src={img}
            alt={design.title}
            loading="lazy"
            className="h-full w-full object-cover brightness-75 saturate-[0.85] transition duration-700 group-hover:scale-110 group-hover:brightness-100 group-hover:saturate-100"
          />
        ) : (
          <div className="art-stripes relative flex h-full w-full items-center justify-center">
            <span className="outline-text font-display text-[7rem] font-black leading-none transition-transform duration-700 group-hover:scale-110">
              Z7
            </span>
            <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.35em] text-zinc-500">
              Your design here
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="sweep" />

        <span className="absolute left-3 top-3 border border-white/20 bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-200 backdrop-blur">
          {design.category}
        </span>
        {design.tag && (
          <span className="absolute right-6 top-3 bg-violet-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-[0_0_14px_#7c3aed]">
            {design.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold text-white">{design.title}</h3>
        {design.note && <p className="mt-1 text-sm text-zinc-500">{design.note}</p>}

        <div className="mt-auto flex items-end justify-between pt-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Price</div>
            <div className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-2xl font-bold text-transparent">
              {formatINR(design.price)}
            </div>
          </div>
          {inBag ? (
            <button
              onClick={onOpenBag}
              className="cut border border-violet-400/60 bg-violet-500/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-violet-300 transition hover:bg-violet-500/25"
            >
              In bag ✓
            </button>
          ) : (
            <button
              onClick={() => onBuy(design)}
              className="cut bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-violet-500 hover:text-white active:scale-95"
            >
              Buy
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
