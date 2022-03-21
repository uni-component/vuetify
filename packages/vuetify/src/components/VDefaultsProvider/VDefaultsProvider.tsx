import { toRefs, uni2Platform, uniComponent } from '@uni-component/core'

// Composables
import { provideDefaults } from '@/composables/defaults'

// Types
import type { PropType } from '@uni-component/core'
import type { DefaultsOptions } from '@/composables/defaults'

const UniVDefaultsProvider = uniComponent('v-defaults-provider', {
  defaults: Object as PropType<DefaultsOptions>,
  reset: [Number, String],
  root: Boolean,
  scoped: Boolean,
}, (name, props) => {
  const { defaults, reset, root, scoped } = toRefs(props)

  provideDefaults(defaults, {
    reset,
    root,
    scoped,
  })

  return {}
})

export const VDefaultsProvider = uni2Platform(UniVDefaultsProvider, (_, __, { renders }) => {
  return renders.defaultRender?.()
})
