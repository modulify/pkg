import { describe, it, expect } from 'vitest'

import { join } from 'node:path'
import { read } from '@/read'

describe('read.ts', () => {
  it('reads root workspace', () => {
    const path = join(__dirname, 'fixtures', 'project1')

    expect(read(path)).toEqual(expect.objectContaining({
      name: 'project1',
      path,
      manifest: {
        name: 'project1',
        workspaces: ['workspace-a', 'workspace-b'],
      },
      children: [
        expect.objectContaining({ name: 'workspace-a' }),
        expect.objectContaining({ name: 'workspace-b' }),
      ],
    }))
  })
})
