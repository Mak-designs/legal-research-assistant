
import React from "react";

const HeroSection = () => {
  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
              About LegalAssist
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-[700px] mx-auto">
              Transforming legal research with advanced technology
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
