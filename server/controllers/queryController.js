const Policy = require('../models/Policy');
const { retrieveTopChunks, retrieveSemanticChunks, highlightKeywords } = require('../utils/retrieval');
const { generateAnswer } = require('../utils/answerGenerator');
const { getEmbedding } = require('../utils/embeddings');


/**
 * Classifies the query category using Hugging Face's facebook/bart-large-mnli model,
 * with a local keyword matcher as a fallback if the API is slow or offline.
 */
async function classifyQueryCategory(question) {
  const categories = ["electronics", "clothing", "furniture", "grocery", "toys", "sports"];
  try {
    const response = await fetch("https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: question,
        parameters: {
          candidate_labels: [...categories, "general refund inquiry"]
        }
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result && result.labels && result.scores && result.scores[0] > 0.45) {
        const topLabel = result.labels[0];
        if (categories.includes(topLabel)) {
          console.log(`🤖 Hugging Face classified query as: "${topLabel}" (score: ${(result.scores[0] * 100).toFixed(1)}%)`);
          return topLabel;
        }
      }
    } else {
      console.warn("Hugging Face classifier returned non-200 status. Falling back to keyword matching.");
    }
  } catch (err) {
    console.error("Hugging Face classifier error:", err.message);
  }

  // Fallback: Keyword matching logic
  const q = question.toLowerCase();
  if (q.includes('electronic') || q.includes('computer') || q.includes('laptop') || q.includes('phone') || q.includes('tv') || q.includes('device') || q.includes('camera') || q.includes('headphone')) {
    return 'electronics';
  }
  if (q.includes('cloth') || q.includes('shirt') || q.includes('pant') || q.includes('dress') || q.includes('apparel') || q.includes('shoe') || q.includes('jacket')) {
    return 'clothing';
  }
  if (q.includes('furnitur') || q.includes('chair') || q.includes('table') || q.includes('sofa') || q.includes('couch') || q.includes('bed') || q.includes('desk')) {
    return 'furniture';
  }
  if (q.includes('toy') || q.includes('game') || q.includes('console') || q.includes('lego') || q.includes('play')) {
    return 'toys';
  }
  if (q.includes('grocer') || q.includes('food') || q.includes('snack') || q.includes('produce') || q.includes('vegetable') || q.includes('fruit') || q.includes('drink') || q.includes('milk')) {
    return 'grocery';
  }
  if (q.includes('sport') || q.includes('ball') || q.includes('fitness') || q.includes('gear') || q.includes('bicycle') || q.includes('helmet') || q.includes('workout')) {
    return 'sports';
  }
  return null;
}

/**
 * POST /api/query
 * Main retrieval endpoint. Accepts a user question, retrieves top policy chunks,
 * and returns a grounded answer with source snippets.
 */
async function handleQuery(req, res) {
  try {
    const { question, category, history } = req.body;

    if (!question || question.trim().length < 3) {
      return res.status(400).json({ error: 'Question must be at least 3 characters.' });
    }

    // Load all policies from DB
    const policies = await Policy.find({});

    if (policies.length === 0) {
      return res.status(503).json({ error: 'Policy database is not yet initialized.' });
    }

    // Auto-detect category if none selected
    let activeCategory = category;
    if (!activeCategory) {
      activeCategory = await classifyQueryCategory(question);
      if (activeCategory) {
        console.log(`🏷️ Auto-detected category: "${activeCategory}" from query "${question}"`);
      }
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
          embedding: section.embedding || [],
        });
      });
    });

    // Fetch query vector embedding from Hugging Face Router
    const queryEmbedding = await getEmbedding(question);

    let topChunks;
    if (queryEmbedding && queryEmbedding.length > 0) {
      console.log(`🧠 Performing semantic vector search for query: "${question}"`);
      topChunks = retrieveSemanticChunks(question, queryEmbedding, chunks, 3, activeCategory || null);
    } else {
      console.warn("⚠️ Falling back to sparse TF-IDF search due to missing query embedding");
      topChunks = retrieveTopChunks(question, chunks, 3, activeCategory || null);
    }

    // Add highlighted content to each chunk
    const enrichedChunks = topChunks.map((chunk) => ({
      ...chunk,
      highlightedContent: highlightKeywords(chunk.content, chunk.matchedKeywords),
    }));

    // Generate grounded answer via Hugging Face API
    const result = await generateAnswer(question, enrichedChunks, history);

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
