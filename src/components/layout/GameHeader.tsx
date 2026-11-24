import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import {
  Lightbulb,
  Zap,
  Volume2,
  VolumeX,
  FileText,
  Gavel,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';

export const GameHeader: React.FC = () => {
  const [state, actions] = useGameStore();
  const { currentCase, lightMode, roomPower, filamentHealth, soundMuted, discoveredClueIds } = state;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3.5 bg-noir-surface/95 border-b border-noir-border text-noir-text-cream select-none shadow-md">
      {/* Left: Case Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-noir-amber animate-pulse" />
          <h1 className="font-noir font-bold text-lg text-noir-text-cream tracking-wide">
            LUMEN: Detective Noir
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-3 text-sm font-body text-noir-text-low border-l border-noir-border pl-4">
          <span className="text-noir-amber font-bold">{currentCase.caseNumber}</span>
          <span className="text-noir-border">|</span>
          <span className="truncate max-w-xs text-noir-text-mid">{currentCase.sceneName}</span>
        </div>
      </div>

      {/* Center: Autonomous Estate Power State & Flashlight Controls */}
      <div className="flex items-center gap-3">
        {/* Estate Power State Badge */}
        {roomPower === 'room_power_on' ? (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded text-xs font-body border border-noir-border bg-noir-surface-card text-noir-text-mid">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Estate Power: Online</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-body border border-noir-border-crimson bg-noir-surface-danger text-noir-crimson animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-noir-crimson" />
            <span className="font-semibold">Breaker Tripped: Torch Active</span>
          </div>
        )}

        {/* Filament / Light Health Bar (Active during blackout) */}
        {roomPower === 'blackout_flashlight' && (
          <div className="hidden sm:flex items-center gap-2.5 bg-noir-surface-card border border-noir-border-subtle px-3.5 py-1.5 rounded-md text-sm font-body animate-in fade-in">
            <Lightbulb
              className={`w-4 h-4 ${
                lightMode === 'uv' ? 'text-noir-uv' : 'text-noir-amber'
              }`}
            />
            <span className="text-xs text-noir-text-low font-semibold">Filament</span>
            <div className="w-16 h-2 bg-noir-surface rounded-full overflow-hidden border border-noir-border-subtle">
              <div
                className={`h-full transition-colors duration-200 ${
                  filamentHealth > 50
                    ? 'bg-noir-amber'
                    : filamentHealth > 25
                    ? 'bg-amber-600'
                    : 'bg-noir-crimson animate-pulse'
                }`}
                style={{ width: `${filamentHealth}%` }}
              />
            </div>
            <button
              onClick={actions.tapFilament}
              title="Press SPACE or click to tap filament"
              className="text-xs text-noir-amber hover:text-noir-amber-dark font-semibold underline cursor-pointer"
            >
              [SPACE] Tap
            </button>
          </div>
        )}

        {/* UV Mode Toggle Button */}
        <button
          onClick={actions.toggleLightMode}
          title="Toggle Forensic UV Blacklight (Key: F)"
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-body transition-colors border cursor-pointer ${
            lightMode === 'uv'
              ? 'bg-noir-surface-elevated border-noir-uv text-noir-uv shadow-md'
              : 'bg-noir-surface-card border-noir-border text-noir-text-mid hover:text-noir-text-cream hover:bg-noir-surface-elevated'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${lightMode === 'uv' ? 'text-noir-uv' : 'text-noir-text-low'}`} />
          <span>{lightMode === 'uv' ? 'UV Blacklight [F]' : 'Tungsten [F]'}</span>
        </button>
      </div>

      {/* Right: Actions (Dossier, Accuse, Audio) */}
      <div className="flex items-center gap-3">
        {/* Discovered evidence pill */}
        <button
          onClick={() => actions.openDossier()}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-noir-surface-card hover:bg-noir-surface-elevated border border-noir-border text-xs font-body text-noir-text-mid transition-colors cursor-pointer"
        >
          <FileText className="w-4 h-4 text-noir-amber" />
          <span className="text-noir-text-cream font-semibold">Dossier [N]</span>
          <span className="px-2 py-0.5 rounded bg-noir-surface-elevated text-xs text-noir-amber font-bold">
            {discoveredClueIds.length}/{currentCase.clues.length}
          </span>
        </button>

        {/* Accuse Action */}
        <button
          onClick={actions.openAccusation}
          className="flex items-center gap-2 px-4 py-1.5 rounded bg-noir-crimson hover:bg-noir-crimson-dark active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-noir-border-crimson text-xs font-noir font-bold text-white tracking-wide transition-colors shadow-md cursor-pointer"
        >
          <Gavel className="w-4 h-4" />
          <span>Accuse [A]</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={actions.toggleSound}
          title={soundMuted ? 'Unmute Noir Audio' : 'Mute Noir Audio'}
          className="p-2 rounded bg-noir-surface-card hover:bg-noir-surface-elevated border border-noir-border text-noir-text-low hover:text-noir-text-cream transition-colors cursor-pointer"
        >
          {soundMuted ? <VolumeX className="w-4 h-4 text-noir-crimson" /> : <Volume2 className="w-4 h-4 text-noir-text-cream" />}
        </button>

        {/* New Random Case */}
        <button
          onClick={actions.startNewCase}
          title="Generate fresh random mystery scenario"
          className="p-2 rounded bg-noir-surface-card hover:bg-noir-surface-elevated border border-noir-border text-noir-text-low hover:text-noir-amber transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
