import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Search, FileText, Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SavedCasesTable } from "@/components/library/SavedCasesTable";
import { CaseDialog } from "@/components/library/CaseDialog";
import { DeleteCaseDialog } from "@/components/library/DeleteCaseDialog";
import { ExternalLinks } from "@/components/library/ExternalLinks";
import type { SavedCase } from "@/components/library/types";
const Library = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savedCases, setSavedCases] = useState<SavedCase[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [caseToDelete, setCaseToDelete] = useState<SavedCase | null>(null);
  const [selectedCase, setSelectedCase] = useState<SavedCase | null>(null);
  const [showCaseDialog, setShowCaseDialog] = useState<boolean>(false);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const {
          data: {
            session
          }
        } = await supabase.auth.getSession();
        if (!session) {
          setIsAuthenticated(false);
          navigate("/login");
          toast.error("Please sign in to access the legal library");
          return;
        }
        setIsAuthenticated(true);
        const {
          data: casesData,
          error: casesError
        } = await supabase.from('saved_cases').select('*').order('updated_at', {
          ascending: false
        });
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
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        navigate("/login");
      } else if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
      }
    });
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
  const handleDeleteCase = async () => {
    if (!caseToDelete) return;
    try {
      const {
        error
      } = await supabase.from('saved_cases').delete().eq('id', caseToDelete.id);
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
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to save cases");
        return;
      }
      const newCase = {
        case_id: `case-${Math.floor(Math.random() * 1000)}`,
        title: `Test Case ${Math.floor(Math.random() * 100)}`,
        court_name: "Supreme Court",
        decision_date: new Date().toISOString().split('T')[0],
        citation: "123 U.S. 456 (2025)",
        user_id: user.id
      };
      const {
        data,
        error
      } = await supabase.from('saved_cases').insert(newCase).select();
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
    return <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your legal library...</span>
      </div>;
  }
  return <div className="min-h-screen flex flex-col">
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
              
              <ExternalLinks />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
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
                {savedCases.length === 0 ? <p className="text-muted-foreground text-center py-6">
                    You haven't saved any cases yet.
                  </p> : <SavedCasesTable savedCases={savedCases} onViewCase={caseItem => {
                setSelectedCase(caseItem);
                setShowCaseDialog(true);
              }} onDeleteCase={caseItem => {
                setCaseToDelete(caseItem);
                setShowDeleteDialog(true);
              }} />}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="border-t bg-muted/50">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full items-center justify-between">
          <p className="text-center text-sm text-muted-foreground">
            @Mak_Designs
          </p>
          <p className="text-center text-sm text-muted-foreground"></p>
        </div>
      </footer>
      
      <DeleteCaseDialog caseToDelete={caseToDelete} open={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirmDelete={handleDeleteCase} />

      <CaseDialog selectedCase={selectedCase} open={showCaseDialog} onOpenChange={setShowCaseDialog} />
    </div>;
};
export default Library;