import type { Manifest } from '~types/manifest'
import type { Workspace } from '~types/worktree'

import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { sync } from 'glob'

export function read (path: string) {
  const root = readWorkspace(path, null, 0)

  root.manifest.workspaces?.forEach(w => readNested(root, w))

  return root
}

export function readWorkspace (
  path: string,
  parent: Workspace | null,
  level = 1
): Workspace {
  const manifest = readManifest(path)

  return {
    name: manifest.name ?? '%NONE%',
    path,
    manifest,
    level,
    parent,
    children: [],
  }
}

export function readNested (
  parent: Workspace,
  workspace: string,
  level = 1
) {
  const pattern = join(parent.path, workspace)

  sync(pattern).sort().forEach(path => {
    try {
      const node = readWorkspace(path, parent, level)
      if (parent) {
        parent.children.push(node)
      }

      node.manifest.workspaces?.forEach(w => readNested(node, w, level + 1))
    } catch (e) {
      if (!(e instanceof Error && 'code' in e && e.code === 'ENOENT')) {
        throw e
      }
    }
  })
}

export function readManifest (path: string) {
  const content = readFileSync(resolve(path, 'package.json'), 'utf8')
  return JSON.parse(content) as Manifest
}