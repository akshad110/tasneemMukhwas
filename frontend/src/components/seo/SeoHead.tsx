import { useEffect } from 'react'
import { applySeo } from '../../lib/seo'

/** Keeps title, description, canonical, and Open Graph tags in sync with the current route. */
export default function SeoHead({ path }: { path: string }) {
  useEffect(() => {
    applySeo(path)
  }, [path])
  return null
}
