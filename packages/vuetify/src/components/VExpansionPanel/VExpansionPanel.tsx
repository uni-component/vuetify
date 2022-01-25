import type {
  PropType,
  UniNode,
} from '@uni-component/core'
import {
  classNames,
  Fragment,
  h,
  provide,
  uni2Platform,
  uniComponent,
} from '@uni-component/core'

// Components
import { makeVExpansionPanelTitleProps, VExpansionPanelTitle } from './VExpansionPanelTitle'
import { VExpansionPanelText } from './VExpansionPanelText'
import { VExpansionPanelSymbol } from './VExpansionPanels'

// Composables
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeGroupItemProps, useGroupItem } from '@/composables/group'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { useBackgroundColor } from '@/composables/color'
import { makeTagProps } from '@/composables/tag'
import { makeLazyProps } from '@/composables/lazy'

import { computed, toRef } from '@uni-store/core'

const UniVExpansionPanel = uniComponent('v-expansion-panel', {
  title: String,
  text: String,
  bgColor: String,

  ...makeLazyProps(),
  ...makeGroupItemProps(),
  ...makeRoundedProps(),
  ...makeElevationProps(),
  ...makeTagProps(),
  ...makeVExpansionPanelTitleProps(),

  titleRender: Function as PropType<() => UniNode | undefined>,
  textRender: Function as PropType<() => UniNode | undefined>,
}, (name, props) => {
  const groupItem = useGroupItem(props, VExpansionPanelSymbol)
  const { roundedClasses } = useRounded(props)
  const { elevationClasses } = useElevation(props)

  provide(VExpansionPanelSymbol, groupItem)

  const isBeforeSelected = computed(() => {
    const index = groupItem.group.items.value.indexOf(groupItem.id)
    return !groupItem.isSelected.value &&
      groupItem.group.selected.value.some(id => groupItem.group.items.value.indexOf(id) - index === 1)
  })

  const isAfterSelected = computed(() => {
    const index = groupItem.group.items.value.indexOf(groupItem.id)
    return !groupItem.isSelected.value &&
      groupItem.group.selected.value.some(id => groupItem.group.items.value.indexOf(id) - index === -1)
  })

  const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'bgColor'))

  const rootClass = computed(() => {
    return [
      {
        [`${name}--active`]: groupItem.isSelected.value,
        [`${name}--before-active`]: isBeforeSelected.value,
        [`${name}--after-active`]: isAfterSelected.value,
        [`${name}--disabled`]: groupItem.disabled.value,
      },
      roundedClasses.value,
      backgroundColorClasses.value,
    ]
  })

  const rootStyle = computed(() => backgroundColorStyles.value)

  return {
    rootClass,
    rootStyle,
    groupItem,
    elevationClasses,
  }
})

export const VExpansionPanel = uni2Platform(UniVExpansionPanel, (props, state, { renders }) => {
  const {
    rootClass,
    rootStyle,
    groupItem,
    elevationClasses,
  } = state
  const content = renders.defaultRender?.() || (
    <>
      <VExpansionPanelTitle
        expandIcon={ props.expandIcon }
        collapseIcon={ props.collapseIcon }
        color={ props.color }
        hideActions={ props.hideActions }
        ripple={ props.ripple }
      >
        { props.titleRender ? props.titleRender() : props.title }
      </VExpansionPanelTitle>
      <VExpansionPanelText eager={ props.eager }>
        { props.textRender ? props.textRender() : props.text }
      </VExpansionPanelText>
    </>
  )

  return (
    <props.tag
      class={rootClass}
      style={rootStyle}
      aria-expanded={ groupItem.isSelected }
    >
      <div
        class={classNames([
          'v-expansion-panel__shadow',
          ...elevationClasses,
        ])}
      />
      { content }
    </props.tag>
  )
})
