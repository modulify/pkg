import type { Workspace } from '../types/worktree'

export async function walk (
  worktree: Workspace[],
  visit: (node: Workspace) => Promise<void>
) {
  for (let i = 0; i < worktree.length; i++) {
    const node = worktree[i]

    await visit(node)
    await walk(node.children, visit)
  }
}
