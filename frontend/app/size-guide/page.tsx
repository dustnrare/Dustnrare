import { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Size Guide — DUST·N·RARE',
  description: 'Find your perfect fit with our detailed size guide.',
}

export default function SizeGuidePage() {
  return (
    <>
      <section className="pt-32 pb-16 px-8 bg-[var(--beige)]">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="section-label">Measurements</div>
          <h1 className="font-serif text-4xl md:text-6xl font-normal text-[var(--text)] mt-4">
            Size <em className="italic text-[var(--gold)]">Guide</em>
          </h1>
          <p className="text-[0.7rem] leading-loose text-[var(--mid)] mt-6 max-w-[500px] mx-auto">
            Our garments feature a signature relaxed, slightly oversized fit. If you prefer a more tailored look, we recommend sizing down.
          </p>
        </div>
      </section>

      <section className="py-20 px-8 bg-[var(--offwhite)]">
        <div className="max-w-[800px] mx-auto space-y-16">
          
          {/* Men Tops */}
          <div>
            <h2 className="font-serif text-2xl text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="text-[var(--gold)]">⟡</span> Tops & Jackets (Unisex)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="py-4 text-[0.6rem] tracking-widest uppercase font-semibold text-[var(--mid)]">Size</th>
                    <th className="py-4 text-[0.6rem] tracking-widest uppercase font-semibold text-[var(--mid)]">Chest (in)</th>
                    <th className="py-4 text-[0.6rem] tracking-widest uppercase font-semibold text-[var(--mid)]">Length (in)</th>
                    <th className="py-4 text-[0.6rem] tracking-widest uppercase font-semibold text-[var(--mid)]">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody className="text-[0.75rem] text-[var(--text)]">
                  <tr className="border-b border-[var(--border)]/50">
                    <td className="py-4 font-medium">S</td>
                    <td className="py-4 text-[var(--mid)]">40 - 42</td>
                    <td className="py-4 text-[var(--mid)]">28</td>
                    <td className="py-4 text-[var(--mid)]">19</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]/50">
                    <td className="py-4 font-medium">M</td>
                    <td className="py-4 text-[var(--mid)]">42 - 44</td>
                    <td className="py-4 text-[var(--mid)]">29</td>
                    <td className="py-4 text-[var(--mid)]">20</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]/50">
                    <td className="py-4 font-medium">L</td>
                    <td className="py-4 text-[var(--mid)]">44 - 46</td>
                    <td className="py-4 text-[var(--mid)]">30</td>
                    <td className="py-4 text-[var(--mid)]">21</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]/50">
                    <td className="py-4 font-medium">XL</td>
                    <td className="py-4 text-[var(--mid)]">46 - 48</td>
                    <td className="py-4 text-[var(--mid)]">31</td>
                    <td className="py-4 text-[var(--mid)]">22</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottoms */}
          <div>
            <h2 className="font-serif text-2xl text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="text-[var(--gold)]">◈</span> Bottoms & Trousers
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="py-4 text-[0.6rem] tracking-widest uppercase font-semibold text-[var(--mid)]">Size</th>
                    <th className="py-4 text-[0.6rem] tracking-widest uppercase font-semibold text-[var(--mid)]">Waist (in)</th>
                    <th className="py-4 text-[0.6rem] tracking-widest uppercase font-semibold text-[var(--mid)]">Inseam (in)</th>
                  </tr>
                </thead>
                <tbody className="text-[0.75rem] text-[var(--text)]">
                  <tr className="border-b border-[var(--border)]/50">
                    <td className="py-4 font-medium">S (28-30)</td>
                    <td className="py-4 text-[var(--mid)]">28 - 30</td>
                    <td className="py-4 text-[var(--mid)]">29</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]/50">
                    <td className="py-4 font-medium">M (32-34)</td>
                    <td className="py-4 text-[var(--mid)]">32 - 34</td>
                    <td className="py-4 text-[var(--mid)]">30</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]/50">
                    <td className="py-4 font-medium">L (36-38)</td>
                    <td className="py-4 text-[var(--mid)]">36 - 38</td>
                    <td className="py-4 text-[var(--mid)]">31</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--border)] text-center">
            <p className="text-[0.65rem] leading-loose text-[var(--mid)]">
              Still unsure? DM us on Instagram at <a href="https://instagram.com/dustnrare.in" target="_blank" rel="noreferrer" className="text-[var(--gold)] transition-colors hover:text-[var(--text)]">@dustnrare.in</a> for personalized sizing advice.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </>
  )
}
