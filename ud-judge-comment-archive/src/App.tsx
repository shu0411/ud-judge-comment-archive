import { useEffect, useRef, useState } from 'react'
import tournamentsData from '@data/tweetList'
import type { Tournament } from './types'
import Header from './components/Header'
import Controls from './components/Controls'
import TableOfContents from './components/TableOfContents'
import TournamentList from './components/TournamentList'

const tournaments = tournamentsData as Tournament[]

function App() {
  const topBarRef = useRef<HTMLDivElement>(null)
  const [expandedTournaments, setExpandedTournaments] = useState<Set<string>>(
    () => new Set(tournaments.map((t) => t.id)),
  )
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(
    () => new Set(tournaments.flatMap((t) => t.events.map((e) => e.id))),
  )

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

  useEffect(() => {
    const el = topBarRef.current
    if (!el) return

    const setHeight = () => {
      document.documentElement.style.setProperty('--topbar-height', `${el.offsetHeight}px`)
    }

    setHeight()
    const observer = new ResizeObserver(setHeight)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div
        ref={topBarRef}
        className="sticky top-0 z-30 border-b border-gray-200 bg-white md:ml-64 dark:border-gray-700 dark:bg-gray-900"
      >
        <Header />
        <Controls onExpandAll={expandAll} onCollapseAll={collapseAll} />
      </div>
      <TableOfContents tournaments={tournaments} />
      <main className="px-4 py-4 md:ml-64">
        <TournamentList
          tournaments={tournaments}
          expandedTournaments={expandedTournaments}
          expandedEvents={expandedEvents}
          onToggleTournament={toggleTournament}
          onToggleEvent={toggleEvent}
        />
      </main>
    </div>
  )
}

export default App
