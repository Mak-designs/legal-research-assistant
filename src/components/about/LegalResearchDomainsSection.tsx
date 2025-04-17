
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const LegalResearchDomainsSection = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Legal Research Domains</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg/relaxed">
              Our database covers these major legal domains with real case law and statutes
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table className="border rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Key Topics</TableHead>
                <TableHead className="hidden md:table-cell">Example Cases</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Property Law</TableCell>
                <TableCell>Real property, adverse possession, easements, fixtures</TableCell>
                <TableCell className="hidden md:table-cell">Pierson v. Post, Kelo v. City of New London</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Contract Law</TableCell>
                <TableCell>Agreements, consideration, performance, remedies</TableCell>
                <TableCell className="hidden md:table-cell">Carlill v. Carbolic Smoke Ball Co., Hadley v. Baxendale</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Tort Law</TableCell>
                <TableCell>Negligence, liability, damages, causation</TableCell>
                <TableCell className="hidden md:table-cell">Palsgraf v. Long Island Railroad Co., MacPherson v. Buick</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Constitutional Law</TableCell>
                <TableCell>Rights, powers, federalism, due process</TableCell>
                <TableCell className="hidden md:table-cell">Marbury v. Madison, Brown v. Board of Education</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Criminal Law</TableCell>
                <TableCell>Mens rea, search and seizure, evidence</TableCell>
                <TableCell className="hidden md:table-cell">Miranda v. Arizona, Gideon v. Wainwright</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default LegalResearchDomainsSection;
