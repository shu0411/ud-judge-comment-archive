import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Tournament } from '../types'

interface TableOfContentsProps {
  tournaments: Tournament[]
  isMobileDrawerOpen: boolean
  onCloseMobileDrawer: () => void
  isDesktopCollapsed: boolean
  onToggleDesktopCollapsed: () => void
}

function TableOfContents({
  tournaments,
  isMobileDrawerOpen,
  onCloseMobileDrawer,
  isDesktopCollapsed,
  onToggleDesktopCollapsed,
}: TableOfContentsProps) {
  function scrollToTournament(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    onCloseMobileDrawer()
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
      {/* Mobile drawer */}
      <div
        className={`fixed inset-x-0 top-14 bottom-0 z-50 md:hidden ${
          isMobileDrawerOpen ? '' : 'pointer-events-none'
        }`}
        aria-hidden={!isMobileDrawerOpen}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
            isMobileDrawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onCloseMobileDrawer}
        />
        <nav
          className={`absolute inset-y-0 left-0 w-3/4 max-w-70 overflow-y-auto bg-white p-4 shadow-lg transition-transform duration-200 dark:bg-gray-900 ${
            isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">目次</span>
            <button
              type="button"
              onClick={onCloseMobileDrawer}
              aria-label="閉じる"
              className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          {list}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <nav
        className={`fixed top-0 left-0 hidden h-screen flex-col overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 md:flex dark:border-gray-700 dark:bg-gray-900 ${
          isDesktopCollapsed ? 'w-10' : 'w-64'
        }`}
      >
        <div
          className={`flex h-14 shrink-0 items-center border-b border-gray-200 dark:border-gray-700 ${
            isDesktopCollapsed ? 'justify-center' : 'justify-between px-4'
          }`}
        >
          {!isDesktopCollapsed && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">目次</span>
          )}
          <button
            type="button"
            onClick={onToggleDesktopCollapsed}
            title={isDesktopCollapsed ? 'サイドバーを開く' : 'サイドバーを閉じる'}
            aria-label={isDesktopCollapsed ? 'サイドバーを開く' : 'サイドバーを閉じる'}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {isDesktopCollapsed ? (
              <ChevronRight className="size-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {!isDesktopCollapsed && <div className="overflow-y-auto p-4">{list}</div>}
      </nav>
    </>
  )
}

export default TableOfContents
