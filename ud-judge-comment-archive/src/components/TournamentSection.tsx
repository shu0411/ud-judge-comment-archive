import { ChevronDown, ChevronUp } from "lucide-react";
import type { Tournament } from "../types";
import EventSection from "./EventSection";

interface TournamentSectionProps {
  tournament: Tournament;
  isExpanded: boolean;
  expandedEvents: Set<string>;
  onToggleTournament: (id: string) => void;
  onToggleEvent: (id: string) => void;
}

function TournamentSection({
  tournament,
  isExpanded,
  expandedEvents,
  onToggleTournament,
  onToggleEvent,
}: TournamentSectionProps) {
  return (
    <section
      id={tournament.id}
      className="scroll-mt-20 border-b border-gray-200 dark:border-gray-700"
    >
      <h2 className="sticky top-[var(--topbar-height)] z-20 bg-white dark:bg-gray-900">
        <button
          type="button"
          onClick={() => onToggleTournament(tournament.id)}
          aria-expanded={isExpanded}
          className="flex h-14 w-full items-center justify-between text-left text-2xl font-semibold text-gray-900 dark:text-gray-100"
        >
          <span>{tournament.label}</span>
          <span className="inline-block w-5 shrink-0 text-center">
            {isExpanded ? (
              <ChevronUp className="inline size-5" aria-hidden="true" />
            ) : (
              <ChevronDown className="inline size-5" aria-hidden="true" />
            )}
          </span>
        </button>
      </h2>
      {isExpanded && (
        <div className="pb-4">
          {tournament.events.length === 0 ? (
            <p className="py-2 text-sm text-gray-500 dark:text-gray-400">
              まだ日程が登録されていません。
            </p>
          ) : (
            tournament.events.map((event) => (
              <EventSection
                key={event.id}
                event={event}
                isExpanded={expandedEvents.has(event.id)}
                onToggle={onToggleEvent}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default TournamentSection;
