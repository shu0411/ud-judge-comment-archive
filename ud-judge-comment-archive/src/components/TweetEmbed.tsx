import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import { tweetUrl } from '../constants'

interface TweetEmbedProps {
  tweetId: string
}

// ビューポートからこの距離まで近づいたら読み込みを開始する（先読みマージン）
const PRELOAD_ROOT_MARGIN = '600px'

function TweetEmbed({ tweetId }: TweetEmbedProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const widgetContainerRef = useRef<HTMLDivElement>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const url = tweetUrl(tweetId)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: PRELOAD_ROOT_MARGIN },
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isNearViewport) return
    let cancelled = false

    function renderWidget(theme: 'light' | 'dark') {
      const container = widgetContainerRef.current
      if (!container) return

      container.innerHTML = ''
      const blockquote = document.createElement('blockquote')
      blockquote.className = 'twitter-tweet'
      blockquote.dataset.theme = theme
      blockquote.dataset.conversation = 'none'
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.textContent = url
      blockquote.appendChild(anchor)
      container.appendChild(blockquote)

      window.twttr?.ready(() => {
        if (cancelled || !widgetContainerRef.current) return
        window.twttr?.widgets?.load(widgetContainerRef.current)
      })
    }

    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    renderWidget(mql.matches ? 'dark' : 'light')

    function handleChange(e: MediaQueryListEvent) {
      renderWidget(e.matches ? 'dark' : 'light')
    }
    mql.addEventListener('change', handleChange)

    return () => {
      cancelled = true
      mql.removeEventListener('change', handleChange)
    }
  }, [url, isNearViewport])

  return (
    <Box ref={rootRef} sx={{ width: { xs: '100%', sm: 'auto' }, maxWidth: '100%', overflow: 'hidden' }}>
      {!isNearViewport && <Skeleton variant="rounded" width={550} height={200} sx={{ maxWidth: '100%' }} />}
      <Box ref={widgetContainerRef} />
    </Box>
  )
}

export default TweetEmbed
