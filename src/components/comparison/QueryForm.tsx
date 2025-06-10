
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Loader2, Search, BookOpen } from "lucide-react";

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
  isLoading,
  onSubmit
}) => {
  // Zambian law example queries
  const exampleQueries = [
    "How does Zambian law handle digital evidence in court proceedings?",
    "What are the key provisions of the Cyber Security and Cyber Crimes Act of 2021?",
    "Explain the requirements for digital evidence chain of custody under Zambian law",
    "What are the legal standards for electronic signatures in Zambia?",
    "How does the Zambian Evidence Act handle digital forensics?",
    "What are the penalties for cybercrime under Zambian law?",
    "How does Zambian constitutional law protect digital rights?",
    "What are the requirements for electronic contracts in Zambia?"
  ];

  // Get a random example query
  const getRandomExample = () => {
    const randomIndex = Math.floor(Math.random() * exampleQueries.length);
    return exampleQueries[randomIndex];
  };

  const handleExampleClick = () => {
    const example = getRandomExample();
    setQuery(example);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="query" className="text-sm font-medium">
          Ask your Zambian legal research question
        </label>
        <Textarea 
          id="query" 
          placeholder="e.g., How does Zambian law handle digital evidence in court proceedings?"
          className="min-h-32 resize-none" 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          disabled={isLoading} 
        />
      </div>
      
      <div className="flex justify-end">
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
      
      {/* Example query button */}
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
          Try a Sample Zambian Legal Question
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          type="button" 
          onClick={handleExampleClick} 
          className="text-xs text-left h-auto p-3 whitespace-normal"
        >
          {getRandomExample()}
        </Button>
      </div>
    </form>
  );
};

export default QueryForm;
