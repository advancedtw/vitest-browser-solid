import { expect, test } from 'vitest';
import { createSignal, createContext, useContext, createMemo } from 'solid-js';
import type { Component, ParentProps } from 'solid-js';
import { createRoot } from 'solid-js'; 

import { render } from '../src/index';
import { useCounter } from './fixtures/useCounter'; // Solid version

// Test 1: Simple state update (Direct Call)
test('should increment counter', () => {
  createRoot(dispose => {
    const { count, increment } = useCounter();

    expect(count()).toBe(0);

    increment();

    expect(count()).toBe(1);

    dispose();
  });
});

test('logic should react to prop changes (using signals)', async () => {
  function useBranchLogic(branchSignal: () => 'left' | 'right') {
    const [leftState, setLeftState] = createSignal('left value');
    const [rightState, setRightState] = createSignal('right value');

    const getCurrentBranchData = () => {
      if (branchSignal() === 'left') {
        return [leftState, setLeftState] as const;
      }
      else {
        return [rightState, setRightState] as const;
      }
    };
    return { getCurrentBranchData };
  }

  const [branch, setBranch] = createSignal<'left' | 'right'>('left');

  const BranchComponent: Component = () => {
    const { getCurrentBranchData } = useBranchLogic(branch);

    const valueSignalGetter = createMemo(() => getCurrentBranchData()[0]);

    return (
      <div>
        <p>Branch: {branch()}</p>
        <p>Value: {valueSignalGetter()()}</p>
      </div>
    );
  };

  const screen = render(() => <BranchComponent />);

  expect(screen.getByText('Branch: left')).toBeVisible();
  expect(screen.getByText('Value: left value')).toBeVisible(); // Uses leftState initially

  setBranch('right');

  expect(screen.getByText('Branch: right')).toBeVisible();
  expect(screen.getByText('Value: right value')).toBeVisible(); // Should now pass!
});



test('allows context providers via component structure', async () => {
  const MyContext = createContext('default');

  const ContextReader: Component = () => {
    const contextValue = useContext(MyContext);
    return <div>Context Value: {contextValue}</div>;
  };

  const Wrapper: Component<ParentProps> = (props) => {
    return (
      <MyContext.Provider value="provided">
        {props.children}
      </MyContext.Provider>
    );
  };

  const screen = render(() => (
    <Wrapper>
      <ContextReader />
    </Wrapper>
  ));

  expect(screen.getByText('Context Value: provided')).toBeVisible();

});

