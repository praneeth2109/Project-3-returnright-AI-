import React, { useState } from 'react';
import { login } from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await login(username, password);
      onLoginSuccess(data.admin.username);
      setUsername('');
      setPassword('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔒 Administrator Login</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p className="json-hint" style={{ marginBottom: '16px' }}>
              Enter your credentials to unlock manager options like uploading, updating, and deleting policies.
            </p>

            <div className="form-fields">
              <div className="field">
                <label htmlFor="login-username">Username</label>
                <input
                  id="login-username"
                  type="text"
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="field">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter passcode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {error && <div className="modal-error" style={{ marginTop: '16px' }}>{error}</div>}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
