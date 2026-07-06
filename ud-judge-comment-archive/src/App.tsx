import { useState } from 'react'
import tournamentsData from '@data/tweetList'
import type { Tournament } from './types'
import Header from './components/Header'
import SiteNotice from './components/SiteNotice'
import TableOfContents from './components/TableOfContents'
import TournamentList from './components/TournamentList'

const tournaments = tournamentsData as Tournament[]

function App() {
  const [expandedTournaments, setExpandedTournaments] = useState<Set<string>>(
    () => new Set(tournaments.map((t) => t.id)),
  )
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(
    () => new Set(tournaments.flatMap((t) => t.events.map((e) => e.id))),
  )
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false)

  function toggleTournament(id: string) {
    setExpandedTournaments((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function toggleEvent(id: string) {
    setExpandedEvents((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function expandAll() {
    setExpandedTournaments(new Set(tournaments.map((t) => t.id)))
    setExpandedEvents(new Set(tournaments.flatMap((t) => t.events.map((e) => e.id))))
  }

  function collapseAll() {
    setExpandedTournaments(new Set())
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Header
        isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
        onOpenDrawer={() => setIsMobileDrawerOpen(true)}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
      />
      <TableOfContents
        tournaments={tournaments}
        isMobileDrawerOpen={isMobileDrawerOpen}
        onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
        isDesktopCollapsed={isDesktopSidebarCollapsed}
        onToggleDesktopCollapsed={() => setIsDesktopSidebarCollapsed((prev) => !prev)}
      />
      <div
        className={`pt-14 transition-[margin-left] duration-200 ${
          isDesktopSidebarCollapsed ? 'md:ml-10' : 'md:ml-64'
        }`}
      >
        <SiteNotice />
        <main className="px-4 py-4">
          <TournamentList
            tournaments={tournaments}
            expandedTournaments={expandedTournaments}
            expandedEvents={expandedEvents}
            onToggleTournament={toggleTournament}
            onToggleEvent={toggleEvent}
          />
        </main>
      </div>
    </div>
  )
}

export default App
