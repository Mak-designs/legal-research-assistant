
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert, RotateCcw, Clock } from "lucide-react";
import type { VerificationResult } from "@/hooks/use-tamper-detection";

interface VerificationResultProps {
  result: VerificationResult;
  documentName: string;
  onReset: () => void;
}

export const VerificationResultDisplay: React.FC<VerificationResultProps> = ({
  result,
  documentName,
  onReset,
}) => {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'low': return 'text-orange-600';
      default: return 'text-green-600';
    }
  };

  const getSeverityEmoji = (severity: string) => {
    switch (severity) {
      case 'high': return '🔴';
      case 'low': return '🟠';
      default: return '✅';
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Summary */}
      <Card className={`${
        result.match 
          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900' 
          : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {result.match ? (
                <ShieldCheck className="h-8 w-8 text-green-600" />
              ) : (
                <ShieldAlert className="h-8 w-8 text-red-600" />
              )}
              <div>
                <h3 className="text-lg font-semibold">
                  {result.match ? '🔍 Tamper Detection' : '⚠️ DOCUMENT TAMPERING DETECTED'}
                </h3>
                <p className="text-sm text-muted-foreground">Document: {documentName}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium mb-1">✅ Status:</p>
              <p className="text-sm">{result.summary}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Severity:</p>
              <p className={`text-sm font-medium ${getSeverityColor(result.severity || 'none')}`}>
                {getSeverityEmoji(result.severity || 'none')} {(result.severity || 'none').charAt(0).toUpperCase() + (result.severity || 'none').slice(1)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">🕓 Last Checked:</p>
              <p className="text-sm">{formatDate(result.timestamp || '')}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Original Hash:</p>
              <p className="text-xs font-mono break-all bg-black/80 text-white p-2 rounded">
                {result.originalHash}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-1">Current Hash:</p>
              <p className="text-xs font-mono break-all bg-black/80 text-white p-2 rounded">
                {result.currentHash}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Changes */}
      {!result.match && result.sections && result.sections.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-4">Detailed Changes Found</h4>
            <div className="space-y-4">
              {result.sections.map((section, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">{section.name}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.original && (
                      <div>
                        <p className="text-xs font-medium text-red-600 mb-1">❌ Removed:</p>
                        <div className="bg-red-50 border border-red-200 p-2 rounded text-xs">
                          "{section.original}"
                        </div>
                      </div>
                    )}
                    {section.current && (
                      <div>
                        <p className="text-xs font-medium text-green-600 mb-1">✅ Added:</p>
                        <div className="bg-green-50 border border-green-200 p-2 rounded text-xs">
                          "{section.current}"
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reset Button */}
      <div className="flex justify-center">
        <Button 
          onClick={onReset}
          variant="outline"
          className="px-8"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          🔄 Reset
        </Button>
      </div>
    </div>
  );
};
