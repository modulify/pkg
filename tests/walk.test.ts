import { describe, it, expect } from 'vitest'

import { walk } from '@/walk'

describe('walk.ts', () => {
  it('visits each node of a worktree', async () => {
    const visited: string[] = []

    await walk([{
      name: 'root',
      path: 'root',
      manifest: {
        name: 'root',
        workspaces: ['child1', 'child2'],
      },
      children: [{
        name: 'child1',
        path: 'root/child1',
        manifest: { name: 'child1' },
        level: 1,
        parent: null,
        children: []
      }, {
        name: 'child2',
        path: 'root/child2',
        manifest: { name: 'child2' },
        level: 1,
        parent: null,
        children: []
      }],
      level: 0,
      parent: null,
    }], async (node) => {
      visited.push(node.name)
    })

    expect(visited).toEqual(['root', 'child1', 'child2'])
  })
})