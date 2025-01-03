import type { Manifest } from '../types/manifest'
import type { Workspace } from '../types/worktree'

import type { LoggerInterface } from './Logger'

import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import * as glob from 'glob'

export class Read {
  private readonly _logger: LoggerInterface

  constructor (logger: LoggerInterface) {
    this._logger = logger
  }

  tree (path: string) {
    const root = this.node(path, null, 0)

    root.manifest.workspaces?.forEach(w => this.workspaces(root, w, 1))

    return root
  }

  node (
    path: string,
    parent: Workspace | null,
    level = 1
  ): Workspace {
    const manifest = this.manifest(path)

    return {
      name: manifest.name ?? '%NONE%',
      path,
      manifest,
      level,
      parent,
      children: [],
    }
  }

  workspaces (
    parent: Workspace | null,
    workspace: string,
    level = 1
  ) {
    const pattern = join(parent?.path ?? process.cwd(), workspace)

    glob.sync(pattern).forEach(path => {
      try {
        const node = this.node(path, parent, level)
        if (parent) {
          parent.children.push(node)
        }

        node.manifest.workspaces?.forEach(w => this.workspaces(node, w, level + 1))
      } catch (e) {
        if (e instanceof Error && 'code' in e && e.code === 'ENOENT') {
          this._logger.warn('Void workspace found: %s', [path])
        } else {
          throw e
        }
      }
    })
  }

  manifest (path: string) {
    const content = readFileSync(resolve(path, 'package.json'), 'utf8')
    return JSON.parse(content) as Manifest
  }
}