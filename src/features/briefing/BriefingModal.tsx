import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { soundscape } from '../audio/soundscape';
import { CharacterPortrait } from '../characters/CharacterPortraits';
import { ArrowRight, Lightbulb, Zap, BookOpen, ShieldAlert } from 'lucide-react';

export const BriefingModal: React.FC = () => {
  const [state, actions] = useGameStore();
  const { currentCase } = state;

  if (state.activeModal !== 'briefing') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-noir-surface border border-noir-border rounded-lg shadow-2xl overflow-hidden text-noir-text-high">
        {/* Prologue Header */}
        <div className="px-6 py-4 border-b border-noir-border-subtle bg-noir-surface-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-noir-amber animate-pulse" />
            <span className="font-noir font-bold text-lg text-noir-amber tracking-wide">
              {currentCase.caseNumber}: Midnight Dispatch
            </span>
          </div>
          <span className="text-sm font-story text-noir-text-low">
            {currentCase.dateString}
          </span>
        </div>

        {/* Narrative Prologue with Detective Miller */}
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-5">
            <CharacterPortrait characterId="miller" size={96} className="border-2 border-noir-border" />
            <div className="space-y-2 flex-1">
              <div className="flex items-baseline justify-between">
                <h2 className="font-noir font-bold text-2xl text-noir-text-high">
                  Detective Sgt. Miller
                </h2>
                <span className="text-xs text-noir-text-low font-body">Senior Partner</span>
              </div>
              <blockquote className="font-story text-base text-noir-text-mid leading-relaxed italic bg-noir-surface-dialogue p-4 rounded-md border-l-4 border-noir-amber">
                “Rain’s washing away every footprint on the estate driveway. Lord Blackwood was found slumped cold over his desk half an hour ago. All three suspects are detained downstairs. Take this inspection lamp and sweep the room before forensics arrive.”
              </blockquote>
            </div>
          </div>

          {/* Detective Equipment Guide (Told as story instructions) */}
          <div className="p-4 rounded-md bg-noir-surface-elevated border border-noir-border space-y-3">
            <h3 className="font-noir font-bold text-base text-noir-amber">
              Field Investigation Equipment & Instructions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-body">
              <div className="p-3 rounded bg-noir-surface-card border border-noir-border-subtle space-y-1">
                <div className="flex items-center gap-2 text-noir-amber font-semibold">
                  <Lightbulb className="w-4 h-4 text-noir-amber" />
                  <span>The Flashlight</span>
                </div>
                <p className="text-xs text-noir-text-mid leading-relaxed">
                  The room is pitch black. Your cursor guides the beam. Tap <kbd className="px-1.5 py-0.5 rounded bg-noir-surface border border-noir-border text-noir-amber font-mono text-xs">SPACE</kbd> if the filament flickers out.
                </p>
              </div>

              <div className="p-3 rounded bg-noir-surface-card border border-noir-border-subtle space-y-1">
                <div className="flex items-center gap-2 text-noir-uv font-semibold">
                  <Zap className="w-4 h-4 text-noir-uv" />
                  <span>Forensic UV Blacklight</span>
                </div>
                <p className="text-xs text-noir-text-mid leading-relaxed">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-noir-surface border border-noir-border text-noir-uv font-mono text-xs">F</kbd> to ignite the violet tube. Exposes wiped blood, invisible ink, and latent prints.
                </p>
              </div>

              <div className="p-3 rounded bg-noir-surface-card border border-noir-border-subtle space-y-1">
                <div className="flex items-center gap-2 text-noir-text-high font-semibold">
                  <BookOpen className="w-4 h-4 text-noir-amber" />
                  <span>Detective Dossier</span>
                </div>
                <p className="text-xs text-noir-text-mid leading-relaxed">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-noir-surface border border-noir-border text-noir-text-high font-mono text-xs">N</kbd> to inspect suspect testimonies, alibis, and gathered evidence.
                </p>
              </div>

              <div className="p-3 rounded bg-noir-surface-card border border-noir-border-subtle space-y-1">
                <div className="flex items-center gap-2 text-noir-crimson font-semibold">
                  <ShieldAlert className="w-4 h-4 text-noir-crimson" />
                  <span>Present Indictment</span>
                </div>
                <p className="text-xs text-noir-text-mid leading-relaxed">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-noir-surface border border-noir-border text-noir-crimson font-mono text-xs">A</kbd> when ready. Match the killer, the murder weapon, and their broken alibi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-noir-surface-card border-t border-noir-border-subtle flex items-center justify-between">
          <span className="text-xs font-story text-noir-text-low">
            Heavy rainfall heard against window glass
          </span>
          <button
            onClick={() => {
              actions.closeModal();
              soundscape.startAmbientRain();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-md bg-noir-amber hover:bg-noir-amber-dark text-noir-bg font-noir font-bold text-sm tracking-wide transition-colors shadow-lg cursor-pointer"
          >
            <span>Begin Investigation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
