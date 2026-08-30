import { describe, expect, it } from 'vitest'

import { pageRange } from '@/lib/pageRange'

describe('pageRange', () => {
  it('lists every page when they all fit', () => {
    expect(pageRange(1, 5)).toEqual([1, 2, 3, 4, 5])
    expect(pageRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('handles a single page', () => {
    expect(pageRange(1, 1)).toEqual([1])
  })

  it('opens with a run of pages when near the start', () => {
    expect(pageRange(1, 42)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 42])
    expect(pageRange(3, 42)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 42])
  })

  it('closes with a run of pages when near the end', () => {
    expect(pageRange(42, 42)).toEqual([1, 'ellipsis', 38, 39, 40, 41, 42])
    expect(pageRange(40, 42)).toEqual([1, 'ellipsis', 38, 39, 40, 41, 42])
  })

  it('brackets the current page in the middle', () => {
    expect(pageRange(20, 42)).toEqual([
      1,
      'ellipsis',
      19,
      20,
      21,
      'ellipsis',
      42,
    ])
  })

  it('keeps a constant width across every position', () => {
    const widths = new Set(
      Array.from({ length: 42 }, (_, index) => pageRange(index + 1, 42).length),
    )

    expect([...widths]).toEqual([7])
  })

  it('always includes the first, last and current page', () => {
    for (const current of [1, 2, 7, 21, 41, 42]) {
      const slots = pageRange(current, 42)

      expect(slots).toContain(1)
      expect(slots).toContain(42)
      expect(slots).toContain(current)
    }
  })

  it('never places an ellipsis where a single page would do', () => {
    for (let current = 1; current <= 42; current++) {
      const slots = pageRange(current, 42)

      slots.forEach((slot, index) => {
        if (slot !== 'ellipsis') return

        const before = slots[index - 1]
        const after = slots[index + 1]
        expect(Number(after) - Number(before)).toBeGreaterThan(2)
      })
    }
  })
})
