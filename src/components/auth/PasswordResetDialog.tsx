
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PasswordResetDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PasswordResetDialog: React.FC<PasswordResetDialogProps> = ({ 
  isOpen, 
  onOpenChange 
}) => {
  const [resetEmail, setResetEmail] = useState<string>("");
  const [isResetLoading, setIsResetLoading] = useState<boolean>(false);
  const [resetSent, setResetSent] = useState<boolean>(false);

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
    onOpenChange(false);
    setResetEmail("");
    setResetSent(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  );
};

export default PasswordResetDialog;
