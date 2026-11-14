/// <reference types="vite/client" />
/* ==========================================================================
   Z7 GARAGE — EDIT THIS FILE TO ADD YOUR OWN WORK
   ==========================================================================
   1. Put your design pictures in:   src/assets/designs/
      (example: src/assets/designs/black-bus-01.jpg)
   2. Add a new line in DESIGNS below, e.g.

      { id: "bus-01", title: "Black Phantom Bus", category: "Bus",
        price: 199, image: "black-bus-01.jpg", tag: "NEW",
        note: "Matte black + purple glow" },

   - id        -> any unique text
   - category  -> "Car" | "Bus" | "Other"
   - price     -> number in ₹ (rupees)
   - image     -> file name from src/assets/designs  (or a full https:// link)
   - tag       -> optional small badge (NEW / HOT / LIMITED)
   - note      -> optional short line under the title
   Designs without an image show a dark "Z7" placeholder.
   Delete the sample placeholders below when you add yours.
   ========================================================================== */

export type Category = "Car" | "Bus" | "Other";

export interface Design {
  id: string;
  title: string;
  category: Category;
  price: number;
  image?: string;
  tag?: string;
  note?: string;
}

export const SITE = {
  brand: "Z7 GARAGE",
  owner: "ZX 4XE",
  instagramUser: "zx_4xe",
  instagramUrl: "https://www.instagram.com/zx_4xe",
  dmUrl: "https://ig.me/m/zx_4xe",
  payment: "Google Play Redeem Code",
};

export const DESIGNS: Design[] = [
  { id: "sample-01", title: "Sample Design 01", category: "Car", price: 99, tag: "SAMPLE", note: "Replace with your own work" },
  { id: "sample-02", title: "Sample Design 02", category: "Car", price: 149, note: "Replace with your own work" },
  { id: "sample-03", title: "Sample Design 03", category: "Bus", price: 199, tag: "SAMPLE", note: "Replace with your own work" },
  { id: "sample-04", title: "Sample Design 04", category: "Bus", price: 249, note: "Replace with your own work" },
  { id: "sample-05", title: "Sample Design 05", category: "Car", price: 299, note: "Replace with your own work" },
  { id: "sample-06", title: "Sample Design 06", category: "Other", price: 129, note: "Replace with your own work" },
];

/* ---- image resolver (don't edit) ---- */
const files = import.meta.glob("../assets/designs/*.{jpg,jpeg,png,webp,gif,avif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function resolveImage(img?: string): string | undefined {
  if (!img) return undefined;
  if (/^(https?:)?\/\//.test(img) || img.startsWith("data:")) return img;
  const key = Object.keys(files).find((k) => k.endsWith("/" + img));
  return key ? files[key] : undefined;
}

export const formatINR = (n: number) => "₹" + new Intl.NumberFormat("en-IN").format(n);
