
import { legalDataset } from './legalDataset.ts';

export const generateRecommendation = (query: string, primaryDomain: string, secondaryDomain: string) => {
  const primaryCases = legalDataset[primaryDomain].cases;
  const secondaryCases = legalDataset[secondaryDomain].cases;
  const primaryStatutes = legalDataset[primaryDomain].statutes;
  const primaryPrinciples = legalDataset[primaryDomain].principles;
  
  // Extract key concepts from query
  const queryConcepts = extractConcepts(query);
  
  // Find most relevant cases based on query concepts
  const relevantCases = findRelevantCases(queryConcepts, primaryCases, 2);
  const relevantSecondaryCases = findRelevantCases(queryConcepts, secondaryCases, 1);
  const relevantStatutes = findRelevantStatutes(queryConcepts, primaryStatutes, 2);
  
  // Generate domain-specific recommendations
  if (primaryDomain === 'zambian' || secondaryDomain === 'zambian') {
    const zambianStatutes = legalDataset['zambian'].statutes;
    const zambianCaseLaw = findRelevantCases(queryConcepts, legalDataset['zambian'].cases, 2);
    
    return `Based on your query about "${query}", we recommend examining Zambian cases including ${zambianCaseLaw[0].title} (${zambianCaseLaw[0].citation}) which addresses ${zambianCaseLaw[0].description} and ${zambianCaseLaw[1].title} (${zambianCaseLaw[1].citation}) concerning ${zambianCaseLaw[1].description.toLowerCase()}. For statutory guidance, the ${zambianStatutes[0].title} (${zambianStatutes[0].citation}) provides that ${zambianStatutes[0].description.toLowerCase()}, while the ${zambianStatutes[1].title} (${zambianStatutes[1].citation}) establishes ${zambianStatutes[1].description.toLowerCase()}. These sources provide a comprehensive Zambian legal framework for analyzing your specific inquiry.`;
  }
  
  if (primaryDomain === 'cyberSecurity' || secondaryDomain === 'cyberSecurity') {
    const cyberCases = findRelevantCases(queryConcepts, legalDataset['cyberSecurity'].cases, 2);
    const cyberStatutes = findRelevantStatutes(queryConcepts, legalDataset['cyberSecurity'].statutes, 1);
    
    return `For your query on "${query}", we recommend examining digital evidence standards in ${cyberCases[0].title} (${cyberCases[0].citation}) which established ${cyberCases[0].description}, and ${cyberCases[1].title} (${cyberCases[1].citation}) that addressed ${cyberCases[1].description.toLowerCase()}. The ${cyberStatutes[0].title} (${cyberStatutes[0].citation}) provides the statutory framework, specifically stating that "${cyberStatutes[0].description}". For technical implementation, SHA-256 hash verification and blockchain-based audit trails are recommended per Zambian Judiciary ICT Policy guidelines, with particular attention to Section 31 regarding chain of custody requirements.`;
  }
  
  // Generate recommendation based on query and selected cases
  const recommendationBase = `Based on your query about "${query}", we recommend examining ${relevantCases[0].title} (${relevantCases[0].citation}) which established that ${relevantCases[0].description}, and ${relevantCases[1].title} (${relevantCases[1].citation}) where the court held ${relevantCases[1].description.toLowerCase()}. `;
  
  const statuteRecommendation = relevantStatutes.length > 0 ? 
    `For statutory guidance, review the ${relevantStatutes[0].title} (${relevantStatutes[0].citation}), which provides that ${relevantStatutes[0].description.toLowerCase()}. ` : 
    '';
  
  const secondaryDomainRecommendation = relevantSecondaryCases.length > 0 ?
    `To understand how ${secondaryDomain} law principles interact with this issue, also consider ${relevantSecondaryCases[0].title} (${relevantSecondaryCases[0].citation}), which clarifies that ${relevantSecondaryCases[0].description.toLowerCase()}. ` :
    '';
  
  const principlesRecommendation = primaryPrinciples ? 
    `The key legal principles to apply include: ${getRelevantPrinciples(queryConcepts, primaryPrinciples, 2).join('; ')}. ` :
    '';
    
  return recommendationBase + statuteRecommendation + secondaryDomainRecommendation + principlesRecommendation + 'These sources provide a comprehensive foundation for analyzing your legal question.';
};

