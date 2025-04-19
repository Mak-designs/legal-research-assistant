
import { legalDataset } from './legalDataset.ts';

export const generateRecommendation = (query: string, primaryDomain: string, secondaryDomain: string) => {
  const primaryCases = legalDataset[primaryDomain].cases;
  const secondaryCases = legalDataset[secondaryDomain].cases;
  const primaryStatutes = legalDataset[primaryDomain].statutes;
  
  if (primaryDomain === 'zambian' || secondaryDomain === 'zambian') {
    return `Based on your query about "${query}", we recommend examining Zambian cases including ${primaryCases[0].title} (${primaryCases[0].citation}) and ${primaryCases[1].title} (${primaryCases[1].citation}). For statutory guidance, review the ${primaryStatutes[0].title} (${primaryStatutes[0].citation}) and ${primaryStatutes[1].title} (${primaryStatutes[1].citation}). These sources provide comprehensive Zambian legal context for analyzing your query.`;
  }
  
  if (primaryDomain === 'cyberSecurity' || secondaryDomain === 'cyberSecurity') {
    return `For your query on "${query}", we recommend examining digital evidence standards in ${primaryCases[0].title} (${primaryCases[0].citation}) which established hash validation protocols, and ${primaryCases[1].title} (${primaryCases[1].citation}). The ${primaryStatutes[0].title} (${primaryStatutes[0].citation}) provides the statutory framework. For technical implementation, SHA-256 hash verification and blockchain-based audit trails are recommended per Zambian Judiciary ICT Policy guidelines.`;
  }
  
  return `Based on your query about "${query}", we recommend examining ${primaryCases[0].title} (${primaryCases[0].citation}) and ${primaryCases[1].title} (${primaryCases[1].citation}) as key cases in ${primaryDomain} law. For statutory guidance, review the ${primaryStatutes[0].title} (${primaryStatutes[0].citation}). To understand how ${secondaryDomain} law principles might interact with this issue, also consider ${secondaryCases[0].title} (${secondaryCases[0].citation}). These sources provide a comprehensive foundation for analyzing your legal question.`;
};

export const generateTechnicalDetails = (primaryDomain: string, secondaryDomain: string) => {
  if (primaryDomain === 'cyberSecurity' || secondaryDomain === 'cyberSecurity') {
    return {
      hashingTechniques: [
        { algorithm: "MD5", description: "Legacy algorithm, provides basic file integrity verification" },
        { algorithm: "SHA-256", description: "Recommended standard for legal evidence in Zambian courts per Cyber Security Act" }
      ],
      chainOfCustody: [
        { step: "Collection", requirements: "Write-blocking hardware, timestamped acquisition logs" },
        { step: "Storage", requirements: "Immutable storage with access logs, forensic copies only" },
        { step: "Analysis", requirements: "Non-destructive tools, documented methodology, validation testing" },
        { step: "Presentation", requirements: "Hash verification, complete metadata, technical expert testimony" }
      ],
      integrityVerification: `To verify file integrity, calculate SHA-256 hash using: echo -n "file_content" | sha256sum. Compare resulting hash (e.g., 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b) with original to detect tampering.`
    };
  }
  return null;
};
