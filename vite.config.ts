import {
  defineConfig,
  mergeConfig,
} from 'vite'

import dts from 'vite-plugin-dts'

import { join, resolve } from 'node:path'

import {
  name,
  dependencies,
} from './package.json'

import basic from './vite.config.basic'

export default mergeConfig(basic, defineConfig({
  build: {
    lib: {
      name,
      formats: ['es', 'cjs'],
      entry: {
        'index': resolve(__dirname, './src/index.ts'),
        'read': resolve(__dirname, './src/read.ts'),
        'update': resolve(__dirname, './src/update.ts'),
        'walk': resolve(__dirname, './src/walk.ts'),
      },
      fileName: (format, name) => `${name}.${{
        es: 'mjs',
        cjs: 'cjs',
      }[format as 'es' | 'cjs']}`,
    },
    minify: false,
    rollupOptions: {
      external: [
        /node:[a-zA-Z]*/,
        ...Object.keys(dependencies),
      ],
      output: {
        exports: 'named',
        dir: join(__dirname, '/dist'),
        chunkFileNames: '[name].[format].js',
      },
    },
  },

  plugins: [
    dts({
      exclude: [
        'scripts/**/*.*',
        'tests/**/*.*',
      ],
      insertTypesEntry: true,
      staticImport: true,
    }),
  ],
}))