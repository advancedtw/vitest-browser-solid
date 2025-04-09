import { Accessor, createSignal } from 'solid-js'

export function useCounter(): {
  count: Accessor<number>
  increment: () => void
} {
  const [count, setCount] = createSignal(0)

  const increment = () => setCount(x => x + 1)

  return { count, increment }
}
