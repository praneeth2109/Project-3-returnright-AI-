import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="message-wrapper assistant-wrapper">
      <div className="avatar assistant-avatar">
        <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
          <path d="M8 14l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="bubble assistant-bubble typing-bubble">
        <div className="typing-dots">
          <span />
          <span />
          <span />
        </div>
        <span className="typing-label">Searching policies...</span>
      </div>
    </div>
  );
}
