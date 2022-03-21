import type { ComputedRef, WatchStopHandle } from '@uni-component/core'
import { nextTick, onMounted, onUnmounted, ref, useRef, watch } from '@uni-component/core'

// todo to uni component core

export interface DirectiveBinding<V = any> {
  value: V
  oldValue?: V | null
  arg?: string
  modifiers: DirectiveModifiers
}

export type DirectiveModifiers = Record<string, boolean>

export type DirectiveFn<T, V> = (ele: T, value?: V) => void

export interface ObjectDirective<T = HTMLElement, V = any> {
  mounted?: DirectiveFn<T, V>
  updated?: DirectiveFn<T, V>
  unmounted?: DirectiveFn<T, V>
}

export const useDirective = <
  T extends HTMLElement,
  R extends ComputedRef<DirectiveBinding>
>(dir: ObjectDirective<T, DirectiveBinding>, val: R) => {
  const ele = ref<T>()
  const setEleRef = useRef(ele)

  const callHook = (name: keyof ObjectDirective) => {
    ele.value && dir[name] && dir[name]!(ele.value, val.value)
  }

  let isMounted = false
  let stopEleWatcher: WatchStopHandle
  onMounted(() => {
    isMounted = true
    callHook('mounted')
    stopEleWatcher = watch(() => ele.value, () => {
      callHook('mounted')
    })
  })
  let stopWatcher: WatchStopHandle
  if (dir.updated) {
    stopWatcher = watch(() => val.value, () => {
      nextTick(() => {
        isMounted && callHook('updated')
      })
    })
  }
  onUnmounted(() => {
    stopEleWatcher?.()
    stopWatcher?.()
    callHook('unmounted')
    isMounted = false
  })

  return {
    ele,
    setEleRef,
  }
}
