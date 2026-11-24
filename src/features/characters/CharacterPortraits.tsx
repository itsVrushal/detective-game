import React from 'react';

interface CharacterPortraitProps {
  characterId: 'miller' | 'eleanor' | 'julian' | 'sterling' | 'beatrice' | 'omalley';
  className?: string;
  size?: number;
}

export const CharacterPortrait: React.FC<CharacterPortraitProps> = ({
  characterId,
  className = '',
  size = 96,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Portrait of ${characterId}`}
      className={`rounded-md border border-noir-border shadow-md bg-noir-surface-card overflow-hidden shrink-0 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Noir dramatic lighting gradient */}
        <linearGradient id={`grad-${characterId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e2638" />
          <stop offset="50%" stopColor="#121724" />
          <stop offset="100%" stopColor="#080a11" />
        </linearGradient>

        <linearGradient id="skinShade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a373" />
          <stop offset="100%" stopColor="#8d5b4c" />
        </linearGradient>

        <linearGradient id="fedoraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Background fill */}
      <rect width="120" height="120" fill={`url(#grad-${characterId})`} />

      {/* Rain backdrop streak */}
      <line x1="20" y1="5" x2="10" y2="35" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="95" y1="15" x2="85" y2="50" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.2" />

      {/* CHARACTER 1: DETECTIVE SERGEANT MILLER (Grizzled Veteran Mentor) */}
      {characterId === 'miller' && (
        <g>
          {/* Trenchcoat collar */}
          <path d="M20,120 L40,80 L60,95 L80,80 L100,120 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          <path d="M48,88 L60,110 L72,88 Z" fill="#991b1b" /> {/* Crimson tie */}
          {/* Jaw & neck */}
          <rect x="52" y="68" width="16" height="18" fill="#a0715e" />
          <polygon points="38,55 82,55 76,82 44,82" fill="#bc8a7e" />
          {/* 5 o'clock shadow stubble */}
          <path d="M44,68 Q60,82 76,68 Q60,84 44,68" fill="#475569" opacity="0.6" />
          {/* Hardened eyes in shadow */}
          <rect x="46" y="58" width="10" height="3" fill="#1e293b" />
          <rect x="64" y="58" width="10" height="3" fill="#1e293b" />
          {/* Fedora Hat */}
          <ellipse cx="60" cy="46" rx="46" ry="10" fill="url(#fedoraGrad)" stroke="#090d16" strokeWidth="2" />
          <path d="M34,45 Q60,20 86,45 Z" fill="#1e293b" />
          <rect x="36" y="40" width="48" height="6" fill="#991b1b" /> {/* Fedora band */}
          {/* Cigarette ember */}
          <line x1="68" y1="74" x2="85" y2="76" stroke="#f1f5f9" strokeWidth="2.5" />
          <circle cx="85" cy="76" r="2" fill="#f59e0b" />
        </g>
      )}

      {/* CHARACTER 2: ELEANOR VANCE (Private Secretary) */}
      {characterId === 'eleanor' && (
        <g>
          {/* Navy dress */}
          <path d="M25,120 Q60,82 95,120 Z" fill="#1e1e38" />
          <ellipse cx="60" cy="92" rx="16" ry="6" fill="#f8fafc" /> {/* Lace collar */}
          {/* Neck & Face */}
          <rect x="54" y="68" width="12" height="18" fill="#e2b49a" />
          <ellipse cx="60" cy="58" rx="20" ry="24" fill="#f3cbb3" />
          {/* 1940s victory rolls hairstyle */}
          <circle cx="42" cy="42" r="16" fill="#382218" />
          <circle cx="78" cy="42" r="16" fill="#382218" />
          <rect x="42" y="30" width="36" height="14" fill="#382218" rx="7" />
          {/* Delicate watchful eyes & lips */}
          <circle cx="52" cy="56" r="2.5" fill="#1e293b" />
          <circle cx="68" cy="56" r="2.5" fill="#1e293b" />
          <path d="M55,70 Q60,73 65,70" stroke="#991b1b" strokeWidth="2" fill="none" />
          {/* Pearl earrings */}
          <circle cx="40" cy="62" r="3" fill="#f8fafc" />
          <circle cx="80" cy="62" r="3" fill="#f8fafc" />
        </g>
      )}

      {/* CHARACTER 3: JULIAN MONTGOMERY (Disinherited Nephew) */}
      {characterId === 'julian' && (
        <g>
          {/* Tuxedo lapels */}
          <path d="M22,120 L42,85 L60,98 L78,85 L98,120 Z" fill="#090c14" />
          <polygon points="52,90 68,90 60,105" fill="#f8fafc" />
          <rect x="56" y="94" width="8" height="5" fill="#090c14" rx="1" /> {/* Black bow tie */}
          {/* Face & Neck */}
          <rect x="52" y="65" width="16" height="16" fill="#d89f88" />
          <polygon points="40,48 80,48 74,78 46,78" fill="#eab39f" />
          {/* Slicked back parted dark hair */}
          <path d="M38,48 Q60,26 82,48 L82,40 Q60,20 38,40 Z" fill="#1c1917" />
          {/* Smug thin mustache & eyes */}
          <line x1="53" y1="68" x2="67" y2="68" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
          <rect x="48" y="54" width="8" height="2.5" fill="#1c1917" />
          <rect x="64" y="54" width="8" height="2.5" fill="#1c1917" />
        </g>
      )}

      {/* CHARACTER 4: DR. STERLING (Personal Physician) */}
      {characterId === 'sterling' && (
        <g>
          {/* Tweed waistcoat */}
          <path d="M25,120 L45,86 L60,96 L75,86 L95,120 Z" fill="#2d241e" />
          <line x1="60" y1="96" x2="60" y2="120" stroke="#b45309" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Neck & Face */}
          <rect x="53" y="66" width="14" height="16" fill="#cca08b" />
          <ellipse cx="60" cy="58" rx="21" ry="24" fill="#deb4a0" />
          {/* Grey hair at temples */}
          <path d="M38,50 Q60,30 82,50 L82,42 Q60,24 38,42 Z" fill="#64748b" />
          {/* Round gold-rim spectacles */}
          <circle cx="51" cy="55" r="7" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="69" cy="55" r="7" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="58" y1="55" x2="62" y2="55" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Solemn mouth */}
          <line x1="54" y1="72" x2="66" y2="72" stroke="#713f12" strokeWidth="1.5" />
        </g>
      )}

      {/* CHARACTER 5: MADAME BEATRICE (Opera Singer) */}
      {characterId === 'beatrice' && (
        <g>
          {/* Black velvet gown */}
          <path d="M22,120 Q60,86 98,120 Z" fill="#181124" />
          {/* Pearl necklace */}
          <path d="M46,88 Q60,98 74,88" fill="none" stroke="#f8fafc" strokeWidth="3" strokeDasharray="4 3" />
          {/* Neck & Face */}
          <rect x="54" y="64" width="12" height="16" fill="#dcae96" />
          <ellipse cx="60" cy="54" rx="19" ry="22" fill="#efc4ad" />
          {/* Dramatic dark curled hair with lace fascinator */}
          <circle cx="60" cy="38" r="22" fill="#09070f" />
          <path d="M40,36 Q60,20 80,36" fill="#4338ca" opacity="0.3" />
          {/* Bold red lips */}
          <ellipse cx="60" cy="66" rx="6" ry="2.5" fill="#b91c1c" />
          <circle cx="52" cy="52" r="2.5" fill="#09070f" />
          <circle cx="68" cy="52" r="2.5" fill="#09070f" />
        </g>
      )}

      {/* Frame border highlight */}
      <rect x="0" y="0" width="120" height="120" fill="none" stroke="#334155" strokeWidth="1.5" rx="4" />
    </svg>
  );
};
