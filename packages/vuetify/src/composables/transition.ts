import { propsFactory } from '@/util'

// Types
import type { PropType } from '@uni-component/core'
import { classNames, onMounted, useRef } from '@uni-component/core'

import type { Ref } from '@uni-store/core'
import { computed, nextTick, ref, watch } from '@uni-store/core'

export function nextFrame (cb: FrameRequestCallback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb)
  })
}

// todo el
type TransitionHook = (el: HTMLElement) => void
type TransitionHookWithDone = (el: HTMLElement, done: () => void) => void
export interface TransitionHooks {
  // appear?: TransitionHook
  // afterAppear?: TransitionHook
  // appearCancelled?: TransitionHook

  beforeEnter?: TransitionHook
  enter?: TransitionHookWithDone
  afterEnter?: TransitionHook
  enterCancelled?: TransitionHook

  beforeLeave?: TransitionHook
  leave?: TransitionHookWithDone
  afterLeave?: TransitionHook
  leaveCancelled?: TransitionHook
}

export const useTransition = (
  refValue: Ref,
  name: string | boolean,
  appear = false,
  hooks?: TransitionHooks
) => {
  // enter-from
  // enter-to
  // leave-from
  // leave-to
  // enter-active
  // leave-active
  let isMounted = false
  const useCSS = ref(true)
  const ele = ref<HTMLElement>()
  const setEleRef = useRef(ele)
  const transitionEnd = ref(true)
  const framed = ref(refValue.value)
  const callHook = (hook: keyof TransitionHooks, cb?: () => void) => {
    ele.value && hooks && hooks[hook] && hooks[hook]!(ele.value, cb!)
  }

  const onTransitionEnd = (e?: Event) => {
    if (e && ele.value && e.target !== ele.value) {
      return
    }
    transitionEnd.value = true
    callHook(refValue.value ? 'afterEnter' : 'afterLeave')
  }

  const trigger = (val: boolean = refValue.value) => {
    if (!isMounted) {
      return
    }
    const isEnter = val
    if (!transitionEnd.value) {
      // callHook(isEnter ? 'enterCancelled' : 'leaveCancelled')
      // todo fix should use last state
      callHook('leaveCancelled')
      callHook('enterCancelled')
    }
    callHook(isEnter ? 'beforeEnter' : 'beforeLeave')
    framed.value = val
    transitionEnd.value = false
    nextTick(() => {
      callHook(isEnter ? 'enter' : 'leave', onTransitionEnd)
    })
    nextFrame(() => {
      framed.value = !framed.value
    })
  }

  const transitionName = ref(name)
  name && watch(() => refValue.value, trigger, {
    flush: 'sync',
  })
  const transtionClass = computed(() => {
    const name = transitionName.value
    if (!name || transitionEnd.value || !useCSS.value) return ''
    if (refValue.value) {
      const activeClass = `${name}-enter-active`
      const fromClass = `${name}-enter-from`
      const toClass = `${name}-enter-to`
      return classNames([activeClass, framed.value === refValue.value ? fromClass : toClass])
    } else {
      const activeClass = `${name}-leave-active`
      const fromClass = `${name}-leave-from`
      const toClass = `${name}-leave-to`
      return classNames([activeClass, framed.value === refValue.value ? fromClass : toClass])
    }
  })
  const style = computed(() => {
    return transitionName.value ? {
      display: refValue.value ? '' : transitionEnd.value ? 'none' : '',
    } : {}
  })
  const setCSS = (enableCSS = true) => {
    useCSS.value = enableCSS
  }
  const setName = (newName: string | boolean) => {
    transitionName.value = newName
  }

  onMounted(() => {
    isMounted = true
    if (refValue.value && appear) {
      framed.value = false
      trigger()
    }
  })

  return {
    transtionClass,
    style,
    setEleRef,
    onTransitionEnd,
    setCSS,
    setName,
  }
}

export type Transition = ReturnType<typeof useTransition>

export const makeTransitionProps = propsFactory({
  // only support bool and string, no other options
  transition: {
    type: [Boolean, String, Object] as PropType<string | false | { component: Function }>,
    default: 'fade-transition',
  },
}, 'transition')
