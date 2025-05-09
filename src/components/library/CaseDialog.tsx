
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { SavedCase } from "./types";

interface CaseDialogProps {
  selectedCase: SavedCase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CaseDialog: React.FC<CaseDialogProps> = ({
  selectedCase,
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  
  const handleVerifyDocument = () => {
    if (!selectedCase) return;
    
    // Navigate to document manager with the selected case
    navigate('/documents', { state: { selectedCase } });
    onOpenChange(false);
  };
  
  if (!selectedCase) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{selectedCase.title}</DialogTitle>
          <DialogDescription className="text-xs">
            {selectedCase.citation || "No citation available"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {selectedCase.court_name && (
            <div>
              <h4 className="text-sm font-medium">Court</h4>
              <p className="text-sm text-muted-foreground">
                {selectedCase.court_name}
              </p>
            </div>
          )}

          {selectedCase.decision_date && (
            <div>
              <h4 className="text-sm font-medium">Decision Date</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(selectedCase.decision_date).toLocaleDateString()}
              </p>
            </div>
          )}

          {selectedCase.notes && (
            <div>
              <h4 className="text-sm font-medium">Notes</h4>
              <p className="text-sm text-muted-foreground">
                {selectedCase.notes}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          
          <div className="flex gap-2">
            <Button onClick={handleVerifyDocument} size="sm">
              Verify with Case
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
