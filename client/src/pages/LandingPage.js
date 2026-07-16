import React, { useState, useEffect, useRef } from 'react';
import Logo from '../components/Logo';

export default function LandingPage({ onGetStarted }) {
  const [stage, setStage] = useState('darkness'); // 'darkness', 'awakens', 'problem', 'control', 'logo', 'title', 'transition', 'landing'
  const [activeCardIndex, setActiveCardIndex] = useState(-1);
  const [demoActive, setDemoActive] = useState(false);
  const [mockScore, setMockScore] = useState(0);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  // Status cards for Stage 'control'
  const glassCards = [
    { text: '✓ Return Eligible', delay: 0 },
    { text: '✓ Refund Available', delay: 200 },
    { text: '✓ Exchange Supported', delay: 400 },
    { text: '✓ Warranty Included', delay: 600 },
    { text: '✓ AI Summary Ready', delay: 800 },
    { text: '✓ Confidence 98%', delay: 1000 },
  ];

  // Documents/legal text terms for Stage 'problem'
  const problemDocuments = [
    { brand: 'Amazon Return Policy', text: 'All return requests must be submitted within the established window. Items returned without authorization will be subject to a restocking fee of up to 20%...', delay: 0, x: 15, y: 20, z: -800 },
    { brand: 'Nike Store Terms', text: 'Products must be returned unworn and unwashed with original tags attached. Final sale and custom configurations are strictly non-refundable under any conditions...', delay: 100, x: 75, y: 15, z: -600 },
    { brand: 'Apple Policy Details', text: 'Hardware returns are subject to a 14-day window. Opened software, custom-configured Macs, and activated subscriptions are strictly final sale...', delay: 200, x: 20, y: 70, z: -400 },
    { brand: 'Adidas Returns', text: 'Items must be returned in their original packaging. Returns that do not satisfy our strict quality inspection will be rejected and sent back...', delay: 300, x: 80, y: 70, z: -200 },
  ];

  const glowingWords = [
    { text: 'NON REFUNDABLE', x: 25, y: 35, z: -500, color: '#EF4444' },
    { text: 'RESTOCKING FEE', x: 70, y: 45, z: -350, color: '#F59E0B' },
    { text: '30 DAYS ONLY', x: 30, y: 60, z: -200, color: '#3B82F6' },
    { text: 'FINAL SALE', x: 65, y: 25, z: -100, color: '#EF4444' },
  ];

  // Timeline Controller
  useEffect(() => {
    // Stage 1: Darkness (0s - 2s)
    
    // Stage 2: AI Awakens (2s)
    const awakensTimer = setTimeout(() => {
      setStage('awakens');
    }, 2000);

    // Stage 3: Human Problem (4s)
    const problemTimer = setTimeout(() => {
      setStage('problem');
    }, 4000);

    // Stage 4: AI Takes Control (7s)
    const controlTimer = setTimeout(() => {
      setStage('control');
      // Reveal glass cards
      glassCards.forEach((_, idx) => {
        setTimeout(() => {
          setActiveCardIndex(idx);
        }, 400 + idx * 250);
      });
    }, 7000);

    // Stage 5: Logo Reveal (10s)
    const logoTimer = setTimeout(() => {
      setStage('logo');
    }, 10000);

    // Stage 6: Title (12s)
    const titleTimer = setTimeout(() => {
      setStage('title');
    }, 12000);

    // Stage 7: Transition (14s)
    const transitionTimer = setTimeout(() => {
      setStage('transition');
    }, 14000);

    // Stage 8: Landing Page Live (15.5s)
    const landingTimer = setTimeout(() => {
      setStage('landing');
    }, 15500);

    return () => {
      clearTimeout(awakensTimer);
      clearTimeout(problemTimer);
      clearTimeout(controlTimer);
      clearTimeout(logoTimer);
      clearTimeout(titleTimer);
      clearTimeout(transitionTimer);
      clearTimeout(landingTimer);
    };
  }, []);

  // Score Count-up
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

  const handleSkip = () => {
    setStage('landing');
  };

  // Canvas particle timeline engine
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

    // Generate Shield targets for Stage 'logo'
    const targets = [];
    for (let i = 0; i < 120; i++) {
      const t = (i / 120) * Math.PI * 2;
      const x = centerX + 110 * Math.sin(t) * (1.25 - 0.25 * Math.cos(t));
      const y = centerY + 110 * Math.cos(t) + 30 * Math.abs(Math.sin(t)) - 25;
      targets.push({ x, y, color: '#2563EB' });
    }
    // Generate Inner box targets
    for (let i = 0; i < 40; i++) {
      const progress = i / 40;
      targets.push({ x: centerX - 35 + progress * 70, y: centerY - 25 + (progress < 0.5 ? progress * 30 : (1 - progress) * 30), color: '#06B6D4' });
      targets.push({ x: centerX - 35, y: centerY - 10 + progress * 50, color: '#3b82f6' });
      targets.push({ x: centerX + 35, y: centerY - 10 + progress * 50, color: '#10B981' });
    }

    // Initialize 600 particles
    const particles = [];
    for (let i = 0; i < 600; i++) {
      particles.push({
        x: w / 2 + (Math.random() - 0.5) * 10,
        y: h / 2 + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1.6 + 0.5,
        color: '#2563EB',
        alpha: Math.random() * 0.8 + 0.2,
        trail: [],
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 200 + 50,
        speed: Math.random() * 0.02 + 0.005,
      });
    }

    let time = 0;
    let shockwaveRadius = 0;
    let shockwaveAlpha = 1.0;

    const render = () => {
      time += 0.016;
      
      // Stage darkness has complete black backdrop. Later stages use light trail alpha.
      if (stage === 'darkness') {
        ctx.fillStyle = '#050816';
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.fillStyle = 'rgba(5, 8, 22, 0.16)';
        ctx.fillRect(0, 0, w, h);
      }

      // ── STAGE 1: DARKNESS (Pulsing Single Particle) ──
      if (stage === 'darkness') {
        const pulse = 4 + Math.sin(time * 6) * 1.8;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#2563EB';
        ctx.fillStyle = '#3B82F6';
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }

      // ── STAGE 2: AI AWAKENS (Neural network grows) ──
      if (stage === 'awakens') {
        // Particles drift outward into orbit positions
        particles.forEach((p, idx) => {
          p.x = centerX + Math.cos(p.angle) * p.distance;
          p.y = centerY + Math.sin(p.angle) * p.distance;
          p.distance += (p.distance < 300 ? 1.5 : 0.2);
          p.angle += p.speed;

          // Drawing neural lines between close nodes
          for (let j = idx + 1; j < idx + 6; j++) {
            const other = particles[j % particles.length];
            const d = Math.hypot(p.x - other.x, p.y - other.y);
            if (d < 120) {
              ctx.strokeStyle = `rgba(37, 99, 235, ${0.1 * (1 - d / 120)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }

          // Draw node
          ctx.fillStyle = '#2563EB';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ── STAGE 3: HUMAN PROBLEM (Particles fly past like stars) ──
      if (stage === 'problem') {
        particles.forEach((p) => {
          // Rapid starfield movement
          p.x += Math.cos(p.angle) * 8;
          p.y += Math.sin(p.angle) * 8;

          // Wrap around screen
          if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
            p.x = centerX + (Math.random() - 0.5) * 100;
            p.y = centerY + (Math.random() - 0.5) * 100;
            p.angle = Math.random() * Math.PI * 2;
          }

          ctx.fillStyle = '#10B981';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 1.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ── STAGE 4: AI TAKES CONTROL (Shockwave & Freeze) ──
      if (stage === 'control') {
        // Shockwave expansion
        if (shockwaveRadius < w) {
          shockwaveRadius += 16;
          shockwaveAlpha *= 0.97;
          ctx.strokeStyle = `rgba(6, 182, 212, ${shockwaveAlpha})`;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(centerX, centerY, shockwaveRadius, 0, Math.PI * 2);
          ctx.stroke();
        }

        particles.forEach((p, idx) => {
          // Slowly pull back to center for logo assembly
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          p.x += dx * 0.05;
          p.y += dy * 0.05;

          ctx.fillStyle = '#06B6D4';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ── STAGE 5: LOGO REVEAL ──
      if (stage === 'logo') {
        particles.forEach((p, idx) => {
          const target = targets[idx % targets.length];
          if (target) {
            const dx = target.x - p.x;
            const dy = target.y - p.y;
            p.x += dx * 0.15;
            p.y += dy * 0.15;
            p.color = target.color;
          }

          ctx.fillStyle = p.color || '#2563EB';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ── STAGE 6 & 7: TITLE & TRANSITION ──
      if (stage === 'title' || stage === 'transition') {
        particles.forEach((p, idx) => {
          const target = targets[idx % targets.length];
          if (target) {
            const dx = target.x - p.x;
            const dy = target.y - p.y;
            // Breathe drift
            p.x += dx * 0.1 + Math.sin(time + idx) * 0.15;
            p.y += dy * 0.1 + Math.cos(time + idx) * 0.15;
            p.color = target.color;
          }

          ctx.fillStyle = p.color || '#2563EB';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [stage]);

  return (
    <div className="landing-container" style={{ background: '#050816' }}>
      {/* 3D Canvas particle workspace */}
      {stage !== 'landing' && (
        <canvas ref={canvasRef} className="cinematic-canvas" />
      )}
      
      {stage !== 'landing' && <div className="cinematic-grid-overlay" />}

      {/* ── INTRO SEQUENCE CONTROLLER (0s to 15s) ── */}
      {stage !== 'landing' && (
        <div className={`intro-overlay-container stage-${stage}`}>
          {/* Skip Intro */}
          <button className="skip-intro-btn" onClick={handleSkip}>
            Skip Intro →
          </button>

          {/* STAGE 3: HUMAN PROBLEM - 3D flying document tunnel */}
          {stage === 'problem' && (
            <div className="problem-docs-container">
              {problemDocuments.map((doc, idx) => (
                <div 
                  key={idx}
                  className="problem-doc-card"
                  style={{
                    left: `${doc.x}%`,
                    top: `${doc.y}%`,
                    transform: `translateZ(${doc.z}px)`,
                    animationDelay: `${doc.delay}ms`
                  }}
                >
                  <h4>{doc.brand}</h4>
                  <p>{doc.text}</p>
                </div>
              ))}

              {glowingWords.map((word, idx) => (
                <div 
                  key={idx}
                  className="glowing-danger-word"
                  style={{
                    left: `${word.x}%`,
                    top: `${word.y}%`,
                    color: word.color,
                    textShadow: `0 0 15px ${word.color}`,
                    transform: `translateZ(${word.z}px)`
                  }}
                >
                  {word.text}
                </div>
              ))}
            </div>
          )}

          {/* STAGE 4: AI TAKES CONTROL - Glass cards revealed */}
          {stage === 'control' && (
            <div className="control-glass-cards-overlay">
              <div className="wave-flash-effect"></div>
              <div className="control-glass-cards-grid">
                {glassCards.map((card, idx) => (
                  <div 
                    key={idx}
                    className={`glass-metric-card ${activeCardIndex >= idx ? 'revealed' : ''}`}
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

          {/* STAGE 5: LOGO REVEAL & STAGE 6: TITLE */}
          {(stage === 'logo' || stage === 'title' || stage === 'transition') && (
            <div className={`cinematic-logo-glow ${stage !== 'logo' ? 'active-halo' : ''}`}>
              <Logo size={180} className="intro-svg-logo pulse-logo" />
              <div className="glow-radial-halo"></div>
            </div>
          )}

          <div className="cinematic-text-col">
            <h1 className={`cinematic-title ${(stage === 'title' || stage === 'transition') ? 'fade-in' : ''}`}>
              {'ReturnRight AI'.split('').map((char, index) => (
                <span 
                  key={index} 
                  style={{ animationDelay: `${0.1 + index * 0.04}s` }}
                  className="letter-span"
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
            <p className={`cinematic-subtitle ${(stage === 'title' || stage === 'transition') ? 'fade-in' : ''}`}>
              {'Understand Return Policies in Seconds'.split('').map((char, index) => (
                <span 
                  key={index} 
                  style={{ animationDelay: `${0.7 + index * 0.02}s` }}
                  className="letter-span-sub"
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}

      {/* ── STAGE 8: MAIN PREMIUM LANDING PAGE (Seamless assembly transition) ── */}
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
