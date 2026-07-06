import { ChevronsDownUp, ChevronsUpDown, Menu } from 'lucide-react'

interface HeaderProps {
  isDesktopSidebarCollapsed: boolean
  onOpenDrawer: () => void
  onExpandAll: () => void
  onCollapseAll: () => void
}

function Header({
  isDesktopSidebarCollapsed,
  onOpenDrawer,
  onExpandAll,
  onCollapseAll,
}: HeaderProps) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-2 transition-[margin-left] duration-200 md:pl-4 dark:border-gray-700 dark:bg-gray-900 ${
        isDesktopSidebarCollapsed ? 'md:ml-10' : 'md:ml-64'
      }`}
    >
      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="目次を開く"
        className="rounded p-2 text-gray-700 hover:bg-gray-100 md:hidden dark:text-gray-200 dark:hover:bg-gray-800"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>
      <h1 className="flex-1 truncate px-1 text-center text-base font-bold text-gray-900 md:flex-none md:text-left md:text-xl dark:text-gray-100">
        UNIDOL 審査員コメントまとめ
      </h1>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={onExpandAll}
          title="全て展開"
          className="flex items-center gap-1.5 rounded p-2 text-sm text-gray-700 hover:bg-gray-100 md:px-3 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <ChevronsUpDown className="size-5" aria-hidden="true" />
          <span className="sr-only md:not-sr-only">全て展開</span>
        </button>
        <button
          type="button"
          onClick={onCollapseAll}
          title="全て折りたたむ"
          className="flex items-center gap-1.5 rounded p-2 text-sm text-gray-700 hover:bg-gray-100 md:px-3 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <ChevronsDownUp className="size-5" aria-hidden="true" />
          <span className="sr-only md:not-sr-only">全て折りたたむ</span>
        </button>
      </div>
    </header>
  )
}

export default Header
