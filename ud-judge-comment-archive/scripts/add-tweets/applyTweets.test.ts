import { describe, expect, it } from 'vitest'
import type { Tournament } from '../../src/types.ts'
import { ApplyTweetsError, applyTweets } from './applyTweets.ts'
import type { ResolvedTarget } from './resolveTarget.ts'

function buildTournaments(): Tournament[] {
  return [
    {
      id: 'unidol-2026-summer',
      label: 'UNIDOL 2026 Summer',
      events: [
        {
          id: 'unidol-2026-summer-kanto1',
          label: '関東予選1日目',
          tweets: ['100', '200'],
        },
      ],
    },
  ]
}

function buildTarget(overrides: Partial<ResolvedTarget> = {}): ResolvedTarget {
  return {
    tournamentId: 'unidol-2026-summer',
    tournamentLabel: 'UNIDOL 2026 Summer',
    isNewTournament: false,
    eventId: 'unidol-2026-summer-kanto1',
    eventLabel: '関東予選1日目',
    isNewEvent: false,
    ...overrides,
  }
}

describe('applyTweets', () => {
  it('既存の日程にツイートを追加する', () => {
    const tournaments = buildTournaments()
    const result = applyTweets(tournaments, buildTarget(), ['300'])

    expect(result.addedTweetIds).toEqual(['300'])
    expect(result.skippedTweetIds).toEqual([])
    const event = result.tweetList[0].events[0]
    expect(event.tweets).toEqual(['100', '200', '300'])
  })

  it('入力を破壊しない', () => {
    const tournaments = buildTournaments()
    applyTweets(tournaments, buildTarget(), ['300'])

    expect(tournaments[0].events[0].tweets).toEqual(['100', '200'])
  })

  it('大きなIDでも数値として昇順に並べる', () => {
    const tournaments = buildTournaments()
    const result = applyTweets(tournaments, buildTarget(), ['99999999999999999999'])

    expect(result.tweetList[0].events[0].tweets).toEqual([
      '100',
      '200',
      '99999999999999999999',
    ])
  })

  it('同じ日程への重複はスキップされ、昇順が保たれる', () => {
    const tournaments = buildTournaments()
    const result = applyTweets(tournaments, buildTarget(), ['100', '150'])

    expect(result.addedTweetIds).toEqual(['150'])
    expect(result.skippedTweetIds).toEqual(['100'])
    expect(result.tweetList[0].events[0].tweets).toEqual(['100', '150', '200'])
  })

  it('別の日程に登録済みのIDはエラーになる', () => {
    const tournaments = buildTournaments()
    const target = buildTarget({
      eventId: 'unidol-2026-summer-kanto2',
      eventLabel: '関東予選2日目',
      isNewEvent: true,
    })

    expect(() => applyTweets(tournaments, target, ['100'])).toThrow(ApplyTweetsError)
  })

  it('エラー時には入力も戻り値も変更されない', () => {
    const tournaments = buildTournaments()
    const target = buildTarget({
      eventId: 'unidol-2026-summer-kanto2',
      eventLabel: '関東予選2日目',
      isNewEvent: true,
    })

    expect(() => applyTweets(tournaments, target, ['100'])).toThrow()
    expect(tournaments[0].events).toHaveLength(1)
  })

  it('新しい日程を先頭に作成する', () => {
    const tournaments = buildTournaments()
    const target = buildTarget({
      eventId: 'unidol-2026-summer-kanto2',
      eventLabel: '関東予選2日目',
      isNewEvent: true,
    })

    const result = applyTweets(tournaments, target, ['400'])

    expect(result.tweetList[0].events[0].id).toBe('unidol-2026-summer-kanto2')
    expect(result.tweetList[0].events[1].id).toBe('unidol-2026-summer-kanto1')
  })

  it('新しい大会を先頭に作成する', () => {
    const tournaments = buildTournaments()
    const target = buildTarget({
      tournamentId: 'unidol-2026-winter',
      tournamentLabel: 'UNIDOL 2026-27 Winter',
      isNewTournament: true,
      eventId: 'unidol-2026-winter-final',
      eventLabel: '決勝戦',
      isNewEvent: true,
    })

    const result = applyTweets(tournaments, target, ['500'])

    expect(result.tweetList[0].id).toBe('unidol-2026-winter')
    expect(result.tweetList[0].events[0].tweets).toEqual(['500'])
    expect(result.tweetList[1].id).toBe('unidol-2026-summer')
  })

  it('全件登録済みの場合、追加件数が0になる', () => {
    const tournaments = buildTournaments()
    const result = applyTweets(tournaments, buildTarget(), ['100', '200'])

    expect(result.addedTweetIds).toEqual([])
    expect(result.skippedTweetIds).toEqual(['100', '200'])
    expect(result.tweetList[0].events[0].tweets).toEqual(['100', '200'])
  })
})
