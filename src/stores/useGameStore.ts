import { useState, useEffect } from 'react';
import { CaseFile, Clue, SceneHotspot, Suspect, AccusationSubmission, VerdictReport, LightMode } from '../types/game';
import { generateMysteryCase } from '../features/engine/mysteryGenerator';
import { soundscape } from '../features/audio/soundscape';

export interface GameState {
  currentCase: CaseFile;
  discoveredClueIds: string[];
  inspectedHotspotIds: string[];
  lightMode: LightMode;
  filamentHealth: number; // 0 to 100
  isFlickering: boolean;
  isBlackout: boolean;
  activeModal: 'none' | 'dossier' | 'hotspot_detail' | 'accusation' | 'verdict' | 'briefing';
  activeHotspot: SceneHotspot | null;
  activeClue: Clue | null;
  selectedSuspectId: string | null;
  verdictReport: VerdictReport | null;
  soundMuted: boolean;
  score: number;
  caseCount: number;
}

// Simple lightweight store hook for clean reactivity without complex dependencies
let globalState: GameState = {
  currentCase: generateMysteryCase(Date.now()),
  discoveredClueIds: [],
  inspectedHotspotIds: [],
  lightMode: 'tungsten',
  filamentHealth: 100,
  isFlickering: false,
  isBlackout: false,
  activeModal: 'briefing',
  activeHotspot: null,
  activeClue: null,
  selectedSuspectId: null,
  verdictReport: null,
  soundMuted: false,
  score: 0,
  caseCount: 1,
};

const listeners = new Set<(state: GameState) => void>();

function notify() {
  listeners.forEach(fn => fn(globalState));
}

export function setGameState(updater: Partial<GameState> | ((prev: GameState) => Partial<GameState>)) {
  const next = typeof updater === 'function' ? updater(globalState) : updater;
  globalState = { ...globalState, ...next };
  notify();
}

export function useGameStore(): [GameState, typeof gameActions] {
  const [, setTick] = useState(0);

  useEffect(() => {
    const fn = () => setTick(t => t + 1);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);

  return [globalState, gameActions];
}

export const gameActions = {
  toggleLightMode: () => {
    const nextMode: LightMode = globalState.lightMode === 'tungsten' ? 'uv' : 'tungsten';
    soundscape.playSwitchClick(nextMode);
    setGameState({ lightMode: nextMode });
  },

  tapFilament: () => {
    soundscape.playFilamentShake();
    setGameState({
      filamentHealth: 100,
      isFlickering: false,
      isBlackout: false,
    });
  },

  discoverHotspot: (hotspot: SceneHotspot) => {
    const alreadyDiscovered = globalState.inspectedHotspotIds.includes(hotspot.id);
    const cluesAtHotspot = globalState.currentCase.clues.filter(c => c.hotspotId === hotspot.id);
    const newDiscoveredClueIds = [...globalState.discoveredClueIds];

    cluesAtHotspot.forEach(c => {
      if (!newDiscoveredClueIds.includes(c.id)) {
        newDiscoveredClueIds.push(c.id);
      }
    });

    const newInspectedIds = alreadyDiscovered
      ? globalState.inspectedHotspotIds
      : [...globalState.inspectedHotspotIds, hotspot.id];

    soundscape.playPaperRustle();

    setGameState({
      inspectedHotspotIds: newInspectedIds,
      discoveredClueIds: newDiscoveredClueIds,
      activeHotspot: hotspot,
      activeClue: cluesAtHotspot[0] || null,
      activeModal: 'hotspot_detail',
    });
  },

  openDossier: (suspectId?: string) => {
    soundscape.playPaperRustle();
    setGameState({
      activeModal: 'dossier',
      selectedSuspectId: suspectId || globalState.currentCase.suspects[0].id,
    });
  },

  openAccusation: () => {
    soundscape.playPaperRustle();
    setGameState({ activeModal: 'accusation' });
  },

  closeModal: () => {
    setGameState({ activeModal: 'none', activeHotspot: null, activeClue: null });
  },

  submitAccusation: (submission: AccusationSubmission) => {
    const { solution, suspects } = globalState.currentCase;
    const culpritCorrect = submission.suspectId === solution.culpritId;
    const weaponCorrect = submission.weaponClueId === solution.keyWeaponClueId;
    const contradictionCorrect = submission.contradictionClueId === solution.keyContradictionClueId;

    const isGuilty = culpritCorrect && weaponCorrect && contradictionCorrect;
    const culpritSuspect = suspects.find(s => s.id === solution.culpritId);

    let scoreGain = 0;
    if (culpritCorrect) scoreGain += 500;
    if (weaponCorrect) scoreGain += 250;
    if (contradictionCorrect) scoreGain += 250;

    let badge = 'Miscarriage of Justice';
    if (isGuilty) {
      badge = 'Master Detective (Sherlock Tier)';
    } else if (culpritCorrect) {
      badge = 'Partial Conviction (Key Evidence Missing)';
    } else {
      badge = 'Case Dismissed (Wrong Suspect)';
    }

    const narrativeReview = isGuilty
      ? `Brilliant deduction, Detective! You cornered ${culpritSuspect?.name} with the unassailable evidence. The weapon matched their forensic residue, and their alibi collapsed when confronted with your timeline proof.`
      : culpritCorrect
      ? `You named the right killer (${culpritSuspect?.name}), but the District Attorney warns that your evidence had gaps. Without the exact weapon and alibi refutation, a shrewd defense lawyer might secure bail.`
      : `Catastrophic error. You accused an innocent person while the true culprit escaped into the London fog. The precinct captain demands your badge on the desk.`;

    const confessionText = culpritCorrect && culpritSuspect?.breakdownQuote
      ? culpritSuspect.breakdownQuote
      : `"You have no proof! My lawyers will have me out by sunrise, Detective!"`;

    soundscape.playVerdictChord(isGuilty);

    const verdictReport: VerdictReport = {
      isGuilty,
      culpritCorrect,
      weaponCorrect,
      contradictionCorrect,
      score: scoreGain,
      titleBadge: badge,
      narrativeReview,
      confessionText,
    };

    setGameState(prev => ({
      verdictReport,
      activeModal: 'verdict',
      score: prev.score + scoreGain,
    }));
  },

  startNewCase: () => {
    const nextSeed = Date.now();
    const newCase = generateMysteryCase(nextSeed);
    soundscape.playPaperRustle();
    setGameState(prev => ({
      currentCase: newCase,
      discoveredClueIds: [],
      inspectedHotspotIds: [],
      lightMode: 'tungsten',
      filamentHealth: 100,
      isFlickering: false,
      isBlackout: false,
      activeModal: 'briefing',
      activeHotspot: null,
      activeClue: null,
      selectedSuspectId: null,
      verdictReport: null,
      caseCount: prev.caseCount + 1,
    }));
  },

  toggleSound: () => {
    const nextMute = !globalState.soundMuted;
    soundscape.setMute(nextMute);
    setGameState({ soundMuted: nextMute });
  },
};
