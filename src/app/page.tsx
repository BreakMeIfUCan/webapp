import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import Squares from "@/components/ui/Squares";

export default function Home() {
  return (
    <main className="min-h-screen relative bg-white">
      {/* Squares Background */}
      <div className="fixed inset-0 z-0 bg-white">
        <Squares
          speed={0.3}
          squareSize={90}
          direction="diagonal"
          borderColor="rgba(0, 0, 0, 0.08)"
          hoverFillColor="rgba(0, 0, 0, 0.03)"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
      </div>
    </main>
  );
}
