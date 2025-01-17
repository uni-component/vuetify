// Utilities
import { convertToUnit, getScrollParents, hasScrollbar, IN_BROWSER, propsFactory } from '@/util'
import { effectScope, nextTick, onScopeDispose, watchEffect } from '@uni-component/core'
import { requestNewFrame } from './requestNewFrame'

// Types
import type { EffectScope, PropType, Ref } from '@uni-component/core'

export interface ScrollStrategyData {
  root: Ref<HTMLElement | undefined>
  contentEl: Ref<HTMLElement | undefined>
  activatorEl: Ref<HTMLElement | undefined>
  isActive: Ref<boolean>
  updatePosition: Ref<((e: Event) => void) | undefined>
}

const scrollStrategies = {
  close: closeScrollStrategy,
  block: blockScrollStrategy,
  reposition: repositionScrollStrategy,
}

interface StrategyProps {
  scrollStrategy: keyof typeof scrollStrategies | ((data: ScrollStrategyData) => void)
}

export const makeScrollStrategyProps = propsFactory({
  scrollStrategy: {
    type: [String, Function] as PropType<StrategyProps['scrollStrategy']>,
    default: 'block',
    validator: (val: any) => typeof val === 'function' || val in scrollStrategies,
  },
})

export function useScrollStrategies (
  props: StrategyProps,
  data: ScrollStrategyData
) {
  if (!IN_BROWSER) return

  let scope: EffectScope | undefined
  watchEffect(async () => {
    scope?.stop()

    if (!(data.isActive.value && props.scrollStrategy)) return

    scope = effectScope()
    await nextTick()
    scope.run(() => {
      if (typeof props.scrollStrategy === 'function') {
        props.scrollStrategy(data)
      } else {
        scrollStrategies[props.scrollStrategy]?.(data)
      }
    })
  })
}

function closeScrollStrategy (data: ScrollStrategyData) {
  function onScroll (e: Event) {
    data.isActive.value = false
  }

  bindScroll(data.activatorEl.value ?? data.contentEl.value, onScroll)
}

function blockScrollStrategy (data: ScrollStrategyData) {
  const scrollElements = [...new Set([
    ...getScrollParents(data.activatorEl.value),
    ...getScrollParents(data.contentEl.value),
  ])].filter(el => !el.classList.contains('v-overlay-scroll-blocked'))
  const scrollbarWidth = window.innerWidth - document.documentElement.offsetWidth

  const scrollableParent = (el => hasScrollbar(el) && el)(data.root.value?.offsetParent || document.documentElement)
  if (scrollableParent) {
    data.root.value!.classList.add('v-overlay--scroll-blocked')
  }

  scrollElements.forEach((el, i) => {
    el.style.setProperty('--v-scrollbar-offset', convertToUnit(scrollbarWidth))
    el.classList.add('v-overlay-scroll-blocked')
  })

  onScopeDispose(() => {
    scrollElements.forEach((el, i) => {
      el.style.removeProperty('--v-scrollbar-offset')
      el.classList.remove('v-overlay-scroll-blocked')
    })
    if (scrollableParent) {
      data.root.value!.classList.remove('v-overlay--scroll-blocked')
    }
  })
}

function repositionScrollStrategy (data: ScrollStrategyData) {
  let slow = false
  let raf = -1

  function update (e: Event) {
    requestNewFrame(() => {
      const start = performance.now()
      data.updatePosition.value?.(e)
      const time = performance.now() - start
      slow = time / (1000 / 60) > 2
    })
  }

  bindScroll(data.activatorEl.value ?? data.contentEl.value, e => {
    if (slow) {
      // If the position calculation is slow,
      // defer updates until scrolling is finished.
      // Browsers usually fire one scroll event per frame so
      // we just wait until we've got two frames without an event
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => {
          update(e)
        })
      })
    } else {
      update(e)
    }
  })
}

/** @private */
function bindScroll (el: HTMLElement | undefined, onScroll: (e: Event) => void) {
  const scrollElements = [document, ...getScrollParents(el)]
  scrollElements.forEach(el => {
    el.addEventListener('scroll', onScroll, { passive: true })
  })

  onScopeDispose(() => {
    scrollElements.forEach(el => {
      el.removeEventListener('scroll', onScroll)
    })
  })
}
