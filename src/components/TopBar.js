import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function TopBar({ onClearChat, selectedCategory }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="brand-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="url(#brandGrad)" />
            <path d="M8 14l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="brandGrad" x1="0" y1="0" x2="28" y2="28">
                <stop stopColor="#6366f1"/>
                <stop offset="1" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <h1 className="brand-name">ReturnRight AI</h1>
          <p className="brand-tagline">Smart Refund Policy Assistant</p>
        </div>
      </div>

      {selectedCategory && (
        <div className="topbar-filter-badge">
          <span>Filtered: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</span>
        </div>
      )}

      <div className="topbar-actions">
        <button className="icon-btn" onClick={onClearChat} title="Clear conversation">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="icon-btn theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
