# vitest-browser-solid

[![npm version](https://img.shields.io/npm/v/vitest-browser-solid.svg?style=flat-square)](https://npmjs.com/package/vitest-browser-solid)
[![license](https://img.shields.io/npm/l/vitest-browser-solid.svg?style=flat-square)](https://opensource.org/licenses/MIT)
<!-- Add other badges like build status, coverage etc. if applicable -->

Render SolidJS components in Vitest Browser Mode. This library follows `testing-library` principles and exposes only [locators](https://vitest.dev/guide/browser/locators) and utilities that encourage you to write tests that closely resemble how your SolidJS components are used.

`vitest-browser-solid` aims to deliver a good developer experience in Vitest Browser Mode by incorporating the [locators API](https://vitest.dev/guide/browser/locators.html) and [retry-ability](https://vitest.dev/guide/browser/assertion-api.html) mechanism directly into the `render` result. This allows you to call user methods without needing to verify the element's existence or wait for external events (like API calls) to render the element.

Requires `vitest` >= 4.0.0, `@vitest/browser` >= 4.0.0, and `solid-js` >= 1.8.0.

Tested and developed using `vitest` 4.0.2, `@vitest/browser` 4.0.2, and `solid-js` 1.9.10.

## Installation

```bash
pnpm add -D vitest-browser-solid
```

## Usage

Check [render.test.tsx](./test/render.test.tsx) for up to date example.

This library test uses *itself* to render components in Vitest Browser Mode.

## Setup

```ts
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
```

## Basic test
```tsx
import { render } from 'vitest-browser-solid'
import { expect, test } from 'vitest'
import { Counter } from './Counter' // Your SolidJS component

test('counter button increments the count', async () => {
  // Pass a function that returns JSX - this ensures computations
  // are created inside the render root, preventing memory leaks
  const screen = render(() => <Counter initialCount={1} />)

  // Interact using Vitest locators (async)
  await screen.getByRole('button', { name: 'Increment' }).click()

  // Assert using Vitest async assertions (waits automatically)
  await expect.element(screen.getByText('Count is 2')).toBeVisible()
})
```

> **Important:** Always wrap your JSX in an arrow function `() => <Component />`. This ensures that Solid's reactive computations (signals, effects) are created inside the proper tracking scope, preventing memory leaks and "computations created outside a root" warnings.

### Testing Updates
SolidJS updates are driven by fine-grained reactivity. To test component updates:

- **Pass Signals as Props**: Design components to accept signals for props that change.
- **Modify Signals in Test**: Update the signal's value directly in your test code.
- **Assert on Result**: Use `await expect.element(...)` to verify the DOM updates reactively.

### Testing Composables / Primitives
Solid's composable functions or custom primitives (create...) can typically be tested:

- **Directly**: By calling them within `createRoot` from `solid-js` if they don't rely on component context.
- **Via a Small Test Component**: Render a minimal component using the composable with `render` and test its output/behavior.



Inspired by 

[vitest-browser-react](https://github.com/vitest-dev/vitest-browser-react) / 
[vitest-browser-vue](https://github.com/vitest-dev/vitest-browser-vue) / 
[vitest-browser-svelte](https://github.com/vitest-dev/vitest-browser-svelte)




