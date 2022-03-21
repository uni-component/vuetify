import { computed, h, inject, provide, ref, toRef, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VList.sass'

// Components
import { VListSubheader } from './VListSubheader'
import { VListChildren } from './VListChildren'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { useBackgroundColor } from '@/composables/color'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { makeNestedProps, useNested } from '@/composables/nested/nested'

// Types
import type { InjectionKey, Prop, PropType, Ref, UniNode } from '@uni-component/core'
import type { ListGroupHeaderSlot } from './VListGroup'

export type ListItem = {
  children?: ListItem[]
  value?: string
}

// Depth
export const DepthKey: InjectionKey<Ref<number>> = Symbol.for('vuetify:depth')

// List
export const ListKey: InjectionKey<{
  hasPrepend: Ref<boolean>
  updateHasPrepend: (value: boolean) => void
}> = Symbol.for('vuetify:list')

export const createList = () => {
  const parent = inject(ListKey, { hasPrepend: ref(false), updateHasPrepend: () => null })

  const data = {
    hasPrepend: ref(false),
    updateHasPrepend: (value: boolean) => {
      if (value) data.hasPrepend.value = value
    },
  }

  provide(ListKey, data)

  return parent
}

export const useList = () => {
  return inject(ListKey, null)
}

const UniVList = uniComponent('v-list', {
  color: String,
  disabled: Boolean,
  lines: {
    type: String,
    default: 'one',
  },
  nav: Boolean,
  subheader: {
    type: [Boolean, String],
    default: false,
  },
  items: Array as Prop<ListItem[]>,

  ...makeNestedProps({
    selectStrategy: 'leaf' as const,
    openStrategy: 'multiple' as const,
    activeStrategy: 'single' as const,
  }),
  ...makeBorderProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),

  'onUpdate:selected': Function as PropType<(val: string[]) => void>,
  'onUpdate:opened': Function as PropType<(val: string[]) => void>,
  'onUpdate:active': Function as PropType<(val: string[]) => void>,

  subheaderRender: Function as PropType<() => UniNode | undefined>,
  headerRender: Function as PropType<(scope: ListGroupHeaderSlot) => UniNode | undefined>,
  itemRender: Function as PropType<(scope: ListItem) => UniNode | undefined>,
}, (name, props, context) => {
  const { themeClasses } = provideTheme(props)
  const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'color'))
  const { borderClasses } = useBorder(props)
  const { densityClasses } = useDensity(props)
  const { dimensionStyles } = useDimension(props)
  const { elevationClasses } = useElevation(props)
  const { roundedClasses } = useRounded(props)
  const { open, select, activate } = useNested(props, context)
  createList()

  const rootClass = computed(() => {
    return [
      {
        [`${name}--disabled`]: props.disabled,
        [`${name}--nav`]: props.nav,
        [`${name}--subheader`]: props.subheader,
        [`${name}--subheader-sticky`]: props.subheader === 'sticky',
        [`${name}--${props.lines}-line`]: true,
      },
      themeClasses.value,
      backgroundColorClasses.value,
      borderClasses.value,
      densityClasses.value,
      elevationClasses.value,
      roundedClasses.value,
    ]
  })
  const rootStyle = computed(() => {
    return {
      ...backgroundColorStyles.value,
      ...dimensionStyles.value,
    }
  })

  return {
    rootClass,
    rootStyle,
    open,
    select,
    activate,
  }
})

export const VList = uni2Platform(UniVList, (props, state, { renders }) => {
  const hasHeader = typeof props.subheader === 'string' || props.subheaderRender
  const {
    rootId,
    rootClass,
    rootStyle,
  } = state
  return (
    <props.tag
      id={rootId}
      class={rootClass}
      style={rootStyle}
    >
      { hasHeader && (
        props.subheaderRender
          ? props.subheaderRender()
          : <VListSubheader>{ props.subheader }</VListSubheader>
      ) }

      <VListChildren items={ props.items } itemRender={props.itemRender} externalHeaderRender={props.headerRender}>
        { renders.defaultRender?.() }
      </VListChildren>
    </props.tag>
  )
})
