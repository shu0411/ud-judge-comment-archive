export class ParseTweetIdsError extends Error {}

const TWEET_URL_PATTERN = /^https?:\/\/(?:www\.|mobile\.)?(?:x\.com|twitter\.com)\/([^/?#]+)\/status\/(\d+)/i
const TWEET_ID_PATTERN = /^\d+$/

export function parseTweetIds(text: string, authorHandle: string): string[] {
  const tokens = text.split(/\s+/).filter((token) => token.length > 0)
  if (tokens.length === 0) {
    throw new ParseTweetIdsError('ツイートが入力されていません')
  }

  return tokens.map((token) => parseTweetToken(token, authorHandle))
}

function parseTweetToken(token: string, authorHandle: string): string {
  const urlMatch = TWEET_URL_PATTERN.exec(token)
  if (urlMatch) {
    const [, handle, id] = urlMatch
    if (handle.toLowerCase() !== authorHandle.toLowerCase()) {
      throw new ParseTweetIdsError(`「${token}」は投稿者が異なるため追加できません`)
    }
    return id
  }

  if (TWEET_ID_PATTERN.test(token)) {
    return token
  }

  throw new ParseTweetIdsError(`「${token}」はツイートのURLまたはIDとして認識できません`)
}
