import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import { tweetUrl } from '../constants'

interface TweetEmbedProps {
  tweetId: string
}

function TweetEmbed({ tweetId }: TweetEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const url = tweetUrl(tweetId)

  useEffect(() => {
    let cancelled = false

    function renderWidget(theme: 'light' | 'dark') {
      const container = containerRef.current
      if (!container) return

      container.innerHTML = ''
      const blockquote = document.createElement('blockquote')
      blockquote.className = 'twitter-tweet'
      blockquote.dataset.theme = theme
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.textContent = url
      blockquote.appendChild(anchor)
      container.appendChild(blockquote)

      let attempts = 0
      function tryLoad() {
        if (cancelled) return
        const twttr = window.twttr
        if (twttr?.widgets && containerRef.current) {
          twttr.widgets.load(containerRef.current)
          return
        }
        if (attempts < 20) {
          attempts += 1
          setTimeout(tryLoad, 100)
        }
      }
      tryLoad()
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
  }, [url])

  return <Box ref={containerRef} sx={{ width: { xs: '100%', sm: 'auto' }, maxWidth: '100%', overflow: 'hidden' }} />
}

export default TweetEmbed
