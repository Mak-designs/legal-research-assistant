
import React from "react";
import { BookOpen, Book } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const LegalDatabaseSection = () => {
  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Enhanced Legal Database</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg/relaxed">
              Our system analyzes queries using a comprehensive database of real legal precedents, statutes, and principles
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="bg-background">
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-medium flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  Leading Case Law
                </h3>
                <p className="text-muted-foreground">
                  Access landmark decisions from state and federal courts, with real-world precedents that shape modern legal practice.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background">
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-medium flex items-center">
                  <Book className="h-5 w-5 mr-2 text-primary" />
                  Statutory Research
                </h3>
                <p className="text-muted-foreground">
                  Find relevant statutes and regulations across jurisdictions, updated to reflect the latest legislative changes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LegalDatabaseSection;
