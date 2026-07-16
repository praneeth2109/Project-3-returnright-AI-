import React, { useState } from 'react';
import { registerAdmin } from '../services/api';

export default function RegisterAdminModal({ isOpen, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await registerAdmin(username, password, role);
      setSuccess(true);
      setUsername('');
      setPassword('');
      setRole('admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register administrator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Add New Administrator</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {success ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '32px 20px' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🎉</span>
            <h3 style={{ color: 'var(--accent)', marginBottom: '8px', fontSize: '16px', fontWeight: '700' }}>
              Registration Successful!
            </h3>
            <p className="json-hint" style={{ marginBottom: '24px' }}>
              The new administrator account has been successfully created. They can now log in using these credentials.
            </p>
            <button className="btn-primary" onClick={() => setSuccess(false)}>
              Add Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <p className="json-hint" style={{ marginBottom: '16px' }}>
                Onboard a new store administrator. Choose their role to grant either policy editing access or super-admin management access.
              </p>

              <div className="form-fields">
                <div className="field">
                  <label htmlFor="reg-username">New Username</label>
                  <input
                    id="reg-username"
                    type="text"
                    placeholder="e.g. manager_jane"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="field">
                  <label htmlFor="reg-password">Password / Passcode</label>
                  <input
                    id="reg-password"
                    type="password"
                    placeholder="Set passcode"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="field">
                  <label htmlFor="reg-role">Account Role</label>
                  <select
                    id="reg-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-elevated)',
                      color: 'var(--text-primary)',
                      fontSize: '13.5px',
                      outline: 'none',
                      fontFamily: "'DM Sans', sans-serif"
                    }}
                  >
                    <option value="admin">Admin (Policy Editor)</option>
                    <option value="super-admin">Super Admin (System Manager)</option>
                  </select>
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
                {loading ? 'Registering...' : 'Register Admin'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
