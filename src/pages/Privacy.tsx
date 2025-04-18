
import React from "react";
import Navbar from "@/components/layout/Navbar";
import { Shield, Lock, Eye, FileCheck } from "lucide-react";

const Privacy = () => {
  // Mock authentication status
  const isAuthenticated = false;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                  Privacy Policy
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-[700px] mx-auto">
                  How we protect your information at LegalAssist
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Last Updated Section */}
        <section className="py-8">
          <div className="container px-4 md:px-6">
            <div className="flex justify-center">
              <div className="text-muted-foreground text-sm">
                Last Updated: April 15, 2025
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-8 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">Introduction</h2>
                </div>
                <p className="text-muted-foreground">
                  At LegalAssist, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our legal research platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>
                <p className="text-muted-foreground">
                  We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FileCheck className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">Information We Collect</h2>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Personal Data</h3>
                  <p className="text-muted-foreground">
                    Personally identifiable information, such as your name, email address, and other contact details that you voluntarily give to us when you register with the site or when you choose to participate in various activities related to the site.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Derivative Data</h3>
                  <p className="text-muted-foreground">
                    Information our servers automatically collect when you access the site, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the site.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Research Data</h3>
                  <p className="text-muted-foreground">
                    When you use our legal research tools, we may collect information about your research queries, usage patterns, and preferences to improve our services and provide personalized research experiences.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Eye className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">How We Use Your Information</h2>
                </div>
                <p className="text-muted-foreground">
                  We may use the information we collect about you for various purposes, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                  <li>Creating and managing your account</li>
                  <li>Providing and delivering the services you request</li>
                  <li>Processing transactions and sending related information</li>
                  <li>Sending administrative information</li>
                  <li>Personalizing your experience on our platform</li>
                  <li>Improving our website and services</li>
                  <li>Monitoring and analyzing usage and trends</li>
                  <li>Detecting, preventing, and addressing technical issues</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Lock className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">Security of Your Information</h2>
                </div>
                <p className="text-muted-foreground">
                  We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>
                <p className="text-muted-foreground">
                  We implement a variety of security measures, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                  <li>Using secure server infrastructure</li>
                  <li>Encrypting sensitive data transmission</li>
                  <li>Performing regular security assessments</li>
                  <li>Enforcing strict access controls</li>
                  <li>Conducting employee security training</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions or concerns about this Privacy Policy, please contact us at:
                </p>
                <div className="not-prose bg-muted p-4 rounded-lg">
                  <p>Email: <a href="mailto:makumbachinyimba@gmail.com">makumbachinyimba@gmail.com</a></p>
                  <p>Phone: 0975838560</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t bg-muted/50">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full items-center justify-between">
          <p className="text-center text-sm text-muted-foreground">
            @Mak_Designs
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <a href="/about" className="hover:underline underline-offset-4">
              About
            </a>
            <a href="/privacy" className="hover:underline underline-offset-4">
              Privacy
            </a>
            <a href="/terms" className="hover:underline underline-offset-4">
              Terms
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
