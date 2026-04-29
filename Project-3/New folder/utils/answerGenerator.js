/**
 * Answer Generator — Claude API (GenAI) Edition
 *
 * Uses the Anthropic Claude API to synthesize a natural, accurate answer
 * from TF-IDF retrieved policy chunks. Claude is strictly instructed to
 * answer ONLY from the provided context — zero hallucination.
 */

// Using native fetch for OpenRouter API
// Node 18+ includes native fetch

/**
 * Build the policy context block to inject into Claude's prompt.
 * Each chunk is clearly labeled with its source so Claude can cite it.
 */
function buildContextBlock(chunks) {
  return chunks
    .map(
      (chunk, i) =>
        `[SOURCE ${i + 1}] ${chunk.policyTitle} › ${chunk.heading}\n${chunk.content}`
    )
    .join('\n\n---\n\n');
}

/**
 * Generate a grounded, Claude-powered answer from retrieved policy chunks.
 *
 * @param {string} query  - The user's natural language question
 * @param {Array}  chunks - Top-ranked policy chunks from TF-IDF retrieval
 * @returns {Object} { answer, primarySource, sources, confidence, model }
 */
async function generateAnswer(query, chunks) {
  // --- No chunks found: return graceful fallback ---
  if (!chunks || chunks.length === 0) {
    return {
      answer:
        "I'm sorry, I couldn't find relevant policy information for your question. Please try rephrasing your query or select a specific category from the sidebar.",
      sources: [],
      confidence: 'low',
      model: 'fallback',
    };
  }

  const contextBlock = buildContextBlock(chunks);
  const confidence = chunks[0].score > 1.0 ? 'high' : chunks[0].score > 0.3 ? 'medium' : 'low';
  const primarySource = `**${chunks[0].policyTitle}** › ${chunks[0].heading}`;

  // --- Claude system prompt: strict grounding, no hallucination ---
  const systemPrompt = `You are ReturnRight AI, a precise and helpful customer service assistant specializing in return and refund policies for a retail store.

RULES YOU MUST FOLLOW:
1. Answer ONLY using information from the provided policy excerpts below. Do not add any information that is not in the sources.
2. If the sources do not contain enough information to answer the question, say so clearly and suggest the customer contact support.
3. Be concise and conversational — answer in 2–4 sentences unless more detail is genuinely needed.
4. Format key facts (dates, timeframes, conditions) in **bold** for easy scanning.
5. Never invent policies, exceptions, or timeframes that aren't explicitly stated in the sources.
6. Always be polite and helpful in tone.`;

  const userPrompt = `Here are the relevant policy excerpts retrieved for this question:

${contextBlock}

---

Customer question: "${query}"

Please answer the customer's question based strictly on the policy excerpts above.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-haiku",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 512
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch from OpenRouter');
    }

    const answer = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    return {
      answer,
      primarySource,
      sources: chunks.map((chunk) => ({
        sectionId: chunk.sectionId,
        category: chunk.category,
        policyTitle: chunk.policyTitle,
        policyIcon: chunk.policyIcon,
        heading: chunk.heading,
        content: chunk.content,
        highlightedContent: chunk.highlightedContent,
        score: chunk.score,
        matchedKeywords: chunk.matchedKeywords,
      })),
      confidence,
      model: data.model,
      inputTokens: data.usage?.prompt_tokens,
      outputTokens: data.usage?.completion_tokens,
    };
  } catch (err) {
    console.error('OpenRouter API error:', err.message);

    // Graceful fallback: return the top chunk content directly if Claude fails
    return {
      answer: `Based on our **${chunks[0].heading}** policy:\n\n${chunks[0].content}`,
      primarySource,
      sources: chunks.map((c) => ({
        sectionId: c.sectionId,
        category: c.category,
        policyTitle: c.policyTitle,
        policyIcon: c.policyIcon,
        heading: c.heading,
        content: c.content,
        highlightedContent: c.highlightedContent,
        score: c.score,
        matchedKeywords: c.matchedKeywords,
      })),
      confidence,
      model: 'fallback',
      error: err.message,
    };
  }
}

module.exports = { generateAnswer };
