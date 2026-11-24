import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { CharacterPortrait } from '../characters/CharacterPortraits';
import { X, Lightbulb, Zap, ShieldAlert, Sparkles, Check } from 'lucide-react';

export const HotspotDetailModal: React.FC = () => {
  const [state, actions] = useGameStore();
  const { activeHotspot, currentCase, lightMode } = useGameStore()[0];
  const [localInspectMode, setLocalInspectMode] = useState<'tungsten' | 'uv'>(lightMode);

  if (state.activeModal !== 'hotspot_detail' || !activeHotspot) {
    return null;
  }

  const clues = currentCase.clues.filter(c => c.hotspotId === activeHotspot.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-noir-surface border border-noir-border rounded-lg shadow-2xl overflow-hidden text-noir-text-high">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-noir-border-subtle bg-noir-surface-card">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded bg-noir-surface-elevated text-noir-amber border border-noir-border">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-noir font-bold text-xl text-noir-text-high tracking-wide">
                {activeHotspot.name}
              </h3>
              <p className="text-xs text-noir-text-low font-body">
                Crime scene evidence examination
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dual Spectrum Toggle */}
            <button
              onClick={() => {
                const next = localInspectMode === 'tungsten' ? 'uv' : 'tungsten';
                setLocalInspectMode(next);
                if (next !== lightMode) actions.toggleLightMode();
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-body transition-colors border cursor-pointer ${
                localInspectMode === 'uv'
                  ? 'bg-noir-surface-elevated border-noir-uv text-noir-uv'
                  : 'bg-noir-surface-elevated border-noir-amber text-noir-amber'
              }`}
            >
              {localInspectMode === 'uv' ? (
                <>
                  <Zap className="w-4 h-4 text-noir-uv" />
                  <span>Forensic UV Blacklight</span>
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4 text-noir-amber" />
                  <span>Tungsten Filament</span>
                </>
              )}
            </button>

            <button
              onClick={actions.closeModal}
              className="p-1.5 rounded text-noir-text-low hover:text-noir-text-high hover:bg-noir-surface-elevated transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
          {clues.length === 0 ? (
            <div className="py-8 text-center text-noir-text-low font-body text-sm">
              No removable physical evidence found at this exact station. Only routine dust and undisturbed surfaces.
            </div>
          ) : (
            clues.map((clue) => {
              const hasUVNote = !!clue.uvRevelation;
              const isUVActive = localInspectMode === 'uv';

              return (
                <div
                  key={clue.id}
                  className="p-5 rounded-md bg-noir-surface-card border border-noir-border space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded font-body font-semibold bg-noir-surface-elevated text-noir-text-mid border border-noir-border-subtle">
                          {clue.category}
                        </span>
                        {clue.isKeyEvidence && (
                          <span className="flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded font-body font-bold bg-noir-surface-danger text-noir-crimson border border-noir-border-crimson">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Key Evidence
                          </span>
                        )}
                      </div>
                      <h4 className="font-noir font-bold text-xl text-noir-amber mt-2">
                        {clue.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-base text-noir-text-high leading-relaxed font-body">
                    {clue.shortDescription}
                  </p>

                  <div className="p-4 rounded bg-noir-surface border border-noir-border-subtle space-y-1">
                    <div className="text-xs font-noir font-bold text-noir-amber">
                      Forensic Ballistics & Pathology Record:
                    </div>
                    <p className="text-sm font-story text-noir-text-mid leading-relaxed">
                      {clue.fullForensicNote}
                    </p>
                  </div>

                  {/* UV Revelation Block */}
                  {hasUVNote && (
                    <div
                      className={`p-4 rounded border text-sm font-story transition-colors duration-200 ${
                        isUVActive
                          ? 'bg-noir-surface-elevated border-noir-border-uv text-noir-uv'
                          : 'bg-noir-surface border-dashed border-noir-border text-noir-text-low'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-noir font-bold mb-1">
                        <Zap className={`w-4 h-4 ${isUVActive ? 'text-noir-uv' : 'text-noir-text-low'}`} />
                        <span>Ultraviolet Luminescence Scan</span>
                        {!isUVActive && <span className="text-noir-text-low font-body">(Toggle UV mode above to reveal)</span>}
                      </div>
                      {isUVActive ? (
                        <p className="font-body text-sm text-noir-text-high leading-relaxed pt-1">
                          {clue.uvRevelation}
                        </p>
                      ) : (
                        <p className="italic font-story text-xs text-noir-text-low pt-1">
                          Fluorescent chemical signatures and latent fingerprints remain obscured under standard incandescent lighting.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Detective Miller Narrative Reaction */}
          <div className="flex items-center gap-4 p-4 rounded-md bg-noir-surface-dialogue border border-noir-border">
            <CharacterPortrait characterId="miller" size={54} />
            <p className="font-story text-sm text-noir-text-mid italic flex-1">
              “Log everything in the dossier. A killer always thinks they were clever, but dust and blood never lie.”
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-noir-surface-card border-t border-noir-border-subtle">
          <span className="text-xs font-body text-noir-text-low">
            Cataloged in Detective Dossier (Press <kbd className="px-1.5 py-0.5 rounded bg-noir-surface text-noir-text-high font-mono text-xs border border-noir-border">N</kbd> anytime)
          </span>
          <button
            onClick={actions.closeModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-noir-amber hover:bg-noir-amber-dark text-noir-bg font-noir font-bold text-sm tracking-wide transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Close & Continue Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};
