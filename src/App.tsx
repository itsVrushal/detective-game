import React from 'react';
import { GameHeader } from './components/layout/GameHeader';
import { CrimeSceneView } from './features/scene/CrimeSceneView';
import { FlashlightCanvas } from './features/lighting/FlashlightCanvas';
import { StoryCompanionBox } from './features/characters/StoryCompanionBox';
import { BriefingModal } from './features/briefing/BriefingModal';
import { HotspotDetailModal } from './features/dossier/HotspotDetailModal';
import { DossierModal } from './features/dossier/DossierModal';
import { AccusationModal } from './features/accusation/AccusationModal';
import { VerdictModal } from './features/accusation/VerdictModal';

export const App: React.FC = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-noir-bg select-none">
      {/* 1. Header controls */}
      <GameHeader />

      {/* 2. On-scene story companion dialogue (Detective Miller) */}
      <StoryCompanionBox />

      {/* 3. Vector crime scene backdrop with interactive hotspots */}
      <main className="w-full h-full">
        <CrimeSceneView />
      </main>

      {/* 4. 60fps Flashlight Darkness & Particle Mask Layer */}
      <FlashlightCanvas />

      {/* 5. Bottom Quick-Key Legend Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-5 py-2 rounded-full bg-noir-surface-card/90 backdrop-blur-md border border-noir-border text-xs font-body text-noir-text-mid flex items-center gap-5 shadow-2xl pointer-events-none">
        <span><strong className="text-noir-amber font-semibold">Cursor:</strong> Move Flashlight</span>
        <span className="text-noir-border">|</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-noir-surface border border-noir-border text-noir-uv font-mono text-xs">F</kbd> Forensic UV</span>
        <span className="text-noir-border">|</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-noir-surface border border-noir-border text-noir-amber font-mono text-xs">SPACE</kbd> Tap Filament</span>
        <span className="text-noir-border">|</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-noir-surface border border-noir-border text-noir-text-high font-mono text-xs">N</kbd> Dossier</span>
        <span className="text-noir-border">|</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-noir-surface border border-noir-border text-noir-crimson font-mono text-xs">A</kbd> Accuse</span>
      </div>

      {/* 6. Modals and Inspection Overlays */}
      <BriefingModal />
      <HotspotDetailModal />
      <DossierModal />
      <AccusationModal />
      <VerdictModal />
    </div>
  );
};

export default App;
