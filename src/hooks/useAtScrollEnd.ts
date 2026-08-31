import { useEffect, useState, type RefObject } from 'react'

export const useAtScrollEnd = (ref: RefObject<HTMLElement | null>) => {
  const [atEnd, setAtEnd] = useState(true)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () => {
      const scrollable = element.scrollHeight - element.clientHeight
      setAtEnd(scrollable <= 1 || element.scrollTop >= scrollable - 1)
    }

    update()
    element.addEventListener('scroll', update, { passive: true })

    const observer = new ResizeObserver(update)
    observer.observe(element)
    if (element.firstElementChild) observer.observe(element.firstElementChild)

    return () => {
      element.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [ref])

  return atEnd
}
