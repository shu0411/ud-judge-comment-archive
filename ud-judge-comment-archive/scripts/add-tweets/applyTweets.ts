import type { Tournament } from '../../src/types.ts'
import type { ResolvedTarget } from './resolveTarget.ts'

export class ApplyTweetsError extends Error {}

export interface ApplyTweetsResult {
  tweetList: Tournament[]
  addedTweetIds: string[]
  skippedTweetIds: string[]
  tournamentId: string
  tournamentLabel: string
  isNewTournament: boolean
  eventId: string
  eventLabel: string
  isNewEvent: boolean
}

function sortTweetIds(ids: string[]): string[] {
  return [...ids].sort((a, b) => {
    const diff = BigInt(a) - BigInt(b)
    return diff < 0n ? -1 : diff > 0n ? 1 : 0
  })
}

function cloneTweetList(tweetList: Tournament[]): Tournament[] {
  return tweetList.map((tournament) => ({
    ...tournament,
    events: tournament.events.map((event) => ({ ...event, tweets: [...event.tweets] })),
  }))
}

export function applyTweets(
  tweetList: Tournament[],
  target: ResolvedTarget,
  tweetIds: string[],
): ApplyTweetsResult {
  const eventIdByTweetId = new Map<string, string>()
  for (const tournament of tweetList) {
    for (const event of tournament.events) {
      for (const id of event.tweets) {
        eventIdByTweetId.set(id, event.id)
      }
    }
  }

  const uniqueIds = Array.from(new Set(tweetIds))

  const conflictIds = uniqueIds.filter((id) => {
    const existingEventId = eventIdByTweetId.get(id)
    return existingEventId !== undefined && existingEventId !== target.eventId
  })
  if (conflictIds.length > 0) {
    throw new ApplyTweetsError(`別の日程に登録済みのツイートIDです: ${conflictIds.join(', ')}`)
  }

  const skippedTweetIds = uniqueIds.filter((id) => eventIdByTweetId.get(id) === target.eventId)
  const addedTweetIds = uniqueIds.filter((id) => eventIdByTweetId.get(id) === undefined)

  const newTweetList = cloneTweetList(tweetList)

  let tournament = newTweetList.find((t) => t.id === target.tournamentId)
  if (tournament === undefined) {
    tournament = { id: target.tournamentId, label: target.tournamentLabel, events: [] }
    newTweetList.unshift(tournament)
  }

  let event = tournament.events.find((e) => e.id === target.eventId)
  if (event === undefined) {
    event = { id: target.eventId, label: target.eventLabel, tweets: [] }
    tournament.events.unshift(event)
  }

  event.tweets = sortTweetIds([...event.tweets, ...addedTweetIds])

  return {
    tweetList: newTweetList,
    addedTweetIds,
    skippedTweetIds,
    tournamentId: target.tournamentId,
    tournamentLabel: target.tournamentLabel,
    isNewTournament: target.isNewTournament,
    eventId: target.eventId,
    eventLabel: target.eventLabel,
    isNewEvent: target.isNewEvent,
  }
}
