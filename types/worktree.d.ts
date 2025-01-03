import type { Manifest } from './manifest'

export type Workspace = {
  name: string;
  path: string;
  manifest: Manifest;
  level: number;
  parent: Workspace | null;
  children: Workspace[];
}
