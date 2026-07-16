const crypto = require('crypto');

// Retrieve or fallback to a JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'returnright-super-secret-key-987654321';

/**
 * Hash a password using SHA-256 (native, zero dependencies).
 */
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Generate a JWT-like signed token using HMAC SHA-256.
 */
function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  
  // Token expires in 24 hours
  const exp = Date.now() + 24 * 60 * 60 * 1000;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
    
  return `${header}.${body}.${signature}`;
}

/**
 * Verify a JWT-like signed token and return the payload if valid.
 */
function verifyToken(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, body, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
      
    if (signature !== expectedSignature) return null;
    
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp < Date.now()) return null; // Token expired
    
    return payload;
  } catch (err) {
    return null;
  }
}

module.exports = {
  hashPassword,
  generateToken,
  verifyToken,
};
