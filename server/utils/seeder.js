const Policy = require('../models/Policy');
const { computeTermFrequency } = require('./retrieval');
const policies = require('../data/policies.json');

/**
 * Seed the database with sample policy documents.
 * Computes TF-IDF term frequencies for each section chunk at index time.
 * Only runs if the database is empty to avoid duplicate seeding.
 */
async function seedDatabase() {
  try {
    const count = await Policy.countDocuments();
    if (count > 0) {
      console.log(`📚 Database already seeded with ${count} policies.`);
      return;
    }

    console.log('🌱 Seeding database with sample policies...');

    // Pre-compute term frequencies for each section at index time
    const preparedPolicies = policies.map((policy) => ({
      ...policy,
      sections: policy.sections.map((section) => ({
        ...section,
        // Combine heading + content for richer term matching
        termFrequencies: computeTermFrequency(`${section.heading} ${section.content}`),
      })),
    }));

    await Policy.insertMany(preparedPolicies);
    console.log(`✅ Seeded ${preparedPolicies.length} policies successfully.`);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  }
}

module.exports = { seedDatabase };
