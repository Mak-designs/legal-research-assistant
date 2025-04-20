
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileDigit } from "lucide-react";
import type { SavedCase } from './types';

interface CaseDialogProps {
  selectedCase: SavedCase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CaseDialog = ({ selectedCase, open, onOpenChange }: CaseDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};

