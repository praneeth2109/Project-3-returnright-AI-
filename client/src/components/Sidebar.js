import React, { useEffect, useState } from 'react';
import { fetchPolicies, deletePolicyByCategory } from '../services/api';

const SUGGESTED_QUERIES = {
  electronics: 'What is the return window for electronics?',
  clothing: 'Can I return sale clothing items?',
  furniture: 'What happens if my furniture is damaged on delivery?',
  grocery: 'Can I return spoiled groceries?',
  toys: 'Are video games returnable once opened?',
  sports: 'Can I return used sports shoes?',
};

export default function Sidebar({
  selectedCategory,
  onSelectCategory,
  onUploadClick,
  onSuggestedQuery,
  onDeletePolicy,
  onEditPolicy,
  isAdmin,
  adminRole,
  onLoginClick,
  onLogout,
  onAddAdminClick,
}) {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null); // category being deleted

  useEffect(() => {
    fetchPolicies()
      .then((data) => {
        // Ensure unique categories just in case, though the DB should be unique
        const uniquePolicies = data.filter((v, i, a) => a.findIndex(t => (t.category === v.category)) === i);
        setPolicies(uniquePolicies.sort((a, b) => a.category.localeCompare(b.category)));
      })
      .catch(() => {
        // Fallback mock data
        setPolicies([
          { category: 'electronics', icon: '💻' },
          { category: 'clothing', icon: '👕' },
          { category: 'furniture', icon: '🪑' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (e, cat) => {
    e.stopPropagation(); // Don't trigger category selection
    if (!window.confirm(`Delete the "${cat}" policy? This cannot be undone.`)) return;

    setDeleting(cat);
    try {
      await deletePolicyByCategory(cat);
      setPolicies((prev) => prev.filter((p) => p.category !== cat));
      if (selectedCategory === cat) onSelectCategory(null);
      if (onDeletePolicy) onDeletePolicy(cat);
    } catch (err) {
      alert('Failed to delete policy. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-label">POLICY CATEGORIES</span>
      </div>

      <nav className="category-list">
        <button
          className={`category-item ${!selectedCategory ? 'active' : ''}`}
          onClick={() => onSelectCategory(null)}
        >
          <span className="cat-icon">🔍</span>
          <span>All Categories</span>
          {!selectedCategory && <span className="active-dot" />}
        </button>

        {loading ? (
          <div className="sidebar-loading">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-item" />
            ))}
          </div>
        ) : (
          policies.map((policy) => {
            const cat = policy.category;
            return (
              <button
                key={cat}
                className={`category-item ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => onSelectCategory(selectedCategory === cat ? null : cat)}
              >
                <span className="cat-icon">{policy.icon || '📄'}</span>
                <span className="cat-name">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                {selectedCategory === cat && <span className="active-dot" />}
                
                {isAdmin && (
                  <div className="cat-actions">
                    <span
                      className="cat-edit-btn"
                      title={`Edit ${cat} policy`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEditPolicy) onEditPolicy(cat);
                      }}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span
                      className={`cat-delete-btn ${deleting === cat ? 'deleting' : ''}`}
                      title={`Delete ${cat} policy`}
                      onClick={(e) => handleDelete(e, cat)}
                    >
                      {deleting === cat ? (
                        <span className="cat-delete-spinner" />
                      ) : (
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                  </div>
                )}
              </button>
            );
          })
        )}
      </nav>

      {/* Quick Suggested Queries */}
      {selectedCategory && SUGGESTED_QUERIES[selectedCategory] && (
        <div className="quick-queries">
          <span className="sidebar-label">QUICK QUERY</span>
          <button
            className="suggested-query"
            onClick={() => onSuggestedQuery(SUGGESTED_QUERIES[selectedCategory])}
          >
            {SUGGESTED_QUERIES[selectedCategory]}
          </button>
        </div>
      )}

      <div className="sidebar-footer">
        {isAdmin ? (
          <>
            <button className="upload-btn" onClick={onUploadClick}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Upload Policy
            </button>
            {adminRole === 'super-admin' && (
              <button 
                className="upload-btn" 
                onClick={onAddAdminClick} 
                style={{ marginTop: '8px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)', borderColor: 'rgba(99, 102, 241, 0.3)' }}
              >
                ➕ Add Admin
              </button>
            )}
            <button 
              className="upload-btn logout-btn" 
              onClick={onLogout}
              style={{ marginTop: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              🔒 Log Out
            </button>
          </>
        ) : (
          <button className="upload-btn login-btn" onClick={onLoginClick}>
            🔑 Admin Login
          </button>
        )}
        <div className="sidebar-meta">
          <span>Powered by Semantic Vector Search</span>
        </div>
      </div>
    </aside>
  );
}
