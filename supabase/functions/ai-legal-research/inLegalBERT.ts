
// InLegalBERT integration for enhanced legal text analysis

const HUGGING_FACE_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');

/**
 * Get semantic embeddings using InLegalBERT model
 */
export async function getInLegalBERTEmbeddings(text: string): Promise<number[] | null> {
  if (!HUGGING_FACE_TOKEN) {
    console.error("HUGGING_FACE_ACCESS_TOKEN not found");
    return null;
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/law-ai/InLegalBERT", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text.substring(0, 512), // Limit text length for BERT
        options: { wait_for_model: true }
      })
    });

    if (!response.ok) {
      console.error(`InLegalBERT API error: ${response.status}`);
      return null;
    }

    const embeddings = await response.json();
    return Array.isArray(embeddings) ? embeddings : null;
  } catch (error) {
    console.error("Error getting InLegalBERT embeddings:", error);
    return null;
  }
}

/**
 * Analyze legal text semantic similarity using InLegalBERT
 */
export async function analyzeLegalSemanticSimilarity(
  queryText: string, 
  legalTexts: string[]
): Promise<Array<{ text: string; similarity: number }>> {
  try {
    const queryEmbedding = await getInLegalBERTEmbeddings(queryText);
    if (!queryEmbedding) {
      return legalTexts.map(text => ({ text, similarity: 0 }));
    }

    const results = [];
    for (const text of legalTexts) {
      const textEmbedding = await getInLegalBERTEmbeddings(text);
      if (textEmbedding) {
        const similarity = cosineSimilarity(queryEmbedding, textEmbedding);
        results.push({ text, similarity });
      } else {
        results.push({ text, similarity: 0 });
      }
    }

    // Sort by similarity score (highest first)
    return results.sort((a, b) => b.similarity - a.similarity);
  } catch (error) {
    console.error("Error in semantic similarity analysis:", error);
    return legalTexts.map(text => ({ text, similarity: 0 }));
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Enhanced legal text classification using InLegalBERT
 */
export async function classifyLegalText(text: string): Promise<{
  legalDomain: string;
  confidence: number;
  semanticSegments: string[];
}> {
  try {
    // Use InLegalBERT for classification
    const response = await fetch("https://api-inference.huggingface.co/models/law-ai/InLegalBERT", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text.substring(0, 512),
        parameters: {
          candidate_labels: [
            "Civil Law", "Criminal Law", "Constitutional Law", 
            "Contract Law", "Property Law", "Tort Law", 
            "Corporate Law", "Tax Law", "Family Law"
          ]
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      return {
        legalDomain: result.labels?.[0] || "General",
        confidence: result.scores?.[0] || 0.5,
        semanticSegments: extractSemanticSegments(text)
      };
    }
  } catch (error) {
    console.error("Error in legal text classification:", error);
  }

  return {
    legalDomain: "General",
    confidence: 0.5,
    semanticSegments: extractSemanticSegments(text)
  };
}

/**
 * Extract semantic segments from legal text
 */
function extractSemanticSegments(text: string): string[] {
  const segments = [];
  
  // Look for common legal document segments
  const segmentPatterns = [
    { name: "Facts", pattern: /(?:facts|background|circumstances)[\s\S]*?(?=\n\n|\.|;)/i },
    { name: "Arguments", pattern: /(?:arguments|contentions|submissions)[\s\S]*?(?=\n\n|\.|;)/i },
    { name: "Law", pattern: /(?:statute|act|section|article)[\s\S]*?(?=\n\n|\.|;)/i },
    { name: "Reasoning", pattern: /(?:reasoning|analysis|consideration)[\s\S]*?(?=\n\n|\.|;)/i },
    { name: "Conclusion", pattern: /(?:conclusion|decision|judgment|held)[\s\S]*?(?=\n\n|\.|;)/i }
  ];

  for (const segment of segmentPatterns) {
    const match = text.match(segment.pattern);
    if (match) {
      segments.push(`${segment.name}: ${match[0].substring(0, 100)}...`);
    }
  }

  return segments.length > 0 ? segments : ["General legal content"];
}

/**
 * Enhanced legal case relevance scoring using InLegalBERT
 */
export async function scoreInLegalBERTRelevance(
  query: string, 
  cases: any[]
): Promise<any[]> {
  try {
    const caseTexts = cases.map(c => `${c.title} ${c.description}`);
    const similarities = await analyzeLegalSemanticSimilarity(query, caseTexts);
    
    return cases.map((caseItem, index) => ({
      ...caseItem,
      relevanceScore: similarities[index]?.similarity || 0,
      semanticAnalysis: similarities[index]?.similarity > 0.7 ? "High Relevance" : 
                       similarities[index]?.similarity > 0.4 ? "Medium Relevance" : "Low Relevance"
    })).sort((a, b) => b.relevanceScore - a.relevanceScore);
  } catch (error) {
    console.error("Error scoring case relevance:", error);
    return cases;
  }
}
