import type { PropType, UniNode } from '@uni-component/core'
import { uni2Platform, uniComponent } from '@uni-component/core'
// Composables
import type { GroupItemProvide } from '@/composables/group'
import { makeGroupItemProps, useGroupItem } from '@/composables/group'
import { VItemGroupSymbol } from './VItemGroup'
import type { UnwrapRef } from '@uni-store/core'

const UniVItem = uniComponent('v-item', {
  ...makeGroupItemProps(),
  defaultRender: Function as PropType<(groupItem: UnwrapRef<GroupItemProvide>) => UniNode | undefined>,
}, (name, props) => {
  const groupItem = useGroupItem(props, VItemGroupSymbol)
  return {
    groupItem,
  }
})

export const VItem = uni2Platform(UniVItem, (props, state, { renders }) => {
  const { isSelected, select, toggle, selectedClass, value, disabled } = state.groupItem
  const render = props.defaultRender || renders.defaultRender
  return render ? render({
    isSelected,
    selectedClass,
    select,
    toggle,
    value,
    disabled,
  }) : undefined
})
