import React from 'react';

export interface AvatarOption {
  id: string;
  name: string;
  bgColor: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'reaper', name: 'Tử Thần', bgColor: 'bg-zinc-800' },
  { id: 'ghost', name: 'Hồn Ma', bgColor: 'bg-cyan-200' },
  { id: 'ninja', name: 'Ninja', bgColor: 'bg-rose-300' },
  { id: 'demon', name: 'Tiểu Quỷ', bgColor: 'bg-purple-300' },
  { id: 'wizard', name: 'Phù Thủy', bgColor: 'bg-blue-300' },
  { id: 'cyborg', name: 'Người Máy', bgColor: 'bg-amber-300' },
  { id: 'judge', name: 'Quan Tòa', bgColor: 'bg-orange-300' },
  { id: 'alien', name: 'Người Ngoài Hành Tinh', bgColor: 'bg-emerald-300' },
];

export const RenderAvatar: React.FC<{ avatarId: string; className?: string }> = ({
  avatarId,
  className = 'w-10 h-10',
}) => {
  switch (avatarId) {
    case 'reaper':
      return (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Hood */}
          <path
            d="M20 3C11 3 7 11 7 24C7 31 10 37 13 37C15 37 16 34 20 34C24 34 25 37 27 37C30 37 33 31 33 24C33 11 29 3 20 3Z"
            fill="#18181B"
            stroke="#111827"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inner face cavity */}
          <path
            d="M20 9C14 9 12 16 12 24C12 29 15 31 20 31C25 31 28 29 28 24C28 16 26 9 20 9Z"
            fill="#09090B"
          />
          {/* Glowing yellow eyes */}
          <circle cx="16" cy="20" r="2.5" fill="#FEE227" />
          <circle cx="24" cy="20" r="2.5" fill="#FEE227" />
          <circle cx="16.8" cy="19.2" r="0.8" fill="white" />
          <circle cx="24.8" cy="19.2" r="0.8" fill="white" />
        </svg>
      );

    case 'ghost':
      return (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Ghost Body */}
          <path
            d="M20 5C11.5 5 8 13 8 23C8 31 7 35 11 35C14 35 14 31 17 31C20 31 20 35 23 35C26 35 26 31 29 31C32 31 32 35 34 35C35 33 32 23 32 15C32 7.5 28.5 5 20 5Z"
            fill="#A5F3FC"
            stroke="#111827"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Eyes */}
          <circle cx="16" cy="16" r="2.5" fill="#111827" />
          <circle cx="24" cy="16" r="2.5" fill="#111827" />
          <circle cx="15" cy="15" r="0.8" fill="white" />
          <circle cx="23" cy="15" r="0.8" fill="white" />
          {/* Blush */}
          <ellipse cx="13" cy="20" rx="2" ry="1.2" fill="#F472B6" />
          <ellipse cx="27" cy="20" rx="2" ry="1.2" fill="#F472B6" />
          {/* Open cute mouth */}
          <ellipse cx="20" cy="22" rx="1.8" ry="2.2" fill="#111827" />
        </svg>
      );

    case 'ninja':
      return (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Head & Mask */}
          <circle cx="20" cy="20" r="16" fill="#F43F5E" stroke="#111827" strokeWidth="2.5" />
          {/* Headband cloth */}
          <rect x="5" y="8" width="30" height="7" rx="2" fill="#111827" />
          <circle cx="20" cy="11.5" r="2" fill="#FEE227" />
          {/* Mask eye slit */}
          <path
            d="M10 18C10 17 12 16 20 16C28 16 30 17 30 18C30 24 28 25 20 25C12 25 10 24 10 18Z"
            fill="#FFE4E6"
            stroke="#111827"
            strokeWidth="2"
          />
          {/* Fierce eyes */}
          <path d="M13 20L18 21.5" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
          <path d="M27 20L22 21.5" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="21" r="1.5" fill="#111827" />
          <circle cx="24" cy="21" r="1.5" fill="#111827" />
        </svg>
      );

    case 'demon':
      return (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Horns */}
          <path d="M10 14L5 5C10 7 13 11 13 13L10 14Z" fill="#DC2626" stroke="#111827" strokeWidth="2" strokeLinejoin="round" />
          <path d="M30 14L35 5C30 7 27 11 27 13L30 14Z" fill="#DC2626" stroke="#111827" strokeWidth="2" strokeLinejoin="round" />
          {/* Head */}
          <circle cx="20" cy="22" r="14" fill="#C084FC" stroke="#111827" strokeWidth="2.5" />
          {/* Eyes */}
          <ellipse cx="15" cy="20" rx="2.5" ry="3" fill="#FEE227" stroke="#111827" strokeWidth="1.5" />
          <ellipse cx="25" cy="20" rx="2.5" ry="3" fill="#FEE227" stroke="#111827" strokeWidth="1.5" />
          <circle cx="15" cy="20" r="1.2" fill="#111827" />
          <circle cx="25" cy="20" r="1.2" fill="#111827" />
          {/* Impish Grin with little fangs */}
          <path d="M15 27C17 30 23 30 25 27" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 27L17 29L18 27M22 27L23 29L24 27" fill="#FFFFFF" stroke="#111827" strokeWidth="1" />
        </svg>
      );

    case 'wizard':
      return (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Face */}
          <circle cx="20" cy="23" r="13" fill="#FED7AA" stroke="#111827" strokeWidth="2.5" />
          {/* Wizard Hat */}
          <path d="M20 2L10 16H30L20 2Z" fill="#3B82F6" stroke="#111827" strokeWidth="2.5" strokeLinejoin="round" />
          <ellipse cx="20" cy="16" rx="14" ry="3.5" fill="#1D4ED8" stroke="#111827" strokeWidth="2" />
          <circle cx="20" cy="9" r="1.5" fill="#FEE227" />
          {/* Eyes */}
          <circle cx="16" cy="21" r="1.8" fill="#111827" />
          <circle cx="24" cy="21" r="1.8" fill="#111827" />
          {/* White Beard */}
          <path
            d="M13 25C13 33 16 38 20 38C24 38 27 33 27 25C24 27 16 27 13 25Z"
            fill="#FFFFFF"
            stroke="#111827"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'cyborg':
      return (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Antenna */}
          <line x1="20" y1="4" x2="20" y2="10" stroke="#111827" strokeWidth="2.5" />
          <circle cx="20" cy="4" r="2.5" fill="#EF4444" stroke="#111827" strokeWidth="1.5" />
          {/* Head Box */}
          <rect x="7" y="10" width="26" height="24" rx="6" fill="#FEE227" stroke="#111827" strokeWidth="2.5" />
          {/* Ear Bolts */}
          <rect x="3" y="18" width="4" height="8" rx="2" fill="#9CA3AF" stroke="#111827" strokeWidth="1.5" />
          <rect x="33" y="18" width="4" height="8" rx="2" fill="#9CA3AF" stroke="#111827" strokeWidth="1.5" />
          {/* Visor Screen */}
          <rect x="11" y="15" width="18" height="8" rx="3" fill="#111827" />
          <circle cx="15" cy="19" r="1.8" fill="#34D399" />
          <circle cx="25" cy="19" r="1.8" fill="#34D399" />
          {/* Speaker Mouth */}
          <rect x="14" y="27" width="12" height="3" rx="1.5" fill="#111827" />
        </svg>
      );

    case 'judge':
      return (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Judge Wig */}
          <circle cx="10" cy="18" r="4.5" fill="#E5E7EB" stroke="#111827" strokeWidth="2" />
          <circle cx="30" cy="18" r="4.5" fill="#E5E7EB" stroke="#111827" strokeWidth="2" />
          <circle cx="10" cy="25" r="4" fill="#E5E7EB" stroke="#111827" strokeWidth="2" />
          <circle cx="30" cy="25" r="4" fill="#E5E7EB" stroke="#111827" strokeWidth="2" />
          <path d="M10 16C10 7 14 5 20 5C26 5 30 7 30 16H10Z" fill="#F3F4F6" stroke="#111827" strokeWidth="2.5" />
          {/* Face */}
          <circle cx="20" cy="22" r="10" fill="#FED7AA" stroke="#111827" strokeWidth="2" />
          {/* Serious eyes & glasses */}
          <circle cx="17" cy="20" r="3" fill="none" stroke="#111827" strokeWidth="1.5" />
          <circle cx="23" cy="20" r="3" fill="none" stroke="#111827" strokeWidth="1.5" />
          <line x1="20" y1="20" x2="20" y2="20" stroke="#111827" strokeWidth="1.5" />
          {/* Stern mouth */}
          <line x1="17" y1="27" x2="23" y2="27" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'alien':
    default:
      return (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Antennas */}
          <line x1="15" y1="4" x2="17" y2="10" stroke="#111827" strokeWidth="2" />
          <circle cx="14" cy="4" r="2" fill="#38BDF8" stroke="#111827" strokeWidth="1.5" />
          <line x1="25" y1="4" x2="23" y2="10" stroke="#111827" strokeWidth="2" />
          <circle cx="26" cy="4" r="2" fill="#38BDF8" stroke="#111827" strokeWidth="1.5" />
          {/* Head */}
          <ellipse cx="20" cy="23" rx="15" ry="13" fill="#34D399" stroke="#111827" strokeWidth="2.5" />
          {/* 3 Eyes! */}
          <circle cx="14" cy="18" r="2.5" fill="#111827" />
          <circle cx="20" cy="15" r="3" fill="#111827" />
          <circle cx="26" cy="18" r="2.5" fill="#111827" />
          <circle cx="13.5" cy="17" r="0.8" fill="white" />
          <circle cx="19.5" cy="14" r="1" fill="white" />
          <circle cx="25.5" cy="17" r="0.8" fill="white" />
          {/* Smile */}
          <path d="M16 26C18 29 22 29 24 26" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
};
