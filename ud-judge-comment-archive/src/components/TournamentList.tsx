import type { Tournament } from '../types'
import TournamentSection from './TournamentSection'

interface TournamentListProps {
  tournaments: Tournament[]
  expandedTournaments: Set<string>
  expandedEvents: Set<string>
  onToggleTournament: (id: string) => void
  onToggleEvent: (id: string) => void
}

function TournamentList({
  tournaments,
  expandedTournaments,
  expandedEvents,
  onToggleTournament,
  onToggleEvent,
}: TournamentListProps) {
  return (
    <div>
      {tournaments.map((tournament) => (
        <TournamentSection
          key={tournament.id}
          tournament={tournament}
          isExpanded={expandedTournaments.has(tournament.id)}
          expandedEvents={expandedEvents}
          onToggleTournament={onToggleTournament}
          onToggleEvent={onToggleEvent}
        />
      ))}
    </div>
  )
}

export default TournamentList
