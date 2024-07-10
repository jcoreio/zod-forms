import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: { main: './demo/index.tsx' },
  },
  server: {
    port: 3501,
  },
})
