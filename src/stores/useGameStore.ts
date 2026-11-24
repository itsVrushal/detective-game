import { useState, useEffect } from 'react';
import { CaseFile, Clue, SceneHotspot, Suspect, AccusationSubmission, VerdictReport, LightMode, RoomPowerMode } from '../types/game';
import { generateMysteryCase } from '../features/engine/mysteryGenerator';
import { soundscape } from '../features/audio/soundscape';

export interface GameState {
  currentCase: CaseFile;
  discoveredClueIds: string[];
  inspectedHotspotIds: string[];
  lightMode: LightMode;
  roomPower: RoomPowerMode; // 'room_power_on' | 'blackout_flashlight'
  powerCountdown: number; // Seconds until next power state switch
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

let globalState: GameState = {
  currentCase: generateMysteryCase(Date.now()),
  discoveredClueIds: [],
  inspectedHotspotIds: [],
  lightMode: 'tungsten',
  roomPower: 'room_power_on', // Starts with chandelier/room lights ON
  powerCountdown: 20,
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

// Global timer that cycles between Room Lights ON and Flashlight Blackout
let powerIntervalId: number | null = null;

function ensurePowerCycleTimer() {
  if (powerIntervalId !== null) return;

  powerIntervalId = window.setInterval(() => {
    // Only cycle power when game is actively played (not on briefing modal)
    if (globalState.activeModal === 'briefing') return;

    setGameState(prev => {
      const nextCount = prev.powerCountdown - 1;
      if (nextCount > 0) {
        return { powerCountdown: nextCount };
      }

      // Time to switch power state!
      if (prev.roomPower === 'room_power_on') {
        // Lights cut out! Breaker trips!
        soundscape.playPowerTrip();
        const blackoutDuration = 18 + Math.floor(Math.random() * 15); // 18-33s
        return {
          roomPower: 'blackout_flashlight',
          powerCountdown: blackoutDuration,
          isFlickering: true,
        };
      } else {
        // Power restored! Generator hums back
        soundscape.playPowerRestore();
        const lightOnDuration = 15 + Math.floor(Math.random() * 15); // 15-30s
        return {
          roomPower: 'room_power_on',
          powerCountdown: lightOnDuration,
          isFlickering: false,
          filamentHealth: 100,
        };
      }
    });
  }, 1000);
}

if (typeof window !== 'undefined') {
  ensurePowerCycleTimer();
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
  toggleRoomPower: () => {
    const nextPower: RoomPowerMode =
      globalState.roomPower === 'room_power_on' ? 'blackout_flashlight' : 'room_power_on';
    if (nextPower === 'blackout_flashlight') {
      soundscape.playPowerTrip();
    } else {
      soundscape.playPowerRestore();
    }
    setGameState({
      roomPower: nextPower,
      powerCountdown: nextPower === 'room_power_on' ? 20 : 25,
      isFlickering: nextPower === 'blackout_flashlight',
    });
  },

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
      : `“You have no proof! My lawyers will have me out by sunrise, Detective!”`;

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
      roomPower: 'room_power_on',
      powerCountdown: 20,
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
