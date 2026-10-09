import React from 'react';
import PremiumCardSwapHero from "./landing/premium-card";
import Cinema from "./landing/slides";
import NivelSSMA from "./landing/nivel";
import FAQSection from "./landing/faqs";

export default function Page() {
  return (
    <>
     <PremiumCardSwapHero />
     <Cinema />
      <NivelSSMA />
       <FAQSection />
    </>
      );
}