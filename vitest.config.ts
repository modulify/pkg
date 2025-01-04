import {
  defineConfig,
  mergeConfig,
} from 'vitest/config'

import { join } from 'node:path'

import basic from './vite.config.basic'

export default mergeConfig(basic, defineConfig({
  resolve: {
    alias: {
      '@': join(__dirname, './src/'),
      '~tests': join(__dirname, './tests/'),
      '~types': join(__dirname, './types/'),
    },
  },
  test: {
    coverage: {
      provider: 'istanbul',
      include: ['src/**'],
    },
  },
}))
