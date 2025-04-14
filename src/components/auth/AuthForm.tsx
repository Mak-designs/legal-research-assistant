
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import PasswordResetDialog from "./PasswordResetDialog";

interface AuthFormProps {
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState<boolean>(false);

  const handleLoginTabClick = () => {
    const loginTab = document.getElementById("login-tab") as HTMLButtonElement;
    if (loginTab) loginTab.click();
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
              <LoginForm 
                onSuccess={onSuccess} 
                onForgotPassword={() => setIsResetDialogOpen(true)} 
              />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm onSuccess={handleLoginTabClick} />
            </TabsContent>
          </CardContent>
          <CardFooter className="px-6 pb-6 pt-0 flex justify-center text-sm text-muted-foreground">
            Protected by LegalAssist Research Tool
          </CardFooter>
        </Tabs>
      </Card>
      
      <PasswordResetDialog 
        isOpen={isResetDialogOpen} 
        onOpenChange={setIsResetDialogOpen} 
      />
    </>
  );
};

export default AuthForm;
