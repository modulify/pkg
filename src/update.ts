import type { Manifest } from '~types/manifest'

import detectIndent from 'detect-indent'
import { detectNewline } from 'detect-newline'
import { resolve } from 'node:path'

import {
  readFileSync,
  writeFileSync,
} from 'node:fs'

const CRLF = '\r\n'
const LF = '\n'

/**
 * @return {string} path to updated file
 */
export function update (path: string, diff: Partial<Manifest>, dry = false): string {
  return dry
    ? resolve(path, 'package.json')
    : rewrite(resolve(path, 'package.json'), diff)
}

/**
 * Rewrites the file at the given path with new manifest data
 */
export function rewrite (path: string, diff: Partial<Manifest>) {
  const content = readFileSync(path, 'utf8')

  const indent = detectIndent(content).indent
  const newline = detectNewline(content)

  writeFileSync(path, stringify({
    ...JSON.parse(content),
    ...diff,
  }, indent, newline), 'utf8')

  return path
}

/**
 * Converts the given manifest data to JSON string ready to be written into a file
 */
export function stringify (
  data: Record<string, unknown>,
  indent: number | string,
  newline: string | undefined
) {
  const json = JSON.stringify(data, null, indent)

  return newline === CRLF
    ? json.replace(/\n/g, CRLF) + CRLF
    : json + LF
}