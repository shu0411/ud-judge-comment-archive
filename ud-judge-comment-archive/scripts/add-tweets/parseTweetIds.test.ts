import { describe, expect, it } from 'vitest'
import { ParseTweetIdsError, parseTweetIds } from './parseTweetIds.ts'

const AUTHOR = 'min_kasa_0211'

describe('parseTweetIds', () => {
  it('数字のみのIDを解析できる', () => {
    expect(parseTweetIds('123456789012345678', AUTHOR)).toEqual(['123456789012345678'])
  })

  it('x.comのURLを解析できる', () => {
    expect(parseTweetIds(`https://x.com/${AUTHOR}/status/123`, AUTHOR)).toEqual(['123'])
  })

  it('twitter.comのURLを解析できる', () => {
    expect(parseTweetIds(`https://twitter.com/${AUTHOR}/status/123`, AUTHOR)).toEqual(['123'])
  })

  it('www.付きのURLを解析できる', () => {
    expect(parseTweetIds(`https://www.x.com/${AUTHOR}/status/123`, AUTHOR)).toEqual(['123'])
  })

  it('mobile.付きのURLを解析できる', () => {
    expect(parseTweetIds(`https://mobile.twitter.com/${AUTHOR}/status/123`, AUTHOR)).toEqual(['123'])
  })

  it('クエリ文字列を無視する', () => {
    expect(parseTweetIds(`https://x.com/${AUTHOR}/status/123?s=20`, AUTHOR)).toEqual(['123'])
  })

  it('改行・空白区切りの複数行を解析できる', () => {
    expect(parseTweetIds(`123\n456  789`, AUTHOR)).toEqual(['123', '456', '789'])
  })

  it('投稿者が異なるURLはエラーになる', () => {
    expect(() => parseTweetIds(`https://x.com/other_user/status/123`, AUTHOR)).toThrow(
      ParseTweetIdsError,
    )
  })

  it('投稿者の大文字小文字は区別しない', () => {
    expect(parseTweetIds(`https://x.com/${AUTHOR.toUpperCase()}/status/123`, AUTHOR)).toEqual([
      '123',
    ])
  })

  it('不正な形式の入力はエラーになる', () => {
    expect(() => parseTweetIds('not-a-tweet', AUTHOR)).toThrow(ParseTweetIdsError)
  })

  it('空の入力はエラーになる', () => {
    expect(() => parseTweetIds('   ', AUTHOR)).toThrow(ParseTweetIdsError)
  })
})
