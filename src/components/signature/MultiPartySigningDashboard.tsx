
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { CheckCircle, Circle, Clock, Download, History, Send } from "lucide-react";
import { useDeviceType } from "@/hooks/use-mobile";

// Types for multi-party signing
interface SignParty {
  id: string;
  name: string;
  role: string;
  status: 'signed' | 'pending' | 'requested';
  requestedDate?: string;
  signedDate?: string;
}

interface MultiPartyDocument {
  id: string;
  name: string;
  caseNumber: string;
  description: string;
  parties: SignParty[];
  created: string;
  modified: string;
}

// Mock data
const mockDocuments: MultiPartyDocument[] = [
  {
    id: 'doc-1',
    name: 'Johnson v. Acme Corp - Settlement Agreement',
    caseNumber: 'CV-2025-12345',
    description: 'Final settlement agreement for Johnson v. Acme Corp lawsuit',
    parties: [
      {
        id: 'party-1',
        name: 'Robert Johnson',
        role: 'Plaintiff',
        status: 'signed',
        requestedDate: '2025-04-20T12:00:00Z',
        signedDate: '2025-04-21T15:32:45Z'
      },
      {
        id: 'party-2',
        name: 'Maria Chen',
        role: 'Plaintiff\'s Counsel',
        status: 'signed',
        requestedDate: '2025-04-20T12:00:00Z',
        signedDate: '2025-04-21T16:47:22Z'
      },
      {
        id: 'party-3',
        name: 'Acme Corp',
        role: 'Defendant',
        status: 'requested',
        requestedDate: '2025-04-20T12:00:00Z'
      },
      {
        id: 'party-4',
        name: 'James Wilson',
        role: 'Defense Counsel',
        status: 'requested',
        requestedDate: '2025-04-20T12:00:00Z'
      }
    ],
    created: '2025-04-19T09:15:00Z',
    modified: '2025-04-21T16:47:22Z'
  },
  {
    id: 'doc-2',
    name: 'Smith v. Jones - Non-Disclosure Agreement',
    caseNumber: 'CV-2025-67890',
    description: 'NDA required for discovery phase',
    parties: [
      {
        id: 'party-5',
        name: 'Alice Smith',
        role: 'Plaintiff',
        status: 'signed',
        requestedDate: '2025-04-18T14:00:00Z',
        signedDate: '2025-04-18T17:22:10Z'
      },
      {
        id: 'party-6',
        name: 'Bob Jones',
        role: 'Defendant',
        status: 'pending',
        requestedDate: '2025-04-18T14:00:00Z'
      }
    ],
    created: '2025-04-18T14:00:00Z',
    modified: '2025-04-18T17:22:10Z'
  }
];

export const MultiPartySigningDashboard = () => {
  const { isMobile } = useDeviceType();
  const [documents] = useState<MultiPartyDocument[]>(mockDocuments);
  const [selectedDocument, setSelectedDocument] = useState<MultiPartyDocument | null>(
    mockDocuments.length > 0 ? mockDocuments[0] : null
  );

  const handleSendReminder = (partyId: string) => {
    toast.success("Reminder sent successfully");
    // In a real app, this would send a reminder to the specified party
  };

  const handleDownload = () => {
    toast.success("Document downloaded successfully");
    // In a real app, this would download the document
  };

  const handleViewHistory = () => {
    toast.success("Opening signature history");
    // In a real app, this would open a history view
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': 
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': 
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'requested': 
        return <Circle className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className={isMobile ? "px-4 py-4" : ""}>
        <CardTitle className="text-lg sm:text-xl">Multi-Party Signing Dashboard</CardTitle>
        <CardDescription>Track and manage signature workflows</CardDescription>
      </CardHeader>
      
      <CardContent className={`space-y-6 ${isMobile ? "px-4 pb-4" : ""}`}>
        <div className="space-y-3">
          {documents.map(doc => (
            <div 
              key={doc.id}
              className={`p-3 rounded border cursor-pointer ${
                selectedDocument?.id === doc.id ? 'bg-accent border-primary' : 'bg-muted/50'
              }`}
              onClick={() => setSelectedDocument(doc)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 justify-between">
                <p className="font-medium">{doc.name}</p>
                <span className="text-xs bg-primary/10 px-2 py-0.5 rounded">
                  {doc.parties.filter(p => p.status === 'signed').length}/{doc.parties.length} signed
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Case: {doc.caseNumber}</p>
            </div>
          ))}
        </div>
        
        {selectedDocument && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">
                {selectedDocument.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Status: {
                  selectedDocument.parties.every(p => p.status === 'signed')
                    ? 'Complete'
                    : `Awaiting Signatures (${selectedDocument.parties.filter(p => p.status === 'signed').length}/${selectedDocument.parties.length} complete)`
                }
              </p>
              
              <div className="space-y-2">
                {selectedDocument.parties.map(party => (
                  <div key={party.id} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                    <div className="flex items-center">
                      {getStatusIcon(party.status)}
                      <div className="ml-2">
                        <p className="text-sm font-medium">{party.name}</p>
                        <p className="text-xs text-muted-foreground">{party.role}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      {party.status === 'signed' ? (
                        <span>Signed {formatDate(party.signedDate)}</span>
                      ) : (
                        <div className="flex flex-col xs:flex-row gap-2">
                          <span>Requested {formatDate(party.requestedDate)}</span>
                          {party.status === 'requested' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs h-6 px-2"
                              onClick={() => handleSendReminder(party.id)}
                            >
                              <Send className="h-3 w-3 mr-1" />
                              Remind
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"} 
                className="text-xs sm:text-sm"
                onClick={handleDownload}
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Download Current Version
              </Button>
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"} 
                className="text-xs sm:text-sm"
                onClick={handleViewHistory}
              >
                <History className="h-3.5 w-3.5 mr-1" />
                View History
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
