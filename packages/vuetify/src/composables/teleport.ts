// Utilities
import { computed } from '@uni-component/core'
import { IN_BROWSER } from '@/util'

// Types
import type { Ref } from '@uni-component/core'

export function useTeleport (target: Ref<boolean | string | Element>) {
  const teleportTarget = computed(() => {
    const _target = target.value

    if (_target === true || !IN_BROWSER) return undefined

    const targetElement =
      _target === false ? document.body
      : typeof _target === 'string' ? document.querySelector(_target)
      : _target

    if (targetElement == null) {
      console.warn(`[useTeleport] Unable to locate target ${_target}`)
      return undefined
    }

    if (!useTeleport.cache.has(targetElement)) {
      const el = document.createElement('div')
      el.className = 'v-overlay-container'
      targetElement.appendChild(el)
      useTeleport.cache.set(targetElement, el)
    }

    return useTeleport.cache.get(targetElement)
  })

  return { teleportTarget }
}
useTeleport.cache = new WeakMap<Element, Element>()
