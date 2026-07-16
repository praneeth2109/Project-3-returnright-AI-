import React, { useState, useEffect, useRef } from 'react';
import Logo from '../components/Logo';

export default function LandingPage({ onGetStarted }) {
  const [stage, setStage] = useState('ambient'); // 'ambient', 'vortex', 'explode', 'assemble', 'logoGlow', 'landing'
  const [activeCardIndex, setActiveCardIndex] = useState(-1);
  const [demoActive, setDemoActive] = useState(false);
  const [mockScore, setMockScore] = useState(0);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const particlesRef = useRef([]);

  // Glass cards to reveal in Scene 5
  const glassCards = [
    { text: '✓ Return Eligible', delay: 0 },
    { text: '✓ Refund Available', delay: 200 },
    { text: '✓ Exchange Supported', delay: 400 },
    { text: '✓ Warranty Included', delay: 600 },
    { text: '✓ AI Summary Ready', delay: 800 },
    { text: '✓ Confidence 98%', delay: 1000 },
  ];

  // Timeline Controller
  useEffect(() => {
    // Stage 1: Ambient particles drifting (0s - 3s)
    
    // Stage 2: Vortex convergence (3s)
    const vortexTimer = setTimeout(() => {
      setStage('vortex');
    }, 3000);

    // Stage 3: Slow-motion fragment explosion (5.5s)
    const explodeTimer = setTimeout(() => {
      setStage('explode');
    }, 5500);

    // Stage 4: Intelligently assemble logo symbol (7.5s)
    const assembleTimer = setTimeout(() => {
      setStage('assemble');
    }, 7500);

    // Stage 5: Completed Logo glows and emits wave (9.5s)
    const glowTimer = setTimeout(() => {
      setStage('logoGlow');
      // Reveal glass cards one-by-one
      glassCards.forEach((_, idx) => {
        setTimeout(() => {
          setActiveCardIndex(idx);
        }, 300 + idx * 300);
      });
    }, 9500);

    // Stage 6: Camera pulls back, full landing dashboard fades in (13.5s)
    const landingTimer = setTimeout(() => {
      setStage('landing');
    }, 13500);

    return () => {
      clearTimeout(vortexTimer);
      clearTimeout(explodeTimer);
      clearTimeout(assembleTimer);
      clearTimeout(glowTimer);
      clearTimeout(landingTimer);
    };
  }, []);

  // Dashboard Mockup Animation - count up confidence meter
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
      }, 30);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // Skip animation handler
  const handleSkip = () => {
    setStage('landing');
  };

  // Canvas particle engine
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
    const centerX = w / 2;
    const centerY = h / 2;

    // Generate Logo assembly targets (shield contour, inner box, arrow points)
    const targets = [];
    
    // 1. Shield outline points (approx. 100 points)
    for (let i = 0; i < 100; i++) {
      const t = (i / 100) * Math.PI * 2;
      // Shield parametric form: curves down to bottom tip
      const x = centerX + 110 * Math.sin(t) * (1.2 - 0.25 * Math.cos(t));
      const y = centerY + 110 * Math.cos(t) + 30 * Math.abs(Math.sin(t)) - 25;
      targets.push({ x, y, color: '#2563EB' }); // Blue
    }

    // 2. Center shopping package points (approx. 60 points)
    for (let i = 0; i < 20; i++) {
      // Top face path
      const progress = i / 20;
      targets.push({ x: centerX - 35 + progress * 70, y: centerY - 25 + (progress < 0.5 ? progress * 30 : (1 - progress) * 30), color: '#06B6D4' });
      // Left vertical face
      targets.push({ x: centerX - 35, y: centerY - 10 + progress * 50, color: '#3b82f6' });
      // Right vertical face
      targets.push({ x: centerX + 35, y: centerY - 10 + progress * 50, color: '#10B981' });
    }

    // Initialize 600 particles
    const particles = [];
    for (let i = 0; i < 600; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 200 - 100,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 1.8 + 0.6,
        color: Math.random() > 0.45 ? '#2563EB' : '#10B981', // Blue or Emerald
        alpha: Math.random() * 0.7 + 0.3,
        trail: [],
      });
    }
    particlesRef.current = particles;

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; // Trail effect in canvas background
      ctx.fillRect(0, 0, w, h);

      // Draw faint digital grid in background
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 60;
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

      // Render & Animate Particles
      particles.forEach((p, idx) => {
        // Handle stages
        if (stage === 'ambient') {
          // Drifting
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;

          // Connect nearby particles with thin neural lines
          for (let j = idx + 1; j < idx + 8; j++) {
            const other = particles[j % particles.length];
            const dist = Math.hypot(p.x - other.x, p.y - other.y);
            if (dist < 100) {
              ctx.strokeStyle = `rgba(6, 182, 212, ${0.08 * (1 - dist / 100)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        } else if (stage === 'vortex') {
          // Spiraling towards center (accelerating)
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          const dist = Math.hypot(dx, dy) || 1;

          const speed = Math.min(8, 400 / dist);
          const pullX = dx / dist;
          const pullY = dy / dist;
          const tangentX = -pullY;
          const tangentY = pullX;

          p.vx += pullX * 0.2 + tangentX * 0.35;
          p.vy += pullY * 0.2 + tangentY * 0.35;

          // Apply speed limit
          p.vx = Math.max(-10, Math.min(10, p.vx));
          p.vy = Math.max(-10, Math.min(10, p.vy));

          p.x += p.vx;
          p.y += p.vy;
        } else if (stage === 'explode') {
          // First frame of explosion assigns high speed outward
          if (!p.exploded) {
            const angle = Math.random() * Math.PI * 2;
            const force = Math.random() * 18 + 6;
            p.vx = Math.cos(angle) * force;
            p.vy = Math.sin(angle) * force;
            p.exploded = true;
          }

          // Slow-motion drag simulation (decay speed)
          p.vx *= 0.89;
          p.vy *= 0.89;

          p.x += p.vx;
          p.y += p.vy;

          // Draw trails
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 8) p.trail.shift();
          
          ctx.beginPath();
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.6;
          ctx.lineWidth = p.radius * 0.8;
          p.trail.forEach((pos, i) => {
            if (i === 0) ctx.moveTo(pos.x, pos.y);
            else ctx.lineTo(pos.x, pos.y);
          });
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        } else if (stage === 'assemble') {
          // Converge onto targets
          const target = targets[idx % targets.length];
          if (target) {
            const dx = target.x - p.x;
            const dy = target.y - p.y;
            p.x += dx * 0.12;
            p.y += dy * 0.12;
            p.color = target.color;
          }
        } else if (stage === 'logoGlow' || stage === 'landing') {
          // Slow breathing drift around logo outline
          const target = targets[idx % targets.length];
          if (target) {
            const dx = target.x - p.x;
            const dy = target.y - p.y;
            p.x += dx * 0.08 + Math.sin(time + idx) * 0.1;
            p.y += dy * 0.08 + Math.cos(time + idx) * 0.1;
            p.color = target.color;
          }
        }

        // Draw particle node
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [stage]);

  return (
    <div className="landing-container">
      {/* Cinematic HTML5 Canvas Background */}
      {stage !== 'landing' && (
        <canvas ref={canvasRef} className="cinematic-canvas" />
      )}

      {/* Grid Overlay for depth */}
      {stage !== 'landing' && <div className="cinematic-grid-overlay" />}

      {/* ── INTRO TIMELINE STAGE RENDERERS ── */}
      {stage !== 'landing' && (
        <div className="intro-container">
          {/* Skip Intro Button */}
          <button className="skip-intro-btn" onClick={handleSkip}>
            Skip Intro →
          </button>

          {/* Logo assembly glow scene */}
          {(stage === 'assemble' || stage === 'logoGlow') && (
            <div className={`cinematic-logo-glow ${stage === 'logoGlow' ? 'active-halo' : ''}`}>
              <Logo size={180} className={`intro-svg-logo ${stage === 'logoGlow' ? 'pulse-logo' : ''}`} />
              <div className="glow-radial-halo"></div>
            </div>
          )}

          {/* Title and subtext animation */}
          <div className="cinematic-text-col">
            <h1 className={`cinematic-title ${stage === 'logoGlow' ? 'fade-in' : ''}`}>
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
            <p className={`cinematic-subtitle ${stage === 'logoGlow' ? 'fade-in' : ''}`}>
              {'Understand Return Policies in Seconds'.split('').map((char, index) => (
                <span 
                  key={index} 
                  style={{ animationDelay: `${0.8 + index * 0.02}s` }}
                  className="letter-span-sub"
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </p>
          </div>

          {/* Scene 5: Floating glass cards appearing in radial pulse */}
          <div className={`cinematic-glass-cards-grid ${stage === 'logoGlow' ? 'visible' : ''}`}>
            {glassCards.map((card, idx) => (
              <div 
                key={idx}
                className={`glass-metric-card ${activeCardIndex >= idx ? 'revealed' : ''}`}
                style={{ '--delay': `${card.delay}ms` }}
              >
                <div className="glass-card-inner">
                  <span className="glass-card-check">✓</span>
                  <span>{card.text.replace('✓ ', '')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN PREMIUM LANDING DASHBOARD (Scene 6) ── */}
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

          {/* Right Column: Interactive Dashboard Mockup */}
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
