import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Simulates an async data load with a configurable delay.
 * First load has a 30% chance of failing to demonstrate the error state.
 * Retry always succeeds.
 */
export function useDataLoader(delay = 900) {
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const isFirstLoad = useRef(true)

  const load = useCallback(() => {
    setStatus('loading')
    const shouldFail = isFirstLoad.current && Math.random() < 0.3
    isFirstLoad.current = false

    const timer = setTimeout(() => {
      setStatus(shouldFail ? 'error' : 'ready')
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    return load()
  }, [load])

  return {
    isLoading: status === 'loading',
    isError:   status === 'error',
    retry:     load,
  }
}
