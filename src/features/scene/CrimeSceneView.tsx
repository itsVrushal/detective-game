import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { SceneHotspot } from '../../types/game';
import {
  FileText,
  Lock,
  Flame,
  BookOpen,
  Wine,
  Sparkles,
  Footprints,
  Compass,
  DollarSign,
  ShieldAlert,
  Search,
  Eye,
  Disc,
  Key,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  FileText,
  Lock,
  Flame,
  BookOpen,
  Wine,
  Sparkles,
  Footprints,
  Compass,
  DollarSign,
  ShieldAlert,
  Search,
  Eye,
  Disc,
  Key,
};

export const CrimeSceneView: React.FC = () => {
  const [state, actions] = useGameStore();
  const { currentCase, lightMode, inspectedHotspotIds } = state;

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-noir-bg">
      {/* 1. Atmospheric Vector Crime Scene Backdrop */}
      <svg
        className="absolute inset-0 w-full h-full object-cover"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Illustrated noir crime scene view"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Wall wood paneling gradient */}
          <linearGradient id="wallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#141824" />
            <stop offset="50%" stopColor="#0d101a" />
            <stop offset="100%" stopColor="#07080c" />
          </linearGradient>

          {/* Persian Rug Pattern */}
          <linearGradient id="rugGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#450a0a" />
            <stop offset="50%" stopColor="#2e0808" />
            <stop offset="100%" stopColor="#1c0505" />
          </linearGradient>

          {/* Window Glass Reflection */}
          <linearGradient id="windowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
          </linearGradient>

          {/* Fireplace glow */}
          <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
          </radialGradient>

          {/* Chandelier Room Light Glow */}
          <radialGradient id="chandelierGlow" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.16" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#07080c" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* --- Background Room Walls & Crown Molding --- */}
        <rect width="1440" height="900" fill="url(#wallGradient)" />

        {/* Chandelier Room Illumination when Power is ON */}
        {state.roomPower === 'room_power_on' && (
          <rect width="1440" height="900" fill="url(#chandelierGlow)" />
        )}

        {/* Wainscoting Panels */}
        <line x1="0" y1="520" x2="1440" y2="520" stroke="#1f2638" strokeWidth="4" />
        <rect x="0" y="520" width="1440" height="380" fill="#0b0e16" />
        {[60, 240, 420, 600, 780, 960, 1140, 1320].map((x, i) => (
          <rect
            key={i}
            x={x}
            y="540"
            width="140"
            height="180"
            fill="none"
            stroke="#161c2a"
            strokeWidth="3"
            rx="4"
          />
        ))}

        {/* Hardwood Floor Parquet */}
        <polygon points="0,720 1440,720 1440,900 0,900" fill="#080a0f" />
        {[0, 180, 360, 540, 720, 900, 1080, 1260, 1440].map((x, idx) => (
          <line
            key={idx}
            x1={x}
            y1="720"
            x2={x + (idx - 4) * 80}
            y2="900"
            stroke="#121722"
            strokeWidth="2"
          />
        ))}

        {/* --- Leaded Glass Window (Rain effect) --- */}
        <rect x="1150" y="80" width="240" height="420" fill="url(#windowGradient)" rx="12" />
        <rect x="1150" y="80" width="240" height="420" fill="none" stroke="#252f44" strokeWidth="6" rx="12" />
        {/* Diamond leaded glass grid */}
        {[130, 200, 270, 340, 410].map(y => (
          <line key={y} x1="1150" y1={y} x2="1390" y2={y} stroke="#1b2232" strokeWidth="2" />
        ))}
        {[1190, 1230, 1270, 1310, 1350].map(x => (
          <line key={x} x1={x} y1="80" x2={x} y2="500" stroke="#1b2232" strokeWidth="2" />
        ))}

        {/* Rain streaks on the glass */}
        <line x1="1200" y1="120" x2="1195" y2="180" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="6 8" />
        <line x1="1260" y1="190" x2="1255" y2="280" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="8 6" />
        <line x1="1330" y1="140" x2="1325" y2="230" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="5 7" />

        {/* --- Bookshelf Alcove (Left) --- */}
        <rect x="40" y="80" width="220" height="580" fill="#0d111a" stroke="#1e2637" strokeWidth="4" />
        {[180, 280, 380, 480, 580].map((shelfY, idx) => (
          <g key={idx}>
            <rect x="40" y={shelfY} width="220" height="12" fill="#182030" />
            {Array.from({ length: 9 }).map((_, bIdx) => (
              <rect
                key={bIdx}
                x={55 + bIdx * 22}
                y={shelfY - 80}
                width="18"
                height="80"
                fill={['#311b1b', '#1b2631', '#1e2d24', '#2c1e18', '#252033'][bIdx % 5]}
                stroke="#090c13"
                strokeWidth="1"
                rx="2"
              />
            ))}
          </g>
        ))}

        {/* --- Ancestor Portrait (Center-Left) --- */}
        <g>
          <rect x="460" y="70" width="160" height="210" fill="#0a0c12" stroke="#b45309" strokeWidth="5" rx="3" />
          <rect x="472" y="82" width="136" height="186" fill="#151b27" />
          <circle cx="540" cy="140" r="32" fill="#080a0f" />
          <path d="M500,240 C500,185 580,185 580,240 Z" fill="#080a0f" />
        </g>

        {/* --- Wall Safe (Behind portrait/curtain) --- */}
        <g>
          <rect x="290" y="160" width="100" height="100" fill="#0b0d14" stroke="#334155" strokeWidth="4" rx="6" />
          <circle cx="340" cy="210" r="28" fill="#131722" stroke="#475569" strokeWidth="3" />
          <circle cx="340" cy="210" r="10" fill="#334155" />
          <line x1="340" y1="182" x2="340" y2="195" stroke="#94a3b8" strokeWidth="2" />
        </g>

        {/* --- Fireplace & Mantle (Right Center) --- */}
        <g>
          <rect x="1000" y="240" width="220" height="20" fill="#1f293d" rx="2" />
          <rect x="1020" y="260" width="180" height="180" fill="#07090e" stroke="#171e2c" strokeWidth="4" />
          <path d="M1040,440 L1040,330 Q1110,290 1180,330 L1180,440 Z" fill="#05070a" />
          <circle cx="1110" cy="410" r="60" fill="url(#fireGlow)" />
          <ellipse cx="1110" cy="425" rx="40" ry="12" fill="#180e06" stroke="#451a03" strokeWidth="2" />
          <circle cx="1095" cy="420" r="4" fill="#f59e0b" opacity="0.8" />
          <circle cx="1125" cy="422" r="3" fill="#ea580c" opacity="0.7" />
        </g>

        {/* --- Persian Carpet Centerpiece --- */}
        <ellipse cx="720" cy="740" rx="340" ry="110" fill="url(#rugGradient)" stroke="#7f1d1d" strokeWidth="4" />
        <ellipse cx="720" cy="740" rx="310" ry="90" fill="none" stroke="#b45309" strokeWidth="2" strokeDasharray="8 6" />

        {/* --- The Grand Mahogany Desk (Center) --- */}
        <g>
          <polygon points="560,460 980,460 1060,630 480,630" fill="#1b120c" stroke="#3f2719" strokeWidth="3" />
          <polygon points="650,490 890,490 920,590 620,590" fill="#0e1713" stroke="#164e3f" strokeWidth="2" />
          <rect x="495" y="630" width="50" height="110" fill="#120c08" />
          <rect x="995" y="630" width="50" height="110" fill="#120c08" />
          <rect x="660" y="520" width="40" height="50" fill="#f6f3eb" opacity="0.85" rx="2" transform="rotate(-6 680 545)" />
          <rect x="710" y="515" width="45" height="55" fill="#f6f3eb" opacity="0.9" rx="2" transform="rotate(8 732 542)" />
          <ellipse cx="600" cy="500" rx="14" ry="8" fill="#d97706" />
          <line x1="600" y1="500" x2="600" y2="475" stroke="#b45309" strokeWidth="3" />
          <ellipse cx="600" cy="475" rx="20" ry="10" fill="#92400e" />
        </g>

        {/* --- Bar / Liquor Cart (Right) --- */}
        <g>
          <rect x="920" y="210" width="60" height="90" fill="#101520" stroke="#263143" strokeWidth="2" rx="4" />
          <path d="M945,230 L955,230 L960,250 L940,250 Z" fill="#94a3b8" opacity="0.5" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="948" y="222" width="4" height="8" fill="#e2e8f0" />
        </g>

        {/* --- SPECIAL UV FORENSIC OVERLAYS --- */}
        {lightMode === 'uv' && (
          <g className="transition-opacity duration-200">
            <path
              d="M680,720 Q710,740 760,735 Q800,750 830,730"
              fill="none"
              stroke="#6366f1"
              strokeWidth="10"
              strokeLinecap="round"
              strokeOpacity="0.6"
              filter="blur(2px)"
            />
            <ellipse cx="660" cy="745" rx="8" ry="16" fill="#818cf8" fillOpacity="0.4" transform="rotate(-20 660 745)" />
            <ellipse cx="715" cy="760" rx="8" ry="16" fill="#818cf8" fillOpacity="0.4" transform="rotate(15 715 760)" />
            <ellipse cx="770" cy="750" rx="8" ry="16" fill="#818cf8" fillOpacity="0.4" transform="rotate(-10 770 750)" />
            <circle cx="950" cy="240" r="14" fill="#a5b4fc" fillOpacity="0.5" filter="blur(3px)" />
            <text x="475" y="115" fill="#c7d2fe" fontSize="13" fontFamily="monospace" letterSpacing="1" opacity="0.85">
              NOV 14 - COMB: 42-18-87
            </text>
          </g>
        )}
      </svg>

      {/* 2. Interactive Hotspot Markers Layer */}
      <div className="absolute inset-0 z-20 pointer-events-auto">
        {currentCase.hotspots.map((hotspot) => {
          const isInspected = inspectedHotspotIds.includes(hotspot.id);
          const IconComponent = ICON_MAP[hotspot.icon] || Search;
          const isVisible = !hotspot.requiresUV || lightMode === 'uv';

          if (!isVisible) return null;

          return (
            <button
              key={hotspot.id}
              onClick={() => actions.discoverHotspot(hotspot)}
              style={{
                left: `${hotspot.xPercent}%`,
                top: `${hotspot.yPercent}%`,
              }}
              title={hotspot.name}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group p-3.5 rounded-full transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 cursor-pointer ${
                hotspot.requiresUV
                  ? 'focus-visible:ring-noir-uv'
                  : 'focus-visible:ring-noir-amber'
              }`}
            >
              {/* Outer Pulsing Radar Ring */}
              <span
                className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
                  hotspot.requiresUV ? 'bg-noir-uv' : 'bg-noir-amber'
                }`}
                style={{ animationDuration: isInspected ? '4s' : '2s' }}
              />

              {/* Main Hotspot Pin */}
              <div
                className={`relative flex items-center justify-center w-12 h-12 rounded-full border shadow-lg transition-transform duration-200 group-hover:scale-110 ${
                  hotspot.requiresUV
                    ? isInspected
                      ? 'bg-noir-surface-elevated border-noir-border-uv text-noir-uv'
                      : 'bg-indigo-950 border-noir-uv text-indigo-100 shadow-indigo-950/60'
                    : isInspected
                    ? 'bg-noir-surface border-noir-border text-noir-text-low'
                    : 'bg-amber-950 border-noir-amber text-amber-100 shadow-amber-950/60'
                }`}
              >
                <IconComponent className="w-5 h-5 transition-transform group-hover:scale-110" />

                {/* Uninspected Evidence Notification Badge */}
                {!isInspected && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-noir-crimson opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-noir-crimson border-2 border-noir-bg"></span>
                  </span>
                )}
              </div>

              {/* Hover Tooltip Label */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-noir-surface-dialogue text-sm border border-noir-border px-3 py-1.5 rounded shadow-xl whitespace-nowrap z-50">
                <span className={hotspot.requiresUV ? 'text-noir-uv font-semibold' : 'text-noir-amber font-semibold'}>
                  {hotspot.name}
                </span>
                {isInspected && <span className="ml-2 text-noir-text-low text-xs">(Examined)</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
