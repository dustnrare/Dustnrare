import Hero from "@/components/home/Hero";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import BrandIdentity from "@/components/home/BrandIdentity";
import CategoryGrid from "@/components/home/CategoryGrid";
import DropCountdown from "@/components/home/DropCountdown";
import Reviews from "@/components/home/Reviews";
import BrandShowcase from "@/components/home/BrandShowcase";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <FeaturedCollection />
      <BrandIdentity />
      <CategoryGrid />
      {/* <DropCountdown targetDate="2025-06-01T00:00:00" /> */}
      <Reviews />
      <BrandShowcase />
      <Footer />
    </>
  );
}
