export const TWEET_AUTHOR_HANDLE = 'min_kasa_0211'

export function tweetUrl(tweetId: string) {
  return `https://x.com/${TWEET_AUTHOR_HANDLE}/status/${tweetId}`
}
