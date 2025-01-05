# <img src="./logo.png" alt="Logo" height="36" /> @modulify/pkg

[![codecov](https://codecov.io/gh/modulify/pkg/branch/main/graph/badge.svg)](https://codecov.io/gh/modulify/pkg)
[![Tests Status](https://github.com/modulify/pkg/actions/workflows/tests.yml/badge.svg)](https://github.com/modulify/pkg/actions)

**@modulify/pkg** is a utility library for working with Node.js package worktrees. It provides functions to read, update, and traverse multiple package manifests, making it easier to interact with monorepos and workspace-like structures.

## Features

- **Read and parse worktrees**:
    - Load package.json files across a workspace hierarchy.
    - Automatically detect nested workspaces.

- **Update manifests**:
    - Modify and rewrite parts of `package.json`.
    - Automatically detects indentation and newline styles for consistent formatting.

- **Traverse worktrees**:
    - Walk through nested workspaces and perform asynchronous operations on each node.

---

## Install

```bash
# Using yarn
yarn add @modulify/pkg

# Using npm
npm install @modulify/pkg
```

---

## Requirements

- **Node.js**: `>=20.0.0`

---

## Usage

### 1. Reading a Worktree

To read the workspace tree starting from a given directory:

```typescript
import { read } from '@modulify/pkg';

const worktree = read('/path/to/root'); // Loads the root and all nested workspaces
console.log(worktree);
```

### 2. Updating a Manifest

Update specific fields of a `package.json` file:

```typescript
import { update } from '@modulify/pkg';

update('/path/to/workspace', { version: '1.0.1' }); // Updates "version" field in package.json
```

Use the `dry` flag to test without making actual changes:

```typescript
update('/path/to/workspace', { scripts: { test: 'vitest' } }, true);
```

### 3. Traversing a Worktree

Perform operations on each workspace in the tree:

```typescript
import { walk } from '@modulify/pkg';

const worktree = read('/path/to/root');

await walk([worktree], async (workspace) => {
  console.log(`Workspace: ${workspace.name}`);
});
```

---

## API

### **read**

Reads the worktree starting from a given directory.

- **Parameters**:
    - `path: string` - Root path of the workspace.
- **Returns**:
    - A `Workspace` object containing name, path, manifest, children, and other metadata.

---

### **update**

Updates fields in a `package.json` file.

- **Parameters**:
    - `path: string` - Path to the workspace.
    - `diff: Partial<Manifest>` - Changes to apply.
    - `dry: boolean` (optional) - If `true`, does not modify the file.
- **Returns**:
    - The path to the updated file.

---

### **walk**

Visits each node in a worktree and performs the provided asynchronous operation.

- **Parameters**:
    - `worktree: Workspace[]` - Array of workspaces to traverse.
    - `visit: (node: Workspace) => Promise<void>` - Async operation to perform on each node.

