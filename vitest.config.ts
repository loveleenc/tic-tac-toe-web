import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    'process.env': {}
  },
  test: {
    exclude: ['./playwright/**', 
      './build/**',
    './node_modules/**'],
    globals: true,
  },
})

//"test": "NODE_ENV=test node --test",