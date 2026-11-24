import React, { useEffect } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { CharacterPortrait } from '../characters/CharacterPortraits';
import { RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const VerdictModal: React.FC = () => {
  const [state, actions] = useGameStore();
  const { verdictReport, currentCase } = state;

  useEffect(() => {
    if (state.activeModal === 'verdict' && verdictReport?.isGuilty) {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#dc2626', '#f1f5f9'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [state.activeModal, verdictReport]);

  if (state.activeModal !== 'verdict' || !verdictReport) {
    return null;
  }

  const { isGuilty, culpritCorrect, weaponCorrect, contradictionCorrect, titleBadge, narrativeReview, confessionText } = verdictReport;
  const culpritSuspect = currentCase.suspects.find(s => s.id === currentCase.solution.culpritId);

  const getPortraitId = (seed?: string): 'eleanor' | 'julian' | 'sterling' | 'beatrice' => {
    if (seed === 'eleanor') return 'eleanor';
    if (seed === 'julian') return 'julian';
    if (seed === 'sterling') return 'sterling';
    return 'beatrice';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-noir-surface border border-noir-border rounded-lg shadow-2xl overflow-hidden text-noir-text-high">
        {/* Top Header */}
        <div
          className={`px-6 py-6 border-b text-center space-y-2 ${
            isGuilty
              ? 'bg-noir-surface-card border-noir-border-amber'
              : 'bg-noir-surface-danger border-noir-border-crimson'
          }`}
        >
          <div className="flex justify-center">
            {isGuilty ? (
              <div className="p-3.5 rounded-full bg-noir-surface-elevated text-noir-amber border border-noir-border-amber">
                <ShieldCheck className="w-10 h-10" />
              </div>
            ) : (
              <div className="p-3.5 rounded-full bg-noir-surface-elevated text-noir-crimson border border-noir-border-crimson">
                <AlertTriangle className="w-10 h-10" />
              </div>
            )}
          </div>

          <h2 className="font-noir font-bold text-3xl text-noir-text-high tracking-wide">
            {isGuilty ? 'Case Solved: Conviction Secured' : 'Indictment Rejected: Evidence Lacking'}
          </h2>
          <div className="inline-block px-4 py-1.5 rounded text-sm font-noir font-bold tracking-wide bg-noir-surface border border-noir-border text-noir-amber">
            {titleBadge}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Evidence Verification Checkmarks */}
          <div className="grid grid-cols-3 gap-3">
            <div
              className={`p-4 rounded border text-center font-body text-sm ${
                culpritCorrect
                  ? 'bg-noir-surface-elevated border-emerald-600/60 text-emerald-300'
                  : 'bg-noir-surface-danger border-noir-border-crimson text-noir-crimson'
              }`}
            >
              <div className="font-bold text-base">{culpritCorrect ? '✓ Verified' : '✗ Mistaken'}</div>
              <div className="text-xs mt-1 text-noir-text-low">Culprit Identified</div>
            </div>

            <div
              className={`p-4 rounded border text-center font-body text-sm ${
                weaponCorrect
                  ? 'bg-noir-surface-elevated border-emerald-600/60 text-emerald-300'
                  : 'bg-noir-surface-danger border-noir-border-crimson text-noir-crimson'
              }`}
            >
              <div className="font-bold text-base">{weaponCorrect ? '✓ Verified' : '✗ Mistaken'}</div>
              <div className="text-xs mt-1 text-noir-text-low">Murder Weapon</div>
            </div>

            <div
              className={`p-4 rounded border text-center font-body text-sm ${
                contradictionCorrect
                  ? 'bg-noir-surface-elevated border-emerald-600/60 text-emerald-300'
                  : 'bg-noir-surface-danger border-noir-border-crimson text-noir-crimson'
              }`}
            >
              <div className="font-bold text-base">{contradictionCorrect ? '✓ Verified' : '✗ Mistaken'}</div>
              <div className="text-xs mt-1 text-noir-text-low">Alibi Disproof</div>
            </div>
          </div>

          {/* Narrative Review */}
          <div className="p-5 rounded-md bg-noir-surface-card border border-noir-border space-y-2">
            <div className="text-sm font-noir font-bold text-noir-amber">
              District Attorney’s Official Case Summary
            </div>
            <p className="text-base text-noir-text-mid leading-relaxed font-body">
              {narrativeReview}
            </p>
          </div>

          {/* Culprit Breakdown Quote with Character Portrait */}
          {confessionText && culpritSuspect && (
            <div className="flex items-start gap-4 p-5 rounded-md bg-noir-surface-card border border-noir-border-crimson">
              <CharacterPortrait
                characterId={getPortraitId(culpritSuspect.avatarSeed)}
                size={70}
                className="border border-noir-border-crimson"
              />
              <div className="space-y-1 flex-1">
                <div className="text-sm font-noir font-bold text-noir-crimson">
                  {culpritSuspect.name}’s Breakdown & Confession
                </div>
                <blockquote className="font-story italic text-base text-noir-text-high pl-3 border-l-2 border-noir-crimson leading-relaxed">
                  {confessionText}
                </blockquote>
              </div>
            </div>
          )}

          {/* Case Solution Truth */}
          <div className="p-4 rounded bg-noir-surface border border-noir-border space-y-1 text-sm font-body text-noir-text-low">
            <div className="text-noir-text-high font-bold text-xs font-noir">
              Official Investigative Record:
            </div>
            <p className="font-story text-xs text-noir-text-mid leading-relaxed">
              {currentCase.solution.explanation}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-noir-surface-card border-t border-noir-border-subtle">
          <div className="text-sm font-body text-noir-text-low">
            Detective Standing: <span className="font-bold text-noir-amber">{state.score} Points</span>
          </div>

          <div className="flex items-center gap-3">
            {!isGuilty && (
              <button
                onClick={actions.closeModal}
                className="px-4 py-2.5 rounded bg-noir-surface-elevated hover:bg-noir-surface border border-noir-border text-sm font-body text-noir-text-high transition-colors cursor-pointer"
              >
                Re-Examine Evidence
              </button>
            )}
            <button
              onClick={actions.startNewCase}
              className="flex items-center gap-2 px-6 py-2.5 rounded bg-noir-amber hover:bg-noir-amber-dark text-noir-bg font-noir font-bold text-sm tracking-wide transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Investigate Next Case</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
