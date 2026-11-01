import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { Tournament } from '../../src/types.ts'
import { ResolveTargetError, resolveTarget } from './resolveTarget.ts'

const DATA_FILE_PATH = new URL('../../src/data/tweetList.json', import.meta.url)
const tournaments = JSON.parse(readFileSync(DATA_FILE_PATH, 'utf-8')) as Tournament[]

function buildInput(overrides: Partial<Parameters<typeof resolveTarget>[0]> = {}) {
  return {
    operation: '既存の大会に追加',
    tournamentName: null,
    eventName: '関東',
    day: 'なし',
    ...overrides,
  }
}

describe('resolveTarget - 大会名からのID生成', () => {
  it.each(tournaments.map((tournament) => [tournament.label, tournament.id] as const))(
    '既存の大会名「%s」からID「%s」を生成できる',
    (label, id) => {
      const result = resolveTarget(
        buildInput({ tournamentName: label, eventName: '決勝戦' }),
        tournaments,
      )
      expect(result.tournamentId).toBe(id)
      expect(result.isNewTournament).toBe(false)
    },
  )

  it('形式違いの大会名はエラーになる', () => {
    expect(() =>
      resolveTarget(buildInput({ tournamentName: 'UNIDOL 2026年 Summer' }), tournaments),
    ).toThrow(ResolveTargetError)
  })

  it('Winterの年の形式が不正な場合エラーになる', () => {
    expect(() =>
      resolveTarget(buildInput({ tournamentName: 'UNIDOL 2026-28 Winter' }), tournaments),
    ).toThrow(ResolveTargetError)
  })

  it('存在しない大会への追加はエラーになり、新規作成しない', () => {
    expect(() =>
      resolveTarget(buildInput({ tournamentName: 'UNIDOL 2099 Summer' }), tournaments),
    ).toThrow(ResolveTargetError)
  })

  it('既存の大会を新規作成しようとするとエラーになる', () => {
    expect(() =>
      resolveTarget(
        buildInput({
          operation: '新しい大会を作成して追加',
          tournamentName: 'UNIDOL 2026 Summer',
        }),
        tournaments,
      ),
    ).toThrow(ResolveTargetError)
  })

  it('新しい大会を作成して追加する場合、配列の先頭に追加される対象として扱われる', () => {
    const result = resolveTarget(
      buildInput({
        operation: '新しい大会を作成して追加',
        tournamentName: 'UNIDOL 2026-27 Winter',
        eventName: '決勝戦',
      }),
      tournaments,
    )
    expect(result.tournamentId).toBe('unidol-2026-winter')
    expect(result.isNewTournament).toBe(true)
  })

  it('新規作成で大会名が空欄の場合エラーになる', () => {
    expect(() =>
      resolveTarget(
        buildInput({ operation: '新しい大会を作成して追加', tournamentName: null }),
        tournaments,
      ),
    ).toThrow(ResolveTargetError)
  })

  it('大会名が空欄なら最新大会（配列先頭）に追加される', () => {
    const result = resolveTarget(buildInput({ eventName: '決勝戦' }), tournaments)
    expect(result.tournamentId).toBe(tournaments[0].id)
  })
})

describe('resolveTarget - 日程の解決', () => {
  it('決勝戦を解決できる', () => {
    const result = resolveTarget(
      buildInput({ tournamentName: 'UNIDOL 2026 Summer', eventName: '決勝戦' }),
      tournaments,
    )
    expect(result.eventId).toBe('unidol-2026-summer-final')
    expect(result.eventLabel).toBe('決勝戦')
  })

  it('敗者復活戦を解決できる', () => {
    const result = resolveTarget(
      buildInput({ tournamentName: 'UNIDOL 2026 Summer', eventName: '敗者復活戦' }),
      tournaments,
    )
    expect(result.eventId).toBe('unidol-2026-summer-repechage')
    expect(result.eventLabel).toBe('敗者復活戦')
  })

  it('決勝戦に日目を指定するとエラーになる', () => {
    expect(() =>
      resolveTarget(
        buildInput({ tournamentName: 'UNIDOL 2026 Summer', eventName: '決勝戦', day: '1' }),
        tournaments,
      ),
    ).toThrow(ResolveTargetError)
  })

  it('敗者復活戦に日目を指定するとエラーになる', () => {
    expect(() =>
      resolveTarget(
        buildInput({ tournamentName: 'UNIDOL 2026 Summer', eventName: '敗者復活戦', day: '2' }),
        tournaments,
      ),
    ).toThrow(ResolveTargetError)
  })

  it.each([
    ['関東', 'kanto'],
    ['東海', 'tokai'],
    ['関西', 'kansai'],
    ['九州', 'kyushu'],
    ['北海道', 'hokkaido'],
  ])('地域「%s」の種別は「%s」になる(Fresh以外・日目あり)', (region, type) => {
    const result = resolveTarget(
      buildInput({ tournamentName: 'UNIDOL 2026 Summer', eventName: region, day: '2' }),
      tournaments,
    )
    expect(result.eventId).toBe(`unidol-2026-summer-${type}2`)
    expect(result.eventLabel).toBe(`${region}予選2日目`)
  })

  it('Fresh以外・日目なしの場合「{地域}予選」になる', () => {
    const result = resolveTarget(
      buildInput({ tournamentName: 'UNIDOL 2026 Summer', eventName: '東海', day: 'なし' }),
      tournaments,
    )
    expect(result.eventId).toBe('unidol-2026-summer-tokai')
    expect(result.eventLabel).toBe('東海予選')
  })

  it('Freshの場合「{地域}{N}日目」になる(予選を付けない)', () => {
    const result = resolveTarget(
      buildInput({ tournamentName: 'UNIDOL 2025 Fresh', eventName: '関西', day: '2' }),
      tournaments,
    )
    expect(result.eventId).toBe('unidol-2025-fresh-kansai2')
    expect(result.eventLabel).toBe('関西2日目')
  })

  it('ラベルの揺れがある既存の日程（東海予選 / 東海）でも種別IDで一致し、既存ラベルを変更しない', () => {
    const result = resolveTarget(
      buildInput({ tournamentName: 'UNIDOL 2025-26 Winter', eventName: '東海', day: 'なし' }),
      tournaments,
    )
    expect(result.eventId).toBe('unidol-2025-winter-tokai')
    expect(result.isNewEvent).toBe(false)
    expect(result.eventLabel).toBe('東海')
  })

  it('ラベルの揺れがある既存の日程（関東3日目 / 関東予選3日目）でも種別IDで一致し、既存ラベルを変更しない', () => {
    const result = resolveTarget(
      buildInput({ tournamentName: 'UNIDOL 2025 Fresh', eventName: '関東', day: '3' }),
      tournaments,
    )
    expect(result.eventId).toBe('unidol-2025-fresh-kanto3')
    expect(result.isNewEvent).toBe(false)
    expect(result.eventLabel).toBe('関東3日目')
  })

  it('既存の大会に新しい日程が追加対象として解決される', () => {
    const result = resolveTarget(
      buildInput({ tournamentName: 'UNIDOL 2026 Summer', eventName: '関西', day: '1' }),
      tournaments,
    )
    expect(result.isNewEvent).toBe(true)
    expect(result.eventId).toBe('unidol-2026-summer-kansai1')
  })
})
