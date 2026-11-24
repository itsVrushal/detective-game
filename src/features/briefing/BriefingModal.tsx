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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-noir-surface border-2 border-noir-border rounded-xl shadow-2xl overflow-hidden text-noir-text-cream">
        {/* Prologue Header Bar */}
        <div className="px-7 py-4 border-b border-noir-border bg-noir-surface-card flex items-center justify-between">
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
        <div className="p-7 space-y-6">
          <div className="flex items-start gap-5">
            <CharacterPortrait characterId="miller" size={105} className="border-2 border-noir-border-amber shadow-lg" />
            <div className="space-y-2.5 flex-1">
              <div className="flex items-baseline justify-between">
                <h2 className="font-noir font-bold text-2xl text-noir-text-cream">
                  Detective Sgt. Miller
                </h2>
                <span className="text-xs text-noir-cream-gold font-body font-semibold">Senior Partner</span>
              </div>
              <blockquote className="font-story text-base text-noir-text-cream leading-relaxed italic bg-noir-surface-dialogue p-4.5 rounded-lg border-l-4 border-noir-amber shadow-inner">
                “Rain’s washing away every footprint on the estate driveway. Lord Blackwood was found slumped cold over his desk half an hour ago. All three suspects are detained downstairs. Take this inspection lamp and sweep the room before forensics arrive.”
              </blockquote>
            </div>
          </div>

          {/* Detective Equipment Guide (Creamy high contrast text) */}
          <div className="p-5 rounded-lg bg-noir-surface-card border border-noir-border space-y-3.5">
            <h3 className="font-noir font-bold text-base text-noir-amber">
              Field Investigation Equipment & Instructions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm font-body">
              {/* Card 1: Torch / Flashlight */}
              <div className="p-3.5 rounded-md bg-noir-surface-elevated border border-noir-border space-y-1.5">
                <div className="flex items-center gap-2 text-noir-amber font-semibold text-sm">
                  <Lightbulb className="w-4 h-4 text-noir-amber" />
                  <span>The Torch</span>
                </div>
                <p className="text-xs text-noir-text-mid leading-relaxed">
                  Your cursor guides the beam. Tap <kbd className="px-1.5 py-0.5 rounded bg-noir-surface border border-noir-border text-noir-amber font-mono text-xs font-bold">SPACE</kbd> if the filament flickers out in the dark.
                </p>
              </div>

              {/* Card 2: UV Blacklight */}
              <div className="p-3.5 rounded-md bg-noir-surface-elevated border border-noir-border space-y-1.5">
                <div className="flex items-center gap-2 text-noir-uv font-semibold text-sm">
                  <Zap className="w-4 h-4 text-noir-uv" />
                  <span>Forensic UV Blacklight</span>
                </div>
                <p className="text-xs text-noir-text-mid leading-relaxed">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-noir-surface border border-noir-border text-noir-uv font-mono text-xs font-bold">F</kbd> to ignite the violet tube. Exposes wiped blood, invisible ink, and latent prints.
                </p>
              </div>

              {/* Card 3: Detective Dossier */}
              <div className="p-3.5 rounded-md bg-noir-surface-elevated border border-noir-border space-y-1.5">
                <div className="flex items-center gap-2 text-noir-text-cream font-semibold text-sm">
                  <BookOpen className="w-4 h-4 text-noir-amber" />
                  <span>Detective Dossier</span>
                </div>
                <p className="text-xs text-noir-text-mid leading-relaxed">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-noir-surface border border-noir-border text-noir-text-cream font-mono text-xs font-bold">N</kbd> to inspect gathered evidence, autopsy notes, and suspect alibis.
                </p>
              </div>

              {/* Card 4: Formal Indictment */}
              <div className="p-3.5 rounded-md bg-noir-surface-elevated border border-noir-border space-y-1.5">
                <div className="flex items-center gap-2 text-noir-crimson font-semibold text-sm">
                  <ShieldAlert className="w-4 h-4 text-noir-crimson" />
                  <span>Present Indictment</span>
                </div>
                <p className="text-xs text-noir-text-mid leading-relaxed">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-noir-surface border border-noir-border text-noir-crimson font-mono text-xs font-bold">A</kbd> when ready to charge the killer with the weapon and proof disproving their alibi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4.5 bg-noir-surface-card border-t border-noir-border flex items-center justify-between">
          <span className="text-sm font-story text-noir-text-low">
            Heavy rainfall heard against window glass
          </span>
          <button
            onClick={() => {
              actions.closeModal();
              soundscape.startAmbientRain();
            }}
            className="flex items-center gap-2.5 px-7 py-3 rounded-md bg-noir-amber hover:bg-noir-amber-dark text-noir-bg font-noir font-bold text-base tracking-wide transition-colors shadow-lg cursor-pointer"
          >
            <span>Begin Investigation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
