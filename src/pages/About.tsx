
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/about/HeroSection";
import MissionSection from "@/components/about/MissionSection";
import LegalDatabaseSection from "@/components/about/LegalDatabaseSection";
import LegalResearchDomainsSection from "@/components/about/LegalResearchDomainsSection";
import ContactSection from "@/components/about/ContactSection";

const About = () => {
  // Mock authentication status
  const isAuthenticated = false;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />
      
      <main className="flex-1">
        <HeroSection />
        <MissionSection />
        <LegalDatabaseSection />
        <LegalResearchDomainsSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
