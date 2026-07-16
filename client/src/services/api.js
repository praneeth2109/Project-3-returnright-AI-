import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production'
    ? 'https://project-3-returnright-ai.onrender.com/api'
    : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Helper to set authorization token in header
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Auto-initialize token from localStorage if present
const storedToken = localStorage.getItem('adminToken');
if (storedToken) {
  setAuthToken(storedToken);
}

/**
 * Log in admin.
 */
export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password });
  if (data.token) {
    localStorage.setItem('adminToken', data.token);
    setAuthToken(data.token);
  }
  return data;
}

/**
 * Log out admin.
 */
export function logout() {
  localStorage.removeItem('adminToken');
  setAuthToken(null);
}

/**
 * Verify token.
 */
export async function verifyToken() {
  try {
    const { data } = await api.get('/auth/verify');
    return { valid: data.valid, role: data.user?.role || 'admin' };
  } catch (err) {
    logout();
    return { valid: false, role: null };
  }
}

/**
 * Register a new administrator.
 */
export async function registerAdmin(username, password, role = 'admin') {
  const { data } = await api.post('/auth/register', { username, password, role });
  return data;
}

/**
 * Send a query to the retrieval engine.
 * @param {string} question - Natural language question
 * @param {string|null} category - Optional category filter
 * @param {Array} history - Previous messages history
 */
export async function sendQuery(question, category = null, history = []) {
  const { data } = await api.post('/query', { question, category, history });
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

