import React from 'react';

const Logo = ({ className = '', size = 32, showText = true, iconOnly = false, vertical = false }) => {
  return (
    <div 
      className={`logo-container ${className}`} 
      style={{ 
        display: 'inline-flex', 
        flexDirection: vertical ? 'column' : 'row',
        alignItems: 'center', 
        gap: vertical ? '10px' : '10px',
        textAlign: vertical ? 'center' : 'left'
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="13 4 85 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Left vertical stem */}
        <rect x="25" y="16" width="11" height="68" rx="2" fill="currentColor" />
        
        {/* Bottom-right leg */}
        <path
          d="M36 50 L68 84 H82 L44 44 C41 44 38 47 36 50 Z"
          fill="currentColor"
        />

        {/* Top-right curved arrow (Navy/White) */}
        <path
          d="M36 44 C46 36 60 24 74 15 L72 9 L86 19 L78 31 L76 25 C64 34 50 46 36 56 Z"
          fill="currentColor"
        />

        {/* Orange curved arrow */}
        <path
          d="M36 54 C46 48 58 38 70 28 L68 22 L82 32 L74 44 L72 38 C62 48 50 60 36 70 Z"
          fill="var(--primary, #d45b08)"
        />
      </svg>

      {showText && !iconOnly && (
        <span
          className="logo-text"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: vertical ? `clamp(1.5rem, calc(${size}px * 0.3), 1.85rem)` : `calc(${size}px * 0.75)`,
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: vertical ? 'center' : 'flex-start',
            color: 'var(--foreground)',
            lineHeight: 1.2
          }}
        >
          <span style={{ color: 'var(--foreground)' }}>Career</span>
          <span style={{ color: 'var(--primary, #d45b08)' }}>K</span>
          <span style={{ color: 'var(--foreground)' }}>inetic</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
