
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Scale, Menu, Home, Search, LogIn, LogOut, BookOpen, Info } from "lucide-react";

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isAuthenticated = false,
  onLogout
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsOpen(false);
  };

  const navItems = [
    {
      name: "Home",
      href: "/",
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
      name: "About",
      href: "/about",
      icon: <Info className="h-5 w-5 mr-2" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <Scale className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">LegalAssist</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems
            .filter(item => !item.requiresAuth || isAuthenticated)
            .map(item => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          
          {isAuthenticated ? (
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button asChild>
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
          )}
        </nav>

        {/* Mobile navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 py-4">
              {navItems
                .filter(item => !item.requiresAuth || isAuthenticated)
                .map(item => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center text-sm font-medium py-2 hover:text-primary transition-colors"
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
                <Button asChild className="mt-4">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
