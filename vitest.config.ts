/// <reference types="@vitest/browser/providers/playwright" />

import { defineConfig } from 'vitest/config'
import solidPlugin from 'vite-plugin-solid' // Import the Solid plugin

export default defineConfig({
  plugins: [
    // Add the Solid plugin
    solidPlugin()
  ],
  test: {
    globals: true,
    browser: {
      provider: "playwright",
      enabled: true,
      instances: [{ browser: "chromium" }],
    },
  },
})
