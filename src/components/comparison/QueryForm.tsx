
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Loader2, Search, Send, Globe, FileDigit, BookOpen } from "lucide-react";
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
  isChatMode?: boolean;
}

const QueryForm: React.FC<QueryFormProps> = ({
  query,
  setQuery,
  jurisdiction,
  setJurisdiction,
  isLoading,
  onSubmit,
  isChatMode = false
}) => {
  // Provide example queries
  const exampleQueries = {
    general: [
      "What are the differences between common law and contract law regarding property rights?",
      "Explain the doctrine of adverse possession and relevant case law",
      "How do courts interpret force majeure clauses in contracts?",
      "What are the key elements of a valid contract?",
      "Explain the principle of estoppel in common law"
    ],
    zambian: [
      "How does Zambian law handle digital evidence in court proceedings?",
      "What are the key provisions of the Cyber Security and Cyber Crimes Act of 2021?",
      "Explain the requirements for digital evidence chain of custody under Zambian law",
      "What are the legal standards for electronic signatures in Zambia?",
      "How does the Zambian Evidence Act handle digital forensics?"
    ]
  };

  // Get a random example query based on jurisdiction
  const getRandomExample = () => {
    const queries = exampleQueries[jurisdiction];
    const randomIndex = Math.floor(Math.random() * queries.length);
    return queries[randomIndex];
  };

  const handleExampleClick = () => {
    const example = getRandomExample();
    setQuery(example);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {isChatMode ? (
        <div className="space-y-2">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Ask a legal question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
                className="h-12"
              />
            </div>
            <Button type="submit" disabled={isLoading || !query.trim()} size="icon" className="h-12 w-12">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <label htmlFor="query" className="text-sm font-medium">
              Enter your legal research query
            </label>
            <Textarea
              id="query"
              placeholder={jurisdiction === "zambian" 
                ? "e.g., How does Zambian law handle digital evidence in court proceedings?" 
                : "e.g., What are the differences between common law and contract law regarding property rights?"}
              className="min-h-32 resize-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="w-full sm:w-1/3">
          <label htmlFor="jurisdiction" className="text-sm font-medium mb-2 block">
            Jurisdiction
          </label>
          <Select 
            value={jurisdiction} 
            onValueChange={(value) => {
              setJurisdiction(value);
            }} 
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
        
        {!isChatMode && (
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
                  Research
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      {/* Example query button */}
      {!isChatMode && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
            Try a Sample Legal Question
          </h3>
          <Button 
            variant="outline" 
            size="sm" 
            type="button"
            onClick={handleExampleClick}
            className="text-xs"
          >
            {getRandomExample()}
          </Button>
        </div>
      )}
      
      {jurisdiction === "zambian" && (
        <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
          <div className="flex items-start">
            <Globe className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-700">Zambian Legal Context</h4>
              <p className="text-xs text-blue-600 mt-1">
                Queries will be analyzed using Zambian legal principles including the Constitution of Zambia, 
                Zambian case law, and relevant statutes like the Cyber Security and Cyber Crimes Act.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {!isChatMode && (
        <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
          <div className="flex items-start">
            <FileDigit className="h-5 w-5 text-slate-500 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-slate-700">Enhanced Legal Research</h4>
              <p className="text-xs text-slate-600 mt-1">
                Our legal research system analyzes relevant case law, statutes, and legal principles 
                to provide comprehensive answers drawn from verified legal sources.
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default QueryForm;
