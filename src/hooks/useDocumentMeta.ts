import { useEffect } from 'react'

const SITE_NAME = 'Rick & Morty Characters'

type DocumentMeta = {
  title?: string
  description: string
  image?: string
}

const setMeta = (
  attribute: 'name' | 'property',
  key: string,
  content?: string,
) => {
  const selector = `meta[${attribute}="${key}"]`
  const existing = document.head.querySelector<HTMLMetaElement>(selector)

  if (!content) {
    existing?.remove()
    return
  }

  if (existing) {
    existing.content = content
    return
  }

  const tag = document.createElement('meta')
  tag.setAttribute(attribute, key)
  tag.content = content
  document.head.append(tag)
}

export const useDocumentMeta = ({
  title,
  description,
  image,
}: DocumentMeta) => {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME

    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', window.location.href)
    setMeta('property', 'og:image', image)
  }, [title, description, image])
}
