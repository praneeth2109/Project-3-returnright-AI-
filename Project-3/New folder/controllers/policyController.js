const Policy = require('../models/Policy');
const { computeTermFrequency } = require('../utils/retrieval');
const { v4: uuidv4 } = require('uuid');

/**
 * GET /api/policies
 * Returns all policies with their metadata (no heavy section content by default).
 */
async function getAllPolicies(req, res) {
  try {
    const policies = await Policy.find({}, 'id category title icon sections.id sections.heading');
    return res.json(policies);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch policies.' });
  }
}

/**
 * GET /api/policies/categories
 * Returns a list of unique policy categories.
 */
async function getCategories(req, res) {
  try {
    const categories = await Policy.distinct('category');
    return res.json(categories.sort());
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch categories.' });
  }
}

/**
 * GET /api/policies/:category
 * Returns full policy content for a given category.
 */
async function getPolicyByCategory(req, res) {
  try {
    const { category } = req.params;
    const policy = await Policy.findOne({ category: category.toLowerCase() });
    if (!policy) {
      return res.status(404).json({ error: `No policy found for category: ${category}` });
    }
    return res.json(policy);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch policy.' });
  }
}

/**
 * POST /api/policies
 * Upload/create a new policy document. Computes TF-IDF at index time.
 */
async function createPolicy(req, res) {
  try {
    const { category, title, icon, sections } = req.body;

    if (!category || !title || !sections || !Array.isArray(sections)) {
      return res.status(400).json({ error: 'category, title, and sections[] are required.' });
    }

    const existing = await Policy.findOne({ category: category.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: `A policy for category "${category}" already exists.` });
    }

    // Pre-compute TF-IDF for each section
    const processedSections = sections.map((section, i) => ({
      id: section.id || `${category}_${uuidv4().slice(0, 8)}`,
      heading: section.heading,
      content: section.content,
      termFrequencies: computeTermFrequency(`${section.heading} ${section.content}`),
    }));

    const policy = await Policy.create({
      id: `pol_${category.toLowerCase()}_${uuidv4().slice(0, 8)}`,
      category: category.toLowerCase(),
      title,
      icon: icon || '📄',
      sections: processedSections,
    });

    return res.status(201).json({ message: 'Policy created successfully.', policy });
  } catch (err) {
    console.error('Create policy error:', err);
    return res.status(500).json({ error: 'Failed to create policy.' });
  }
}

/**
 * DELETE /api/policies/:id
 * Delete a policy by its document ID.
 */
async function deletePolicy(req, res) {
  try {
    const { id } = req.params;
    const result = await Policy.findOneAndDelete({ id });
    if (!result) {
      return res.status(404).json({ error: 'Policy not found.' });
    }
    return res.json({ message: 'Policy deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete policy.' });
  }
}

/**
 * DELETE /api/policies/category/:category
 * Delete a policy by its category name.
 */
async function deletePolicyByCategory(req, res) {
  try {
    const { category } = req.params;
    const result = await Policy.findOneAndDelete({ category: category.toLowerCase() });
    if (!result) {
      return res.status(404).json({ error: `No policy found for category: ${category}` });
    }
    return res.json({ message: `Policy for "${category}" deleted successfully.` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete policy.' });
  }
}

/**
 * PUT /api/policies/category/:category
 * Update a policy by its category name.
 */
async function updatePolicyByCategory(req, res) {
  try {
    const { category } = req.params;
    const { category: newCategory, title, icon, sections } = req.body;

    if (!title || !sections || !Array.isArray(sections)) {
      return res.status(400).json({ error: 'title and sections[] are required.' });
    }

    const updatedCategory = newCategory ? newCategory.toLowerCase() : category.toLowerCase();

    // Pre-compute TF-IDF for each section
    const processedSections = sections.map((section) => ({
      id: section.id || `${updatedCategory}_${uuidv4().slice(0, 8)}`,
      heading: section.heading,
      content: section.content,
      termFrequencies: computeTermFrequency(`${section.heading} ${section.content}`),
    }));

    const updatedPolicy = await Policy.findOneAndUpdate(
      { category: category.toLowerCase() },
      { 
        category: updatedCategory,
        title, 
        icon: icon || '📄', 
        sections: processedSections 
      },
      { new: true }
    );

    if (!updatedPolicy) {
      return res.status(404).json({ error: `No policy found for category: ${category}` });
    }

    return res.json({ message: 'Policy updated successfully.', policy: updatedPolicy });
  } catch (err) {
    console.error('Update policy error:', err);
    return res.status(500).json({ error: 'Failed to update policy.' });
  }
}

module.exports = { getAllPolicies, getCategories, getPolicyByCategory, createPolicy, deletePolicy, deletePolicyByCategory, updatePolicyByCategory };
