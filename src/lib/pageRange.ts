export type PageSlot = number | 'ellipsis'

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index)

const expandLoneGaps = (slots: PageSlot[]): PageSlot[] =>
  slots.map((slot, index) => {
    if (slot !== 'ellipsis') return slot

    const before = slots[index - 1]
    const after = slots[index + 1]

    if (typeof before !== 'number' || typeof after !== 'number') return slot

    return after - before === 2 ? before + 1 : slot
  })

export const pageRange = (
  current: number,
  total: number,
  siblings = 1,
): PageSlot[] => {
  const slots = siblings * 2 + 5

  if (total <= slots) return range(1, total)

  const firstSibling = Math.max(current - siblings, 1)
  const lastSibling = Math.min(current + siblings, total)

  const gapBefore = firstSibling > 2
  const gapAfter = lastSibling < total - 1

  if (!gapBefore) return [...range(1, slots - 2), 'ellipsis', total]

  if (!gapAfter) return [1, 'ellipsis', ...range(total - (slots - 3), total)]

  return expandLoneGaps([
    1,
    'ellipsis',
    ...range(firstSibling, lastSibling),
    'ellipsis',
    total,
  ])
}
