import React from "react";
import Hero from "./hero";
import Features from "./features";
import SmartLinkSection from "./smart-link";
import Faq from "./faqs";
import TrafficAnalyticsSection from "./traffic-analytics";
import Customize from "./customize";
import AnimatedBannerTailwind from "./info-strip";
import HeroSlider from "../../../components/slider/template-slider";
import DigitalCardSlider from "../../../components/slider/digital-card-slider";

const WebLinqoLanding = () => {
  return (
    <div className="min-h-screen bg-offWhite ">
      {/* blue strip */}
      <AnimatedBannerTailwind />

      {/* Hero Section */}
      <Hero />

      {/* customize */}
      <Customize />

      {/* Feature */}
      <Features />

      {/* Templates */}
      <div id="templates">
        <HeroSlider />
      </div>

      <DigitalCardSlider />

      {/* Traffic Analytics */}
      <TrafficAnalyticsSection />

      {/* FAQs */}
      <Faq />

      {/* Pricing */}
      <div id="pricing">
        <PricingPlans />
      </div>

      {/* Smart link */}
      <SmartLinkSection />
    </div>
  );
};
export default WebLinqoLanding;
