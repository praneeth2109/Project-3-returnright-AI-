import React from 'react';

/**
 * ReturnRight AI Brand Logo
 * Intelligently combines:
 * - A shopping package (cube structure in the center)
 * - A circular return arrow (wrapping loop)
 * - An AI neural spark (glowing nodes/connections in center)
 * - A trust shield (overall bounding shield structure)
 */
export default function Logo({ size = 48, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rr-logo ${className}`}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="shieldGrad" x1="10" y1="5" x2="90" y2="95">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="sparkGrad" x1="30" y1="30" x2="70" y2="70">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Trust Shield Outline (Base Layer) */}
      <path
        d="M50 10 C68 10 82 18 85 35 C88 55 78 78 50 90 C22 78 12 55 15 35 C18 18 32 10 50 10 Z"
        stroke="url(#shieldGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="logo-shield"
      />

      {/* 2. Circular Return Arrow (Negative Space Integration) */}
      <path
        d="M28 45 A 22 22 0 1 1 50 72 M28 45 L 20 45 M28 45 L 28 37"
        stroke="url(#shieldGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="logo-arrow"
      />

      {/* 3. Shopping Package Box (Clever Centerpiece) */}
      <g className="logo-package">
        {/* Box Top Panel */}
        <path
          d="M50 36 L 65 43 L 50 50 L 35 43 Z"
          fill="rgba(99, 102, 241, 0.15)"
          stroke="#06B6D4"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Box Left Panel */}
        <path
          d="M35 43 L 35 59 L 50 66 L 50 50 Z"
          fill="rgba(37, 99, 235, 0.15)"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Box Right Panel */}
        <path
          d="M50 50 L 50 66 L 65 59 L 65 43 Z"
          fill="rgba(16, 185, 129, 0.15)"
          stroke="#10B981"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>

      {/* 4. AI Neural Spark (Glowing Nodes & Connections) */}
      <g className="logo-spark" filter="url(#glow)">
        {/* Central Core Spark Node */}
        <circle cx="50" cy="48" r="4.5" fill="url(#sparkGrad)" />

        {/* Neural Connections radiating outward */}
        <line x1="50" y1="48" x2="50" y2="30" stroke="#67e8f9" strokeWidth="1.5" strokeDasharray="2,2" />
        <line x1="50" y1="48" x2="33" y2="57" stroke="#67e8f9" strokeWidth="1.5" strokeDasharray="2,2" />
        <line x1="50" y1="48" x2="67" y2="57" stroke="#67e8f9" strokeWidth="1.5" strokeDasharray="2,2" />

        {/* Outer Connection Nodes */}
        <circle cx="50" cy="30" r="2.5" fill="#2563EB" />
        <circle cx="33" cy="57" r="2.5" fill="#10B981" />
        <circle cx="67" cy="57" r="2.5" fill="#06B6D4" />
      </g>
    </svg>
  );
}
