
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import AuthForm from "@/components/auth/AuthForm";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { Scale, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [passwordResetToken, setPasswordResetToken] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // User is already logged in, redirect to research page
          navigate("/research");
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Handle hash fragments for password reset flow
    if (location.hash) {
      if (location.hash.includes("error=") && location.hash.includes("error_description=")) {
        // Handle error in reset password flow
        const errorDescription = decodeURIComponent(
          location.hash.split("error_description=")[1].split("&")[0].replace(/\+/g, " ")
        );
        toast.error(errorDescription || "Password reset link is invalid or has expired");
      } else if (location.hash.includes("access_token=") && location.hash.includes("type=recovery")) {
        // Extract the access token for password reset
        const accessToken = location.hash.split("access_token=")[1].split("&")[0];
        setPasswordResetToken(accessToken);
        toast.info("Please set your new password");
      }
      
      // Clear the hash fragment
      window.history.replaceState(null, "", location.pathname);
    }
  }, [navigate, location]);
  
  const handleAuthSuccess = () => {
    navigate("/research");
  };

  const handlePasswordUpdateSuccess = () => {
    setPasswordResetToken(null);
    toast.success("Password updated successfully. Please log in with your new password.");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-md px-4 mb-8">
          <div className="flex flex-col items-center space-y-2 text-center mb-8">
            <Scale className="h-12 w-12 text-primary" />
            <h1 className="text-3xl font-bold">Welcome to LegalAssist</h1>
            <p className="text-muted-foreground">
              Sign in to access advanced legal research tools
            </p>
          </div>
          
          {passwordResetToken ? (
            <NewPasswordForm 
              accessToken={passwordResetToken} 
              onSuccess={handlePasswordUpdateSuccess}
              onCancel={() => setPasswordResetToken(null)}
            />
          ) : (
            <AuthForm onSuccess={handleAuthSuccess} />
          )}
        </div>
      </main>
      
      <footer className="border-t">
        <div className="container flex flex-col sm:flex-row py-6 w-full items-center justify-between">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 LegalAssist. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
