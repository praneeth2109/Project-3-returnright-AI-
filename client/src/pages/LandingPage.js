import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';

export default function LandingPage({ onGetStarted }) {
  const [stage, setStage] = useState('intro'); // 'intro', 'fadeOut', 'landing'
  const [showCards, setShowCards] = useState(false);
  const [demoActive, setDemoActive] = useState(false);

  useEffect(() => {
    // Stage 1: Trigger the status cards after logo pulse (3.5s)
    const cardsTimer = setTimeout(() => {
      setShowCards(true);
    }, 3200);

    // Stage 2: Start fade out overlay (5.2s)
    const fadeTimer = setTimeout(() => {
      setStage('fadeOut');
    }, 5200);

    // Stage 3: Switch to full landing page (5.8s)
    const landingTimer = setTimeout(() => {
      setStage('landing');
    }, 5800);

    return () => {
      clearTimeout(cardsTimer);
      clearTimeout(fadeTimer);
      clearTimeout(landingTimer);
    };
  }, []);

  const handleSkip = () => {
    setStage('landing');
  };

  return (
    <div className="landing-container">
      {/* ── BACKGROUND AI ENVIRONMENT ── */}
      <div className="ai-bg-grid"></div>
      <div className="ai-bg-gradient"></div>
      <div className="ai-light-beams">
        <div className="light-beam beam-1"></div>
        <div className="light-beam beam-2"></div>
      </div>
      <div className="ai-bg-particles">
        <div className="particle p-1"></div>
        <div className="particle p-2"></div>
        <div className="particle p-3"></div>
        <div className="particle p-4"></div>
      </div>

      {/* ── INTRO ANIMATION OVERLAY ── */}
      {stage !== 'landing' && (
        <div className={`intro-overlay ${stage === 'fadeOut' ? 'fade-out' : ''}`}>
          <button className="skip-intro-btn" onClick={handleSkip}>
            Skip Intro →
          </button>

          <div className="intro-neural-network">
            {/* SVG Neural lines in background */}
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="10" y1="20" x2="50" y2="48" className="neural-line line-1" />
              <line x1="90" y1="30" x2="50" y2="48" className="neural-line line-2" />
              <line x1="20" y1="80" x2="50" y2="48" className="neural-line line-3" />
              <line x1="80" y1="75" x2="50" y2="48" className="neural-line line-4" />
            </svg>
          </div>

          <div className="intro-content">
            {/* Logo Assembly & Glow */}
            <div className="intro-logo-glow">
              <Logo size={140} className="animated-logo" />
            </div>

            {/* Wordmark Fades In */}
            <h1 className="intro-title">ReturnRight AI</h1>
            <p className="intro-subtitle">Understand Return Policies in Seconds</p>

            {/* Logo Radial Pulse Waves */}
            <div className="intro-pulse-wave"></div>

            {/* Floating Status Cards from Pulse */}
            <div className={`intro-status-cards ${showCards ? 'visible' : ''}`}>
              <div className="status-card sc-1">
                <span className="sc-icon">✓</span> Return Eligible
              </div>
              <div className="status-card sc-2">
                <span className="sc-icon">✓</span> Refund Available
              </div>
              <div className="status-card sc-3">
                <span className="sc-icon">✓</span> Exchange Supported
              </div>
              <div className="status-card sc-4">
                <span className="sc-icon">✓</span> AI Summary Ready
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN LANDING PAGE CONTENT ── */}
      <div className={`landing-layout ${stage === 'landing' ? 'visible' : ''}`}>
        
        {/* Header */}
        <header className="landing-header">
          <div className="landing-brand">
            <Logo size={36} />
            <span className="landing-brand-name">ReturnRight AI</span>
          </div>
          <button className="landing-nav-btn" onClick={onGetStarted}>
            Launch App
          </button>
        </header>

        {/* Hero Section */}
        <main className="landing-hero">
          <div className="hero-content-col">
            <div className="startup-badge">
              <span className="badge-pulse"></span>
              <span>Next-Gen AI Customer Assistant</span>
            </div>
            
            <h1 className="hero-headline">
              Stop Reading <br />
              <span className="highlight-gradient">Hundreds of Lines</span> <br />
              of Return Policies.
            </h1>
            
            <p className="hero-subheadline">
              AI Explains Everything in Seconds. Paste a product URL or upload a return policy to instantly summarize return windows, refunds, exchanges, and hidden conditions.
            </p>

            <div className="hero-actions">
              <button className="btn-get-started" onClick={onGetStarted}>
                Get Started
                <svg className="arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="btn-watch-demo" onClick={() => setDemoActive(true)}>
                Watch Demo
              </button>
            </div>

            <div className="hero-trust-metrics">
              <div className="metric">
                <strong>98%</strong>
                <span>Accuracy Rate</span>
              </div>
              <div className="metric">
                <strong>&lt; 3s</strong>
                <span>Response Time</span>
              </div>
              <div className="metric">
                <strong>Zero</strong>
                <span>Hallucinations</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Interactive Dashboard Illustration */}
          <div className="hero-ill-col">
            <div className="dashboard-mockup">
              {/* Top Glass Header */}
              <div className="mock-header">
                <div className="mock-dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="mock-url-bar">amazon.com/return-policy-details</div>
              </div>

              {/* Mock Dashboard Layout */}
              <div className="mock-body">
                {/* Sidebar (mini) */}
                <div className="mock-sidebar">
                  <div className="mock-sb-item active"></div>
                  <div className="mock-sb-item"></div>
                  <div className="mock-sb-item"></div>
                </div>

                {/* Main Content Area */}
                <div className="mock-main">
                  {/* Upload Card */}
                  <div className="mock-upload-card">
                    <div className="mock-upload-status">
                      <span className="upload-indicator-pulse"></span>
                      <span>Amazon Return Policy - Analyzed</span>
                    </div>
                  </div>

                  {/* Grounded chat message mockup */}
                  <div className="mock-chat-bubble">
                    <div className="mock-bubble-q">Can I return electronics after 15 days?</div>
                    <div className="mock-bubble-a">
                      Yes. Electronics have a **30-day** return window with **100% refund** in original packaging. Return shipping is **free**.
                    </div>
                  </div>

                  {/* Floating Glassmorphic Cards (The core visual hook) */}
                  <div className="floating-cards-grid">
                    <div className="floating-card fc-window">
                      <div className="fc-icon">📅</div>
                      <div>
                        <div className="fc-label">Return Window</div>
                        <div className="fc-val">30 Days</div>
                      </div>
                    </div>

                    <div className="floating-card fc-refund">
                      <div className="fc-icon">💳</div>
                      <div>
                        <div className="fc-label">Refund Type</div>
                        <div className="fc-val">100% Original</div>
                      </div>
                    </div>

                    <div className="floating-card fc-shipping">
                      <div className="fc-icon">📦</div>
                      <div>
                        <div className="fc-label">Replacement</div>
                        <div className="fc-val">Free Label</div>
                      </div>
                    </div>

                    <div className="floating-card fc-score">
                      <div className="fc-icon">🛡️</div>
                      <div>
                        <div className="fc-label">Confidence</div>
                        <div className="fc-val val-green">98% High</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Demo Modal */}
      {demoActive && (
        <div className="demo-modal-overlay" onClick={() => setDemoActive(false)}>
          <div className="demo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="demo-modal-header">
              <h3>ReturnRight AI Demo</h3>
              <button className="close-demo" onClick={() => setDemoActive(false)}>✕</button>
            </div>
            <div className="demo-modal-body">
              <div className="demo-video-placeholder">
                <div className="demo-play-btn"></div>
                <p>Interactive AI Demo Preview</p>
                <button className="btn-get-started" onClick={onGetStarted} style={{ marginTop: '16px' }}>
                  Try App Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
