import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@data/tweetList': path.resolve(
        import.meta.dirname,
        mode === 'e2e' ? 'e2e/fixtures/tweetList.json' : 'src/data/tweetList.json',
      ),
    },
  },
}))
