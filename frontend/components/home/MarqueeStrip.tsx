"use client";

export default function MarqueeStrip() {
  const items = [
    "Dust N Rare",
    "Not For Everyone",
    "Rare Fits",
    "Everyday Dust",
    "GenZ Clothing",
    "India",
    "Subtle. Original. Rare.",
    "Quiet Luxury",
  ];

  const doubled = [...items, ...items];

  return (
    <div className="border-y border-[var(--border)] py-5 overflow-hidden bg-[var(--surface)]">
      <div className="flex w-max animate-marquee">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            {/* Text */}
            <span className="text-[0.7rem] tracking-[0.35em] uppercase text-[var(--text-soft)] font-medium px-10">
              {item}
            </span>

            {/* Separator */}
            <span className="text-[var(--gold)] text-xs opacity-70">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
