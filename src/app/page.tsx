"use client";

import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import Squares from "@/components/ui/Squares";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme } = useTheme();

  // Theme-aware colors for Squares
  const getSquaresColors = () => {
    if (theme === "dark") {
      return {
        borderColor: "rgba(255, 255, 255, 0.2)",
        hoverFillColor: "rgba(255, 255, 255, 0.1)"
      };
    } else {
      return {
        borderColor: "rgba(0, 0, 0, 0.1)",
        hoverFillColor: "rgba(0, 0, 0, 0.03)"
      };
    }
  };

  const squaresColors = getSquaresColors();

  return (
    <main className="min-h-screen relative bg-background">
      {/* Squares Background */}
      <div className="fixed inset-0 z-0 bg-background">
        <Squares
          speed={0.3}
          squareSize={90}
          direction="diagonal"
          borderColor={squaresColors.borderColor}
          hoverFillColor={squaresColors.hoverFillColor}
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
