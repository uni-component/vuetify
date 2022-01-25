import { uni2Platform, uniComponent } from '@uni-component/core'

// Composables
import { useHydration } from '@/composables/hydration'

import { ref } from '@uni-store/core'

export const VNoSsr = uni2Platform(uniComponent('v-no-ssr', () => {
  const show = ref(false)

  useHydration(() => (show.value = true))

  return {
    show,
  }
}), (_, state, { renders }) => {
  return state.show && renders.defaultRender?.()
})