export const generateTechnicalDetails = (primaryDomain: string, secondaryDomain: string) => {
  if (primaryDomain === 'cyberSecurity' || secondaryDomain === 'cyberSecurity') {
    return {
      hashingTechniques: [
        { algorithm: "MD5", description: "Legacy algorithm, provides basic file integrity verification but no longer considered secure for legal evidence due to collision vulnerabilities" },
        { algorithm: "SHA-256", description: "Recommended standard for legal evidence in Zambian courts per Cyber Security Act Section 24(3), providing strong cryptographic assurance" },
        { algorithm: "SHA-3", description: "Advanced algorithm offering enhanced security, approved for use in sensitive legal documents under Electronic Communications Act regulations" }
      ],
      chainOfCustody: [
        { step: "Collection", requirements: "Write-blocking hardware, timestamped acquisition logs, dual-party verification, and photographic documentation as required by Zambian Judiciary ICT Policy" },
        { step: "Storage", requirements: "Immutable storage with comprehensive access logs, WORM (Write Once Read Many) media for forensic copies, and tamper-evident seals" },
        { step: "Analysis", requirements: "Non-destructive tools, documented methodology, validation testing using multiple tools, and peer verification of findings" },
        { step: "Presentation", requirements: "Hash verification in court, complete metadata preservation, technical expert testimony, and demonstrable chain of custody documentation" }
      ],
      integrityVerification: `To verify file integrity, calculate SHA-256 hash using: echo -n "file_content" | sha256sum. Compare resulting hash (e.g., 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b) with original to detect tampering. Under Zambian Cyber Security Act Section 25, digital evidence must maintain verifiable integrity through cryptographic hash functions and blockchain-based timestamping for admissibility in court proceedings.`
    };
  }
  return null;
};

// Helper functions for more relevant results
function extractConcepts(query: string): string[] {
  // Remove common words and extract key concepts
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among'];
  const words = query.toLowerCase().split(/\s+/);
  return words.filter(word => 
    word.length > 3 && !stopWords.includes(word) && !(/^\d+$/.test(word))
  );
}

function findRelevantCases(concepts: string[], cases: any[], count: number) {
  // Score cases based on concept matches in title and description
  const scoredCases = cases.map(caseObj => {
    let score = 0;
    const caseText = (caseObj.title + ' ' + caseObj.description).toLowerCase();
    
    concepts.forEach(concept => {
      if (caseText.includes(concept)) {
        score += 1;
        // Boost score for title matches
        if (caseObj.title.toLowerCase().includes(concept)) {
          score += 0.5;
        }
      }
    });
    
    return { case: caseObj, score };
  });
  
  // Sort by relevance score
  scoredCases.sort((a, b) => b.score - a.score);
  
  // If no strong matches, return first cases
  if (scoredCases[0].score === 0) {
    return cases.slice(0, count);
  }
  
  // Return most relevant cases
  return scoredCases.slice(0, count).map(item => item.case);
}

function findRelevantStatutes(concepts: string[], statutes: any[], count: number) {
  if (!statutes || statutes.length === 0) return [];
  
  // Score statutes based on concept matches
  const scoredStatutes = statutes.map(statute => {
    let score = 0;
    const statuteText = (statute.title + ' ' + statute.description).toLowerCase();
    
    concepts.forEach(concept => {
      if (statuteText.includes(concept)) {
        score += 1;
      }
    });
    
    return { statute, score };
  });
  
  // Sort by relevance score
  scoredStatutes.sort((a, b) => b.score - a.score);
  
  // Return most relevant statutes
  return scoredStatutes.slice(0, count).map(item => item.statute);
}

function getRelevantPrinciples(concepts: string[], principles: string[], count: number) {
  if (!principles || principles.length === 0) return [];
  
  // Score principles based on concept matches
  const scoredPrinciples = principles.map(principle => {
    let score = 0;
    const principleText = principle.toLowerCase();
    
    concepts.forEach(concept => {
      if (principleText.includes(concept)) {
        score += 1;
      }
    });
    
    return { principle, score };
  });
  
  // Sort by relevance score
  scoredPrinciples.sort((a, b) => b.score - a.score);
  
  // Return top principles, or first ones if no strong matches
  return scoredPrinciples.slice(0, count).map(item => item.principle);
}
