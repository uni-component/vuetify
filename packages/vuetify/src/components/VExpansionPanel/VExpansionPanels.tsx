import type {
  InjectionKey,
  PropType,
} from '@uni-component/core'
import {
  computed,
  h,
  uni2Platform,
  uniComponent,
} from '@uni-component/core'

// Styles
import './VExpansionPanel.sass'

// Composables
import { makeTagProps } from '@/composables/tag'
import { makeGroupProps, useGroup } from '@/composables/group'
import { makeThemeProps, provideTheme } from '@/composables/theme'

// Types
import type { GroupItemProvide } from '@/composables/group'

export const VExpansionPanelSymbol: InjectionKey<GroupItemProvide> = Symbol.for('vuetify:v-expansion-panel')

const allowedVariants = ['default', 'accordion', 'inset', 'popout'] as const
type Variant = typeof allowedVariants[number]

const UniVExpansionPanels = uniComponent('v-expansion-panels', {
  variant: {
    type: String as PropType<Variant>,
    default: 'default',
    validator: (v: any) => allowedVariants.includes(v),
  },

  ...makeTagProps(),
  ...makeGroupProps(),
  ...makeThemeProps(),

  // 'onUpdate:modelValue': Function as PropType<(val: unknown) => void>,
}, (_, props, context) => {
  useGroup(props, VExpansionPanelSymbol, context)
  const { themeClasses } = provideTheme(props)

  const variantClass = computed(() => props.variant && `v-expansion-panels--variant-${props.variant}`)

  const rootClass = computed(() => {
    return [
      themeClasses.value,
      variantClass.value,
    ]
  })

  return {
    rootClass,
  }
})

export const VExpansionPanels = uni2Platform(UniVExpansionPanels, (props, state, { renders }) => {
  return (
    <props.tag
      class={state.rootClass}
    >
      { renders.defaultRender?.() }
    </props.tag>
  )
})
