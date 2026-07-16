const Policy = require('../models/Policy');
const { getEmbedding } = require('./embeddings');

/**
 * Checks all policies in the database, and generates embeddings for
 * any sections that are missing them.
 */
async function migrateEmbeddings() {
  console.log('⚡ Checking for missing policy section embeddings...');
  try {
    const policies = await Policy.find({});
    let updatedCount = 0;

    for (let policy of policies) {
      let isModified = false;
      for (let section of policy.sections) {
        if (!section.embedding || section.embedding.length === 0) {
          console.log(`🧠 Generating embedding for policy "${policy.title}" -> "${section.heading}"`);
          const text = `${section.heading} ${section.content}`;
          const embedding = await getEmbedding(text);
          if (embedding && embedding.length > 0) {
            section.embedding = embedding;
            isModified = true;
            updatedCount++;
          }
        }
      }
      if (isModified) {
        await policy.save();
        console.log(`✅ Saved embeddings for policy "${policy.title}"`);
      }
    }

    console.log(`⚡ Embeddings migration complete. Updated ${updatedCount} sections.`);
  } catch (err) {
    console.error('❌ Embeddings migration failed:', err.message);
  }
}

module.exports = { migrateEmbeddings };
