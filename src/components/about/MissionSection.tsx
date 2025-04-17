
import React from "react";
import { Scale } from "lucide-react";

const MissionSection = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Our Mission
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Making Legal Research Accessible
            </h2>
            <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
              At LegalAssist, we believe that legal information should be accessible and understandable to everyone. 
              Our mission is to leverage advanced technology to simplify legal research and empower legal professionals 
              and students with powerful comparative analysis tools.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative h-[300px] w-[300px] overflow-hidden rounded-xl bg-gradient-to-b from-primary/20 to-background flex items-center justify-center">
              <Scale className="h-32 w-32 text-primary/80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
