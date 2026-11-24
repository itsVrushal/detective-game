import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { CharacterPortrait } from './CharacterPortraits';
import { MessageSquare, ChevronDown, ChevronUp, Lightbulb, Zap } from 'lucide-react';

export const StoryCompanionBox: React.FC = () => {
  const [state] = useGameStore();
  const { lightMode, discoveredClueIds, currentCase } = state;
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Dynamic story dialogue based on investigation state
  const getDialogue = () => {
    const clueCount = discoveredClueIds.length;
    const totalClues = currentCase.clues.length;

    if (clueCount === 0) {
      if (lightMode === 'uv') {
        return "“That’s the violet tube humming. Keep your eyes sharp for wiped footprints on the carpet or grease chalk behind that ancestral portrait.”";
      }
      return "“Keep that flashlight steady, rookie. The storm’s rattling the French windows. Sweep across the desk, fireplace, and safe. If the bulb flickers, tap [SPACE] to wake it up.”";
    }

    if (clueCount >= 1 && clueCount < 4) {
      if (lightMode === 'uv') {
        return "“Good eye. Blacklight catches what the killer thought they wiped off with turpentine. Now check the liquor decanter and hearth.”";
      }
      return `“That’s ${clueCount} pieces logged in your dossier [N]. Someone in this manor is lying through their teeth. Keep sweeping the dark.”`;
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
      <div className="bg-noir-surface-dialogue/95 backdrop-blur-md border border-noir-border rounded-lg shadow-2xl p-4 text-noir-text-high">
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-noir-border-subtle pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-noir-amber animate-pulse" />
            <h3 className="font-noir font-bold text-base text-noir-amber tracking-wide">
              Detective Sgt. Miller
            </h3>
            <span className="text-xs text-noir-text-low font-body">
              (On-Scene Partner)
            </span>
          </div>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded text-noir-text-low hover:text-noir-text-high hover:bg-noir-surface-elevated transition-colors"
            title={isMinimized ? 'Expand Dialogue' : 'Minimize Dialogue'}
          >
            {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Content Body */}
        {!isMinimized && (
          <div className="flex items-start gap-3">
            <CharacterPortrait characterId="miller" size={72} />
            <div className="flex-1 space-y-2">
              <p className="font-story text-sm text-noir-text-mid leading-relaxed">
                {getDialogue()}
              </p>

              <div className="flex items-center gap-3 pt-1 text-xs text-noir-text-low">
                <span className="flex items-center gap-1 text-noir-amber">
                  <Lightbulb className="w-3.5 h-3.5" />
                  [SPACE] Tap Light
                </span>
                <span className="flex items-center gap-1 text-noir-uv">
                  <Zap className="w-3.5 h-3.5" />
                  [F] UV Mode
                </span>
              </div>
            </div>
          </div>
        )}

        {isMinimized && (
          <div className="flex items-center justify-between text-xs text-noir-text-mid">
            <span className="italic font-story truncate">“Keep your eyes sharp…”</span>
            <span className="text-noir-amber text-[13px] font-semibold">Click to expand</span>
          </div>
        )}
      </div>
    </div>
  );
};
