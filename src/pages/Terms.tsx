
import React from "react";
import Navbar from "@/components/layout/Navbar";
import { FileText, BookOpen, ShieldCheck, AlertTriangle } from "lucide-react";

const Terms = () => {
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
                  Terms of Service
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-[700px] mx-auto">
                  Please read these terms carefully before using LegalAssist
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
                  <FileText className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">Agreement to Terms</h2>
                </div>
                <p className="text-muted-foreground">
                  These Terms of Service constitute a legally binding agreement made between you and LegalAssist, concerning your access to and use of our website and legal research platform. By accessing or using LegalAssist, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">Intellectual Property</h2>
                </div>
                <p className="text-muted-foreground">
                  The Service and its original content, features, and functionality are and will remain the exclusive property of LegalAssist and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of LegalAssist.
                </p>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">User Content</h3>
                  <p className="text-muted-foreground">
                    You retain any and all of your rights to any content you submit, post or display on or through the Service and you are responsible for protecting those rights. We take no responsibility and assume no liability for content you or any third party posts on or through the Service.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">Accounts</h2>
                </div>
                <p className="text-muted-foreground">
                  When you create an account with us, you must provide accurate, complete, and current information at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </p>
                <p className="text-muted-foreground">
                  You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">Disclaimer</h2>
                </div>
                <p className="text-muted-foreground">
                  Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
                </p>
                <p className="text-muted-foreground">
                  LegalAssist, its subsidiaries, affiliates, and its licensors do not warrant that:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                  <li>The Service will function uninterrupted, secure or available at any particular time or location</li>
                  <li>Any errors or defects will be corrected</li>
                  <li>The Service is free of viruses or other harmful components</li>
                  <li>The results of using the Service will meet your requirements</li>
                </ul>
                <p className="text-muted-foreground font-semibold">
                  Legal Disclaimer: The information provided on LegalAssist is not legal advice, and no attorney-client relationship is formed. The information is provided for educational and informational purposes only.
                </p>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  In no event shall LegalAssist, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                  <li>Your access to or use of or inability to access or use the Service</li>
                  <li>Any conduct or content of any third party on the Service</li>
                  <li>Any content obtained from the Service</li>
                  <li>Unauthorized access, use or alteration of your transmissions or content</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Changes</h2>
                <p className="text-muted-foreground">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
                <p className="text-muted-foreground">
                  By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
                </p>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms, please contact us at:
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

export default Terms;
