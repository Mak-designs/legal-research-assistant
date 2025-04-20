
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDigit, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import type { SavedCase } from './types';

interface SavedCasesTableProps {
  savedCases: SavedCase[];
  onViewCase: (caseItem: SavedCase) => void;
  onDeleteCase: (caseItem: SavedCase) => void;
}

export const SavedCasesTable = ({ savedCases, onViewCase, onDeleteCase }: SavedCasesTableProps) => {
  return (
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
          <TableRow key={caseItem.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onViewCase(caseItem)}>
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
                  onDeleteCase(caseItem);
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
  );
};

