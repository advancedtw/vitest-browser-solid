import { defineConfig } from 'tsup'
import {solidPlugin} from 'esbuild-plugin-solid' // Import the esbuild plugin

export default defineConfig({
  // Define entry points, including the .tsx file
  entry: ['./src/index.ts', './src/pure.tsx'],
  // Output format
  format: ['esm'],
  // Generate TypeScript definition files
  dts: true,
  // Specify the target environment
  target: 'esnext', // Or a specific modern browser target if preferred
  // Specify the platform
  platform: 'browser', // Suitable for browser-oriented code
  // Clean the dist directory before building
  clean: true,
  // Generate sourcemaps
  sourcemap: true,
  // Add the Solid plugin for esbuild
  esbuildPlugins: [
    solidPlugin()
  ],
})