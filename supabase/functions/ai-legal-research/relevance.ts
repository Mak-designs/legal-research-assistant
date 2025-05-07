
// Relevance scoring and filtering utilities for legal research

/**
 * Find relevant cases based on query keywords
 * @param query The user's legal query
 * @param cases Array of case objects
 * @returns Array of most relevant cases
 */
export function findRelevantCases(query: string, cases: any[]) {
  if (!cases || !Array.isArray(cases)) return [];
  
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => 
    word.length > 3 && 
    !['the', 'and', 'for', 'that', 'with', 'from'].includes(word)
  );
  
  // Score each case based on query relevance
  const scoredCases = cases.map(caseObj => {
    let score = 0;
    const caseText = (caseObj.title + ' ' + caseObj.description).toLowerCase();
    
    // Calculate relevance score based on keyword matches
    queryWords.forEach(word => {
      if (caseText.includes(word)) {
        score += 1;
        // Higher score for title matches
        if (caseObj.title.toLowerCase().includes(word)) {
          score += 0.5;
        }
      }
    });
    
    return { case: caseObj, score };
  });
  
  // Sort by relevance and get top results
  scoredCases.sort((a, b) => b.score - a.score);
  
  // If no strong matches, still return some cases but fewer
  if (scoredCases[0]?.score < 1) {
    return cases.slice(0, 2);
  }
  
  // Return top relevant cases
  return scoredCases.slice(0, 3).map(item => item.case);
}

/**
 * Find relevant statutes based on query
 * @param query The user's legal query
 * @param statutes Array of statute objects
 * @returns Array of most relevant statutes
 */
export function findRelevantStatutes(query: string, statutes: any[]) {
  if (!statutes || !Array.isArray(statutes)) return [];
  
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => 
    word.length > 3 && 
    !['the', 'and', 'for', 'that', 'with', 'from'].includes(word)
  );
  
  // Score each statute based on query relevance
  const scoredStatutes = statutes.map(statute => {
    let score = 0;
    const statuteText = (statute.title + ' ' + statute.description).toLowerCase();
    
    queryWords.forEach(word => {
      if (statuteText.includes(word)) {
        score += 1;
        // Higher score for title matches
        if (statute.title.toLowerCase().includes(word)) {
          score += 0.5;
        }
      }
    });
    
    return { statute, score };
  });
  
  // Sort by relevance score
  scoredStatutes.sort((a, b) => b.score - a.score);
  
  // If no strong matches, return some default statutes but fewer
  if (scoredStatutes[0]?.score < 1) {
    return statutes.slice(0, 2);
  }
  
  // Return most relevant statutes
  return scoredStatutes.slice(0, 2).map(item => item.statute);
}

/**
 * Extract relevant principles based on the query
 * @param query The user's legal query
 * @param principles Array of legal principles
 * @returns Array of most relevant principles
 */
export function extractRelevantPrinciples(query: string, principles: string[]) {
  if (!principles || !Array.isArray(principles)) return [];
  
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => 
    word.length > 3 && 
    !['the', 'and', 'for', 'that', 'with', 'from'].includes(word)
  );
  
  // Score each principle based on query relevance
  const scoredPrinciples = principles.map(principle => {
    let score = 0;
    const principleText = principle.toLowerCase();
    
    queryWords.forEach(word => {
      if (principleText.includes(word)) {
        score += 1;
      }
    });
    
    return { principle, score };
  });
  
  // Sort by relevance score
  scoredPrinciples.sort((a, b) => b.score - a.score);
  
  // Return most relevant principles or default if no strong matches
  return scoredPrinciples.slice(0, 4).map(item => item.principle);
}
