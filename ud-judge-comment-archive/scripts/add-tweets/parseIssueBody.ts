export class IssueBodyParseError extends Error {}

export interface IssueFormInput {
  operation: string
  tournamentName: string | null
  eventName: string
  day: string
  tweetsText: string
}

const NO_RESPONSE = '_No response_'

function extractSections(body: string): Map<string, string> {
  const sections = new Map<string, string>()
  const lines = body.split(/\r\n|\r|\n/)
  let heading: string | null = null
  let buffer: string[] = []

  const flush = () => {
    if (heading !== null) {
      sections.set(heading, buffer.join('\n').trim())
    }
  }

  for (const line of lines) {
    const match = /^###\s+(.+?)\s*$/.exec(line)
    if (match) {
      flush()
      heading = match[1]
      buffer = []
    } else {
      buffer.push(line)
    }
  }
  flush()

  return sections
}

function getSection(sections: Map<string, string>, heading: string): string {
  const value = sections.get(heading)
  if (value === undefined) {
    throw new IssueBodyParseError(`Issue本文に見出し「${heading}」が見つかりません`)
  }
  return value
}

function toOptional(value: string): string | null {
  return value === NO_RESPONSE ? null : value
}

export function parseIssueBody(body: string): IssueFormInput {
  const sections = extractSections(body)

  const operation = getSection(sections, '操作')
  const tournamentName = toOptional(getSection(sections, '大会名'))
  const eventName = getSection(sections, '日程')
  const day = getSection(sections, '日目')
  const tweetsText = getSection(sections, 'ツイート')

  if (toOptional(tweetsText) === null) {
    throw new IssueBodyParseError('ツイートが入力されていません')
  }

  return { operation, tournamentName, eventName, day, tweetsText }
}
