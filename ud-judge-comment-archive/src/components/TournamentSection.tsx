import type { Tournament } from '../types'
import EventSection from './EventSection'

interface TournamentSectionProps {
  tournament: Tournament
  isExpanded: boolean
  expandedEvents: Set<string>
  onToggleTournament: (id: string) => void
  onToggleEvent: (id: string) => void
}

function TournamentSection({
  tournament,
  isExpanded,
  expandedEvents,
  onToggleTournament,
  onToggleEvent,
}: TournamentSectionProps) {
  return (
    <section id={tournament.id} className="scroll-mt-20 border-b border-gray-200 py-4 dark:border-gray-700">
      <h2>
        <button
          type="button"
          onClick={() => onToggleTournament(tournament.id)}
          aria-expanded={isExpanded}
          className="flex w-full items-center justify-between text-left text-2xl font-semibold text-gray-900 dark:text-gray-100"
        >
          <span>{tournament.label}</span>
          <span aria-hidden="true">{isExpanded ? '−' : '+'}</span>
        </button>
      </h2>
      {isExpanded && (
        <div className="mt-2">
          {tournament.events.length === 0 ? (
            <p className="py-2 text-sm text-gray-500 dark:text-gray-400">
              まだ試合が登録されていません。
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
  )
}

export default TournamentSection
