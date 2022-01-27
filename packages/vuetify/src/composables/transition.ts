import { propsFactory } from '@/util'

// Types
import type { PropType } from '@uni-component/core'
import { onMounted, onUnmounted, useRef } from '@uni-component/core'

import type { Ref } from '@uni-store/core'
import { computed, nextTick, ref, watch } from '@uni-store/core'

export function nextFrame (cb: FrameRequestCallback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb)
  })
}

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

const eventTransitionEnd = 'transitionend'

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

  const transitionName = ref(name)

  const transtionClass = computed(() => {
    const name = transitionName.value
    if (!name || transitionEnd.value || !useCSS.value) {
      return {
        activeClass: '',
        targetClass: '',
      }
    }
    const modeName = refValue.value ? 'enter' : 'leave'

    const activeClass = `${name}-${modeName}-active`
    const fromClass = `${name}-${modeName}-from`
    const toClass = `${name}-${modeName}-to`
    return {
      activeClass,
      targetClass: framed.value === refValue.value ? fromClass : toClass,
    }
  })
  const style = computed(() => {
    return transitionName.value ? {
      display: refValue.value ? '' : transitionEnd.value ? 'none' : '',
    } : {
      display: '',
    }
  })

  const onStateChange = () => {
    const el = ele.value
    if (!el) {
      return
    }
    el.style.display = style.value.display
  }

  let enterClasses: string[] = []
  let leaveClasses: string[] = []
  const innerHooks: TransitionHooks = {
    enter (el) {
      onStateChange()
      if (!transtionClass.value.activeClass) {
        return
      }
      enterClasses = [transtionClass.value.activeClass, transtionClass.value.targetClass]
      el.classList.add(...enterClasses)
      nextFrame(() => {
        el.classList.remove(enterClasses[1])
        enterClasses[1] = transtionClass.value.targetClass
        el.classList.add(enterClasses[1])
      })
    },
    afterEnter (el) {
      onStateChange()
      if (!enterClasses.length) return
      el.classList.remove(...enterClasses)
      enterClasses = []
    },
    enterCancelled (el) {
      innerHooks.afterEnter!(el)
    },
    leave (el) {
      onStateChange()
      if (!transtionClass.value.activeClass) {
        return
      }
      leaveClasses = [transtionClass.value.activeClass, transtionClass.value.targetClass]
      el.classList.add(...leaveClasses)
      nextFrame(() => {
        el.classList.remove(leaveClasses[1])
        leaveClasses[1] = transtionClass.value.targetClass
        el.classList.add(leaveClasses[1])
      })
    },
    afterLeave (el) {
      onStateChange()
      if (!leaveClasses.length) return
      el.classList.remove(...leaveClasses)
      leaveClasses = []
    },
    leaveCancelled (el) {
      innerHooks.afterLeave!(el)
    },
  }

  const callHook = (hook: keyof TransitionHooks, cb?: () => void) => {
    if (ele.value) {
      innerHooks[hook]?.(ele.value, cb!)
      ;(hooks?.[hook])?.(ele.value, cb!)
    }
  }

  const onTransitionEnd = (e?: Event) => {
    // todo check appear transition end in first frame
    if ((e && ele.value && e.target !== ele.value) || framed.value === refValue.value) {
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

  const setCSS = (enableCSS = true) => {
    useCSS.value = enableCSS
  }
  const setName = (newName: string | boolean) => {
    transitionName.value = newName
  }

  const stopValWatcher = watch(refValue, trigger, {
    // flush: 'sync',
  })
  const stopEleWatcher = watch(ele, (newEle, oldEle) => {
    // class
    // style
    // transitionend
    if (oldEle) {
      oldEle.removeEventListener(eventTransitionEnd, onTransitionEnd)
    }
    if (newEle) {
      newEle.addEventListener(eventTransitionEnd, onTransitionEnd)
      onStateChange()
    }
  })

  onMounted(() => {
    isMounted = true
    if (refValue.value && appear) {
      framed.value = false
      trigger()
    } else {
      onStateChange()
    }
  })
  onUnmounted(() => {
    ele.value?.removeEventListener(eventTransitionEnd, onTransitionEnd)
    stopValWatcher()
    stopEleWatcher()
  })

  return {
    setEleRef,
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
