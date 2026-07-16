const axios = require('axios');

/**
 * Generates a 384-dimensional vector embedding for the given text
 * using Hugging Face Inference API with all-MiniLM-L6-v2.
 */
async function getEmbedding(text) {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return [];
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn('⚠️ Unexpected response from Hugging Face embeddings API:', response.status, response.data);
    }
  } catch (err) {
    console.error('⚠️ Hugging Face Embedding API error:', err.response?.data || err.message);
  }

  return [];
}

module.exports = { getEmbedding };
