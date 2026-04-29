/**
 * TF-IDF Retrieval Engine
 * Implements Term Frequency–Inverse Document Frequency scoring
 * for keyword-based semantic search over policy document chunks.
 */

// Common English stop words to ignore during tokenization
const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','are','was','were','be','been','being','have','has',
  'had','do','does','did','will','would','could','should','may','might',
  'shall','can','need','dare','ought','used','i','you','he','she','it',
  'we','they','me','him','her','us','them','my','your','his','its','our',
  'their','what','which','who','this','that','these','those','am','not',
  'no','so','if','as','up','out','about','into','than','then','there',
  'when','where','how','all','any','each','every','both','few','more',
  'most','other','some','such','only','own','same','just',
]);

/**
 * Tokenize and normalize a text string into an array of meaningful terms.
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^[-']+|[-']+$/g, ''))
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

/**
 * Compute term frequency map for a given text.
 * TF = count(term) / total_terms
 */
function computeTermFrequency(text) {
  const tokens = tokenize(text);
  const freq = {};
  tokens.forEach((t) => { freq[t] = (freq[t] || 0) + 1; });
  const total = tokens.length || 1;
  Object.keys(freq).forEach((k) => { freq[k] = freq[k] / total; });
  return freq;
}

/**
 * Given a query and an array of document chunks, compute TF-IDF scores
 * and return the top N ranked results.
 *
 * @param {string} query - The user's natural language query
 * @param {Array} chunks - Array of { sectionId, heading, content, category, policyTitle, policyIcon, termFrequencies }
 * @param {number} topN - How many results to return
 * @param {string|null} categoryFilter - Optional category to restrict results
 * @returns {Array} Ranked chunks with score and keyword highlights
 */
function retrieveTopChunks(query, chunks, topN = 3, categoryFilter = null) {
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) return [];

  // Filter by category if requested
  const candidates = categoryFilter
    ? chunks.filter((c) => c.category === categoryFilter.toLowerCase())
    : chunks;

  // Compute IDF: log(N / df) for each query term
  const N = candidates.length || 1;
  const df = {};
  queryTokens.forEach((term) => {
    df[term] = candidates.filter((c) => {
      const tf = c.termFrequencies instanceof Map
        ? c.termFrequencies
        : c.termFrequencies;
      return (typeof tf.get === 'function' ? tf.get(term) : tf[term]) > 0;
    }).length;
  });

  // Score each chunk using TF-IDF cosine-like similarity
  const scored = candidates.map((chunk) => {
    let score = 0;
    const matchedTerms = new Set();

    queryTokens.forEach((term) => {
      const tf = chunk.termFrequencies instanceof Map
        ? (chunk.termFrequencies.get(term) || 0)
        : (chunk.termFrequencies[term] || 0);

      const idf = Math.log((N + 1) / (df[term] + 1)) + 1; // smoothed IDF
      const tfidf = tf * idf;
      score += tfidf;

      if (tf > 0) matchedTerms.add(term);
    });

    // Boost score if query terms appear in the heading (heading match is very relevant)
    const headingTokens = new Set(tokenize(chunk.heading));
    queryTokens.forEach((t) => {
      if (headingTokens.has(t)) score += 0.5;
    });

    return {
      ...chunk,
      score: parseFloat(score.toFixed(4)),
      matchedKeywords: Array.from(matchedTerms),
    };
  });

  // Sort descending by score, filter out zero-score chunks
  return scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

/**
 * Highlight matched keywords in a text string by wrapping them in <mark> tags.
 */
function highlightKeywords(text, keywords) {
  if (!keywords || keywords.length === 0) return text;
  const pattern = new RegExp(
    `\\b(${keywords.map((k) => escapeRegex(k)).join('|')})\\b`,
    'gi'
  );
  return text.replace(pattern, '<mark>$1</mark>');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { tokenize, computeTermFrequency, retrieveTopChunks, highlightKeywords };
