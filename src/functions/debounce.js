// Simple debounce utility with cancel support
// Usage: const debouncedFn = debounce(fn, 100)
// debouncedFn.cancel() to clear pending invocation
export default function debounce(fn, wait = 0) {
  let timeoutId = null
  function debounced(...args) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      timeoutId = null
      fn.apply(this, args) // eslint-disable-line prefer-rest-params
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
