import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { CharacterPortrait } from '../characters/CharacterPortraits';
import { X, Gavel, ShieldAlert, AlertTriangle } from 'lucide-react';
import { AccusationSubmission } from '../../types/game';

export const AccusationModal: React.FC = () => {
  const [state, actions] = useGameStore();
  const { currentCase, discoveredClueIds } = state;

  const [selectedSuspectId, setSelectedSuspectId] = useState<string>(currentCase.suspects[0].id);
  const [selectedWeaponId, setSelectedWeaponId] = useState<string>('');
  const [selectedContradictionId, setSelectedContradictionId] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  if (state.activeModal !== 'accusation') {
    return null;
  }

  const discoveredClues = currentCase.clues.filter(c => discoveredClueIds.includes(c.id));
  const weaponsPool = discoveredClues.filter(c => c.category === 'Weapon' || c.isKeyEvidence);
  const contradictionsPool = discoveredClues.filter(
    c => c.category === 'Timeline' || c.category === 'Forensic Trace' || c.type === 'alibi_break'
  );

  const getPortraitId = (seed: string): 'eleanor' | 'julian' | 'sterling' | 'beatrice' => {
    if (seed === 'eleanor') return 'eleanor';
    if (seed === 'julian') return 'julian';
    if (seed === 'sterling') return 'sterling';
    return 'beatrice';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuspectId) {
      setFormError('You must name the perpetrator.');
      return;
    }
    if (!selectedWeaponId) {
      setFormError('You must present the exact murder weapon or fatal instrument.');
      return;
    }
    if (!selectedContradictionId) {
      setFormError('You must present the crucial evidence disproving their alibi.');
      return;
    }

    const submission: AccusationSubmission = {
      suspectId: selectedSuspectId,
      weaponClueId: selectedWeaponId,
      contradictionClueId: selectedContradictionId,
    };

    actions.submitAccusation(submission);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-noir-surface border border-noir-border rounded-lg shadow-2xl overflow-hidden text-noir-text-high">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-noir-border-subtle bg-noir-surface-danger">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded bg-noir-surface text-noir-crimson border border-noir-border-crimson">
              <Gavel className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-noir font-bold text-xl text-noir-text-high tracking-wide">
                Final Formal Indictment
              </h3>
              <p className="text-xs text-noir-text-low font-body">
                Arrest Warrant & Court Presentation • Case {currentCase.caseNumber}
              </p>
            </div>
          </div>

          <button
            onClick={actions.closeModal}
            className="p-1.5 rounded text-noir-text-low hover:text-noir-text-high hover:bg-noir-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning notification banner with Lucide SVG (No raw emoji) */}
        <div className="px-6 py-3 bg-noir-surface-card border-b border-noir-border-subtle flex items-center gap-3 text-xs font-body text-noir-text-mid">
          <AlertTriangle className="w-4 h-4 text-noir-amber shrink-0" />
          <span>
            An airtight indictment requires naming the true culprit, presenting the fatal weapon, and citing the proof that shatters their alibi.
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {formError && (
            <div className="p-3.5 rounded bg-noir-surface-danger border border-noir-border-crimson text-noir-crimson text-sm font-body flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. Name the Culprit with Illustrated Characters */}
          <div className="space-y-3">
            <label className="block text-sm font-noir font-bold text-noir-amber">
              1. The Accused Murderer
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentCase.suspects.map((suspect) => {
                const isSelected = selectedSuspectId === suspect.id;
                const portraitId = getPortraitId(suspect.avatarSeed);
                return (
                  <button
                    type="button"
                    key={suspect.id}
                    onClick={() => {
                      setSelectedSuspectId(suspect.id);
                      setFormError('');
                    }}
                    className={`p-3 rounded-md text-left transition-colors flex items-center gap-3 border cursor-pointer ${
                      isSelected
                        ? 'bg-noir-surface-danger border-noir-crimson text-noir-text-high ring-1 ring-noir-crimson shadow-md'
                        : 'bg-noir-surface-card border-noir-border-subtle text-noir-text-mid hover:bg-noir-surface-elevated'
                    }`}
                  >
                    <CharacterPortrait characterId={portraitId} size={42} />
                    <div className="min-w-0">
                      <div className="font-noir font-bold text-sm truncate text-noir-text-high">
                        {suspect.name}
                      </div>
                      <div className="text-xs text-noir-text-low font-body truncate">
                        {suspect.role}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Specify the Murder Weapon */}
          <div className="space-y-2">
            <label className="block text-sm font-noir font-bold text-noir-amber">
              2. The Fatal Instrument or Weapon
            </label>
            {weaponsPool.length === 0 ? (
              <div className="p-3.5 rounded bg-noir-surface-card border border-noir-border-amber text-noir-amber text-xs font-body flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-noir-amber shrink-0" />
                <span>You have not discovered any potential murder weapons yet. Search the room with your light.</span>
              </div>
            ) : (
              <select
                value={selectedWeaponId}
                onChange={e => {
                  setSelectedWeaponId(e.target.value);
                  setFormError('');
                }}
                className="w-full p-3 rounded bg-noir-surface-card border border-noir-border text-base text-noir-text-high font-body focus:border-noir-amber focus:outline-none"
              >
                <option value="">-- Select Discovered Weapon --</option>
                {weaponsPool.map(clue => (
                  <option key={clue.id} value={clue.id}>
                    {clue.title} ({clue.category})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 3. Disproved Alibi Evidence */}
          <div className="space-y-2">
            <label className="block text-sm font-noir font-bold text-noir-amber">
              3. The Proof Disproving Their Alibi
            </label>
            {contradictionsPool.length === 0 ? (
              <div className="p-3.5 rounded bg-noir-surface-card border border-noir-border-amber text-noir-amber text-xs font-body flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-noir-amber shrink-0" />
                <span>You have not found timeline evidence or forensic traces yet. Try UV blacklight mode [F].</span>
              </div>
            ) : (
              <select
                value={selectedContradictionId}
                onChange={e => {
                  setSelectedContradictionId(e.target.value);
                  setFormError('');
                }}
                className="w-full p-3 rounded bg-noir-surface-card border border-noir-border text-base text-noir-text-high font-body focus:border-noir-amber focus:outline-none"
              >
                <option value="">-- Select Timeline or Forensic Contradiction --</option>
                {contradictionsPool.map(clue => (
                  <option key={clue.id} value={clue.id}>
                    {clue.title} ({clue.category})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex items-center justify-between border-t border-noir-border-subtle">
            <button
              type="button"
              onClick={actions.closeModal}
              className="px-4 py-2 rounded text-sm font-body text-noir-text-low hover:text-noir-text-high whitespace-nowrap cursor-pointer"
            >
              Cancel & Continue
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded bg-noir-crimson hover:bg-noir-crimson-dark text-white font-noir font-bold text-sm tracking-wide shadow-lg transition-transform active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Deliver Formal Indictment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
