import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileDigit, Shield, ShieldCheck, ShieldX } from "lucide-react";
import type { SavedCase } from './types';
interface CaseDialogProps {
  selectedCase: SavedCase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export const CaseDialog = ({
  selectedCase,
  onOpenChange,
  open
}: CaseDialogProps) => {
  const renderIntegrityStatus = (status: string) => {
    switch (status) {
      case 'verified':
        return <div className="flex items-center text-green-600 mt-2">
            <ShieldCheck className="mr-2 h-5 w-5" />
            <span>Document integrity verified (matches version from {new Date().toLocaleDateString()})</span>
          </div>;
      case 'modified':
        return <div className="flex items-center text-red-600 mt-2">
            <ShieldX className="mr-2 h-5 w-5" />
            <span>Document may be altered! Hash does not match stored version</span>
          </div>;
      default:
        return <div className="flex items-center text-muted-foreground mt-2">
            <Shield className="mr-2 h-5 w-5" />
            <span>Document integrity unknown</span>
          </div>;
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedCase?.title}</DialogTitle>
          <DialogDescription>
            {selectedCase?.citation && <p className="mt-2">Citation: {selectedCase.citation}</p>}
            {selectedCase?.court_name && <p>Court: {selectedCase.court_name}</p>}
            {selectedCase?.decision_date && <p>Date: {new Date(selectedCase.decision_date).toLocaleDateString()}</p>}
            
            {/* Display document integrity status */}
            {selectedCase && renderIntegrityStatus(selectedCase.notes?.includes('verified') ? 'verified' : 'unknown')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {selectedCase?.notes && <div className="space-y-4">
              {(() => {
            try {
              const parsedNotes = JSON.parse(selectedCase.notes);
              if (parsedNotes.technicalDetails) {
                return <div className="space-y-4 border p-4 rounded-md bg-slate-50">
                        <h3 className="text-xl font-semibold flex items-center">
                          <FileDigit className="mr-2 h-5 w-5 text-green-600" />
                          Digital Evidence Technical Details
                        </h3>
                        
                        {parsedNotes.technicalDetails.hashingTechniques && <div className="space-y-2">
                            <h4 className="text-lg font-medium">Hashing Techniques</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {parsedNotes.technicalDetails.hashingTechniques.map((technique: any, index: number) => <div key={index} className="border p-2 rounded bg-white">
                                  <p className="font-medium">{technique.algorithm}</p>
                                  <p className="text-sm text-muted-foreground">{technique.description}</p>
                                </div>)}
                            </div>
                          </div>}
                        
                        {/* Add Document Hash Information */}
                        {parsedNotes.technicalDetails.documentHash && <div className="space-y-2">
                            <h4 className="text-lg font-medium">Document Hash</h4>
                            <div className="border p-2 rounded bg-white">
                              <p className="font-medium break-all">{parsedNotes.technicalDetails.documentHash.value}</p>
                              <p className="text-sm text-muted-foreground">Algorithm: {parsedNotes.technicalDetails.documentHash.algorithm}</p>
                              <p className="text-sm text-muted-foreground">Generated: {parsedNotes.technicalDetails.documentHash.timestamp}</p>
                            </div>
                          </div>}
                        
                        {parsedNotes.technicalDetails.chainOfCustody && <div className="space-y-2">
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
                                  {parsedNotes.technicalDetails.chainOfCustody.map((step: any, index: number) => <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                                      <td className="border px-4 py-2">{step.step}</td>
                                      <td className="border px-4 py-2">{step.requirements}</td>
                                    </tr>)}
                                </tbody>
                              </table>
                            </div>
                          </div>}
                        
                        {/* Add Chain of Custody History */}
                        {parsedNotes.technicalDetails.custodyHistory && <div className="space-y-2">
                            <h4 className="text-lg font-medium">Document History</h4>
                            <div className="border p-3 rounded bg-white">
                              <ul className="space-y-2">
                                {parsedNotes.technicalDetails.custodyHistory.map((entry: any, index: number) => <li key={index} className="border-b pb-2 last:border-b-0 last:pb-0">
                                    <p className="text-sm">
                                      <span className="font-medium">{entry.action}</span>:{' '}
                                      <span className="text-muted-foreground">{entry.timestamp}</span> by{' '}
                                      <span className="text-blue-600">{entry.user}</span>
                                    </p>
                                    {entry.hash && <p className="text-xs text-muted-foreground break-all mt-1">
                                        Hash: {entry.hash}
                                      </p>}
                                  </li>)}
                              </ul>
                            </div>
                          </div>}
                        
                        {parsedNotes.technicalDetails.integrityVerification && <div className="space-y-2">
                            <h4 className="text-lg font-medium">Integrity Verification Example</h4>
                            <div className="bg-black text-white p-3 rounded-md overflow-x-auto font-mono text-sm">
                              {parsedNotes.technicalDetails.integrityVerification}
                            </div>
                          </div>}
                      </div>;
              }
            } catch (e) {
              // If notes is not JSON, display as plain text
            }
            return <p className="text-muted-foreground whitespace-pre-wrap text-justify px-0 my-0 mx-0 text-base">{selectedCase.notes}</p>;
          })()}
            </div>}
        </div>
      </DialogContent>
    </Dialog>;
};