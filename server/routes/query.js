const express = require('express');
const router = express.Router();
const { handleQuery } = require('../controllers/queryController');

// POST /api/query — Main retrieval-augmented query endpoint
router.post('/', handleQuery);

module.exports = router;
