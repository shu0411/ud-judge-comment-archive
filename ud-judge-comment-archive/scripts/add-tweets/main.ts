import { appendFileSync, readFileSync, writeFileSync } from 'node:fs'
import { TWEET_AUTHOR_HANDLE, tweetUrl } from '../../src/constants.ts'
import type { Tournament } from '../../src/types.ts'
import { applyTweets, type ApplyTweetsResult } from './applyTweets.ts'
import { parseIssueBody } from './parseIssueBody.ts'
import { parseTweetIds } from './parseTweetIds.ts'
import { resolveTarget } from './resolveTarget.ts'
import { validateTweetList } from './validateTweetList.ts'

const DATA_FILE_PATH = new URL('../../src/data/tweetList.json', import.meta.url)

function requireEnv(name: string): string {
  const value = process.env[name]
  if (value === undefined || value === '') {
    throw new Error(`環境変数 ${name} が設定されていません`)
  }
  return value
}

function writeOutput(name: string, value: string): void {
  const outputPath = process.env.GITHUB_OUTPUT
  if (outputPath === undefined) {
    console.log(`${name}=${value}`)
    return
  }
  const delimiter = `ghadelim_${Math.random().toString(36).slice(2)}`
  appendFileSync(outputPath, `${name}<<${delimiter}\n${value}\n${delimiter}\n`)
}

function buildAddedSummary(result: ApplyTweetsResult): string {
  const lines: string[] = []
  lines.push(`大会: ${result.tournamentLabel}${result.isNewTournament ? '（新規作成）' : ''}`)
  lines.push(`日程: ${result.eventLabel}${result.isNewEvent ? '（新規作成）' : ''}`)
  lines.push(`追加したツイート: ${result.addedTweetIds.length}件`)
  for (const id of result.addedTweetIds) {
    lines.push(`- ${tweetUrl(id)}`)
  }
  if (result.skippedTweetIds.length > 0) {
    lines.push(`登録済みのためスキップしたツイート: ${result.skippedTweetIds.length}件`)
    for (const id of result.skippedTweetIds) {
      lines.push(`- ${tweetUrl(id)}`)
    }
  }
  return lines.join('\n')
}

function buildNoChangeSummary(result: ApplyTweetsResult): string {
  return `指定されたツイートはすべて登録済みでした（${result.skippedTweetIds.length}件）。変更はありません。`
}

function buildCommitMessage(result: ApplyTweetsResult, issueNumber: string): string {
  return `ツイート追加: ${result.tournamentLabel} ${result.eventLabel} (#${issueNumber})`
}

function main(): void {
  const issueBody = requireEnv('ISSUE_BODY')
  const issueNumber = requireEnv('ISSUE_NUMBER')

  try {
    const fields = parseIssueBody(issueBody)
    const tweetIds = parseTweetIds(fields.tweetsText, TWEET_AUTHOR_HANDLE)

    const tweetList = JSON.parse(readFileSync(DATA_FILE_PATH, 'utf-8')) as Tournament[]

    const target = resolveTarget(
      {
        operation: fields.operation,
        tournamentName: fields.tournamentName,
        eventName: fields.eventName,
        day: fields.day,
      },
      tweetList,
    )

    const result = applyTweets(tweetList, target, tweetIds)

    const validationErrors = validateTweetList(result.tweetList)
    if (validationErrors.length > 0) {
      throw new Error(`内部エラー: 検証に失敗しました\n${validationErrors.join('\n')}`)
    }

    if (result.addedTweetIds.length === 0) {
      writeOutput('status', 'no-change')
      writeOutput('summary', buildNoChangeSummary(result))
      return
    }

    writeFileSync(DATA_FILE_PATH, `${JSON.stringify(result.tweetList, null, 2)}\n`)

    writeOutput('status', 'added')
    writeOutput('summary', buildAddedSummary(result))
    writeOutput('commit-message', buildCommitMessage(result, issueNumber))
  } catch (error) {
    // 入力エラーはここで捕捉してIssueへのコメント用に出力する。
    // 終了コードは0のままにし、ワークフロー側の if: failure() とは区別する。
    const message = error instanceof Error ? error.message : String(error)
    writeOutput('status', 'error')
    writeOutput('summary', message)
  }
}

main()
