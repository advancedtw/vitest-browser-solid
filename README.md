# vitest-browser-solid

[![npm version](https://img.shields.io/npm/v/vitest-browser-solid.svg?style=flat-square)](https://npmjs.com/package/vitest-browser-solid)
[![license](https://img.shields.io/npm/l/vitest-browser-solid.svg?style=flat-square)](https://opensource.org/licenses/MIT)
<!-- Add other badges like build status, coverage etc. if applicable -->

Render SolidJS components in Vitest Browser Mode. This library follows `testing-library` principles and exposes only [locators](https://vitest.dev/guide/browser/locators) and utilities that encourage you to write tests that closely resemble how your SolidJS components are used.

`vitest-browser-solid` aims to deliver a good developer experience in Vitest Browser Mode by incorporating the [locators API](https://vitest.dev/guide/browser/locators.html) and [retry-ability](https://vitest.dev/guide/browser/assertion-api.html) mechanism directly into the `render` result. This allows you to call user methods without needing to verify the element's existence or wait for external events (like API calls) to render the element.

Requires `vitest` >= 2.1.0, `@vitest/browser` >= 2.1.0, and `solid-js` >= 1.8.0.

```tsx
import { render } from 'vitest-browser-solid'
import { expect, test } from 'vitest'
import { Counter } from './Counter' // Your SolidJS component

test('counter button increments the count', async () => {
  // JSX containing your component and props
  const screen = render( <Counter initialCount={1} />)

  // Interact using Vitest locators (async)
  await screen.getByRole('button', { name: 'Increment' }).click()

  // Assert using Vitest async assertions (waits automatically)
  await expect.element(screen.getByText('Count is 2')).toBeVisible()
})

// vitest.config.ts
import { defineConfig } from 'vitest/config'
import solidPlugin from 'vite-plugin-solid' // Use the Solid plugin

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

// src/setupVitestBrowser.ts
// Add an import at the top so TypeScript can pick up types and extensions
import 'vitest-browser-solid'


// myComponent.test.tsx
import { expect, test } from 'vitest'
import { page } from '@vitest/browser/context' // Import page context
import { MyComponent } from './MyComponent'

test('counter button increments the count using page.render', async () => {
  // JSX containing your component and props
  const screen = page.render( <MyComponent initialValue={5} />)

  // ... interactions and assertions ...
  await screen.getByRole('button').click()
  await expect.element(screen.getByText('Value: 6')).toBeVisible()

  // Cleanup is handled automatically via the setup file's import
})


import { expect, test, afterEach } from 'vitest'
// Import from the 'pure' entry point for manual cleanup
import { render, cleanup } from 'vitest-browser-solid/pure'
import { MyComponent } from './MyComponent'

// Manually call cleanup after each test
afterEach(cleanup);

test('manual cleanup example', () => {
  const screen = render( <MyComponent />);
  // ... assertions ...
  // Component remains mounted until afterEach calls cleanup()
});

```

### Testing Updates
SolidJS updates are driven by fine-grained reactivity. To test component updates:

Pass Signals as Props: Design components to accept signals for props that change.

Modify Signals in Test: Update the signal's value directly in your test code.

Assert on Result: Use await expect.element(...) to verify the DOM updates reactively.


### Testing Composables / Primitives
Solid's composable functions or custom primitives (create...) can typically be tested:

Directly: By calling them within createRoot from solid-js if they don't rely on component context.

Via a Small Test Component: Render a minimal component using the composable with render and test its output/behavior.


Special thanks
Inspired by @testing-library/react, @testing-library/solid, and other Testing Library packages.


