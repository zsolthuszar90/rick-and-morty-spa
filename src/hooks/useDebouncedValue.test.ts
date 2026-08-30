import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebouncedValue } from '@/hooks/useDebouncedValue'

describe('useDebouncedValue', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('returns the initial value straight away', () => {
    const { result } = renderHook(() => useDebouncedValue('rick', 300))

    expect(result.current).toBe('rick')
  })

  it('holds the previous value until the delay has passed', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'rick' } },
    )

    rerender({ value: 'morty' })
    expect(result.current).toBe('rick')

    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe('morty')
  })
})
