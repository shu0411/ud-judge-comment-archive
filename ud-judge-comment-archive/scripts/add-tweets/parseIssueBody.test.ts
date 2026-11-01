import { describe, expect, it } from 'vitest'
import { IssueBodyParseError, parseIssueBody } from './parseIssueBody.ts'

function buildBody(fields: Record<string, string>): string {
  return Object.entries(fields)
    .map(([heading, value]) => `### ${heading}\n\n${value}`)
    .join('\n\n')
}

describe('parseIssueBody', () => {
  it('全項目が入力されている場合、そのまま値を返す', () => {
    const body = buildBody({
      操作: '既存の大会に追加',
      大会名: 'UNIDOL 2026 Summer',
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

  it('大会名が _No response_ の場合、nullを返す', () => {
    const body = buildBody({
      操作: '既存の大会に追加',
      大会名: '_No response_',
      日程: '東海',
      日目: 'なし',
      ツイート: '123',
    })

    expect(parseIssueBody(body).tournamentName).toBeNull()
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
      大会名: '_No response_',
      日程: '東海',
      日目: 'なし',
      ツイート: '_No response_',
    })

    expect(() => parseIssueBody(body)).toThrow(IssueBodyParseError)
  })

  it('改行を含む複数行のツイート欄を保持する', () => {
    const body = buildBody({
      操作: '既存の大会に追加',
      大会名: '_No response_',
      日程: '東海',
      日目: 'なし',
      ツイート: '123\n456',
    })

    expect(parseIssueBody(body).tweetsText).toBe('123\n456')
  })
})
