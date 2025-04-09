import type { Locator, LocatorSelectors } from '@vitest/browser/context'
import { debug as browserDebug, getElementLocatorSelectors } from '@vitest/browser/utils'
import type { PrettyDOMOptions } from '@vitest/browser/utils'
import type { JSX } from 'solid-js'
import { render as solidRender } from 'solid-js/web'

// --- Type Definitions ---

/** Options for container/baseElement */
export interface SolidRenderOptions {
  container?: HTMLElement;
  baseElement?: HTMLElement;
}

/** Result object */
export interface RenderResult extends LocatorSelectors {
  container: HTMLElement;
  baseElement: HTMLElement;
  debug: (
    el?: HTMLElement | HTMLElement[] | Locator | Locator[],
    maxLength?: number,
    options?: PrettyDOMOptions
  ) => void;
  unmount: () => void;
  asFragment: () => DocumentFragment;
}


const mountedContainers = new Map<HTMLElement, () => void>();


/**
 * Renders Solid JSX provided by a factory function into a container.
 *
 * @param uiFactory A function that returns the JSX element(s) to render.
 * @param options Configuration for container and baseElement.
 * @returns RenderResult containing the container, utilities, and locators.
 */
export function render(
  uiFactory: () => JSX.Element, // Changed signature: Accepts the factory function directly
  options: SolidRenderOptions = {},
): RenderResult {
  const {
    container: customContainer,
    baseElement: customBaseElement,
  } = options;

  const baseElement = customBaseElement || customContainer?.parentElement || document.body;
  const container = customContainer || baseElement.appendChild(document.createElement('div'));

  // Dispose previous instance in the same container if any
  if (mountedContainers.has(container)) {
    const previousDispose = mountedContainers.get(container);
    if (previousDispose) {
      previousDispose();
    }
    mountedContainers.delete(container);
  }

  // Directly call solidRender with the user's factory function
  const dispose = solidRender(uiFactory, container);
  mountedContainers.set(container, dispose);

  const unmount = () => {
    if (mountedContainers.has(container)) {
      const currentDispose = mountedContainers.get(container);
      if (currentDispose) {
        currentDispose();
      }
      mountedContainers.delete(container);
    }
    // Only remove container if it wasn't provided and is child of body
    if (!customContainer && container.parentNode === document.body) {
      container.remove();
    }
  };


  return {
    container,
    baseElement,
    debug: (el = baseElement, maxLength, debugOptions) => browserDebug(el, maxLength, debugOptions),
    unmount,
    asFragment: (): DocumentFragment => {
      return document.createRange().createContextualFragment(container.innerHTML);
    },
    ...getElementLocatorSelectors(baseElement),
  };
}

export function cleanup(): void {
  mountedContainers.forEach((dispose, container) => {
    dispose();
  // Check parent before removing - container might have been removed by parent/unmount
    if (container.parentNode === document.body) {
      document.body.removeChild(container);
    }
  });
  mountedContainers.clear();
}