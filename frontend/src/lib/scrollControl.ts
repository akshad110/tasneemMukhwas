/** Shared Lenis instance for app-wide smooth scrolling (registered by SmoothScroll). */
type ScrollController = {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { offset?: number; immediate?: boolean; duration?: number; lock?: boolean; force?: boolean },
  ) => void
  start: () => void
  stop: () => void
  resize: () => void
  isStopped: boolean
}

let controller: ScrollController | null = null

export function setScrollController(next: ScrollController | null) {
  controller = next
}

export function refreshScrollLayout() {
  controller?.resize()
}

/** Scroll to top — uses Lenis when active, native scroll as fallback. */
export function scrollAppToTop(immediate = true) {
  if (controller) {
    controller.scrollTo(0, { immediate })
    return
  }
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

/** Smooth scroll to top (e.g. floating action button). */
export function scrollAppToTopSmooth(duration = 0.75) {
  if (controller) {
    controller.scrollTo(0, { duration })
    return
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function scrollAppTo(
  target: number | string | HTMLElement,
  options?: { offset?: number; immediate?: boolean; duration?: number },
) {
  if (controller) {
    controller.scrollTo(target, options)
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' })
    return
  }
  if (target instanceof HTMLElement) {
    const top = target.getBoundingClientRect().top + window.scrollY + (options?.offset ?? 0)
    window.scrollTo({ top, behavior: options?.immediate ? 'auto' : 'smooth' })
  }
}

export function getScrollY(): number {
  return window.scrollY || document.documentElement.scrollTop || 0
}
