
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ComparisonTool from "@/components/comparison/ComparisonTool";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { ExternalLink, Scale, Loader2, BookOpen, Search, Book, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Research = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialQuery, setInitialQuery] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  
  useEffect(() => {
    if (location.state && location.state.initialQuery) {
      setInitialQuery(location.state.initialQuery);
    }
    
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAuthenticated(false);
          navigate("/login");
          toast.error("Please sign in to access research tools");
          return;
        }
        
        setIsAuthenticated(true);
        
        // Fetch recent searches
        const { data: searches, error } = await supabase
          .from('search_history')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (error) {
          console.error("Failed to fetch recent searches:", error);
        } else {
          setRecentSearches(searches || []);
        }
        
      } catch (error) {
        console.error("Authentication check failed:", error);
        navigate("/login");
        toast.error("Authentication error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          navigate("/login");
        } else if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      navigate("/");
      toast.success("You have been logged out");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleSearchClick = (query: string) => {
    setInitialQuery(query);
    // This will trigger the useEffect in ComparisonTool
    setTimeout(() => setInitialQuery(null), 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying authentication...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Scale className="h-8 w-8 mr-2 text-primary" />
                Legal Research Assistant
              </h1>
              <p className="text-muted-foreground mt-1">
                Research and compare legal principles across multiple domains
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/library")}>
                <BookOpen className="h-4 w-4 mr-1" />
                Your Library
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://www.law.cornell.edu/" target="_blank" rel="noreferrer" className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Cornell Law
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://www.courtlistener.com/" target="_blank" rel="noreferrer" className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  Court Listener
                </a>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-muted/50 md:col-span-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Enhanced Legal Database</h3>
                    <p className="text-muted-foreground">
                      Our system analyzes your queries using a comprehensive database of real legal precedents, statutes, and principles across multiple domains.
                    </p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-background rounded-lg p-3 border">
                        <h4 className="font-medium flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-primary" />
                          Leading Case Law
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Access landmark decisions from state and federal courts
                        </p>
                      </div>
                      <div className="bg-background rounded-lg p-3 border">
                        <h4 className="font-medium flex items-center">
                          <Book className="h-4 w-4 mr-2 text-primary" />
                          Statutory Research
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Find relevant statutes and regulations across jurisdictions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium flex items-center mb-3">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  Recent Searches
                </h3>
                
                {recentSearches.length > 0 ? (
                  <ul className="space-y-2">
                    {recentSearches.map((search) => (
                      <li key={search.id} className="text-sm">
                        <Button 
                          variant="ghost" 
                          className="h-auto py-1 px-2 w-full justify-start text-left font-normal"
                          onClick={() => handleSearchClick(search.query)}
                        >
                          <Search className="h-3 w-3 mr-2 text-muted-foreground" />
                          <span className="truncate">{search.query}</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Your recent search history will appear here
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <ComparisonTool initialQuery={initialQuery} />
          
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium">Legal Research Domains</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our database covers these major legal domains with real case law and statutes:
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain</TableHead>
                    <TableHead>Key Topics</TableHead>
                    <TableHead className="hidden md:table-cell">Example Cases</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Property Law</TableCell>
                    <TableCell>Real property, adverse possession, easements, fixtures</TableCell>
                    <TableCell className="hidden md:table-cell">Pierson v. Post, Kelo v. City of New London</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Contract Law</TableCell>
                    <TableCell>Agreements, consideration, performance, remedies</TableCell>
                    <TableCell className="hidden md:table-cell">Carlill v. Carbolic Smoke Ball Co., Hadley v. Baxendale</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tort Law</TableCell>
                    <TableCell>Negligence, liability, damages, causation</TableCell>
                    <TableCell className="hidden md:table-cell">Palsgraf v. Long Island Railroad Co., MacPherson v. Buick</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Constitutional Law</TableCell>
                    <TableCell>Rights, powers, federalism, due process</TableCell>
                    <TableCell className="hidden md:table-cell">Marbury v. Madison, Brown v. Board of Education</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Criminal Law</TableCell>
                    <TableCell>Mens rea, search and seizure, evidence</TableCell>
                    <TableCell className="hidden md:table-cell">Miranda v. Arizona, Gideon v. Wainwright</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="border-t bg-muted/50">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full items-center justify-between">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 LegalAssist. All rights reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            For educational purposes only. Not legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Research;
