
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { ArrowRight, Scale, Search, Shield, Compass } from "lucide-react";

const Index = () => {
  // Mock authentication status
  const isAuthenticated = false;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background"></div>
          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                  Legal Research Assistant
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-[700px] mx-auto">
                  Compare common law and contract law principles with advanced NLP technology
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-2">
                <Button asChild size="lg" className="gap-1">
                  <Link to="/research">
                    Start Researching
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Powerful Legal Analysis
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Our advanced NLP technology provides comprehensive comparisons between legal frameworks
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 bg-card text-card-foreground">
                <div className="rounded-full border p-4 text-primary border-primary/20">
                  <Search className="h-6 w-6" />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="font-bold">NLP Powered Research</h3>
                  <p className="text-sm text-muted-foreground">
                    Natural language processing technology to analyze and compare legal concepts
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 bg-card text-card-foreground">
                <div className="rounded-full border p-4 text-primary border-primary/20">
                  <Scale className="h-6 w-6" />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="font-bold">Legal Comparison</h3>
                  <p className="text-sm text-muted-foreground">
                    Side-by-side analysis of common law and contract law principles
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 bg-card text-card-foreground">
                <div className="rounded-full border p-4 text-primary border-primary/20">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="font-bold">Secure Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Protect your legal research with secure user accounts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Start Your Legal Research
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Sign up today and access powerful legal comparison tools
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link to="/login">Create Account</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t bg-muted/50">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full items-center justify-between">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 LegalAssist. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/about" className="hover:underline underline-offset-4">
              About
            </Link>
            <Link to="#" className="hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link to="#" className="hover:underline underline-offset-4">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Index;
