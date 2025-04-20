
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const RecommendationsTables = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Summary of Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Suggested Fix</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Dataset</TableCell>
                <TableCell>No Zambia-specific data</TableCell>
                <TableCell>Use ZambLII or Zambian Law Reports</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Methodology</TableCell>
                <TableCell>No training pipeline shown</TableCell>
                <TableCell>Add model architecture, NLP steps</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Evaluation</TableCell>
                <TableCell>No metrics, graphs, or confusion matrix</TableCell>
                <TableCell>Show F1 scores, graphs, retrieval precision</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Legal Grounding</TableCell>
                <TableCell>Non-Zambian case law</TableCell>
                <TableCell>Cite local precedents, Zambian legal structure</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Visuals</TableCell>
                <TableCell>Text-heavy, no flow diagrams or examples</TableCell>
                <TableCell>Use diagrams, mockups, output samples</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Ethics</TableCell>
                <TableCell>No data protection/legal implications</TableCell>
                <TableCell>Include section on compliance & ethical use</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Specific Section Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Suggestion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Abstract</TableCell>
                <TableCell>Good clarity</TableCell>
                <TableCell>Add Zambian law reference</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Chapter 1</TableCell>
                <TableCell>Sound intro, clear problem</TableCell>
                <TableCell>Localize legal standards</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Chapter 2</TableCell>
                <TableCell>Good comparative review</TableCell>
                <TableCell>Include Zambian forensic/legal tools (ZICTA, Zambia Police Cybercrime Unit)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Chapter 3</TableCell>
                <TableCell>Strong use of mixed methods</TableCell>
                <TableCell>Needs execution proof and expert quotes</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Chapter 4</TableCell>
                <TableCell>Risk analysis is thoughtful</TableCell>
                <TableCell>Add more technical mitigations, e.g., backup, redundancy</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Chapter 5</TableCell>
                <TableCell>Contributions overstated</TableCell>
                <TableCell>Tone down or support with actual data</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
