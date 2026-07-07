import { useState } from 'react'
import Box from '@mui/material/Box'
import tournamentsData from '@data/tweetList'
import type { Tournament } from './types'
import { HEADER_HEIGHT, DRAWER_WIDTH, RAIL_WIDTH } from './theme'
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
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
      <Box
        sx={{
          pt: `${HEADER_HEIGHT}px`,
          transition: (theme) => theme.transitions.create('margin-left'),
          ml: { md: `${isDesktopSidebarCollapsed ? RAIL_WIDTH : DRAWER_WIDTH}px` },
        }}
      >
        <SiteNotice />
        <Box component="main" sx={{ px: { xs: 1, md: 2 }, py: 2 }}>
          <TournamentList
            tournaments={tournaments}
            expandedTournaments={expandedTournaments}
            expandedEvents={expandedEvents}
            onToggleTournament={toggleTournament}
            onToggleEvent={toggleEvent}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default App
