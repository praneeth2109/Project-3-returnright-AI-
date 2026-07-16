import React, { useState, useEffect, useRef } from 'react';
import Logo from '../components/Logo';

export default function LandingPage({ onGetStarted }) {
  const [stage, setStage] = useState('blueprint'); // 'blueprint', 'metallic', 'title', 'landing'
  const [mockScore, setMockScore] = useState(0);
  const [demoActive, setDemoActive] = useState(false);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  // Timeline: 4 Seconds Reveal
  useEffect(() => {
    // 1.5s: Metallic transformation
    const metallicTimer = setTimeout(() => {
      setStage('metallic');
    }, 1500);

    // 3.0s: Title reveals
    const titleTimer = setTimeout(() => {
      setStage('title');
    }, 3000);

    // 4.0s: Landing page goes live
    const landingTimer = setTimeout(() => {
      setStage('landing');
    }, 4000);

    return () => {
      clearTimeout(metallicTimer);
      clearTimeout(titleTimer);
      clearTimeout(landingTimer);
    };
  }, []);

  // Dashboard score count-up
  useEffect(() => {
    if (stage === 'landing') {
      const interval = setInterval(() => {
        setMockScore((prev) => {
          if (prev >= 98) {
            clearInterval(interval);
            return 98;
          }
          return prev + 2;
        });
      }, 25);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // Blueprint background grid canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const w = canvas.width;
    const h = canvas.height;

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.fillStyle = '#050816';
      ctx.fillRect(0, 0, w, h);

      // Render glowing blueprint grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Drawing rotating drafting compass circles in blueprint stage
      if (stage === 'blueprint' || stage === 'metallic') {
        ctx.save();
        ctx.translate(w / 2, h / 2 - 50);
        ctx.rotate(time * 0.4);
        
        // Outer drafting ring
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
        ctx.setLineDash([4, 12]);
        ctx.beginPath();
        ctx.arc(0, 0, 140, 0, Math.PI * 2);
        ctx.stroke();

        // Inner guidelines
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(0, 0, 90, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [stage]);

  const handleSkip = () => {
    setStage('landing');
  };

  return (
    <div className="landing-container" style={{ background: '#050816' }}>
      
      {/* Blueprint grid background */}
      <canvas ref={canvasRef} className={`cinematic-canvas stage-${stage}`} />

      {/* ── 4-SECOND BLUEPRINT INTRO CONTAINER ── */}
      <div className={`blueprint-intro-overlay stage-${stage}`}>
        
        <button className="skip-intro-btn" onClick={handleSkip}>
          Skip Intro →
        </button>

        <div className="blueprint-workspace">
          {/* Blueprint Grid Vectors */}
          <svg className="blueprint-vectors" viewBox="0 0 400 400">
            {/* Diagonal lines */}
            <line x1="50" y1="50" x2="350" y2="350" stroke="rgba(6, 182, 212, 0.12)" strokeDasharray="3,3" />
            <line x1="350" y1="50" x2="50" y2="350" stroke="rgba(6, 182, 212, 0.12)" strokeDasharray="3,3" />
            
            {/* Horizontal / Vertical coordinate lines */}
            <line x1="200" y1="20" x2="200" y2="380" stroke="rgba(6, 182, 212, 0.15)" strokeDasharray="5,5" />
            <line x1="20" y1="200" x2="380" y2="200" stroke="rgba(6, 182, 212, 0.15)" strokeDasharray="5,5" />

            {/* Outer drafting square bounds */}
            <rect x="75" y="75" width="250" height="250" fill="none" stroke="rgba(6, 182, 212, 0.08)" />

            {/* Drafting text indicators */}
            <text x="208" y="70" fill="rgba(6, 182, 212, 0.45)" fontSize="9" fontFamily="monospace">W: 180.00mm</text>
            <text x="330" y="205" fill="rgba(6, 182, 212, 0.45)" fontSize="9" fontFamily="monospace" rotate="90">H: 180.00mm</text>
            <text x="210" y="325" fill="rgba(6, 182, 212, 0.4)" fontSize="8" fontFamily="monospace">SCALE: 1:1</text>
            
            {/* Dimension reference arrows */}
            <path d="M75 60 L325 60" stroke="rgba(6, 182, 212, 0.25)" markerEnd="url(#arrow)" />
            <path d="M340 75 L340 325" stroke="rgba(6, 182, 212, 0.25)" />
          </svg>

          {/* Drawing/Solid Logo Object wrapper */}
          <div className={`blueprint-logo-container ${stage}`}>
            <Logo size={160} className="blueprint-logo-element" />
            <div className="metallic-glow-halo"></div>
          </div>
        </div>

        {/* Spaced title reveal */}
        <div className="blueprint-title-row">
          <h1 className={`blueprint-title ${(stage === 'title' || stage === 'metallic') ? 'fade-in' : ''}`}>
            {'ReturnRight AI'.split('').map((char, index) => (
              <span 
                key={index} 
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                className="letter-span"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
          <p className={`blueprint-subtitle ${(stage === 'title') ? 'fade-in' : ''}`}>
            {'Understand Return Policies in Seconds'.split('').map((char, index) => (
              <span 
                key={index} 
                style={{ animationDelay: `${0.6 + index * 0.02}s` }}
                className="letter-span-sub"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </p>
        </div>

      </div>

      {/* ── MAIN LANDING DASHBOARD (Fades in seamlessly) ── */}
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

          {/* Right Column: Premium Dashboard illustration */}
          <div className="hero-ill-col">
            <div className="dashboard-mockup">
              <div className="mock-header">
                <div className="mock-dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="mock-url-bar">amazon.com/return-policy-details</div>
              </div>

              <div className="mock-body">
                <div className="mock-sidebar">
                  <div className="mock-sb-item active"></div>
                  <div className="mock-sb-item"></div>
                  <div className="mock-sb-item"></div>
                </div>

                <div className="mock-main">
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
                      Yes. Electronics have a <span className="highlight-tag">30-day</span> return window with <span className="highlight-tag">100% refund</span> in original packaging. Return shipping is <span className="highlight-tag-green">free</span>.
                    </div>
                  </div>

                  {/* Floating Glassmorphic Cards */}
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
                        <div className="fc-val val-green">{mockScore}% High</div>
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
