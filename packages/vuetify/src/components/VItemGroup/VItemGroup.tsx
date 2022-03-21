// Styles
import './VItemGroup.sass'

// Composables
import type { GroupProvide } from '@/composables/group'
import { makeGroupProps, useGroup } from '@/composables/group'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import type { PropType, UniNode, UnwrapRef } from '@uni-component/core'
import { computed, h, uni2Platform, uniComponent } from '@uni-component/core'

export const VItemGroupSymbol = Symbol.for('vuetify:v-item-group')

const UniVItemGroup = uniComponent('v-item-group', {
  ...makeGroupProps({
    selectedClass: 'v-item--selected',
  }),
  ...makeTagProps(),
  ...makeThemeProps(),
  defaultRender: Function as PropType<(group: UnwrapRef<GroupProvide>) => UniNode | undefined>,
}, (_, props, context) => {
  const theme = provideTheme(props)
  const group = useGroup(props, VItemGroupSymbol, context)
  const rootClass = computed(() => {
    return theme.themeClasses.value
  })
  return {
    rootClass,
    group,
  }
})

export const VItemGroup = uni2Platform(UniVItemGroup, (props, state, { renders }) => {
  const { rootClass, group } = state
  const { isSelected, select, next, prev, selected } = group
  const render = props.defaultRender || renders.defaultRender
  return (
    <props.tag
      class={rootClass}
    >
      { render ? render({
        isSelected,
        select,
        next,
        prev,
        selected,
      }) : undefined }
    </props.tag>
  )
})
