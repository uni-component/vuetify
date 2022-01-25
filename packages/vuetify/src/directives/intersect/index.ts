// Utils
import { getUid, SUPPORTS_INTERSECTION } from '@/util'

// Types
import type {
  DirectiveBinding,
  ObjectDirective,
} from '@/composables/directive'

type ObserveHandler = (
  isIntersecting: boolean,
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
) => void

export interface ObserveDirectiveBinding extends Omit<DirectiveBinding, 'modifiers' | 'value'> {
  value: ObserveHandler | { handler: ObserveHandler, options?: IntersectionObserverInit }
  modifiers: {
    once?: boolean
    quiet?: boolean
  }
}

function mounted (el: HTMLElement, binding: ObserveDirectiveBinding) {
  if (!SUPPORTS_INTERSECTION) return

  const modifiers = binding.modifiers || {}
  const value = binding.value
  const { handler, options } = typeof value === 'object'
    ? value
    : { handler: value, options: {} }

  const uid = getUid()

  const observer = new IntersectionObserver((
    entries: IntersectionObserverEntry[] = [],
    observer: IntersectionObserver
  ) => {
    const _observe = el._observe?.[uid]
    if (!_observe) return // Just in case, should never fire

    const isIntersecting = entries.some(entry => entry.isIntersecting)

    // If is not quiet or has already been
    // initted, invoke the user callback
    if (
      (
        !modifiers.quiet ||
        _observe.init
      ) && (
        !modifiers.once ||
        isIntersecting ||
        _observe.init
      )
    ) {
      handler(isIntersecting, entries, observer)
    }

    if (isIntersecting && modifiers.once) unmounted(el, binding)
    else _observe.init = true
  }, options)

  el._observe = Object(el._observe)
  ;(el as any)._observe_uid = uid
  el._observe![uid] = { init: false, observer }

  observer.observe(el)
}

function unmounted (el: HTMLElement, binding: ObserveDirectiveBinding) {
  const uid = (el as any)._observe_uid
  const observe = el._observe?.[uid]
  if (!observe) return

  observe.observer.unobserve(el)
  delete el._observe![uid]
}

export const Intersect: ObjectDirective<HTMLElement> = {
  mounted,
  unmounted,
}

export default Intersect
