import type { Manifest } from '~types/manifest'

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  test,
} from 'vitest'

import * as fs from 'node:fs'

import {
  join,
  resolve,
} from 'node:path'

import {
  stringify,
  update,
} from '@/update'

const __fixtures = resolve(__dirname, 'fixtures')
const __temporary = resolve(__dirname, 'temporary')

describe('update.ts', () => {
  beforeEach(() => {
    if (!fs.existsSync(__temporary)) {
      fs.mkdirSync(__temporary)
    }
  })

  afterEach(() => {
    fs.rmSync(__temporary, { recursive: true, force: true })
  })

  it('updates manifest', () => {
    const __manifest = join(__temporary, 'package.json')

    fs.copyFileSync(join(__fixtures, 'update', 'dots-2', 'package.json'), __manifest)

    expect(update(__temporary, {
      version: '1.1.0',
      description: 'Updated description',
    })).toBe(__manifest)

    expect(fs.readFileSync(__manifest, 'utf8')).toBe(`{\n  "name": "original",\n  "version": "1.1.0",\n  "description": "Updated description"\n}\n`)
  })

  it('updates manifest (tab = 4 dots)', () => {
    const __manifest = join(__temporary, 'package.json')

    fs.copyFileSync(join(__fixtures, 'update', 'dots-4', 'package.json'), __manifest)

    expect(update(__temporary, {
      version: '1.1.0',
      description: 'Updated description',
    })).toBe(__manifest)

    expect(fs.readFileSync(__manifest, 'utf8')).toBe(`{\n    "name": "original",\n    "version": "1.1.0",\n    "description": "Updated description"\n}\n`)
  })

  it('does not update manifest for dry runs', () => {
    const __manifest = join(__temporary, 'package.json')

    fs.copyFileSync(join(__fixtures, 'update', 'dots-2', 'package.json'), __manifest)

    expect(update(__temporary, {
      version: '1.1.0',
      description: 'Updated description',
    }, true)).toBe(__manifest)

    const manifest = JSON.parse(fs.readFileSync(__manifest, 'utf8')) as Manifest

    expect(manifest.name).toBe('original')
    expect(manifest.version).toBe('1.0.0')
    expect(manifest.description).toBe('Original')
  })
})

test('stringify', () => {
  expect(stringify({
    name: 'test',
    version: '1.1.0'
  }, 2, '\n')).toBe(`{\n  "name": "test",\n  "version": "1.1.0"\n}\n`)

  expect(stringify({
    name: 'test',
    version: '1.1.0'
  }, 4, '\r\n')).toBe(`{\r\n    "name": "test",\r\n    "version": "1.1.0"\r\n}\r\n`)
})