
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BookOpen, Search, FileText, Scale, Loader2, ExternalLink, GraduationCap, Save, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type SavedCase = {
  id: string;
  title: string;
  court_name: string | null;
  decision_date: string | null;
  case_id: string;
  citation: string | null;
};

type CaseToDelete = SavedCase | null;

const Library = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [savedCases, setSavedCases] = useState<SavedCase[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [caseToDelete, setCaseToDelete] = useState<CaseToDelete>(null);
  
  useEffect(() => {
    // Check if user is authenticated via Supabase
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // User is not authenticated, redirect to login
          setIsAuthenticated(false);
          navigate("/login");
          toast.error("Please sign in to access the legal library");
          return;
        }
        
        // User is authenticated
        setIsAuthenticated(true);
        
        // Fetch user's search history
        const { data: historyData, error: historyError } = await supabase
          .from('search_history')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (historyError) throw historyError;
        setSearchHistory(historyData || []);
        
        // Fetch user's saved cases
        const { data: casesData, error: casesError } = await supabase
          .from('saved_cases')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (casesError) throw casesError;
        setSavedCases(casesData || []);
        
      } catch (error) {
        console.error("Authentication or data fetch error:", error);
        toast.error("Failed to load your legal library data");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
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
  }, [navigate]);
  
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
  
  const handleRepeatSearch = (query: string) => {
    navigate("/research", { state: { initialQuery: query } });
  };

  const handleDeleteCase = async () => {
    if (!caseToDelete) return;
    
    try {
      const { error } = await supabase
        .from('saved_cases')
        .delete()
        .eq('id', caseToDelete.id);
      
      if (error) throw error;
      
      setSavedCases(savedCases.filter(caseItem => caseItem.id !== caseToDelete.id));
      toast.success("Case deleted successfully");
    } catch (error) {
      console.error("Error deleting case:", error);
      toast.error("Failed to delete case");
    } finally {
      setShowDeleteDialog(false);
      setCaseToDelete(null);
    }
  };

  const handleSaveCase = async () => {
    // This functionality simulates adding a test case since we don't have a real case search yet
    try {
      const newCase = {
        case_id: `case-${Math.floor(Math.random() * 1000)}`,
        title: `Test Case ${Math.floor(Math.random() * 100)}`,
        court_name: "Supreme Court",
        decision_date: new Date().toISOString().split('T')[0],
        citation: "123 U.S. 456 (2025)"
      };
      
      const { data, error } = await supabase
        .from('saved_cases')
        .insert(newCase)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setSavedCases([...savedCases, data[0]]);
        toast.success("Case saved to your library");
      }
    } catch (error) {
      console.error("Error saving case:", error);
      toast.error("Failed to save case to your library");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your legal library...</span>
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
                <BookOpen className="h-8 w-8 mr-2 text-primary" />
                Legal Library
              </h1>
              <p className="text-muted-foreground mt-1">
                Your personal collection of legal research and saved cases
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate("/research")} className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                New Research
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Searches Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-primary" />
                  Recent Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                {searchHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-6">
                    You haven't performed any searches yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {searchHistory.map((item) => (
                      <div key={item.id} className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">{item.query}</p>
                          <Badge>{item.results_count} results</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handleRepeatSearch(item.query)}
                        >
                          <Search className="h-3 w-3 mr-1" />
                          Search Again
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Saved Cases Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Saved Cases
                </CardTitle>
                <Button size="sm" onClick={handleSaveCase} className="flex items-center">
                  <Save className="h-4 w-4 mr-1" />
                  Save Test Case
                </Button>
              </CardHeader>
              <CardContent>
                {savedCases.length === 0 ? (
                  <p className="text-muted-foreground text-center py-6">
                    You haven't saved any cases yet.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Case</TableHead>
                        <TableHead>Court</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {savedCases.map((caseItem) => (
                        <TableRow key={caseItem.id}>
                          <TableCell className="font-medium">{caseItem.title}</TableCell>
                          <TableCell>{caseItem.court_name}</TableCell>
                          <TableCell>{caseItem.decision_date && new Date(caseItem.decision_date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive"
                              onClick={() => {
                                setCaseToDelete(caseItem);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete case</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
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
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Case</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{caseToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCase} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Library;
