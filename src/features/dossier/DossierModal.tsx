import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { CharacterPortrait } from '../characters/CharacterPortraits';
import { X, Users, FolderSearch, UserCheck, ShieldAlert, Zap, MessageSquare } from 'lucide-react';

export const DossierModal: React.FC = () => {
  const [state, actions] = useGameStore();
  const { currentCase, discoveredClueIds, selectedSuspectId } = state;
  const [activeTab, setActiveTab] = useState<'suspects' | 'clues' | 'victim'>('suspects');
  const [activeSuspectId, setActiveSuspectId] = useState<string>(
    selectedSuspectId || currentCase.suspects[0].id
  );

  if (state.activeModal !== 'dossier') {
    return null;
  }

  const activeSuspect = currentCase.suspects.find(s => s.id === activeSuspectId) || currentCase.suspects[0];
  const discoveredClues = currentCase.clues.filter(c => discoveredClueIds.includes(c.id));

  // Map suspect seed to character portrait id
  const getPortraitId = (seed: string): 'eleanor' | 'julian' | 'sterling' | 'beatrice' => {
    if (seed === 'eleanor') return 'eleanor';
    if (seed === 'julian') return 'julian';
    if (seed === 'sterling') return 'sterling';
    return 'beatrice';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[85vh] bg-noir-surface border border-noir-border rounded-lg shadow-2xl flex flex-col overflow-hidden text-noir-text-high">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-noir-border-subtle bg-noir-surface-card">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded bg-noir-surface-elevated text-noir-amber border border-noir-border font-story text-sm font-bold">
              {currentCase.caseNumber}
            </span>
            <div>
              <h2 className="font-noir font-bold text-xl text-noir-text-high tracking-wide">
                Detective Dossier & Case Record
              </h2>
              <p className="text-sm text-noir-text-low font-body">
                {currentCase.title}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-noir-surface-dialogue p-1 rounded-md border border-noir-border-subtle">
            <button
              onClick={() => setActiveTab('suspects')}
              className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-body transition-colors ${
                activeTab === 'suspects'
                  ? 'bg-noir-amber text-noir-bg font-bold'
                  : 'text-noir-text-low hover:text-noir-text-high'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Suspects ({currentCase.suspects.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('clues')}
              className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-body transition-colors ${
                activeTab === 'clues'
                  ? 'bg-noir-amber text-noir-bg font-bold'
                  : 'text-noir-text-low hover:text-noir-text-high'
              }`}
            >
              <FolderSearch className="w-4 h-4" />
              <span>Evidence ({discoveredClues.length}/{currentCase.clues.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('victim')}
              className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-body transition-colors ${
                activeTab === 'victim'
                  ? 'bg-noir-amber text-noir-bg font-bold'
                  : 'text-noir-text-low hover:text-noir-text-high'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Victim & Autopsy</span>
            </button>
          </div>

          <button
            onClick={actions.closeModal}
            className="p-2 rounded text-noir-text-low hover:text-noir-text-high hover:bg-noir-surface-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-hidden flex">
          {/* TAB 1: SUSPECTS WITH ILLUSTRATED GRAPHICS */}
          {activeTab === 'suspects' && (
            <div className="flex w-full h-full">
              {/* Left Suspect Sidebar */}
              <div className="w-72 border-r border-noir-border-subtle bg-noir-surface-card overflow-y-auto p-4 space-y-3">
                <div className="text-xs font-noir font-bold text-noir-text-low px-1">
                  Persons Under Guard
                </div>
                {currentCase.suspects.map((suspect) => {
                  const isSelected = suspect.id === activeSuspectId;
                  const portraitId = getPortraitId(suspect.avatarSeed);
                  return (
                    <button
                      key={suspect.id}
                      onClick={() => setActiveSuspectId(suspect.id)}
                      className={`w-full text-left p-3 rounded-md transition-colors flex items-center gap-3 border ${
                        isSelected
                          ? 'bg-noir-surface-elevated border-noir-amber text-noir-text-high shadow-md'
                          : 'bg-noir-surface border-noir-border-subtle text-noir-text-mid hover:bg-noir-surface-elevated'
                      }`}
                    >
                      <CharacterPortrait characterId={portraitId} size={48} />
                      <div className="min-w-0">
                        <div className="font-noir font-bold text-base truncate">
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

              {/* Right Suspect Details */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-noir-surface-dialogue">
                <div className="flex items-start gap-6 border-b border-noir-border-subtle pb-6">
                  <CharacterPortrait
                    characterId={getPortraitId(activeSuspect.avatarSeed)}
                    size={110}
                    className="border-2 border-noir-border shadow-lg"
                  />
                  <div className="space-y-1">
                    <h3 className="font-noir font-bold text-3xl text-noir-text-high">
                      {activeSuspect.name}
                    </h3>
                    <p className="text-base text-noir-amber font-body">
                      {activeSuspect.role} (Age {activeSuspect.age})
                    </p>
                    <p className="text-sm text-noir-text-mid font-body">
                      Relation to Victim: {activeSuspect.relationToVictim}
                    </p>
                    <p className="text-xs text-noir-text-low italic font-body pt-1">
                      Observed Demeanor: {activeSuspect.demeanor}
                    </p>
                  </div>
                </div>

                {/* Stated Alibi */}
                <div className="p-5 rounded-md bg-noir-surface-card border border-noir-border space-y-2">
                  <div className="flex items-center gap-2 text-sm font-noir font-bold text-noir-amber">
                    <MessageSquare className="w-4 h-4 text-noir-amber" />
                    <span>Official Stated Alibi</span>
                  </div>
                  <blockquote className="font-story text-base text-noir-text-high italic pl-4 border-l-4 border-noir-amber leading-relaxed">
                    “{activeSuspect.statedAlibi}”
                  </blockquote>
                </div>

                {/* Motive & Suspicion */}
                <div className="p-5 rounded-md bg-noir-surface-card border border-noir-border space-y-2">
                  <div className="text-sm font-noir font-bold text-noir-crimson">
                    Detective’s Motive Analysis
                  </div>
                  <p className="text-base text-noir-text-mid leading-relaxed font-body">
                    {activeSuspect.motive}
                  </p>
                </div>

                {/* Direct Interrogation Quote */}
                <div className="p-5 rounded-md bg-noir-surface-card border border-noir-border space-y-2">
                  <div className="text-sm font-noir font-bold text-noir-text-low">
                    On-Scene Interrogation Record
                  </div>
                  <p className="font-story text-base text-noir-text-high">
                    {activeSuspect.testimony}
                  </p>
                </div>

                {/* Shortcut to Accusation */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => actions.openAccusation()}
                    className="px-5 py-2.5 rounded bg-noir-crimson hover:bg-noir-crimson-dark text-white text-sm font-noir font-bold tracking-wide transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Indict {activeSuspect.name}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLUES & EVIDENCE */}
          {activeTab === 'clues' && (
            <div className="w-full h-full overflow-y-auto p-8 space-y-6 bg-noir-surface-dialogue">
              <div className="flex items-center justify-between pb-3 border-b border-noir-border-subtle">
                <p className="text-base font-body text-noir-text-mid">
                  {discoveredClues.length} of {currentCase.clues.length} forensic clues gathered from the crime scene.
                </p>
                <p className="text-sm text-noir-amber font-body">
                  Sweep your flashlight over the room to uncover remaining traces.
                </p>
              </div>

              {discoveredClues.length === 0 ? (
                <div className="py-20 text-center text-noir-text-low space-y-3">
                  <FolderSearch className="w-12 h-12 mx-auto text-noir-text-dim" />
                  <p className="font-noir font-bold text-lg text-noir-text-mid">No evidence cataloged yet</p>
                  <p className="text-sm text-noir-text-low font-body max-w-sm mx-auto">
                    Move your flashlight beam over the desk, carpet, safe, and hearth. Click hotspots to investigate.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {discoveredClues.map((clue) => (
                    <div
                      key={clue.id}
                      className="p-5 rounded-md bg-noir-surface-card border border-noir-border space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2.5 py-1 rounded font-body font-semibold bg-noir-surface-elevated text-noir-text-mid border border-noir-border-subtle">
                          {clue.category}
                        </span>
                        {clue.isKeyEvidence && (
                          <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded font-body font-bold bg-noir-surface-danger text-noir-crimson border border-noir-border-crimson">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Crucial Evidence
                          </span>
                        )}
                      </div>
                      <h4 className="font-noir font-bold text-noir-amber text-lg">
                        {clue.title}
                      </h4>
                      <p className="text-sm text-noir-text-mid font-body leading-relaxed">
                        {clue.shortDescription}
                      </p>
                      <div className="p-3 rounded bg-noir-surface text-xs font-story text-noir-text-low leading-relaxed">
                        {clue.fullForensicNote}
                      </div>
                      {clue.uvRevelation && (
                        <div className="p-3 rounded bg-noir-surface-elevated border border-noir-border-uv text-xs font-story text-noir-uv flex items-start gap-2">
                          <Zap className="w-4 h-4 text-noir-uv mt-0.5 shrink-0" />
                          <span>{clue.uvRevelation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VICTIM & AUTOPSY */}
          {activeTab === 'victim' && (
            <div className="w-full h-full overflow-y-auto p-8 space-y-6 bg-noir-surface-dialogue">
              <div className="border-b border-noir-border-subtle pb-4">
                <span className="text-xs font-body font-bold text-noir-crimson bg-noir-surface-danger px-3 py-1 rounded border border-noir-border-crimson">
                  Deceased Subject
                </span>
                <h3 className="font-noir font-bold text-3xl text-noir-text-high mt-3">
                  {currentCase.victim.name}
                </h3>
                <p className="text-sm font-body text-noir-text-low mt-1">
                  {currentCase.victim.title}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-md bg-noir-surface-card border border-noir-border space-y-1">
                  <div className="text-xs font-body text-noir-text-low">
                    Estimated Time of Death
                  </div>
                  <div className="font-story text-base text-noir-amber font-bold">
                    {currentCase.victim.estimatedTimeOfDeath}
                  </div>
                </div>

                <div className="p-4 rounded-md bg-noir-surface-card border border-noir-border space-y-1">
                  <div className="text-xs font-body text-noir-text-low">
                    Location Found
                  </div>
                  <div className="font-body text-base text-noir-text-high">
                    {currentCase.victim.foundLocation}
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-md bg-noir-surface-card border border-noir-border space-y-2">
                <div className="text-sm font-noir font-bold text-noir-crimson">
                  Pathology & Mechanism of Death
                </div>
                <p className="text-base text-noir-text-mid leading-relaxed font-story">
                  {currentCase.victim.apparentCause}
                </p>
              </div>

              <div className="p-5 rounded-md bg-noir-surface-card border border-noir-border space-y-2">
                <div className="text-sm font-noir font-bold text-noir-text-high">
                  Victim Background & Prior Disputes
                </div>
                <p className="text-base text-noir-text-mid leading-relaxed font-body">
                  {currentCase.victim.backgroundBrief}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-noir-surface-card border-t border-noir-border-subtle">
          <span className="text-sm font-story text-noir-text-low">
            Press <kbd className="px-2 py-0.5 rounded bg-noir-surface border border-noir-border text-noir-text-high font-mono text-xs">ESC</kbd> to return to crime scene
          </span>
          <button
            onClick={actions.closeModal}
            className="px-5 py-2 rounded bg-noir-surface-elevated hover:bg-noir-surface border border-noir-border text-sm font-body text-noir-text-high transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
