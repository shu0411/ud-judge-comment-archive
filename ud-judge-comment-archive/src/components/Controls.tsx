interface ControlsProps {
  onExpandAll: () => void
  onCollapseAll: () => void
}

function Controls({ onExpandAll, onCollapseAll }: ControlsProps) {
  return (
    <div className="flex gap-2 px-4 py-2">
      <button
        type="button"
        onClick={onExpandAll}
        className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        全て展開する
      </button>
      <button
        type="button"
        onClick={onCollapseAll}
        className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        全て折りたたむ
      </button>
    </div>
  )
}

export default Controls
