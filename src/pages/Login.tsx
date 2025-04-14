
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import AuthForm from "@/components/auth/AuthForm";
import { Scale } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  
  const handleAuthSuccess = () => {
    navigate("/research");
  };

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
          
          <AuthForm onSuccess={handleAuthSuccess} />
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
