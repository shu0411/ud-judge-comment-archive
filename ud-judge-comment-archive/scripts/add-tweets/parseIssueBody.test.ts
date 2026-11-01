import { describe, expect, it } from 'vitest'
import { IssueBodyParseError, parseIssueBody } from './parseIssueBody.ts'

function buildBody(fields: Record<string, string>): string {
  return Object.entries(fields)
    .map(([heading, value]) => `### ${heading}\n\n${value}`)
    .join('\n\n')
}

describe('parseIssueBody', () => {
  it('全項目が入力されている場合、年度と大会種類から大会名を組み立てて返す', () => {
    const body = buildBody({
      操作: '既存の大会に追加',
      年度: '2026',
      大会種類: 'Summer',
      日程: '関東',
      日目: '3',
      ツイート: 'https://x.com/example/status/123',
    })

    expect(parseIssueBody(body)).toEqual({
      operation: '既存の大会に追加',
      tournamentName: 'UNIDOL 2026 Summer',
      eventName: '関東',
      day: '3',
      tweetsText: 'https://x.com/example/status/123',
    })
  })

  it('Winterの年度（20XX-XY形式）から大会名を組み立てられる', () => {
    const body = buildBody({
      操作: '新しい大会を作成して追加',
      年度: '2026-27',
      大会種類: 'Winter',
      日程: '決勝戦',
      日目: 'なし',
      ツイート: '123',
    })

    expect(parseIssueBody(body).tournamentName).toBe('UNIDOL 2026-27 Winter')
  })

  it('年度と大会種類がどちらも _No response_ の場合、大会名はnullになる', () => {
    const body = buildBody({
      操作: '既存の大会に追加',
      年度: '_No response_',
      大会種類: '_No response_',
      日程: '東海',
      日目: 'なし',
      ツイート: '123',
    })

    expect(parseIssueBody(body).tournamentName).toBeNull()
  })

  it('年度だけが入力されている場合、エラーになる', () => {
    const body = buildBody({
      操作: '既存の大会に追加',
      年度: '2026',
      大会種類: '_No response_',
      日程: '東海',
      日目: 'なし',
      ツイート: '123',
    })

    expect(() => parseIssueBody(body)).toThrow(IssueBodyParseError)
  })

  it('大会種類だけが選択されている場合、エラーになる', () => {
    const body = buildBody({
      操作: '既存の大会に追加',
      年度: '_No response_',
      大会種類: 'Summer',
      日程: '東海',
      日目: 'なし',
      ツイート: '123',
    })

    expect(() => parseIssueBody(body)).toThrow(IssueBodyParseError)
  })

  it('見出しが欠落している場合、エラーになる', () => {
    const body = buildBody({
      操作: '既存の大会に追加',
      日程: '東海',
      日目: 'なし',
      ツイート: '123',
    })

    expect(() => parseIssueBody(body)).toThrow(IssueBodyParseError)
  })

  it('ツイートが _No response_ の場合、エラーになる', () => {
    const body = buildBody({
      操作: '既存の大会に追加',
      年度: '_No response_',
      大会種類: '_No response_',
      日程: '東海',
      日目: 'なし',
      ツイート: '_No response_',
    })

    expect(() => parseIssueBody(body)).toThrow(IssueBodyParseError)
  })

  it('改行を含む複数行のツイート欄を保持する', () => {
    const body = buildBody({
      操作: '既存の大会に追加',
      年度: '_No response_',
      大会種類: '_No response_',
      日程: '東海',
      日目: 'なし',
      ツイート: '123\n456',
    })

    expect(parseIssueBody(body).tweetsText).toBe('123\n456')
  })
})
