import React, { useState, useEffect } from 'react';

/**
 * Renders simple markdown-like formatting: **bold**, *italic*, newlines.
 */
function formatText(text) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return (
      <span key={i}>
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={j}>{part.slice(1, -1)}</em>;
          }
          return part;
        })}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    );
  });
}

function TypewriterText({ text }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!text) return;
    const words = text.split(' ');
    let timer;

    if (currentIndex < words.length) {
      timer = setTimeout(() => {
        setDisplayedText((prev) => prev + (currentIndex > 0 ? ' ' : '') + words[currentIndex]);
        setCurrentIndex((idx) => idx + 1);
      }, 25); // Faster typing feels snappier and mimics high-speed RAG streaming
    }
    return () => clearTimeout(timer);
  }, [text, currentIndex]);

  const isComplete = currentIndex >= (text ? text.split(' ').length : 0);

  return (
    <>
      {formatText(displayedText)}
      {!isComplete && <span className="typewriter-cursor">█</span>}
    </>
  );
}

function SourceCard({ source, index }) {
  const [expanded, setExpanded] = useState(false);

  const confidenceColor = {
    high: '#10b981',
    medium: '#f59e0b',
    low: '#ef4444',
  };

  return (
    <div className="source-card">
      <div className="source-header" onClick={() => setExpanded(!expanded)}>
        <div className="source-meta">
          <span className="source-icon">{source.policyIcon}</span>
          <div>
            <span className="source-title">{source.policyTitle}</span>
            <span className="source-heading"> › {source.heading}</span>
          </div>
        </div>
        <div className="source-actions">
          <span
            className="score-badge"
            style={{ color: source.score > 1.0 ? '#10b981' : source.score > 0.3 ? '#f59e0b' : '#6b7280' }}
          >
            {(source.score * 100).toFixed(0)}% match
          </span>
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="source-body">
          {/* Render highlighted HTML content safely */}
          <p
            className="source-content"
            dangerouslySetInnerHTML={{ __html: source.highlightedContent || source.content }}
          />
          {source.matchedKeywords && source.matchedKeywords.length > 0 && (
            <div className="keyword-tags">
              {source.matchedKeywords.map((kw) => (
                <span key={kw} className="keyword-tag">{kw}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const isError = message.isError;
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'like' | 'dislike' | null

  const isNew = !isUser && !isError && message.timestamp && (Date.now() - new Date(message.timestamp).getTime()) < 2000;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timeStr = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`message-wrapper ${isUser ? 'user-wrapper' : 'assistant-wrapper'}`}>
      {!isUser && (
        <div className="avatar assistant-avatar">
          <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
            <path d="M8 14l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      <div className={`message-group ${isUser ? 'user-group' : 'assistant-group'}`}>
        <div
          className={`bubble ${isUser ? 'user-bubble' : 'assistant-bubble'} ${isError ? 'error-bubble' : ''}`}
        >
          <div className="bubble-text">
            {isNew ? <TypewriterText text={message.text} /> : formatText(message.text)}
          </div>
        </div>

        {/* ChatGPT style utilities: Copy & Feedback */}
        {!isUser && !isError && (
          <div className="message-utilities">
            <button className={`utility-btn ${copied ? 'copied' : ''}`} onClick={handleCopy} title="Copy response">
              {copied ? (
                <>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeLinecap="round"/>
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              className={`utility-btn feedback-btn ${feedback === 'like' ? 'active' : ''}`}
              onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
              title="Helpful"
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              className={`utility-btn feedback-btn ${feedback === 'dislike' ? 'active' : ''}`}
              onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
              title="Not helpful"
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h3a2 2 0 012 2v7a2 2 0 01-2 2h-3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}

        {/* Model badge — shows which AI model generated the answer */}
        {!isUser && message.model && message.model !== 'fallback' && (
          <div className="model-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Claude AI</span>
            {message.outputTokens && (
              <span className="token-count">{message.outputTokens} tokens</span>
            )}
          </div>
        )}

        {/* Source citations for assistant messages */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="sources-section">
            <div className="sources-label">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" strokeLinecap="round"/>
              </svg>
              Policy Sources ({message.sources.length})
            </div>
            {message.sources.map((source, i) => (
              <SourceCard key={source.sectionId || i} source={source} index={i} />
            ))}
          </div>
        )}

        <span className="message-time">{timeStr}</span>
      </div>

      {isUser && (
        <div className="avatar user-avatar">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}
