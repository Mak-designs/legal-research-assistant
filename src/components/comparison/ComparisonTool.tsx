
import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, BookOpen, Trash2 } from "lucide-react";
import ComparisonResults from "@/components/comparison/ComparisonResults";
import QueryForm from "@/components/comparison/QueryForm";
import DetailedAnalysisTab from "@/components/comparison/DetailedAnalysisTab";
import { useLegalSearch } from "@/hooks/use-legal-search";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface ComparisonToolProps {
  initialQuery?: string | null;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ initialQuery = null }) => {
  const {
    query,
    setQuery,
    isLoading,
    results,
    jurisdiction,
    setJurisdiction,
    handleSearch,
    chatHistory,
    clearChat
  } = useLegalSearch(initialQuery);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(new Event('submit') as unknown as React.FormEvent);
    }
  }, [initialQuery]);
  
  // Scroll chat to bottom when history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="w-full space-y-6">
      <Card className="legal-card">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium flex items-center">
              <Scale className="mr-2 h-5 w-5 text-primary" />
              Legal Research Assistant
              {jurisdiction === "zambian" && (
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Zambian Law
                </span>
              )}
            </h2>
            {chatHistory.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearChat}
                className="text-xs"
              >
                <Trash2 className="h-3 w-3 mr-1" /> Clear Chat
              </Button>
            )}
          </div>
          
          {/* Chat history container */}
          {chatHistory.length > 0 && (
            <div 
              className="h-[300px] border rounded-md mb-4 overflow-y-auto p-3 bg-slate-50"
              ref={chatContainerRef}
            >
              {chatHistory.map((message, index) => (
                <div key={index} className={`flex mb-4 ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex ${message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'} max-w-[80%]`}>
                    <Avatar className={`h-8 w-8 ${message.role === 'assistant' ? 'mr-2 bg-primary' : 'ml-2 bg-slate-700'}`}>
                      <div className="flex h-full w-full items-center justify-center text-white">
                        {message.role === 'assistant' ? '⚖️' : '👤'}
                      </div>
                    </Avatar>
                    <div 
                      className={`p-3 rounded-lg ${
                        message.role === 'assistant' 
                          ? 'bg-primary/10 text-primary-foreground' 
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <QueryForm
            query={query}
            setQuery={setQuery}
            jurisdiction={jurisdiction}
            setJurisdiction={setJurisdiction}
            isLoading={isLoading}
            onSubmit={handleSearch}
            isChatMode={true}
          />
        </CardContent>
      </Card>
      
      {results && (
        <div className="animate-fade-in">
          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Scale className="mr-2 h-5 w-5 text-accent" />
            Detailed Legal Analysis
          </h2>
          
          <Tabs defaultValue="comparison">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="comparison">
                <div className="flex items-center">
                  <Scale className="mr-2 h-4 w-4" />
                  Comparison
                </div>
              </TabsTrigger>
              <TabsTrigger value="detailed">
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Detailed Analysis
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="comparison" className="mt-4">
              <ComparisonResults results={results} />
            </TabsContent>
            
            <TabsContent value="detailed" className="mt-4">
              <DetailedAnalysisTab results={results} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ComparisonTool;
