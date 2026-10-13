import React from "react";
import { Crown, ChevronRight } from "lucide-react";
import PremiumCardSwapHero from "./landing/premium-card";
import Cinema from "./landing/slides";
import NivelSSMA from "./landing/nivel";
import FAQSection from "./landing/faqs";
import ScrollVelocity from "./landing/scroll-velocity";
import AnimatedGridBackground from "./landing/animated-grid";
import AuroraHero from "./landing/aura-hero";
import BorderGlow from "./landing/border-glow";
import BubbleMenuDemo from "./landing/bubble-menu";
import BubbleFillButton from "./landing/bubblefill";
import FluidGlassLens from "./landing/fluid-glass";
import HoverDevCards from "./landing/hover-cards";
import PremiumFolder from "./landing/premium-folder";
import RadarHero2 from "./landing/radar-hero2";
import { TextParallaxContentExample } from "./landing/section";
import TemplateGrid from "./landing/template-grid";
import VariableProximityText from "./landing/variable-proxi";
import TextRevealByWord from "./landing/text-change";
import { Button } from "@/components/ui/button";


export default function Page() {
  return (
    <>
    <BubbleMenuDemo />
      <PremiumCardSwapHero />
       <main className="bg-black py-32">
        <ScrollVelocity
          texts={[
            "NEXT.JS • REACT • TYPESCRIPT •",
            "FRAMER MOTION • TAILWIND •",
          ]}
          velocity={120}
          numCopies={8}
          className="px-4 text-7xl font-black uppercase text-white"
        />
      </main>
      <Cinema />
      <NivelSSMA />
      <FAQSection />
      <AnimatedGridBackground />
      <AuroraHero />
      <BorderGlow />
      <BubbleFillButton text="Twitter" icon={<Crown size={18} />} />
      <FluidGlassLens />
      <HoverDevCards />
      <PremiumFolder />
      <RadarHero2 />
      <TextParallaxContentExample />
      <TemplateGrid />
       <section className="flex min-h-screen items-center justify-center bg-black px-8">
        <VariableProximityText
          text="Build beautiful experiences with React and Next.js"
          radius={220}
          falloff="gaussian"
          className="max-w-5xl text-center text-6xl font-medium text-white"
          fromFontVariationSettings="'wght' 300,'opsz' 14"
          toFontVariationSettings="'wght' 1000,'opsz' 48"
        />
      </section>
    <Button className="cursor-pointer bg-gradient-to-b from-indigo-500 to-indigo-600 shadow-[0px_4px_32px_0_rgba(99,102,241,.70)] px-6 py-3 rounded-xl border-[1px] border-slate-500 text-white font-medium group">
          <div className="relative overflow-hidden">
            <p className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
              Button
            </p>
            <p className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
              Button
            </p>
          </div>
        </Button>

 <div className="my-10 flex justify-center">
        <div className="relative flex items-center justify-center">
          <>
            <div className="absolute inset-0 scale-150 animate-ping rounded-full bg-red-500/40" />
            <div className="absolute inset-0 scale-125 animate-ping rounded-full bg-white/20" />
          </>
          <div className="relative flex size-8 items-center justify-center rounded-full border border-slate-100 bg-white text-[#0c8eb1] shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-transform hover:scale-110">
            <ChevronRight />
          </div>
        </div>
      </div>
 <TextRevealByWord text="Transformamos ideas en experiencias digitales extraordinarias" />
    </>
  );
}
