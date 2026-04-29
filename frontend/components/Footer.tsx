import Link from "next/link";

export default function Footer() {
  const links = {
    Shop: [
      ["Men", "/shop?gender=men"],
      ["Women", "/shop?gender=women"],
      ["Surplus", "/shop?gender=surplus"],
      ["New Drop", "/shop"],
    ],
    Brand: [
      ["About", "/about"],
      ["Lookbook", "/lookbook"],
      ["Sustainability", "/sustainability"],
      ["Size Guide", "/size-guide"],
    ],
    Help: [
      ["Shipping Policy", "/policies#shipping"],
      ["Returns", "/policies#returns"],
      ["Privacy Policy", "/policies#privacy"],
      ["Terms of Service", "/policies#terms"],
      ["Contact", "/contact"],
    ],
  };

  return (
    <footer className="bg-[var(--surface)] pt-20 pb-8">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-5">
              <img src="/logo-text.png" alt="DUST N RARE" className="h-10 object-contain" />
            </div>

            <p className="text-[0.7rem] leading-[2] tracking-wider max-w-[220px] text-[var(--text-soft)]">
              Quiet Luxury Streetwear
              <br />
              Original + Surplus
              <br />
              New Delhi · Est. 2026
            </p>

            {/* Social Icons */}
            <div className="flex gap-6 mt-8">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/dustnrare.in"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--gold)] transition"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17" cy="7" r="1" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/918789277058"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--gold)] transition"
              >
                <svg
                  width="15"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.845L.057 23.428a.75.75 0 0 0 .921.921l5.623-1.485A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.662-.523-5.17-1.432l-.36-.214-3.762.994.994-3.74-.228-.374A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path>
                </svg>
              </a>

              {/* Call */}
              <a
                href="tel:+91XXXXXXXXXX"
                className="text-[var(--text-muted)] hover:text-[var(--gold)] transition"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 012.08 4.18 2 2 0 014 2h3a2 2 0 012 1.72c.12.9.32 1.77.59 2.61a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.47-1.05a2 2 0 012.11-.45c.84.27 1.71.47 2.61.59A2 2 0 0122 16.92z" />
                </svg>
              </a>

              {/* Mail */}
              <a
                href="mailto:dustnrare@gmail.com"
                className="text-[var(--text-muted)] hover:text-[var(--gold)] transition"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <div className="text-[0.65rem] tracking-[0.4em] uppercase font-semibold mb-6 text-[var(--gold)]">
                {title}
              </div>

              <ul className="flex flex-col gap-3">
                {items.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[0.7rem] tracking-wide text-[var(--text-soft)] hover:text-[var(--text)] transition"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 border-t border-[var(--border)]">
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-[var(--text-muted)]">
            © 2026 Dust N Rare. All rights reserved.
          </p>

          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-[var(--text-muted)]">
            <a
              href="http://pixelbytes.online/"
              className="hover:text-[var(--gold)] transition"
            >
              Engineered by Pixelbytes
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
