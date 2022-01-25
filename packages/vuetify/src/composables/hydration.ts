import { IN_BROWSER } from '@/util'
import { onMounted } from '@uni-component/core'

export function useHydration (callback: () => void) {
  if (!IN_BROWSER) return

  // const vm = getCurrentInstance('useHydration')

  // todo
  // const rootEl = vm?.root?.appContext?.app?._container
  // return rootEl?.__vue_app__ ? callback() : onMounted(callback)

  return onMounted(callback)
}
