type DebouncedFunction<T extends (...args: unknown[]) => unknown> = ((
  ...args: Parameters<T>
) => void) & {
  cancel: () => void
}

// Simple debounce utility with cancel support
// Usage: const debouncedFn = debounce(fn, 100)
// debouncedFn.cancel() to clear pending invocation
export default function debounce<T extends(...args: unknown[]) => unknown> (
  fn: T,
  wait = 0
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  function debounced(this: unknown, ...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      timeoutId = null
      fn.apply(this, args)
    }, wait)
  }
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }
  return debounced
}
