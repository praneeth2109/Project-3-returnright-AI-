import React, { useState, useRef, useEffect } from 'react';

const EXAMPLE_QUESTIONS = [
  'What is the return window for electronics?',
  'Can I return a swimsuit without tags?',
  'How long does a furniture refund take?',
  'What happens if my delivery is damaged?',
  'Are final sale items returnable?',
];

export default function ChatInput({ onSend, isLoading, externalValue, onExternalValueUsed }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  // Handle external suggested queries from sidebar
  useEffect(() => {
    if (externalValue) {
      setValue(externalValue);
      textareaRef.current?.focus();
      if (onExternalValueUsed) onExternalValueUsed();
    }
  }, [externalValue, onExternalValueUsed]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  }, [value]);

  return (
    <div className="chat-input-container">
      {/* Example prompts shown when input is empty */}
      {value === '' && (
        <div className="example-prompts">
          {EXAMPLE_QUESTIONS.slice(0, 3).map((q) => (
            <button key={q} className="prompt-chip" onClick={() => setValue(q)}>
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="input-row">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about return windows, refund policies, exceptions..."
          rows={1}
          disabled={isLoading}
        />
        <button
          className={`send-btn ${isLoading ? 'loading' : ''} ${value.trim() ? 'active' : ''}`}
          onClick={handleSubmit}
          disabled={isLoading || !value.trim()}
          title="Send (Enter)"
        >
          {isLoading ? (
            <span className="spinner" />
          ) : (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
      <div className="input-hint">Press Enter to send · Shift+Enter for new line</div>
    </div>
  );
}
