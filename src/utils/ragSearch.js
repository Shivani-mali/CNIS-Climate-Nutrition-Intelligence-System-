/**
 * RAG (Retrieval-Augmented Generation) Search Utility
 * Searches the knowledge base for relevant chunks based on a user query
 */

// Knowledge base data loaded asynchronously
let ragData = null;
let isLoadingData = false;

export async function initKnowledgeBase() {
    if (ragData || isLoadingData) return;
    isLoadingData = true;
    try {
        const response = await fetch('/ragKnowledgeBase.json');
        ragData = await response.json();
        console.log('[RAG] Knowledge base loaded:', ragData.totalChunks, 'chunks');
    } catch (err) {
        console.error('[RAG] Failed to load knowledge base json', err);
    }
    isLoadingData = false;
}
// Common stop words to ignore in scoring
const STOP_WORDS = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her',
    'was', 'one', 'our', 'out', 'has', 'have', 'been', 'from', 'they', 'will',
    'with', 'this', 'that', 'what', 'when', 'how', 'who', 'which', 'does',
    'should', 'would', 'could', 'about', 'into', 'than', 'them', 'then',
    'some', 'these', 'those', 'such', 'also', 'more', 'very', 'just',
    'child', 'children', 'baby', 'infant', 'infants', 'years', 'months',
    'please', 'tell', 'know', 'help', 'need', 'want', 'like'
]);

// Medical/nutrition keywords that should get higher weight
const HIGH_VALUE_KEYWORDS = new Set([
    'fever', 'diarrhea', 'diarrhoea', 'malnutrition', 'wasting', 'stunting',
    'muac', 'breastfeeding', 'vaccination', 'immunization', 'oedema', 'edema',
    'anemia', 'anaemia', 'protein', 'calorie', 'vitamin', 'zinc', 'iron',
    'ors', 'dehydration', 'pneumonia', 'measles', 'polio', 'bcg', 'dpt',
    'weight', 'height', 'growth', 'feeding', 'diet', 'dietary', 'nutrition',
    'sam', 'mam', 'severe', 'moderate', 'acute', 'chronic', 'obesity',
    'icds', 'anganwadi', 'poshan', 'supplementary', 'therapeutic',
    'danger', 'emergency', 'hospital', 'treatment', 'management',
    'pregnancy', 'maternal', 'lactation', 'colostrum', 'complementary',
    'micronutrient', 'macronutrient', 'energy', 'kilocalorie',
    // Hindi/Marathi keywords
    'बुखार', 'दस्त', 'कुपोषण', 'स्तनपान', 'टीकाकरण', 'आहार',
    'ताप', 'जुलाब', 'लसीकरण', 'पोषण'
]);

/**
 * Tokenize text into lowercase words, filtering stop words
 */
function tokenize(text, removeStopWords = false) {
    const tokens = text
        .toLowerCase()
        .replace(/[^\w\s\u0900-\u097F]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2);
    
    if (removeStopWords) {
        return tokens.filter(w => !STOP_WORDS.has(w));
    }
    return tokens;
}

/**
 * Calculate relevance score between query and a chunk
 * Improved scoring: penalizes data tables, rewards medical content
 */
function scoreChunk(queryTokens, chunk) {
    const chunkText = chunk.text.toLowerCase();
    let score = 0;

    // Penalize data table chunks (lots of numbers, country names, percentages)
    const numberCount = (chunkText.match(/\d+/g) || []).length;
    const wordCount = chunkText.split(/\s+/).length;
    const numberRatio = numberCount / wordCount;
    if (numberRatio > 0.3) return 0; // Skip data tables

    // Penalize very short or very long chunks  
    if (chunk.text.length < 50) return 0;

    for (const qt of queryTokens) {
        if (STOP_WORDS.has(qt)) continue; // Skip common words

        // Check if the query token appears in chunk
        const qtLower = qt.toLowerCase();
        // Count occurrences
        let count = 0;
        let pos = 0;
        while ((pos = chunkText.indexOf(qtLower, pos)) !== -1) {
            count++;
            pos += qtLower.length;
        }
        
        if (count > 0) {
            // High-value keyword gets 5 points per match
            if (HIGH_VALUE_KEYWORDS.has(qtLower)) {
                score += count * 5;
            } else {
                score += count * 2;
            }
        }
    }

    // Bonus for chunks with multiple query terms present
    const termsPresent = queryTokens.filter(qt => !STOP_WORDS.has(qt) && chunkText.includes(qt)).length;
    const significantTerms = queryTokens.filter(qt => !STOP_WORDS.has(qt)).length;
    if (significantTerms > 0 && termsPresent === significantTerms) {
        score *= 1.5; // Bonus if ALL significant query terms found
    }

    // Bonus for shorter, focused chunks (better context)
    if (chunk.text.length < 400) score *= 1.2;

    return score;
}

/**
 * Search the RAG knowledge base for relevant chunks
 */
export function searchKnowledgeBase(query, topK = 5) {
    if (!ragData || !ragData.chunks || ragData.chunks.length === 0) {
        console.warn('[RAG] Knowledge base is empty or not loaded');
        return [];
    }

    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    // Score all chunks
    const scored = ragData.chunks
        .map(chunk => ({
            text: chunk.text,
            source: chunk.source,
            file: chunk.file,
            score: scoreChunk(queryTokens, chunk)
        }))
        .filter(item => item.score > 2) // Higher threshold
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);

    return scored;
}

/**
 * Format retrieved chunks into a context string for the LLM prompt
 */
export function formatRAGContext(chunks) {
    if (!chunks || chunks.length === 0) return '';

    const sourcesUsed = [...new Set(chunks.map(c => c.source))];

    let context = '📚 REFERENCE MATERIAL FROM VERIFIED SOURCES:\n';
    context += `Sources: ${sourcesUsed.join(', ')}\n\n`;

    chunks.forEach((chunk, i) => {
        context += `--- Reference ${i + 1} [${chunk.source}] ---\n`;
        context += chunk.text.substring(0, 400) + '\n\n';
    });

    return context;
}

/**
 * Get RAG metadata
 */
export function getRAGStats() {
    return {
        totalChunks: ragData?.totalChunks || 0,
        totalFiles: ragData?.totalFiles || 0,
        sources: ragData?.sources || [],
        version: ragData?.version || 'unknown'
    };
}
