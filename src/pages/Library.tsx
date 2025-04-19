import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { BookOpen, Search, FileText, Scale, Loader2, ExternalLink, GraduationCap, Save, Trash, FileDigit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type SavedCase = {
  id: string;
  title: string;
  court_name: string | null;
  decision_date: string | null;
  case_id: string;
  citation: string | null;
  notes: string | null;
};

type CaseToDelete = SavedCase | null;

const Library = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savedCases, setSavedCases] = useState<SavedCase[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [caseToDelete, setCaseToDelete] = useState<CaseToDelete>(null);
  const [selectedCase, setSelectedCase] = useState<SavedCase | null>(null);
  const [showCaseDialog, setShowCaseDialog] = useState<boolean>(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAuthenticated(false);
          navigate("/login");
          toast.error("Please sign in to access the legal library");
          return;
        }
        
        setIsAuthenticated(true);
        
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
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

  const handleViewCase = (caseItem: SavedCase) => {
    setSelectedCase(caseItem);
    setShowCaseDialog(true);
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
              
              <Button variant="outline" size="sm" asChild>
                <a href="https://zambialii.org/" target="_blank" rel="noreferrer" className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Zambian Law
                </a>
              </Button>
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
                        <TableHead>Type</TableHead>
                        <TableHead className="w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {savedCases.map((caseItem) => (
                        <TableRow key={caseItem.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewCase(caseItem)}>
                          <TableCell className="font-medium">{caseItem.title}</TableCell>
                          <TableCell>{caseItem.court_name}</TableCell>
                          <TableCell>{caseItem.decision_date && new Date(caseItem.decision_date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {caseItem.notes?.includes('technicalDetails') ? (
                              <div className="flex items-center text-green-600">
                                <FileDigit className="h-4 w-4 mr-1" />
                                Digital
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-1" />
                                Standard
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
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
            @Mak_Designs
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

      <Dialog open={showCaseDialog} onOpenChange={setShowCaseDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCase?.title}</DialogTitle>
            <DialogDescription>
              {selectedCase?.citation && (
                <p className="mt-2">Citation: {selectedCase.citation}</p>
              )}
              {selectedCase?.court_name && (
                <p>Court: {selectedCase.court_name}</p>
              )}
              {selectedCase?.decision_date && (
                <p>Date: {new Date(selectedCase.decision_date).toLocaleDateString()}</p>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            {selectedCase?.notes && (
              <div className="space-y-4">
                {(() => {
                  try {
                    const parsedNotes = JSON.parse(selectedCase.notes);
                    if (parsedNotes.technicalDetails) {
                      return (
                        <div className="space-y-4 border p-4 rounded-md bg-slate-50">
                          <h3 className="text-xl font-semibold flex items-center">
                            <FileDigit className="mr-2 h-5 w-5 text-green-600" />
                            Digital Evidence Technical Details
                          </h3>
                          
                          {parsedNotes.technicalDetails.hashingTechniques && (
                            <div className="space-y-2">
                              <h4 className="text-lg font-medium">Hashing Techniques</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {parsedNotes.technicalDetails.hashingTechniques.map((technique: any, index: number) => (
                                  <div key={index} className="border p-2 rounded bg-white">
                                    <p className="font-medium">{technique.algorithm}</p>
                                    <p className="text-sm text-muted-foreground">{technique.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {parsedNotes.technicalDetails.chainOfCustody && (
                            <div className="space-y-2">
                              <h4 className="text-lg font-medium">Chain of Custody</h4>
                              <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse">
                                  <thead>
                                    <tr className="bg-muted">
                                      <th className="border px-4 py-2 text-left">Step</th>
                                      <th className="border px-4 py-2 text-left">Requirements</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {parsedNotes.technicalDetails.chainOfCustody.map((step: any, index: number) => (
                                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                                        <td className="border px-4 py-2">{step.step}</td>
                                        <td className="border px-4 py-2">{step.requirements}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                          
                          {parsedNotes.technicalDetails.integrityVerification && (
                            <div className="space-y-2">
                              <h4 className="text-lg font-medium">Integrity Verification Example</h4>
                              <div className="bg-black text-white p-3 rounded-md overflow-x-auto font-mono text-sm">
                                {parsedNotes.technicalDetails.integrityVerification}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  } catch (e) {
                    // If notes is not JSON, display as plain text
                  }
                  return <p className="text-muted-foreground whitespace-pre-wrap">{selectedCase.notes}</p>;
                })()}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Library;
