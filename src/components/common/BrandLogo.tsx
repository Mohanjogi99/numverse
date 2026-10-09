import React from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  glow?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  className = '',
  glow = true,
}) => {
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const titleSizes = {
    xs: 'text-sm font-bold',
    sm: 'text-base font-extrabold',
    md: 'text-lg font-black',
    lg: 'text-xl font-black',
    xl: 'text-2xl font-black',
  };

  const badgeSizes = {
    xs: 'text-[7px] px-1 py-0.2',
    sm: 'text-[8px] px-1.5 py-0.5',
    md: 'text-[9px] px-1.5 py-0.5',
    lg: 'text-[10px] px-2 py-0.5',
    xl: 'text-xs px-2.5 py-1',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Cosmic "N" Universe Mark */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        {glow && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/40 via-pink-500/40 to-amber-400/30 blur-md scale-125 pointer-events-none" />
        )}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-md"
        >
          <defs>
            {/* Main Sunset Diagonal Gradient */}
            <linearGradient id="nv-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="40%" stopColor="#EC4899" />
              <stop offset="75%" stopColor="#FF5E3A" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>

            {/* Orbit Arc Gradient */}
            <linearGradient id="nv-grad-orbit" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>

            {/* Glowing Core Sphere Gradient */}
            <radialGradient id="nv-grad-core" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#E11D48" />
            </radialGradient>

            {/* Secondary Sphere Gradient */}
            <radialGradient id="nv-grad-sphere2" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FDF2F8" />
              <stop offset="40%" stopColor="#F472B6" />
              <stop offset="85%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#4C1D95" />
            </radialGradient>
          </defs>

          {/* Outer Cosmic Aura Orbit */}
          <ellipse
            cx="24"
            cy="24"
            rx="20"
            ry="9"
            transform="rotate(-28 24 24)"
            stroke="url(#nv-grad-orbit)"
            strokeWidth="1.75"
            strokeDasharray="2 1.5"
            opacity="0.75"
          />

          {/* Celestial Base Pill / Backing */}
          <rect
            x="4"
            y="4"
            width="40"
            height="40"
            rx="12"
            fill="#0F0E1D"
            stroke="url(#nv-grad-primary)"
            strokeWidth="1.2"
            opacity="0.9"
          />

          {/* Stylized Cosmic "N" - Left Pillar */}
          <path
            d="M14 34V14"
            stroke="url(#nv-grad-primary)"
            strokeWidth="3.6"
            strokeLinecap="round"
          />

          {/* Stylized Cosmic "N" - Diagonal Light Ray */}
          <path
            d="M14.5 15L33.5 33"
            stroke="url(#nv-grad-primary)"
            strokeWidth="3.8"
            strokeLinecap="round"
          />

          {/* Stylized Cosmic "N" - Right Pillar */}
          <path
            d="M34 14V34"
            stroke="url(#nv-grad-primary)"
            strokeWidth="3.6"
            strokeLinecap="round"
          />

          {/* Left Anchor Orbit Sphere */}
          <circle cx="14" cy="14" r="3.2" fill="url(#nv-grad-sphere2)" />
          <circle cx="14" cy="14" r="1.2" fill="#FFFFFF" opacity="0.9" />

          {/* Right Anchor Orbit Sphere */}
          <circle cx="34" cy="34" r="3.2" fill="url(#nv-grad-core)" />
          <circle cx="34" cy="34" r="1.2" fill="#FFFFFF" opacity="0.9" />

          {/* Center Universe Sparkle Node */}
          <circle cx="24" cy="24" r="2.2" fill="#FDE047" />
          <path
            d="M24 20V28M20 24H28"
            stroke="#FFFFFF"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center shrink-0">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-display tracking-tight text-white group-hover:text-pink-300 transition-colors ${titleSizes[size]}`}
            >
              Numverse
            </span>
            <span
              className={`font-extrabold uppercase rounded-full bg-gradient-to-r from-fuchsia-500/20 via-pink-500/20 to-amber-500/20 text-pink-300 border border-pink-500/30 shrink-0 ${badgeSizes[size]}`}
            >
              PRO
            </span>
          </div>
          {showTagline && (
            <span className="text-[10px] sm:text-xs text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 font-medium tracking-wide mt-0.5 whitespace-nowrap">
              Numbers की दुनिया
            </span>
          )}
        </div>
      )}
    </div>
  );
};
