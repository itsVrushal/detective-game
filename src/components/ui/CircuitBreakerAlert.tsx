import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { AlertTriangle, Lightbulb, X } from 'lucide-react';

export const CircuitBreakerAlert: React.FC = () => {
  const [state, actions] = useGameStore();
  const { roomPower, breakerAlert } = state;

  // Only show warning if power is out (blackout mode) and alert is active
  if (roomPower !== 'blackout_flashlight' || !breakerAlert) {
    return null;
  }

  return (
    <aside
      aria-label="Power Outage Notice"
      className="fixed top-18 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-start gap-3.5 p-4 rounded-lg bg-noir-surface-danger border-2 border-noir-border-crimson shadow-2xl text-noir-text-cream">
        <div className="p-2 rounded bg-noir-surface text-noir-crimson border border-noir-border-crimson shrink-0">
          <AlertTriangle className="w-5 h-5 text-noir-crimson animate-pulse" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-noir font-bold text-base text-noir-cream-gold tracking-wide">
              Circuit Breaker Tripped!
            </h4>
          </div>
          <p className="font-body text-sm text-noir-text-mid leading-relaxed">
            The estate power suddenly cut out. Someone downstairs is trying to reset the fusebox. Use your torch in the meantime!
          </p>
          <div className="flex items-center gap-1.5 pt-1 text-xs text-noir-amber font-body">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Aim your cursor to illuminate the room with your torch</span>
          </div>
        </div>

        <button
          onClick={actions.dismissBreakerAlert}
          aria-label="Dismiss breaker warning"
          className="p-1 rounded text-noir-text-low hover:text-noir-text-cream transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
