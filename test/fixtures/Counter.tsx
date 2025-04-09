import { createSignal, JSX } from 'solid-js'

export function Counter({ initialCount = 0 }: { initialCount: number }): JSX.Element {
  const [count, setCount] = createSignal(initialCount)
  return (
    <>
      <div>
        Count is
        {' '}
        {count()}
      </div>
      <button onClick={() => setCount(count() + 1)}>Increment</button>
    </>
  )
}
