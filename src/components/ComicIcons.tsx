import React from 'react';

// Flat 2D Comic Neo-brutalism Bomb (100% Vector SVG, Zero 3D Plasticky Emoji)
export const ComicBomb: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Spark starburst */}
      <path
        d="M78 8L82 18L92 16L85 24L90 32L80 28L74 36L72 26L62 26L70 19L66 10L75 16Z"
        fill="#FEE227"
        stroke="#111827"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="78" cy="22" r="3" fill="#EF4444" />

      {/* Fuse cord */}
      <path
        d="M62 38C62 26 68 22 75 22"
        stroke="#111827"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Bomb neck */}
      <rect
        x="42"
        y="30"
        width="20"
        height="10"
        rx="3"
        fill="#111827"
        stroke="#111827"
        strokeWidth="3"
      />

      {/* Bomb body */}
      <circle
        cx="50"
        cy="62"
        r="30"
        fill="#18181B"
        stroke="#111827"
        strokeWidth="4.5"
      />

      {/* Comic light reflection highlight */}
      <path
        d="M33 50C37 42 46 39 52 40"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="31" cy="57" r="2.5" fill="white" />
    </svg>
  );
};

// Flat 2D Comic Heart (No Windows OS 3D emoji bug)
export const ComicHeart: React.FC<{ filled: boolean; className?: string }> = ({
  filled,
  className = 'w-5 h-5',
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={filled ? '#F43F5E' : '#E5E7EB'}
        stroke="#111827"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {filled ? (
        <circle cx="7" cy="7.5" r="1.5" fill="white" opacity="0.8" />
      ) : (
        <path
          d="M8 8l8 8"
          stroke="#9CA3AF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
};

// Flat 2D Comic Skull
export const ComicSkull: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cranium */}
      <path
        d="M12 2C6.48 2 2 6.48 2 12c0 3.08 1.4 5.84 3.6 7.15V21c0 .55.45 1 1 1h10.8c.55 0 1-.45 1-1v-1.85c2.2-1.31 3.6-4.07 3.6-7.15 0-5.52-4.48-10-10-10z"
        fill="#FFFFFF"
        stroke="#111827"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Eye Sockets */}
      <circle cx="8" cy="11" r="2.2" fill="#111827" />
      <circle cx="16" cy="11" r="2.2" fill="#111827" />
      {/* Nose */}
      <path d="M12 13.5l-1 2h2l-1-2z" fill="#111827" />
      {/* Teeth */}
      <path d="M9 19v3M12 19v3M15 19v3" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
