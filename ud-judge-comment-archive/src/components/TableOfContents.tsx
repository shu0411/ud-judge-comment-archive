import { useState } from 'react'
import type { Tournament } from '../types'

interface TableOfContentsProps {
  tournaments: Tournament[]
}

function TableOfContents({ tournaments }: TableOfContentsProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  function scrollToTournament(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setIsDrawerOpen(false)
  }

  const list = (
    <ul className="space-y-2">
      {tournaments.map((tournament) => (
        <li key={tournament.id}>
          <button
            type="button"
            onClick={() => scrollToTournament(tournament.id)}
            className="text-left text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          >
            {tournament.label}
          </button>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      {/* Mobile trigger */}
      <div className="border-b border-gray-200 bg-white px-4 py-2 md:hidden dark:border-gray-700 dark:bg-gray-900">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          ☰ 目次
        </button>
      </div>

      {/* Mobile drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsDrawerOpen(false)}
          />
          <nav className="absolute inset-y-0 left-0 w-64 overflow-y-auto bg-white p-4 shadow-lg dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">目次</span>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="閉じる"
                className="text-gray-500 dark:text-gray-400"
              >
                ×
              </button>
            </div>
            {list}
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <nav className="hidden md:fixed md:top-0 md:left-0 md:block md:h-screen md:w-64 md:overflow-y-auto md:border-r md:border-gray-200 md:bg-white md:p-4 md:pt-24 dark:md:border-gray-700 dark:md:bg-gray-900">
        {list}
      </nav>
    </>
  )
}

export default TableOfContents
