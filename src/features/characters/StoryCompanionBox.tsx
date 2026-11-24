import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { CharacterPortrait } from './CharacterPortraits';
import { ChevronDown, ChevronUp, Lightbulb, Zap, Power } from 'lucide-react';

export const StoryCompanionBox: React.FC = () => {
  const [state] = useGameStore();
  const { lightMode, roomPower, discoveredClueIds, currentCase } = state;
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Dynamic story dialogue based on room power and investigation state
  const getDialogue = () => {
    const clueCount = discoveredClueIds.length;
    const totalClues = currentCase.clues.length;

    // React to room lighting power state first
    if (roomPower === 'blackout_flashlight') {
      if (lightMode === 'uv') {
        return "“Blacklight’s cutting through the blackout. Look for chemical stains and wiped fingerprints glowing on the surfaces.”";
      }
      return "“The breaker tripped! Complete blackout. Keep that flashlight beam moving over the desk and safe. Tap [SPACE] if the filament starts to die.”";
    }

    if (clueCount === 0) {
      return "“Chandelier’s holding for now. Take a hard look at the room layout while we have light. The storm’s rattling the estate wires—breaker’s bound to blow.”";
    }

    if (clueCount >= 1 && clueCount < 4) {
      return `“That’s ${clueCount} clues cataloged in your dossier [N]. Someone in this manor is lying through their teeth. Keep searching while the power holds.”`;
    }

    if (clueCount >= 4 && clueCount < totalClues) {
      return "“The web’s tightening. Cross-check their alibis in the dossier [N]. One of their stories falls apart the second you look at the timetable stubs.”";
    }

    return "“You’ve got enough evidence to hang them twice over. Open the Indictment [A], name the culprit, present the fatal weapon, and break their alibi.”";
  };

  return (
    <div
      className={`fixed top-18 left-6 z-40 max-w-md transition-opacity duration-300 ${
        isMinimized ? 'opacity-90' : 'opacity-100'
      }`}
    >
      <div className="bg-noir-surface-dialogue border-2 border-noir-border rounded-lg shadow-2xl p-4.5 text-noir-text-cream">
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-noir-border-subtle pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-noir-amber animate-pulse" />
            <h3 className="font-noir font-bold text-base text-noir-amber tracking-wide">
              Detective Sgt. Miller
            </h3>
            <span className="text-xs text-noir-cream-gold font-body font-semibold">
              (On-Scene Partner)
            </span>
          </div>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded text-noir-text-low hover:text-noir-text-cream hover:bg-noir-surface-elevated transition-colors cursor-pointer"
            title={isMinimized ? 'Expand Dialogue' : 'Minimize Dialogue'}
          >
            {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Content Body */}
        {!isMinimized && (
          <div className="flex items-start gap-3.5">
            <CharacterPortrait characterId="miller" size={76} className="border border-noir-border-amber shadow-md" />
            <div className="flex-1 space-y-2.5">
              <p className="font-story text-sm text-noir-text-cream leading-relaxed">
                {getDialogue()}
              </p>

              <div className="flex items-center gap-3 pt-1 text-xs text-noir-text-low font-body">
                <span className="flex items-center gap-1 text-noir-cream-gold">
                  <Power className="w-3.5 h-3.5" />
                  [L] Power Breaker
                </span>
                <span className="flex items-center gap-1 text-noir-amber">
                  <Lightbulb className="w-3.5 h-3.5" />
                  [SPACE] Tap
                </span>
                <span className="flex items-center gap-1 text-noir-uv">
                  <Zap className="w-3.5 h-3.5" />
                  [F] UV Light
                </span>
              </div>
            </div>
          </div>
        )}

        {isMinimized && (
          <div className="flex items-center justify-between text-xs text-noir-text-mid font-story">
            <span className="italic truncate">“Keep your eyes sharp…”</span>
            <span className="text-noir-amber text-[13px] font-semibold font-body">Click to expand</span>
          </div>
        )}
      </div>
    </div>
  );
};
