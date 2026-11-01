import type { Tournament } from '../../src/types.ts'
import { parseTournamentLabel, REGION_TYPES, ResolveTargetError } from './resolveTarget.ts'

const EXACT_EVENT_TYPES = ['final', 'repechage']
const REGION_TYPE_VALUES = Object.values(REGION_TYPES)

function isValidEventType(type: string): boolean {
  if (EXACT_EVENT_TYPES.includes(type)) {
    return true
  }
  return REGION_TYPE_VALUES.some(
    (region) =>
      type === region ||
      (type.length === region.length + 1 && type.startsWith(region) && /^[1-9]$/.test(type.slice(-1))),
  )
}

export function validateTweetList(tweetList: Tournament[]): string[] {
  const errors: string[] = []
  const tournamentIds = new Set<string>()
  const eventIds = new Set<string>()
  const tweetIds = new Set<string>()

  for (const tournament of tweetList) {
    try {
      const { id: expectedId } = parseTournamentLabel(tournament.label)
      if (expectedId !== tournament.id) {
        errors.push(
          `大会「${tournament.label}」のID「${tournament.id}」が規則と一致しません（期待値: ${expectedId}）`,
        )
      }
    } catch (error) {
      errors.push(error instanceof ResolveTargetError ? error.message : String(error))
    }

    if (tournamentIds.has(tournament.id)) {
      errors.push(`大会ID「${tournament.id}」が重複しています`)
    }
    tournamentIds.add(tournament.id)

    for (const event of tournament.events) {
      if (!event.id.startsWith(`${tournament.id}-`)) {
        errors.push(`日程ID「${event.id}」が大会ID「${tournament.id}」と一致しません`)
      } else {
        const type = event.id.slice(tournament.id.length + 1)
        if (!isValidEventType(type)) {
          errors.push(`日程ID「${event.id}」の種別「${type}」が規則に沿っていません`)
        }
      }

      if (eventIds.has(event.id)) {
        errors.push(`日程ID「${event.id}」が重複しています`)
      }
      eventIds.add(event.id)

      let previous: bigint | null = null
      for (const tweetId of event.tweets) {
        if (!/^\d+$/.test(tweetId)) {
          errors.push(`ツイートID「${tweetId}」が数字のみではありません`)
          continue
        }

        if (tweetIds.has(tweetId)) {
          errors.push(`ツイートID「${tweetId}」が重複しています`)
        }
        tweetIds.add(tweetId)

        const current = BigInt(tweetId)
        if (previous !== null && current <= previous) {
          errors.push(`日程「${event.id}」のツイートIDが昇順ではありません: ${tweetId}`)
        }
        previous = current
      }
    }
  }

  return errors
}
