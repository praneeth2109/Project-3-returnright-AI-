import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Send a query to the retrieval engine.
 * @param {string} question - Natural language question
 * @param {string|null} category - Optional category filter
 */
export async function sendQuery(question, category = null) {
  const { data } = await api.post('/query', { question, category });
  return data;
}

/**
 * Fetch all policy categories.
 */
export async function fetchCategories() {
  const { data } = await api.get('/policies/categories');
  return data;
}

/**
 * Fetch all policies metadata.
 */
export async function fetchPolicies() {
  const { data } = await api.get('/policies');
  return data;
}

/**
 * Fetch full policy content for a category.
 */
export async function fetchPolicyByCategory(category) {
  const { data } = await api.get(`/policies/${category}`);
  return data;
}

/**
 * Upload a new policy document.
 */
export async function uploadPolicy(policyData) {
  const { data } = await api.post('/policies', policyData);
  return data;
}

/**
 * Delete a policy by ID.
 */
export async function deletePolicy(id) {
  const { data } = await api.delete(`/policies/${id}`);
  return data;
}

/**
 * Delete a policy by category name.
 */
export async function deletePolicyByCategory(category) {
  const { data } = await api.delete(`/policies/category/${category}`);
  return data;
}

/**
 * Update a policy by category name.
 */
export async function updatePolicyByCategory(category, policyData) {
  const { data } = await api.put(`/policies/category/${category}`, policyData);
  return data;
}

