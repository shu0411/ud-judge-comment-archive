import type { Tournament } from '../../src/types.ts'

export class ResolveTargetError extends Error {}

export type Season = 'summer' | 'fresh' | 'winter'

export const REGION_TYPES: Record<string, string> = {
  関東: 'kanto',
  東海: 'tokai',
  関西: 'kansai',
  九州: 'kyushu',
  北海道: 'hokkaido',
}

export interface ParsedTournamentLabel {
  id: string
  season: Season
}

export function parseTournamentLabel(label: string): ParsedTournamentLabel {
  const summerFreshMatch = /^UNIDOL (\d{4}) (Summer|Fresh)$/.exec(label)
  if (summerFreshMatch) {
    const [, year, season] = summerFreshMatch
    return { id: `unidol-${year}-${season.toLowerCase()}`, season: season.toLowerCase() as Season }
  }

  const winterMatch = /^UNIDOL (\d{4})-(\d{2}) Winter$/.exec(label)
  if (winterMatch) {
    const [, startYearText, endYearSuffix] = winterMatch
    const startYear = Number(startYearText)
    const expectedSuffix = String((startYear + 1) % 100).padStart(2, '0')
    if (expectedSuffix !== endYearSuffix) {
      throw new ResolveTargetError(
        `大会名「${label}」の年の形式が不正です。「${startYearText}-${expectedSuffix}」のように開始年の次の年を指定してください`,
      )
    }
    return { id: `unidol-${startYearText}-winter`, season: 'winter' }
  }

  throw new ResolveTargetError(
    `大会名「${label}」の形式が不正です。年度はSummer・Freshなら「2026」、Winterなら「2026-27」の形式で指定してください`,
  )
}

export interface ResolvedEventTarget {
  id: string
  label: string
}

export function resolveEventTarget(
  eventName: string,
  day: string,
  tournamentId: string,
  season: Season,
): ResolvedEventTarget {
  if (eventName === '決勝戦' || eventName === '敗者復活戦') {
    if (day !== 'なし') {
      throw new ResolveTargetError(`「${eventName}」に日目を指定することはできません`)
    }
    const type = eventName === '決勝戦' ? 'final' : 'repechage'
    return { id: `${tournamentId}-${type}`, label: eventName }
  }

  const regionType = REGION_TYPES[eventName]
  if (regionType === undefined) {
    throw new ResolveTargetError(`不明な日程です: ${eventName}`)
  }

  const daySuffix = day === 'なし' ? '' : day
  const labelDaySuffix = day === 'なし' ? '' : `${day}日目`
  const labelPrefix = season === 'fresh' ? eventName : `${eventName}予選`

  return {
    id: `${tournamentId}-${regionType}${daySuffix}`,
    label: `${labelPrefix}${labelDaySuffix}`,
  }
}

export interface ResolveTargetInput {
  operation: string
  tournamentName: string | null
  eventName: string
  day: string
}

export interface ResolvedTarget {
  tournamentId: string
  tournamentLabel: string
  isNewTournament: boolean
  eventId: string
  eventLabel: string
  isNewEvent: boolean
}

export function resolveTarget(input: ResolveTargetInput, tournaments: Tournament[]): ResolvedTarget {
  const isNewTournamentOperation = input.operation === '新しい大会を作成して追加'

  let tournamentLabel: string
  if (isNewTournamentOperation) {
    if (input.tournamentName === null) {
      throw new ResolveTargetError('新しい大会を作成するには大会名が必須です')
    }
    tournamentLabel = input.tournamentName
  } else {
    tournamentLabel = input.tournamentName ?? tournaments[0]?.label
    if (tournamentLabel === undefined) {
      throw new ResolveTargetError('追加先の大会がありません')
    }
  }

  const { id: tournamentId, season } = parseTournamentLabel(tournamentLabel)
  const existingTournament = tournaments.find((tournament) => tournament.id === tournamentId)

  if (isNewTournamentOperation) {
    if (existingTournament !== undefined) {
      throw new ResolveTargetError(`大会「${tournamentLabel}」は既に存在します`)
    }
  } else if (existingTournament === undefined) {
    throw new ResolveTargetError(`大会「${tournamentLabel}」が見つかりません`)
  }

  const event = resolveEventTarget(input.eventName, input.day, tournamentId, season)
  const existingEvent = existingTournament?.events.find((e) => e.id === event.id)

  return {
    tournamentId,
    tournamentLabel,
    isNewTournament: existingTournament === undefined,
    eventId: event.id,
    eventLabel: existingEvent?.label ?? event.label,
    isNewEvent: existingEvent === undefined,
  }
}
