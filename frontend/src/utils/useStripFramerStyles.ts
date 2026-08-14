/**
 * useStripFramerStyles
 *
 * Strips inline styles the Framer runtime re-applies every render cycle.
 */
import { useEffect } from 'react'

type StyleProperty = keyof CSSStyleDeclaration

export default function useStripFramerStyles(
  selector: string,
  properties: string[],
): void {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(selector)
    if (!el) return
    const strip = () => {
      for (const prop of properties) {
        const neutral = /filter|mask|overflow|will/i.test(prop) ? 'none' : ''
        // @ts-expect-error — dynamic style key set
        el.style[prop as StyleProperty] = neutral
      }
    }
    strip()
    const mo = new MutationObserver(strip)
    mo.observe(el, { attributes: true, attributeFilter: ['style'] })
    return () => mo.disconnect()
  }, [selector, properties.join(',')])
}
