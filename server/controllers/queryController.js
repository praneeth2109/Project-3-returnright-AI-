const Policy = require('../models/Policy');
const { retrieveTopChunks, highlightKeywords } = require('../utils/retrieval');
const { generateAnswer } = require('../utils/answerGenerator');

/**
 * POST /api/query
 * Main retrieval endpoint. Accepts a user question, retrieves top policy chunks,
 * and returns a grounded answer with source snippets.
 */
async function handleQuery(req, res) {
  try {
    const { question, category } = req.body;

    if (!question || question.trim().length < 3) {
      return res.status(400).json({ error: 'Question must be at least 3 characters.' });
    }

    // Load all policies from DB
    const policies = await Policy.find({});

    if (policies.length === 0) {
      return res.status(503).json({ error: 'Policy database is not yet initialized.' });
    }

    // Flatten all sections into a searchable chunk array
    const chunks = [];
    policies.forEach((policy) => {
      policy.sections.forEach((section) => {
        chunks.push({
          sectionId: section.id,
          heading: section.heading,
          content: section.content,
          category: policy.category,
          policyTitle: policy.title,
          policyIcon: policy.icon,
          // Convert Mongoose Map to plain object for retrieval engine
          termFrequencies: Object.fromEntries(section.termFrequencies || new Map()),
        });
      });
    });

    // Retrieve top 3 most relevant chunks using TF-IDF
    const topChunks = retrieveTopChunks(question, chunks, 3, category || null);

    // Add highlighted content to each chunk
    const enrichedChunks = topChunks.map((chunk) => ({
      ...chunk,
      highlightedContent: highlightKeywords(chunk.content, chunk.matchedKeywords),
    }));

    // Generate grounded answer via Claude API (RAG pattern)
    const result = await generateAnswer(question, enrichedChunks);

    return res.json({
      question,
      ...result,
      retrievedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Query error:', err);
    return res.status(500).json({ error: 'Internal server error during query processing.' });
  }
}

module.exports = { handleQuery };
