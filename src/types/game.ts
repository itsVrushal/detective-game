export type SceneTheme = 'victorian_study' | 'jazz_club_office' | 'abandoned_observatory' | 'manor_library';

export type LightMode = 'tungsten' | 'uv';

export type ClueType = 'physical' | 'forensic_uv' | 'document' | 'mechanism' | 'alibi_break';

export interface SceneHotspot {
  id: string;
  name: string;
  xPercent: number; // 0 to 100% across the crime scene canvas
  yPercent: number; // 0 to 100% down the crime scene canvas
  radiusPx: number; // Interaction detection radius
  requiresUV: boolean; // True if invisible unless UV mode is active
  icon: string;
  discovered: boolean;
}

export interface Clue {
  id: string;
  hotspotId: string;
  title: string;
  type: ClueType;
  category: 'Weapon' | 'Timeline' | 'Motive' | 'Forensic Trace' | 'Document';
  shortDescription: string;
  fullForensicNote: string;
  uvRevelation?: string; // Text revealed under UV light
  isKeyEvidence: boolean;
  contradictsSuspectId?: string;
  contradictionReason?: string;
  iconName: string;
  discoveredAt?: number;
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  age: number;
  relationToVictim: string;
  motive: string;
  statedAlibi: string;
  actualActivity: string;
  demeanor: string;
  testimony: string;
  crossExaminationClueId?: string; // Presenting this clue breaks their alibi
  breakdownQuote?: string; // Quote when caught
  isCulprit: boolean;
  avatarSeed: string;
}

export interface Victim {
  name: string;
  title: string;
  estimatedTimeOfDeath: string;
  apparentCause: string;
  foundLocation: string;
  backgroundBrief: string;
}

export interface CaseFile {
  id: string;
  caseNumber: string;
  title: string;
  dateString: string;
  sceneTheme: SceneTheme;
  sceneName: string;
  briefing: string;
  victim: Victim;
  suspects: Suspect[];
  clues: Clue[];
  hotspots: SceneHotspot[];
  solution: {
    culpritId: string;
    keyWeaponClueId: string;
    keyContradictionClueId: string;
    explanation: string;
  };
}

export interface AccusationSubmission {
  suspectId: string;
  weaponClueId: string;
  contradictionClueId: string;
}

export interface VerdictReport {
  isGuilty: boolean;
  culpritCorrect: boolean;
  weaponCorrect: boolean;
  contradictionCorrect: boolean;
  score: number;
  titleBadge: string;
  narrativeReview: string;
  confessionText: string;
}
