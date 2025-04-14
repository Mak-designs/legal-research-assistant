
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { Mail, Lock, User, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AuthFormProps {
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  
  // Register form state
  const [registerName, setRegisterName] = useState<string>("");
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  
  // Reset password state
  const [isResetDialogOpen, setIsResetDialogOpen] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [isResetLoading, setIsResetLoading] = useState<boolean>(false);
  const [resetSent, setResetSent] = useState<boolean>(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (error) {
        throw error;
      }
      
      // Show success message
      toast.success("Login successful!");
      
      // Redirect to research page or call onSuccess callback
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/research");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            first_name: registerName.split(' ')[0],
            last_name: registerName.split(' ').slice(1).join(' '),
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Show success message
      if (data.user?.identities?.length === 0) {
        toast.error("Email already registered. Please log in instead.");
        
        // Switch to login tab programmatically
        const loginTab = document.getElementById("login-tab") as HTMLButtonElement;
        if (loginTab) loginTab.click();
      } else {
        toast.success("Registration successful! Please verify your email to log in.");
      }
      
      // Clear register form
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/login`,
      });
      
      if (error) {
        throw error;
      }
      
      setResetSent(true);
      toast.success("Password reset link sent! Check your email.");
      
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "Failed to send reset link. Please try again.");
    } finally {
      setIsResetLoading(false);
    }
  };
  
  const closeResetDialog = () => {
    setIsResetDialogOpen(false);
    setResetEmail("");
    setResetSent(false);
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto shadow-lg border-primary/10">
        <Tabs defaultValue="login">
          <CardHeader className="pb-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger id="login-tab" value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="pt-4">
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Email"
                        type="email"
                        required
                        className="pl-10"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Password"
                        type="password"
                        required
                        className="pl-10"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <button 
                      type="button" 
                      onClick={() => setIsResetDialogOpen(true)}
                      className="text-sm text-primary hover:underline" 
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Full Name"
                        required
                        className="pl-10"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Email"
                        type="email"
                        required
                        className="pl-10"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Password"
                        type="password"
                        required
                        className="pl-10"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </CardContent>
          <CardFooter className="px-6 pb-6 pt-0 flex justify-center text-sm text-muted-foreground">
            Protected by LegalAssist Research Tool
          </CardFooter>
        </Tabs>
      </Card>
      
      {/* Password Reset Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              Reset Password
            </DialogTitle>
            <DialogDescription>
              {!resetSent 
                ? "Enter your email address and we'll send you a link to reset your password."
                : "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder."}
            </DialogDescription>
          </DialogHeader>
          
          {!resetSent ? (
            <form onSubmit={handleResetPasswordRequest} className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Email address"
                    type="email"
                    required
                    className="pl-10"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    disabled={isResetLoading}
                  />
                </div>
              </div>
              
              <DialogFooter className="sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeResetDialog}
                  disabled={isResetLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isResetLoading}>
                  {isResetLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <div className="py-6">
              <Button 
                className="w-full" 
                onClick={closeResetDialog}
              >
                Back to Login
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthForm;
