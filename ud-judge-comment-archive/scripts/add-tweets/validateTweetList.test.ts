import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { Tournament } from '../../src/types.ts'
import { validateTweetList } from './validateTweetList.ts'

const DATA_FILE_PATH = new URL('../../src/data/tweetList.json', import.meta.url)

function buildValidTournaments(): Tournament[] {
  return [
    {
      id: 'unidol-2026-summer',
      label: 'UNIDOL 2026 Summer',
      events: [
        { id: 'unidol-2026-summer-final', label: '決勝戦', tweets: ['100', '200'] },
        { id: 'unidol-2026-summer-kanto1', label: '関東予選1日目', tweets: [] },
      ],
    },
    {
      id: 'unidol-2025-fresh',
      label: 'UNIDOL 2025 Fresh',
      events: [{ id: 'unidol-2025-fresh-kanto2', label: '関東2日目', tweets: ['300'] }],
    },
  ]
}

describe('validateTweetList', () => {
  it('規則を満たすデータはエラーなし', () => {
    expect(validateTweetList(buildValidTournaments())).toEqual([])
  })

  it('実データのtweetList.jsonは規則を満たす', () => {
    const tweetList = JSON.parse(readFileSync(DATA_FILE_PATH, 'utf-8')) as Tournament[]
    expect(validateTweetList(tweetList)).toEqual([])
  })

  it('実データのtweetList.jsonは読み書きしてバイト単位で一致する', () => {
    const original = readFileSync(DATA_FILE_PATH, 'utf-8')
    const tweetList = JSON.parse(original) as Tournament[]
    expect(`${JSON.stringify(tweetList, null, 2)}\n`).toBe(original)
  })

  it('大会名とIDが一致しない場合エラーになる', () => {
    const tournaments = buildValidTournaments()
    tournaments[0].id = 'unidol-2026-summer-x'

    expect(validateTweetList(tournaments)).not.toEqual([])
  })

  it('大会IDの重複を検出する', () => {
    const tournaments = buildValidTournaments()
    tournaments[1].id = tournaments[0].id
    tournaments[1].label = tournaments[0].label

    expect(validateTweetList(tournaments).some((message) => message.includes('重複'))).toBe(
      true,
    )
  })

  it('日程IDが大会IDと一致しない場合エラーになる', () => {
    const tournaments = buildValidTournaments()
    tournaments[0].events[0].id = 'unidol-other-final'

    expect(validateTweetList(tournaments)).not.toEqual([])
  })

  it('日程IDの種別が不正な場合エラーになる', () => {
    const tournaments = buildValidTournaments()
    tournaments[0].events[0].id = 'unidol-2026-summer-unknown'

    expect(validateTweetList(tournaments)).not.toEqual([])
  })

  it('日程IDの重複を検出する', () => {
    const tournaments = buildValidTournaments()
    tournaments[0].events[1].id = tournaments[0].events[0].id

    expect(validateTweetList(tournaments).some((message) => message.includes('重複'))).toBe(
      true,
    )
  })

  it('ツイートIDが数字のみでない場合エラーになる', () => {
    const tournaments = buildValidTournaments()
    tournaments[0].events[0].tweets = ['abc']

    expect(validateTweetList(tournaments)).not.toEqual([])
  })

  it('ツイートIDの重複を検出する', () => {
    const tournaments = buildValidTournaments()
    tournaments[0].events[0].tweets = ['100']
    tournaments[0].events[1].tweets = ['100']

    expect(validateTweetList(tournaments).some((message) => message.includes('重複'))).toBe(
      true,
    )
  })

  it('ツイートIDが昇順でない場合エラーになる', () => {
    const tournaments = buildValidTournaments()
    tournaments[0].events[0].tweets = ['200', '100']

    expect(validateTweetList(tournaments).some((message) => message.includes('昇順'))).toBe(
      true,
    )
  })
})
