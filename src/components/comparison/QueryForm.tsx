
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Loader2, Search, Globe } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QueryFormProps {
  query: string;
  setQuery: (query: string) => void;
  jurisdiction: string;
  setJurisdiction: (jurisdiction: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const QueryForm: React.FC<QueryFormProps> = ({
  query,
  setQuery,
  jurisdiction,
  setJurisdiction,
  isLoading,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="query" className="text-sm font-medium">
          Enter your legal research query
        </label>
        <Textarea
          id="query"
          placeholder="e.g., What are the differences between common law and contract law regarding property rights?"
          className="min-h-32 resize-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="w-full sm:w-1/3">
          <label htmlFor="jurisdiction" className="text-sm font-medium mb-2 block">
            Jurisdiction
          </label>
          <Select 
            value={jurisdiction} 
            onValueChange={setJurisdiction} 
            disabled={isLoading}
          >
            <SelectTrigger className="w-full" id="jurisdiction">
              <SelectValue placeholder="Select jurisdiction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4" />
                  General
                </div>
              </SelectItem>
              <SelectItem value="zambian">
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4" />
                  Zambian
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end items-end">
          <Button type="submit" disabled={isLoading || !query.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default QueryForm;
