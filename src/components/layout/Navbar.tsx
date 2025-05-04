
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Scale, 
  Menu, 
  Home, 
  Search, 
  LogIn, 
  LogOut, 
  BookOpen, 
  Info, 
  FileText, 
  Shield,
  FileDigit
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isAuthenticated = false,
  onLogout
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Check if current route is about, privacy, or terms
  const isInfoPage = ['/about', '/privacy', '/terms'].includes(location.pathname);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsOpen(false);
  };

  const navItems = [
    {
      name: "Home",
      href: isAuthenticated ? "/research" : "/", // Home redirects to research for authenticated users
      icon: <Home className="h-5 w-5 mr-2" />,
    },
    {
      name: "Research Tool",
      href: "/research",
      icon: <Search className="h-5 w-5 mr-2" />,
      requiresAuth: true,
    },
    {
      name: "Legal Library",
      href: "/library",
      icon: <BookOpen className="h-5 w-5 mr-2" />,
      requiresAuth: true,
    },
    {
      name: "Document Manager",
      href: "/documents",
      icon: <FileDigit className="h-5 w-5 mr-2" />,
      requiresAuth: true,
    },
    {
      name: "About",
      href: "/about",
      icon: <Info className="h-5 w-5 mr-2" />,
    },
    {
      name: "Privacy",
      href: "/privacy",
      icon: <Shield className="h-5 w-5 mr-2" />,
    },
    {
      name: "Terms",
      href: "/terms",
      icon: <FileText className="h-5 w-5 mr-2" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-14 sm:h-16 items-center justify-between py-2 sm:py-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <Link to={isAuthenticated ? "/research" : "/"} className="flex items-center space-x-1 sm:space-x-2">
            <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="text-base sm:text-xl font-bold">LegalAssist</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {navItems
            .filter(item => !item.requiresAuth || isAuthenticated)
            .filter((_, index) => !isMobile || index < 3) // Limit items on smaller screens
            .map(item => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium hover:text-primary transition-colors ${
                  location.pathname === item.href ? "text-primary font-semibold" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          
          {isAuthenticated ? (
            <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1 sm:mr-2" />
              <span className={isMobile ? "sr-only" : ""}>Logout</span>
            </Button>
          ) : (
            !isInfoPage && (
              <Button size={isMobile ? "sm" : "default"} asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className={isMobile ? "sr-only" : ""}>Sign In</span>
                </Link>
              </Button>
            )
          )}
        </nav>

        {/* Mobile navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-3/4 max-w-xs">
            <div className="flex flex-col gap-4 py-4">
              {navItems
                .filter(item => !item.requiresAuth || isAuthenticated)
                .map(item => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center text-sm font-medium py-2 hover:text-primary transition-colors ${
                      location.pathname === item.href ? "text-primary font-semibold" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              
              {isAuthenticated ? (
                <Button variant="outline" onClick={handleLogout} className="mt-4">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                !isInfoPage && (
                  <Button asChild className="mt-4">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                )
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
