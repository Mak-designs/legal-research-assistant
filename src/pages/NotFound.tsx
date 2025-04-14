
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="container max-w-md text-center px-4">
          <div className="rounded-full bg-muted p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/" className="flex items-center justify-center">
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </Link>
          </Button>
        </div>
      </main>
      
      <footer className="border-t">
        <div className="container py-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 LegalAssist. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
