import { playwright } from '@vitest/browser-playwright'

import { defineConfig } from 'vitest/config'
import solidPlugin from 'vite-plugin-solid' // Import the Solid plugin

export default defineConfig({
  plugins: [
    // Add the Solid plugin
    solidPlugin()
  ],
  test: {
    name: 'browser',
    printConsoleTrace: true,
    globals: true,
    browser: {
      provider: playwright(),
      enabled: true,
      instances: [{ browser: "chromium" }],
    },
  },
})
