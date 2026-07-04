import { useEffect, useRef } from 'react'
import { tweetUrl } from '../constants'

interface TweetEmbedProps {
  tweetId: string
}

function TweetEmbed({ tweetId }: TweetEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
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
    return () => {
      cancelled = true
    }
  }, [])

  const url = tweetUrl(tweetId)

  return (
    <div ref={containerRef}>
      <blockquote className="twitter-tweet">
        <a href={url}>{url}</a>
      </blockquote>
    </div>
  )
}

export default TweetEmbed
