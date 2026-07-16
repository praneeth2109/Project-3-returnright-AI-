const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/auth');
const {
  getAllPolicies,
  getCategories,
  getPolicyByCategory,
  createPolicy,
  deletePolicy,
  deletePolicyByCategory,
  updatePolicyByCategory,
} = require('../controllers/policyController');

/**
 * Authentication middleware to protect policy edits.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  req.user = payload;
  next();
}

// GET /api/policies — List all policies (metadata only)
router.get('/', getAllPolicies);

// GET /api/policies/categories — List all unique categories
router.get('/categories', getCategories);

// GET /api/policies/:category — Get full policy by category
router.get('/:category', getPolicyByCategory);

// POST /api/policies — Upload a new policy document (Admin only)
router.post('/', requireAuth, createPolicy);

// PUT /api/policies/category/:category — Update a policy by category (Admin only)
router.put('/category/:category', requireAuth, updatePolicyByCategory);

// DELETE /api/policies/category/:category — Delete a policy by category (Admin only)
router.delete('/category/:category', requireAuth, deletePolicyByCategory);

// DELETE /api/policies/:id — Delete a policy (Admin only)
router.delete('/:id', requireAuth, deletePolicy);

module.exports = router;
