
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Scale, Search, Shield, Compass } from "lucide-react";
import { useDeviceType } from "@/hooks/use-mobile";

const Index = () => {
  // Mock authentication status
  const isAuthenticated = false;
  const { isMobile, isTablet } = useDeviceType();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background"></div>
          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                  Legal Research Assistant
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-[700px] mx-auto px-4">
                  Enhance your legal research with our NLP legal assistant
                </p>
              </div>
              <div className="flex flex-col xs:flex-row gap-3 w-full justify-center px-4">
                <Button asChild size={isMobile ? "default" : "lg"} className="gap-1 w-full xs:w-auto">
                  <Link to="/research">
                    Start Researching
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size={isMobile ? "default" : "lg"} className="w-full xs:w-auto">
                  <Link to="/login">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-xs sm:text-sm">Features</div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter">
                  Powerful Legal Analysis
                </h2>
                <p className="max-w-[700px] px-4 text-sm sm:text-base md:text-lg text-muted-foreground">
                  Our advanced NLP technology provides comprehensive comparisons between legal frameworks
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12">
              <div className="flex flex-col items-center space-y-3 rounded-lg border p-4 sm:p-6 bg-card text-card-foreground">
                <div className="rounded-full border p-3 sm:p-4 text-primary border-primary/20">
                  <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="space-y-1 sm:space-y-2 text-center">
                  <h3 className="font-bold text-sm sm:text-base">NLP Powered Research</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Natural language processing technology to analyze legal concepts
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border p-4 sm:p-6 bg-card text-card-foreground">
                <div className="rounded-full border p-3 sm:p-4 text-primary border-primary/20">
                  <Scale className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="space-y-1 sm:space-y-2 text-center">
                  <h3 className="font-bold text-sm sm:text-base">Legal Comparison</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Side-by-side analysis of common law and contract law principles
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border p-4 sm:p-6 bg-card text-card-foreground sm:col-span-2 md:col-span-1">
                <div className="rounded-full border p-3 sm:p-4 text-primary border-primary/20">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="space-y-1 sm:space-y-2 text-center">
                  <h3 className="font-bold text-sm sm:text-base">Secure Authentication</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Protect your legal research with secure user accounts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter">
                  Start Your Legal Research
                </h2>
                <p className="max-w-[700px] text-sm sm:text-base md:text-lg text-muted-foreground px-4">
                  Sign up today and access powerful legal tools
                </p>
              </div>
              <div className="flex flex-col xs:flex-row gap-3 w-full justify-center px-4">
                <Button asChild size={isMobile ? "default" : "lg"} className="w-full xs:w-auto">
                  <Link to="/login">Create Account</Link>
                </Button>
                <Button asChild variant="outline" size={isMobile ? "default" : "lg"} className="w-full xs:w-auto">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
