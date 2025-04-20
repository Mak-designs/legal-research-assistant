
import React from 'react';
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
import type { SavedCase } from './types';

interface DeleteCaseDialogProps {
  caseToDelete: SavedCase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

export const DeleteCaseDialog = ({ caseToDelete, open, onOpenChange, onConfirmDelete }: DeleteCaseDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Case</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{caseToDelete?.title}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

