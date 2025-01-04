import { describe, it, expect } from 'vitest'

import { join } from 'node:path'
import { read } from '@/read'

describe('read.ts', () => {
  it('reads worktree where workspaces defined by exact names', () => {
    const path = join(__dirname, 'fixtures', 'worktree-exact')

    const worktree = read(path)

    expect(worktree).toEqual(expect.objectContaining({
      name: 'worktree-exact',
      path,
      manifest: {
        name: 'worktree-exact',
        workspaces: ['workspace-a', 'workspace-b'],
      },
      level: 0,
      parent: null,
      children: [
        expect.objectContaining({ name: 'workspace-a', level: 1, parent: worktree }),
        expect.objectContaining({ name: 'workspace-b', level: 1, parent: worktree }),
      ],
    }))
  })

  it('reads worktree where workspaces defined by wildcard', () => {
    const path = join(__dirname, 'fixtures', 'worktree-wildcard')

    const worktree = read(path)

    expect(worktree).toEqual(expect.objectContaining({
      name: 'worktree-wildcard',
      path,
      manifest: {
        name: 'worktree-wildcard',
        workspaces: ['packages/*'],
      },
      level: 0,
      parent: null,
      children: [
        expect.objectContaining({ name: 'lib-a', level: 1, parent: worktree }),
        expect.objectContaining({ name: 'lib-b', level: 1, parent: worktree }),
      ],
    }))
  })

  it('reads worktree with deep nesting', () => {
    const path = join(__dirname, 'fixtures', 'worktree-deep')

    const worktree = read(path)

    expect(worktree).toMatchObject({
      children: expect.any(Array),
    })

    const nested = worktree.children[0]

    expect(worktree).toEqual({
      name: 'worktree-deep',
      path,
      manifest: {
        name: 'worktree-deep',
        workspaces: ['nested'],
      },
      level: 0,
      parent: null,
      children: [{
        name: 'nested',
        path: join(path, 'nested'),
        manifest: {
          name: 'nested',
          workspaces: ['packages/*'],
        },
        level: 1,
        parent: worktree,
        children: [
          expect.objectContaining({ name: 'deep-1', level: 2, parent: nested }),
          expect.objectContaining({ name: 'deep-2', level: 2, parent: nested }),
        ],
      }],
    })
  })
})
