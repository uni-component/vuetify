import type { Ref } from '@uni-component/core'
import { computed } from '@uni-component/core'
import type { TransitionHooks } from '../transition'
import { useTransition } from '../transition'

export function createCssTransition (
  name: string,
  origin = 'top center 0',
  // todo mode
  mode?: string
) {
  return (
    props: {
      model: Ref
      origin?: string
      leaveAbsolute?: boolean
      hideOnLeave?: boolean
      appear?: boolean
    },
    hooks?: TransitionHooks
  ) => {
    const _origin = computed(() => props.origin || origin)
    return useTransition(props.model!, name, props.appear, mergeHooks({
      beforeEnter (el: HTMLElement) {
        el.style.transformOrigin = _origin.value
      },
      leave (el: HTMLElement) {
        if (props.leaveAbsolute) {
          const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = el
          el._transitionInitialStyles = {
            position: el.style.position,
            top: el.style.top,
            left: el.style.left,
            width: el.style.width,
            height: el.style.height,
          }
          el.style.position = 'absolute'
          el.style.top = `${offsetTop}px`
          el.style.left = `${offsetLeft}px`
          el.style.width = `${offsetWidth}px`
          el.style.height = `${offsetHeight}px`
        }

        if (props.hideOnLeave) {
          el.style.setProperty('display', 'none', 'important')
        }
      },
      afterLeave (el: HTMLElement) {
        if (props.leaveAbsolute && el?._transitionInitialStyles) {
          const { position, top, left, width, height } = el._transitionInitialStyles
          delete el._transitionInitialStyles
          el.style.position = position || ''
          el.style.top = top || ''
          el.style.left = left || ''
          el.style.width = width || ''
          el.style.height = height || ''
        }
      },
    }, hooks))
  }
}

export function createJavascriptTransition (
  name: string,
  hooks: TransitionHooks,
  // todo mode
  mode = 'in-out'
) {
  return (
    props: {
      model: Ref
      appear?: boolean
    },
    newHooks?: TransitionHooks
  ) => {
    return useTransition(props.model!, name, props.appear, mergeHooks(hooks, newHooks))
  }
}

function mergeHooks (hooks: TransitionHooks, newHooks?: TransitionHooks) {
  const ret: TransitionHooks = {
    ...hooks,
  }
  newHooks && Object.keys(newHooks).forEach(key => {
    const hook = key as keyof TransitionHooks
    const originHook = ret[hook]
    if (originHook) {
      ret[hook] = (el: HTMLElement, done?: () => void) => {
        originHook(el, done!)
        newHooks[hook]!(el, done!)
      }
    }
  })
  return ret
}
