const express = require('express');
const router = express.Router();
const {
  getAllPolicies,
  getCategories,
  getPolicyByCategory,
  createPolicy,
  deletePolicy,
  deletePolicyByCategory,
  updatePolicyByCategory,
} = require('../controllers/policyController');

// GET /api/policies — List all policies (metadata only)
router.get('/', getAllPolicies);

// GET /api/policies/categories — List all unique categories
router.get('/categories', getCategories);

// GET /api/policies/:category — Get full policy by category
router.get('/:category', getPolicyByCategory);

// POST /api/policies — Upload a new policy document
router.post('/', createPolicy);

// PUT /api/policies/category/:category — Update a policy by category
router.put('/category/:category', updatePolicyByCategory);

// DELETE /api/policies/category/:category — Delete a policy by category
router.delete('/category/:category', deletePolicyByCategory);

// DELETE /api/policies/:id — Delete a policy
router.delete('/:id', deletePolicy);

module.exports = router;
