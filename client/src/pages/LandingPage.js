import React, { useState, useEffect, useRef } from 'react';
import Logo from '../components/Logo';

export default function LandingPage({ onGetStarted }) {
  const [stage, setStage] = useState('darkness'); // 'darkness', 'awakens', 'problem', 'control', 'logo', 'title', 'transition', 'landing'
  const [activeCardIndex, setActiveCardIndex] = useState(-1);
  const [demoActive, setDemoActive] = useState(false);
  const [mockScore, setMockScore] = useState(0);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const containerRef = useRef(null);

  // Status cards for Stage 'control' (Smoked glassmorphism)
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
    { brand: 'Amazon Return Policy', text: 'All return requests must be submitted within the established window. Items returned without authorization will be subject to a restocking fee of up to 20%...', delay: 0, x: 15, y: 22, z: -800 },
    { brand: 'Nike Store Terms', text: 'Products must be returned unworn and unwashed with original tags attached. Final sale and custom configurations are strictly non-refundable under any conditions...', delay: 100, x: 70, y: 18, z: -600 },
    { brand: 'Apple Policy Details', text: 'Hardware returns are subject to a 14-day window. Opened software, custom-configured Macs, and activated subscriptions are strictly final sale...', delay: 200, x: 25, y: 68, z: -400 },
    { brand: 'Adidas Returns', text: 'Items must be returned in their original packaging. Returns that do not satisfy our strict quality inspection will be rejected and sent back...', delay: 300, x: 75, y: 65, z: -200 },
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

    // Stage 3: Human Problem (4.5s)
    const problemTimer = setTimeout(() => {
      setStage('problem');
    }, 4500);

    // Stage 4: AI Takes Control (7.5s)
    const controlTimer = setTimeout(() => {
      setStage('control');
      glassCards.forEach((_, idx) => {
        setTimeout(() => {
          setActiveCardIndex(idx);
        }, 400 + idx * 250);
      });
    }, 7500);

    // Stage 5: Logo Reveal (10.5s)
    const logoTimer = setTimeout(() => {
      setStage('logo');
    }, 10500);

    // Stage 6: Title (13s)
    const titleTimer = setTimeout(() => {
      setStage('title');
    }, 13000);

    // Stage 7: Transition (15s)
    const transitionTimer = setTimeout(() => {
      setStage('transition');
    }, 15000);

    // Stage 8: Landing Page Live (16.5s)
    const landingTimer = setTimeout(() => {
      setStage('landing');
    }, 16500);

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

  // Canvas particle PBR-simulation timeline engine
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
    const floorY = h * 0.72; // Reflections Floor Division line

    // Initialize 100 volumetric dust particles catching light
    const dustParticles = [];
    for (let i = 0; i < 100; i++) {
      dustParticles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.3 + 0.05,
      });
    }

    // Initialize sparks container
    let sparks = [];

    // Initialize metal logo fragments for magnetic construction
    const fragments = [];
    const fragmentTargets = [
      // Bounding shield segments
      { x: centerX - 60, y: centerY - 40, rx: -30, ry: -20, delay: 0 },
      { x: centerX + 60, y: centerY - 40, rx: 30, ry: -20, delay: 100 },
      { x: centerX, y: centerY + 70, rx: 0, ry: 40, delay: 200 },
      // Inner package panels
      { x: centerX, y: centerY - 15, rx: 0, ry: -15, delay: 300 },
      { x: centerX - 30, y: centerY + 15, rx: -25, ry: 15, delay: 400 },
      { x: centerX + 30, y: centerY + 15, rx: 25, ry: 15, delay: 500 },
    ];

    fragmentTargets.forEach((t) => {
      fragments.push({
        x: centerX + (Math.random() - 0.5) * w * 0.6,
        y: centerY + (Math.random() - 0.5) * h * 0.6 - 150,
        tx: t.x,
        ty: t.y,
        rx: t.rx,
        ry: t.ry,
        size: Math.random() * 15 + 10,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        delay: t.delay,
        locked: false,
      });
    });

    // 600 micro neural/dust particles
    const particles = [];
    for (let i = 0; i < 600; i++) {
      particles.push({
        x: w / 2 + (Math.random() - 0.5) * 15,
        y: h / 2 + (Math.random() - 0.5) * 15,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.4,
        color: '#2563EB',
        alpha: Math.random() * 0.7 + 0.2,
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 180 + 30,
        speed: Math.random() * 0.012 + 0.003,
      });
    }

    let time = 0;
    let shockwaveRadius = 0;
    let shockwaveAlpha = 1.0;

    const render = () => {
      time += 0.016;

      // ── RENDER BASE ATMOSPHERE (PBR Polished Dark Glass Floor) ──
      // Air (Top half)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, floorY);
      skyGrad.addColorStop(0, '#030712');
      skyGrad.addColorStop(1, '#050a1c');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, floorY);

      // Floor (Bottom half - polished reflecting glass)
      const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
      floorGrad.addColorStop(0, '#040714');
      floorGrad.addColorStop(1, '#020308');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, floorY, w, h - floorY);

      // Volumetric Light Beams drifting overhead
      const lightGrad = ctx.createRadialGradient(centerX + Math.sin(time * 0.5) * 200, centerY - 200, 50, centerX + Math.sin(time * 0.5) * 200, centerY - 200, 600);
      lightGrad.addColorStop(0, 'rgba(37, 99, 235, 0.05)');
      lightGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.02)');
      lightGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = lightGrad;
      ctx.fillRect(0, 0, w, floorY);

      // ── DRAW VOLUMETRIC FLOATING DUST PARTICLES ──
      dustParticles.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > floorY) d.vy *= -1;

        // Pulse alpha based on volumetric light alignment
        const intensity = Math.sin(time + d.x * 0.01) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${d.alpha * intensity})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── STAGE 1: PULSING HEARTBEAT PARTICLE ──
      if (stage === 'darkness') {
        const pulse = 4.5 + Math.sin(time * 7) * 1.6;
        
        const drawSingle = (yPos, alphaVal, sizeMod) => {
          ctx.save();
          ctx.globalAlpha = alphaVal;
          ctx.shadowBlur = 24 * sizeMod;
          ctx.shadowColor = '#2563EB';
          ctx.fillStyle = '#3B82F6';
          ctx.beginPath();
          ctx.arc(centerX, yPos, pulse * sizeMod, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        };

        // Real
        drawSingle(centerY - 50, 1.0, 1.0);
        // Reflection
        drawSingle(floorY + (floorY - (centerY - 50)), 0.3, 0.95);
      }

      // ── STAGE 2: AI AWAKENS (Neural pathway growth) ──
      if (stage === 'awakens') {
        const drawNetwork = (yOffset, scaleFactor, alphaFactor) => {
          ctx.save();
          ctx.globalAlpha = alphaFactor;
          
          particles.forEach((p, idx) => {
            const px = centerX + Math.cos(p.angle) * p.distance * scaleFactor;
            const py = yOffset + Math.sin(p.angle) * p.distance * scaleFactor * (yOffset > floorY ? -1 : 1);
            p.distance += 1.2;
            p.angle += p.speed;

            // Connect lines
            for (let j = idx + 1; j < idx + 5; j++) {
              const other = particles[j % particles.length];
              const ox = centerX + Math.cos(other.angle) * other.distance * scaleFactor;
              const oy = yOffset + Math.sin(other.angle) * other.distance * scaleFactor * (yOffset > floorY ? -1 : 1);
              const d = Math.hypot(px - ox, py - oy);
              if (d < 110) {
                ctx.strokeStyle = `rgba(37, 99, 235, ${0.08 * (1 - d / 110)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(ox, oy);
                ctx.stroke();
              }
            }

            ctx.fillStyle = '#2563EB';
            ctx.beginPath();
            ctx.arc(px, py, p.radius * scaleFactor, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.restore();
        };

        // Draw Real
        drawNetwork(centerY - 50, 1.0, 1.0);
        // Draw Reflection
        drawNetwork(floorY + (floorY - (centerY - 50)), 0.28, 0.28);
      }

      // ── STAGE 3: HUMAN PROBLEM (Dust trails) ──
      if (stage === 'problem') {
        particles.forEach((p) => {
          p.x += Math.cos(p.angle) * 7;
          p.y += Math.sin(p.angle) * 7;
          if (p.x < 0 || p.x > w || p.y < 0 || p.y > floorY) {
            p.x = centerX + (Math.random() - 0.5) * 100;
            p.y = centerY + (Math.random() - 0.5) * 100;
            p.angle = Math.random() * Math.PI * 2;
          }

          ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 1.2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ── STAGE 4: SHOCKWAVE & BLANKET REFLECTION ──
      if (stage === 'control') {
        if (shockwaveRadius < w) {
          shockwaveRadius += 18;
          shockwaveAlpha *= 0.96;
          
          const drawShockwave = (yPos, alphaVal) => {
            ctx.strokeStyle = `rgba(6, 182, 212, ${alphaVal})`;
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.arc(centerX, yPos, shockwaveRadius, 0, Math.PI * 2);
            ctx.stroke();
          };

          drawShockwave(centerY - 50, shockwaveAlpha);
          drawShockwave(floorY + (floorY - (centerY - 50)), shockwaveAlpha * 0.3);
        }

        particles.forEach((p) => {
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          p.x += dx * 0.06;
          p.y += dy * 0.06;

          ctx.fillStyle = '#06B6D4';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ── STAGE 5: PHYSICAL LOGO CONSTRUCTION (MAGNETIC SNAP & SPARKS) ──
      if (stage === 'logo') {
        // Draw Sparks
        sparks.forEach((s) => {
          s.x += s.vx;
          s.y += s.vy;
          s.vy += 0.25; // Gravity
          s.alpha *= 0.93;
          ctx.strokeStyle = `rgba(245, 158, 11, ${s.alpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * 1.5, s.y - s.vy * 1.5);
          ctx.stroke();
        });
        sparks = sparks.filter((s) => s.alpha > 0.05);

        // Render fragments snapping together
        const drawFragments = (yOffset, isReflection) => {
          ctx.save();
          if (isReflection) {
            ctx.globalAlpha = 0.28;
          }

          fragments.forEach((f) => {
            if (!f.locked) {
              const dx = f.tx - f.x;
              const dy = (isReflection ? floorY + (floorY - f.ty) : f.ty) - f.y;
              const dist = Math.hypot(dx, dy);

              // Magnetic snap acceleration
              if (dist < 4) {
                f.locked = true;
                // Spawn connection sparks on snapping
                for (let k = 0; k < 12; k++) {
                  sparks.push({
                    x: f.tx,
                    y: isReflection ? floorY + (floorY - f.ty) : f.ty,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5 - 2,
                    alpha: 1.0,
                  });
                }
              } else {
                f.x += dx * 0.08;
                f.y += dy * 0.08;
                f.angle += f.rotSpeed;
              }
            } else {
              f.x = f.tx;
              f.y = isReflection ? floorY + (floorY - f.ty) : f.ty;
              f.angle = 0;
            }

            // Draw fragment block (brushed metal look)
            ctx.save();
            ctx.translate(f.x, f.y);
            ctx.rotate(f.angle);
            
            const blockGrad = ctx.createLinearGradient(-f.size / 2, -f.size / 2, f.size / 2, f.size / 2);
            blockGrad.addColorStop(0, '#3b82f6');
            blockGrad.addColorStop(0.5, '#60a5fa');
            blockGrad.addColorStop(1, '#1d4ed8');
            ctx.fillStyle = blockGrad;
            
            ctx.beginPath();
            ctx.rect(-f.size / 2, -f.size / 2, f.size, f.size);
            ctx.fill();
            ctx.restore();
          });

          ctx.restore();
        };

        drawFragments(centerY - 50, false);
        drawFragments(floorY + (floorY - (centerY - 50)), true);
      }

      // ── POLISHED FLOOR ACCENT DIVISION LINE ──
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(w, floorY);
      ctx.stroke();

      // Soft reflection backdrop overlay (simulating roughness)
      const reflectionOverlay = ctx.createLinearGradient(0, floorY, 0, h);
      reflectionOverlay.addColorStop(0, 'rgba(5, 8, 22, 0.3)');
      reflectionOverlay.addColorStop(1, 'rgba(5, 8, 22, 0.95)');
      ctx.fillStyle = reflectionOverlay;
      ctx.fillRect(0, floorY, w, h - floorY);

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [stage]);

  return (
    <div ref={containerRef} className="landing-container" style={{ background: '#030712' }}>
      
      {/* Volumetric analog noise film grain filter */}
      <div className="film-grain-overlay"></div>

      {/* Cinematic Canvas background */}
      {stage !== 'landing' && (
        <canvas ref={canvasRef} className="cinematic-canvas" />
      )}

      {/* ── INTRO SEQUENCE LAYER OVERLAYS ── */}
      {stage !== 'landing' && (
        <div className={`intro-overlay-container stage-${stage}`}>
          {/* Skip Intro */}
          <button className="skip-intro-btn" onClick={handleSkip}>
            Skip Intro →
          </button>

          {/* STAGE 3: HUMAN PROBLEM - 3D Text policies tunnel */}
          {stage === 'problem' && (
            <div className="problem-docs-container">
              {problemDocuments.map((doc, idx) => (
                <div 
                  key={idx}
                  className="problem-doc-card glass-reflection"
                  style={{
                    left: `${doc.x}%`,
                    top: `${doc.y}%`,
                    transform: `translateZ(${doc.z}px)`,
                    animationDelay: `${doc.delay}ms`
                  }}
                >
                  <div className="brushed-metal-header">
                    <span>{doc.brand}</span>
                  </div>
                  <p>{doc.text}</p>
                </div>
              ))}

              {glowingWords.map((word, idx) => (
                <div 
                  key={idx}
                  className="glowing-danger-word text-glow"
                  style={{
                    left: `${word.x}%`,
                    top: `${word.y}%`,
                    color: word.color,
                    textShadow: `0 0 20px ${word.color}`,
                    transform: `translateZ(${word.z}px)`
                  }}
                >
                  {word.text}
                </div>
              ))}
            </div>
          )}

          {/* STAGE 4: AI TAKES CONTROL - Beautiful PBR Glass Cards */}
          {stage === 'control' && (
            <div className="control-glass-cards-overlay">
              <div className="wave-flash-effect"></div>
              <div className="control-glass-cards-grid">
                {glassCards.map((card, idx) => (
                  <div 
                    key={idx}
                    className={`glass-metric-card pbr-glass ${activeCardIndex >= idx ? 'revealed' : ''}`}
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

          {/* STAGE 5: LOGO REVEAL & TITLE STAGES */}
          {(stage === 'logo' || stage === 'title' || stage === 'transition') && (
            <div className="logo-glow-wrapper">
              {/* Real Logo */}
              <div className="cinematic-logo-glow active-halo">
                <Logo size={180} className="intro-svg-logo pulse-logo" />
                <div className="glow-radial-halo"></div>
              </div>
              {/* Mirror Reflection Logo on Floor */}
              <div className="cinematic-logo-glow reflection-logo">
                <Logo size={180} className="intro-svg-logo reflection-svg-logo" />
                <div className="glow-radial-halo"></div>
              </div>
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

      {/* ── STAGE 8: MAIN PREMIUM LANDING PAGE (Smooth zoom reveal) ── */}
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

          {/* Right Column: Premium Interactive Mockup */}
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
